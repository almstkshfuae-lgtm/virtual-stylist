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
  })
    .index("by_userId", ["userId"]),

  // Chat history
  chatMessages: defineTable({
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"]),
});
