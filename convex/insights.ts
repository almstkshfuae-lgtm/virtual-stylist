import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Store anonymized fashion insights for developer/internal use only.
 * No PII besides optional userId/sessionId is kept.
 */
export const logFashionInsight = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    styles: v.array(v.string()),
    keywords: v.array(v.string()),
    language: v.string(),
    bodyShape: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("fashionInsights", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
