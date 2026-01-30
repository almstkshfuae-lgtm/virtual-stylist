import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEFAULT_PROGRAM_SLUG = "default";

// Normalize codes for consistent lookups (case-insensitive comparisons).
const normalizeCode = (code: string) => code.trim().toLowerCase();

// Helper to create a stable month key (YYYY-MM)
const monthKey = () => {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

// Helper to create daily key (YYYY-MM-DD)
const dayKey = () => {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getUTCDate()).padStart(2, "0")}`;
};

// Ensure a settings row exists so future marketing tweaks are one place.
export const ensureProgramSettings = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("programSettings")
      .withIndex("by_slug", (q) => q.eq("slug", DEFAULT_PROGRAM_SLUG))
      .first();

    if (existing) {
      return existing;
    }

    const id = await ctx.db.insert("programSettings", {
      slug: DEFAULT_PROGRAM_SLUG,
      monthlyPoints: 300,
      signupBonusPoints: 500,
      welcomePackagePoints: 1300,
      referralRewardPoints: 500,
      adInventoryEnabled: false,
      adProductNotes: "Toggle to monetize via brand services/placements later.",
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

// Create or fetch a customer account, award signup + welcome, and handle referrals.
export const getOrCreateCustomer = mutation({
  args: {
    userId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    referredByCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.runMutation(ensureProgramSettings, {});
    const referredByCode = args.referredByCode
      ? normalizeCode(args.referredByCode)
      : undefined;
    const existing = await ctx.db
      .query("customerAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      const patch: any = { updatedAt: Date.now() };
      let shouldPatch = false;

      if (args.name && args.name !== existing.name) {
        patch.name = args.name;
        shouldPatch = true;
      }

      if (args.email && args.email !== existing.email) {
        patch.email = args.email;
        shouldPatch = true;
      }

      const needsReferral =
        referredByCode &&
        !existing.referredByCode &&
        referredByCode !== existing.referralCode;

      if (needsReferral) {
        patch.referredByCode = referredByCode;
        shouldPatch = true;
      }

      if (shouldPatch) {
        await ctx.db.patch(existing._id, patch);
      }

      // If the user just entered a referral code after signup, reward it once.
      if (needsReferral) {
        await rewardReferral(ctx, { ...existing, ...patch }, referredByCode!, settings);
      }

      await maybeIssueTrial(ctx, { ...existing, ...patch });
      return await ctx.db.get(existing._id);
    }

    const referralCode = await generateUniqueReferralCode(ctx);
    const now = Date.now();
    const month = monthKey();

    const accountId = await ctx.db.insert("customerAccounts", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      referralCode,
      referredByCode,
      pointsBalance: 0,
      lifetimePoints: 0,
      monthlyIssuedFor: undefined,
      trialStartAt: now,
      trialLastIssuedFor: undefined,
      trialDaysIssued: 0,
      signupAwarded: false,
      welcomeAwarded: false,
      marketingTags: [],
      adConsent: false,
      segments: [],
      createdAt: now,
      updatedAt: now,
    });

    const account = await ctx.db.get(accountId);
    if (!account) throw new Error("Failed to create account");

    // Award signup bonus once.
    await addPoints(ctx, account, settings.signupBonusPoints, "signup", {
      description: "Signup bonus",
    });
    await ctx.db.patch(account._id, { signupAwarded: true, updatedAt: Date.now() });

    // Welcome package (one-time).
    await addPoints(
      ctx,
      { ...account, signupAwarded: true },
      settings.welcomePackagePoints,
      "welcome",
      { description: "Welcome package" }
    );
    await ctx.db.patch(account._id, { welcomeAwarded: true, updatedAt: Date.now() });

    // Monthly issuance if not yet issued this month.
    await maybeIssueMonthly(ctx, account, settings);
    await maybeIssueTrial(ctx, account);

    // If referred, credit both parties once.
    if (referredByCode) {
      await rewardReferral(ctx, account, referredByCode, settings);
    }

    return await ctx.db.get(accountId);
  },
});

// Public query: fetch account and latest settings.
export const getCustomer = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("customerAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    const settings = await ctx.db
      .query("programSettings")
      .withIndex("by_slug", (q) => q.eq("slug", DEFAULT_PROGRAM_SLUG))
      .first();
    return { account, settings };
  },
});

// Email-based login/restore: find existing by email or create a new account.
export const loginWithEmail = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    referredByCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.runMutation(ensureProgramSettings, {});
    const normalizedEmail = args.email.trim().toLowerCase();
    const referredByCode = args.referredByCode ? normalizeCode(args.referredByCode) : undefined;

    // Try to find existing account by email
    const existing = await ctx.db
      .query("customerAccounts")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existing) {
      // Update name if newly provided
      if (args.name && args.name !== existing.name) {
        await ctx.db.patch(existing._id, { name: args.name, updatedAt: Date.now() });
      }
      // Attach referral if user adds it later and hasn't used one yet
      const needsReferral =
        referredByCode &&
        !existing.referredByCode &&
        referredByCode !== existing.referralCode;
      if (needsReferral) {
        await ctx.db.patch(existing._id, {
          referredByCode,
          updatedAt: Date.now(),
        });
        await rewardReferral(ctx, { ...existing, referredByCode }, referredByCode, settings);
      }
      await maybeIssueTrial(ctx, existing);
      return {
        account: await ctx.db.get(existing._id),
        settings,
      };
    }

    // Create a deterministic userId from email to make future restores consistent.
    const userId = `email-${normalizedEmail}`;
    const referralCode = await generateUniqueReferralCode(ctx);
    const now = Date.now();

    const accountId = await ctx.db.insert("customerAccounts", {
      userId,
      email: normalizedEmail,
      name: args.name,
      referralCode,
      referredByCode,
      pointsBalance: 0,
      lifetimePoints: 0,
      monthlyIssuedFor: undefined,
      trialStartAt: now,
      trialLastIssuedFor: undefined,
      trialDaysIssued: 0,
      signupAwarded: false,
      welcomeAwarded: false,
      marketingTags: [],
      adConsent: false,
      segments: [],
      createdAt: now,
      updatedAt: now,
    });

    const account = await ctx.db.get(accountId);
    if (!account) throw new Error("Failed to create account via email login");

    // Award signup + welcome + monthly same as new user flow
    await addPoints(ctx, account, settings.signupBonusPoints, "signup", {
      description: "Signup bonus",
    });
    await ctx.db.patch(account._id, { signupAwarded: true, updatedAt: Date.now() });

    await addPoints(
      ctx,
      { ...account, signupAwarded: true },
      settings.welcomePackagePoints,
      "welcome",
      { description: "Welcome package" }
    );
    await ctx.db.patch(account._id, { welcomeAwarded: true, updatedAt: Date.now() });

    await maybeIssueMonthly(ctx, account, settings);
    await maybeIssueTrial(ctx, account);

    // If referred, credit both parties once.
    if (referredByCode) {
      await rewardReferral(ctx, account, referredByCode, settings);
    }

    return { account: await ctx.db.get(accountId), settings };
  },
});

// Spend points (e.g., perks/ads swaps). Negative delta.
export const spendPoints = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.amount <= 0) throw new Error("Amount must be positive");

    const account = await ctx.db
      .query("customerAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (!account) throw new Error("Account not found");
    if (account.pointsBalance < args.amount) throw new Error("Insufficient points");

    await addPoints(ctx, account, -args.amount, "spend", {
      description: args.description,
    });

    return await ctx.db
      .query("customerAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Manually adjust balance (admin control).
export const adjustPoints = mutation({
  args: {
    userId: v.string(),
    delta: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("customerAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (!account) throw new Error("Account not found");

    await addPoints(ctx, account, args.delta, "adjustment", {
      description: args.description,
    });

    return await ctx.db
      .query("customerAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Issue monthly points idempotently.
export const issueMonthlyPoints = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const settings = await ctx.runMutation(ensureProgramSettings, {});
    const account = await ctx.db
      .query("customerAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (!account) throw new Error("Account not found");

    await maybeIssueMonthly(ctx, account, settings);
    await maybeIssueTrial(ctx, account);

    return await ctx.db
      .query("customerAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// List recent ledger entries for transparency.
export const getLedger = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("pointsLedger")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 50);
    return entries;
  },
});

// --- Internal helpers ---

async function addPoints(
  ctx: any,
  account: any,
  delta: number,
  type:
    | "monthly"
    | "signup"
    | "welcome"
    | "trial"
    | "referral_referrer"
    | "referral_new_user"
    | "spend"
    | "adjustment",
  options: { description: string; meta?: Record<string, any> }
) {
  const updatedBalance = account.pointsBalance + delta;
  const updatedLifetime = account.lifetimePoints + Math.max(delta, 0);

  await ctx.db.patch(account._id, {
    pointsBalance: updatedBalance,
    lifetimePoints: updatedLifetime,
    updatedAt: Date.now(),
  });

  await ctx.db.insert("pointsLedger", {
    userId: account.userId,
    delta,
    type,
    description: options.description,
    meta: options.meta,
    createdAt: Date.now(),
  });
}

async function maybeIssueMonthly(ctx: any, account: any, settings: any) {
  const currentMonth = monthKey();
  if (account.monthlyIssuedFor === currentMonth) return;

  await addPoints(
    ctx,
    account,
    settings.monthlyPoints,
    "monthly",
    { description: `Monthly points for ${currentMonth}`, meta: { monthKey: currentMonth } }
  );

  await ctx.db.patch(account._id, {
    monthlyIssuedFor: currentMonth,
    updatedAt: Date.now(),
  });
}

async function maybeIssueTrial(ctx: any, account: any) {
  const TRIAL_DAYS = 14;
  const TRIAL_DAILY_POINTS = 300;
  const today = dayKey();

  const startAt = account.trialStartAt ?? Date.now();
  const daysIssued = account.trialDaysIssued ?? 0;
  const lastIssued = account.trialLastIssuedFor;

  if (daysIssued >= TRIAL_DAYS) return;
  if (lastIssued === today) return;

  // Ensure trial hasn't expired by calendar days since start
  const daysSinceStart = Math.floor((Date.now() - startAt) / (1000 * 60 * 60 * 24));
  if (daysSinceStart >= TRIAL_DAYS) return;

  await addPoints(
    ctx,
    account,
    TRIAL_DAILY_POINTS,
    "trial",
    { description: `Trial day ${daysIssued + 1}/${TRIAL_DAYS}` }
  );

  await ctx.db.patch(account._id, {
    trialLastIssuedFor: today,
    trialDaysIssued: daysIssued + 1,
    trialStartAt: startAt,
    updatedAt: Date.now(),
  });
}

async function rewardReferral(ctx: any, newAccount: any, referredByCodeRaw: string, settings: any) {
  const referredByCode = normalizeCode(referredByCodeRaw);

  // Prevent self-referrals.
  const referrer = await ctx.db
    .query("customerAccounts")
    .withIndex("by_referralCode", (q) => q.eq("referralCode", referredByCode))
    .first();

  if (!referrer || referrer.userId === newAccount.userId) {
    await ctx.db.insert("referrals", {
      referrerUserId: referrer ? referrer.userId : "unknown",
      refereeUserId: newAccount.userId,
      referralCode: referredByCode,
      status: "duplicate",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return;
  }

  const existing = await ctx.db
    .query("referrals")
    .withIndex("by_referralCode", (q) => q.eq("referralCode", referredByCode))
    .filter((q) => q.eq(q.field("refereeUserId"), newAccount.userId))
    .first();

  if (existing) return;

  const referralId = await ctx.db.insert("referrals", {
    referrerUserId: referrer.userId,
    refereeUserId: newAccount.userId,
    referralCode: referredByCode,
    status: "converted",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  await addPoints(
    ctx,
    referrer,
    settings.referralRewardPoints,
    "referral_referrer",
    {
      description: "Referral bonus (referrer)",
      meta: { sourceUserId: newAccount.userId, referralCode: referredByCode },
    }
  );

  await addPoints(
    ctx,
    newAccount,
    settings.referralRewardPoints,
    "referral_new_user",
    {
      description: "Referral bonus (new user)",
      meta: { referralCode: referredByCode },
    }
  );

  await ctx.db.patch(referralId, { status: "rewarded", updatedAt: Date.now() });
}

async function generateUniqueReferralCode(ctx: any): Promise<string> {
  const MAX_ATTEMPTS = 5;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // 8-char base36, lower-case for consistency with legacy codes.
    const code = Math.random().toString(36).slice(2, 10).toLowerCase();

    const collision = await ctx.db
      .query("customerAccounts")
      .withIndex("by_referralCode", (q: any) => q.eq("referralCode", code))
      .first();

    if (!collision) return code;
  }

  throw new Error("Unable to generate a unique referral code. Please retry.");
}
