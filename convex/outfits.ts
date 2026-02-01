import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const requireUser = async (ctx: any, userId?: string) => {
  const identity = await ctx.auth.getUserIdentity?.();
  if (!identity) throw new Error("Unauthorized");
  if (userId && identity.subject !== userId) throw new Error("Forbidden");
  return identity;
};

const outfitIdArg = v.union(v.id("outfits"), v.string(), v.null());
const asOutfitId = (id: string | null) => (id ? (id as any) : null);

// Get or create user profile
export const getOrCreateUser = mutation({
  args: { userId: v.string(), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
      .first();

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const newUserId = await ctx.db.insert("users", {
      clerkId: args.userId,
      email: args.email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(newUserId);
  },
});

// Save an outfit
export const saveOutfit = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    style: v.string(),
    imageUrl: v.string(),
    keywords: v.array(v.string()),
    bodyShapeTip: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    const outfitId = await ctx.db.insert("outfits", {
      userId: args.userId,
      title: args.title,
      description: args.description,
      style: args.style,
      imageUrl: args.imageUrl,
      keywords: args.keywords,
      bodyShapeTip: args.bodyShapeTip,
      favorited: false,
      rating: undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(outfitId);
  },
});

// Get user's saved outfits
export const getUserOutfits = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    return await ctx.db
      .query("outfits")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();
  },
});

// Get favorited outfits only
export const getFavoritedOutfits = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    return await ctx.db
      .query("outfits")
      .withIndex("by_favorited", (q) =>
        q.eq("userId", args.userId).eq("favorited", true)
      )
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();
  },
});

// Toggle outfit favorite
export const toggleFavorite = mutation({
  args: { outfitId: outfitIdArg },
  handler: async (ctx, args) => {
    const outfitId = asOutfitId(args.outfitId);
    if (!outfitId) return null;
    const outfit = await ctx.db.get(outfitId);
    if (!outfit) throw new Error("Outfit not found");
    if (outfit.deletedAt) throw new Error("Outfit deleted");
    await requireUser(ctx, outfit.userId);

    await ctx.db.patch(outfitId, {
      favorited: !outfit.favorited,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(outfitId);
  },
});

// Rate an outfit
export const rateOutfit = mutation({
  args: { outfitId: outfitIdArg, rating: v.number() },
  handler: async (ctx, args) => {
    const outfitId = asOutfitId(args.outfitId);
    if (!outfitId) throw new Error("Outfit not found");
    if (args.rating < 0 || args.rating > 5) {
      throw new Error("Rating must be between 0 and 5");
    }

    const outfit = await ctx.db.get(outfitId);
    if (!outfit) throw new Error("Outfit not found");
    if (outfit.deletedAt) throw new Error("Outfit deleted");
    await requireUser(ctx, outfit.userId);

    await ctx.db.patch(outfitId, {
      rating: args.rating,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(outfitId);
  },
});

// Delete an outfit
export const deleteOutfit = mutation({
  args: { outfitId: outfitIdArg },
  handler: async (ctx, args) => {
    const outfitId = asOutfitId(args.outfitId);
    if (!outfitId) throw new Error("Outfit not found");
    const outfit = await ctx.db.get(outfitId);
    if (!outfit) throw new Error("Outfit not found");
    await requireUser(ctx, outfit.userId);
    await ctx.db.patch(outfitId, { deletedAt: Date.now(), updatedAt: Date.now() });
    return { success: true, deletedAt: Date.now() };
  },
});

// Update style profile
export const updateStyleProfile = mutation({
  args: {
    userId: v.string(),
    liked: v.array(v.string()),
    disliked: v.array(v.string()),
    preferredBodyShape: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    const existing = await ctx.db
      .query("styleProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        liked: args.liked,
        disliked: args.disliked,
        preferredBodyShape: args.preferredBodyShape,
        updatedAt: Date.now(),
      });
      return await ctx.db.get(existing._id);
    } else {
      const profileId = await ctx.db.insert("styleProfiles", {
        userId: args.userId,
        liked: args.liked,
        disliked: args.disliked,
        preferredBodyShape: args.preferredBodyShape,
        updatedAt: Date.now(),
      });
      return await ctx.db.get(profileId);
    }
  },
});

// Get style profile
export const getStyleProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    return await ctx.db
      .query("styleProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .first();
  },
});

// Save a combination
export const saveCombination = mutation({
  args: {
    userId: v.string(),
    outfitIds: v.array(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    const combinationId = await ctx.db.insert("combinations", {
      userId: args.userId,
      outfitIds: args.outfitIds,
      title: args.title,
      description: args.description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(combinationId);
  },
});

// Get user's combinations
export const getUserCombinations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    return await ctx.db
      .query("combinations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();
  },
});

// Add chat message
export const addChatMessage = mutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    const messageId = await ctx.db.insert("chatMessages", {
      userId: args.userId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
    });

    return await ctx.db.get(messageId);
  },
});

// Get chat history
export const getChatHistory = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();
  },
});

// Save bookmarked store
export const bookmarkStore = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    address: v.string(),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    distance: v.number(),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    const storeId = await ctx.db.insert("bookmarkedStores", {
      userId: args.userId,
      name: args.name,
      address: args.address,
      phone: args.phone,
      website: args.website,
      latitude: args.latitude,
      longitude: args.longitude,
      distance: args.distance,
      rating: args.rating,
      createdAt: Date.now(),
    });

    return await ctx.db.get(storeId);
  },
});

// Get bookmarked stores
export const getBookmarkedStores = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireUser(ctx, args.userId);
    return await ctx.db
      .query("bookmarkedStores")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();
  },
});
