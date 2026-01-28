import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEFAULT_PROGRAM_SLUG = "default";

// Helper to create a stable month key (YYYY-MM)
const monthKey = () => {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}`;
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
    const existing = await ctx.db
      .query("customerAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      return existing;
    }

    const referralCode = generateReferralCode();
    const now = Date.now();
    const month = monthKey();

  const accountId = await ctx.db.insert("customerAccounts", {
    userId: args.userId,
    email: args.email,
    name: args.name,
    referralCode,
    referredByCode: args.referredByCode ?? undefined,
    pointsBalance: 0,
    lifetimePoints: 0,
    monthlyIssuedFor: undefined,
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

    // If referred, credit both parties once.
    if (args.referredByCode) {
      await rewardReferral(ctx, account, args.referredByCode, settings);
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

async function rewardReferral(ctx: any, newAccount: any, referredByCode: string, settings: any) {
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

function generateReferralCode() {
  return Math.random().toString(36).slice(2, 10);
}
