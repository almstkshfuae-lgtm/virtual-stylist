import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles and authentication
  users: defineTable({
    clerkId: v.string(), // Clerk user ID (optional, for future auth)
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"]),

  // Saved outfits
  outfits: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    style: v.string(),
    imageUrl: v.string(),
    keywords: v.array(v.string()),
    bodyShapeTip: v.optional(v.string()),
    rating: v.optional(v.number()), // 0-5 stars
    favorited: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_favorited", ["userId", "favorited"]),

  // Style profile (user's likes and dislikes)
  styleProfiles: defineTable({
    userId: v.string(),
    liked: v.array(v.string()), // Keywords they like
    disliked: v.array(v.string()), // Keywords they dislike
    preferredBodyShape: v.optional(v.string()),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"]),

  // Outfit combinations/pairings
  combinations: defineTable({
    userId: v.string(),
    outfitIds: v.array(v.string()), // Array of outfit IDs that go well together
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    rating: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"]),

  // Trend analysis results (cached)
  trends: defineTable({
    userId: v.string(),
    season: v.string(),
    trendKeywords: v.array(v.string()),
    recommendations: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"]),

  // Store locations (bookmarked stores)
  bookmarkedStores: defineTable({
    userId: v.string(),
    name: v.string(),
    address: v.string(),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    distance: v.number(),
    rating: v.optional(v.number()),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"]),

  // Chat history
  chatMessages: defineTable({
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"]),

  // Messages posted through internal HTTP action
  messages: defineTable({
    author: v.string(),
    body: v.string(),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_author", ["author"]),

  // Loyalty, referrals, and marketing controls
  programSettings: defineTable({
    slug: v.string(),
    monthlyPoints: v.number(),
    signupBonusPoints: v.number(),
    welcomePackagePoints: v.number(),
    referralRewardPoints: v.number(),
    adInventoryEnabled: v.boolean(),
    adProductNotes: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  customerAccounts: defineTable({
    userId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    referralCode: v.string(),
    referredByCode: v.optional(v.string()),
    pointsBalance: v.number(),
    lifetimePoints: v.number(),
    monthlyIssuedFor: v.optional(v.string()), // YYYY-MM string
    trialStartAt: v.optional(v.number()), // ms timestamp UTC
    trialLastIssuedFor: v.optional(v.string()), // YYYY-MM-DD string
    trialDaysIssued: v.optional(v.number()),
    signupAwarded: v.boolean(),
    welcomeAwarded: v.boolean(),
    marketingTags: v.array(v.string()),
    adConsent: v.boolean(),
    segments: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_referralCode", ["referralCode"])
    .index("by_referredByCode", ["referredByCode"]),

  pointsLedger: defineTable({
    userId: v.string(),
    delta: v.number(),
    type: v.union(
      v.literal("monthly"),
      v.literal("signup"),
      v.literal("welcome"),
      v.literal("trial"),
      v.literal("referral_referrer"),
      v.literal("referral_new_user"),
      v.literal("spend"),
      v.literal("adjustment")
    ),
    description: v.string(),
    meta: v.optional(
      v.object({
        monthKey: v.optional(v.string()),
        referralCode: v.optional(v.string()),
        sourceUserId: v.optional(v.string()),
      })
    ),
    idempotencyKey: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_idempotencyKey", ["idempotencyKey"]),

  fashionInsights: defineTable({
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    styles: v.array(v.string()),
    keywords: v.array(v.string()),
    language: v.string(),
    bodyShape: v.optional(v.string()),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_createdAt", ["createdAt"]),

  referrals: defineTable({
    referrerUserId: v.string(),
    refereeUserId: v.optional(v.string()),
    referralCode: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("converted"),
      v.literal("rewarded"),
      v.literal("duplicate")
    ),
    idempotencyKey: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_referralCode", ["referralCode"])
    .index("by_referrer", ["referrerUserId"])
    .index("by_referrer_referee", ["referrerUserId", "refereeUserId"])
    .index("by_referralCode_referee", ["referralCode", "refereeUserId"])
    .index("by_idempotencyKey", ["idempotencyKey"]),
});
