import assert from "node:assert/strict";
import test from "node:test";
import { addPoints, _test } from "../convex/loyalty";

type Doc = Record<string, any> & { _id?: string };

const createMockCtx = (seed: Record<string, Doc[]> = {}) => {
  const store = new Map<string, Doc>();
  let counter = 0;

  // Seed initial documents
  Object.entries(seed).forEach(([table, docs]) => {
    docs.forEach((doc) => {
      const id = `${table}_${counter++}`;
      store.set(id, { ...doc, _id: id });
    });
  });

  const getTableDocs = (table: string) =>
    [...store.values()].filter((d) => d._id?.startsWith(`${table}_`));

  const db = {
    get: async (id: string) => store.get(id),
    insert: async (table: string, doc: Doc) => {
      const id = `${table}_${counter++}`;
      store.set(id, { ...doc, _id: id });
      return id;
    },
    patch: async (id: string, patch: Doc) => {
      const existing = store.get(id);
      if (!existing) throw new Error("Not found");
      store.set(id, { ...existing, ...patch });
    },
    query: (table: string) => ({
      withIndex: (_name: string, filterFn: any) => {
        let docs = getTableDocs(table).filter((doc) => {
          const q = {
            eq: (field: string, value: any) => doc[field] === value,
            field: (name: string) => name,
          };
          return filterFn(q);
        });
        const chain = {
          first: async () => docs[0],
          collect: async () => docs,
          order: () => chain,
          take: (n: number) => docs.slice(0, n),
          filter: (fn: any) => {
            docs = docs.filter((doc) => {
              const q = {
                eq: (_field: any, value: any) => doc[_field] === value,
                field: (name: string) => name,
              };
              return fn(q);
            });
            return chain;
          },
        };
        return chain;
      },
    }),
  };

  return { db, auth: { getUserIdentity: async () => ({ subject: "user-1" }) }, store };
};

// Use fixed timestamps for deterministic month/day keys.
const fixedNow = Date.UTC(2024, 4, 15); // May 15, 2024

test("cumulative signup/welcome/monthly/trial balances and ledger entries", async () => {
  const ctx = createMockCtx({
    customerAccounts: [
      {
        _id: "customerAccounts_0",
        userId: "user-1",
        pointsBalance: 0,
        lifetimePoints: 0,
        monthlyIssuedFor: undefined,
        trialStartAt: fixedNow,
        trialLastIssuedFor: undefined,
        trialDaysIssued: 0,
        signupAwarded: false,
        welcomeAwarded: false,
      },
    ],
  });

  const monthlyPoints = 300;
  const trialDailyPoints = 300;

  const originalNow = Date.now;
  Date.now = () => fixedNow;

  const afterSignup = await addPoints(ctx as any, "customerAccounts_0", 500, "signup", {
    description: "Signup bonus",
  });
  assert.equal(afterSignup.pointsBalance, 500);

  const afterWelcome = await addPoints(ctx as any, "customerAccounts_0", 1300, "welcome", {
    description: "Welcome package",
  });
  assert.equal(afterWelcome.pointsBalance, 1800);

  const afterMonthly = await _test.maybeIssueMonthly(
    ctx as any,
    afterWelcome,
    { monthlyPoints }
  );
  assert.equal(afterMonthly?.pointsBalance ?? 1800 + monthlyPoints, 2100);

  const afterTrial = await _test.maybeIssueTrial(ctx as any, afterMonthly ?? afterWelcome);
  assert.equal(afterTrial?.pointsBalance ?? 2100 + trialDailyPoints, 2400);

  const ledgerEntries = [...ctx.store.values()].filter((d) => d._id?.startsWith("pointsLedger_"));
  assert.equal(ledgerEntries.length, 4, "expected four ledger entries");

  Date.now = originalNow;
});

test("negative spend is rejected", async () => {
  const ctx = createMockCtx({
    customerAccounts: [
      {
        _id: "customerAccounts_0",
        userId: "user-1",
        pointsBalance: 100,
        lifetimePoints: 100,
      },
    ],
  });

  await assert.rejects(
    () => addPoints(ctx as any, "customerAccounts_0", -200, "spend", { description: "overspend" }),
    /Balance cannot go negative/
  );
});

test("monthly issuance is idempotent per month key", async () => {
  const ctx = createMockCtx({
    customerAccounts: [
      {
        _id: "customerAccounts_0",
        userId: "user-1",
        pointsBalance: 0,
        lifetimePoints: 0,
        monthlyIssuedFor: undefined,
      },
    ],
  });

  const originalNow = Date.now;
  Date.now = () => fixedNow;

  const settings = { monthlyPoints: 300 };
  const first = await _test.maybeIssueMonthly(ctx as any, ctx.store.get("customerAccounts_0"), settings);
  const second = await _test.maybeIssueMonthly(ctx as any, first ?? ctx.store.get("customerAccounts_0"), settings);

  const ledgerEntries = [...ctx.store.values()].filter((d) => d._id?.startsWith("pointsLedger_"));
  assert.equal(ledgerEntries.length, 1, "second monthly issuance should be skipped");
  assert.equal(first?.monthlyIssuedFor ?? ctx.store.get("customerAccounts_0")?.monthlyIssuedFor, "2024-05");
  assert.equal((second ?? first)?.pointsBalance, 300);

  Date.now = originalNow;
});

test("ledger preserves meta and type for referral-like awards", async () => {
  const ctx = createMockCtx({
    customerAccounts: [
      {
        _id: "customerAccounts_0",
        userId: "user-1",
        pointsBalance: 0,
        lifetimePoints: 0,
      },
    ],
  });

  await addPoints(ctx as any, "customerAccounts_0", 500, "referral_referrer", {
    description: "Referral bonus (referrer)",
    meta: { sourceUserId: "user-2", referralCode: "abcd1234" },
  });

  const ledgerEntry = [...ctx.store.values()].find((d) => d._id?.startsWith("pointsLedger_"));
  assert.ok(ledgerEntry);
  assert.equal(ledgerEntry?.type, "referral_referrer");
  assert.equal(ledgerEntry?.meta?.sourceUserId, "user-2");
});

test("idempotency key prevents duplicate ledger writes", async () => {
  const ctx = createMockCtx({
    customerAccounts: [
      {
        _id: "customerAccounts_0",
        userId: "user-1",
        pointsBalance: 0,
        lifetimePoints: 0,
      },
    ],
  });

  const key = "abc123";
  await addPoints(ctx as any, "customerAccounts_0", 100, "signup", {
    description: "once",
    idempotencyKey: key,
  });
  await addPoints(ctx as any, "customerAccounts_0", 100, "signup", {
    description: "duplicate",
    idempotencyKey: key,
  });

  const account = ctx.store.get("customerAccounts_0");
  const ledgers = [...ctx.store.values()].filter((d) => d._id?.startsWith("pointsLedger_"));
  assert.equal(account?.pointsBalance, 100);
  assert.equal(ledgers.length, 1);
});

test("rewardReferral is idempotent per referrer/referee pair", async () => {
  const ctx = createMockCtx({
    customerAccounts: [
      { _id: "customerAccounts_0", userId: "referrer-1", referralCode: "code123", pointsBalance: 0, lifetimePoints: 0 },
      { _id: "customerAccounts_1", userId: "new-1", pointsBalance: 0, lifetimePoints: 0 },
    ],
  });

  await _test.rewardReferral(
    ctx as any,
    ctx.store.get("customerAccounts_1"),
    "code123",
    { referralRewardPoints: 500 }
  );
  await _test.rewardReferral(
    ctx as any,
    ctx.store.get("customerAccounts_1"),
    "code123",
    { referralRewardPoints: 500 }
  );

  const ledgerEntries = [...ctx.store.values()].filter((d) => d._id?.startsWith("pointsLedger_"));
  const referrals = [...ctx.store.values()].filter((d) => d._id?.startsWith("referrals_"));

  assert.equal(ledgerEntries.length, 2, "should credit referrer and new user once each");
  assert.equal(referrals.length, 1, "only one referral record should exist");
  const referrer = ctx.store.get("customerAccounts_0");
  const referee = ctx.store.get("customerAccounts_1");
  assert.equal(referrer?.pointsBalance, 500);
  assert.equal(referee?.pointsBalance, 500);
});
