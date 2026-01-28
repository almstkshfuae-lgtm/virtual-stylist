import { v } from "convex/values";
import { httpAction, internalMutation, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";

export const sendOne = internalMutation({
  args: {
    author: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      author: args.author,
      body: args.body,
      createdAt: Date.now(),
    });

    return ctx.db.get(messageId);
  },
});

type PostMessagePayload = {
  author: string;
  body: string;
};

const jsonResponse = (data: unknown) =>
  new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });

const fetchMessagesByAuthor = (ctx: ActionCtx, author: string) =>
  ctx.db
    .query("messages")
    .withIndex("by_author", (q) => q.eq("author", author))
    .collect();

const respondWithMessages = async (ctx: ActionCtx, author: string) => {
  const messages = await fetchMessagesByAuthor(ctx, author);
  return jsonResponse(messages);
};

export const postMessage = httpAction(async (ctx, request) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return new Response("Expected JSON payload", { status: 400 });
  }

  const payload = (await request.json()) as PostMessagePayload;
  if (!payload?.author || !payload?.body) {
    return new Response("Missing author or body", { status: 400 });
  }

  await ctx.runMutation(internal.messages.sendOne, {
    author: payload.author,
    body: `Sent via HTTP action: ${payload.body}`,
  });

  return new Response(null, { status: 200 });
});

export const getByAuthor = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const author = url.searchParams.get("author");
  if (!author) {
    return new Response("Missing author query param", { status: 400 });
  }

  return respondWithMessages(ctx, author);
});

export const getByAuthorPathSuffix = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const prefix = "/getAuthorMessages/";
  const suffix = url.pathname.slice(prefix.length);
  if (!suffix) {
    return new Response("Missing author path segment", { status: 400 });
  }

  const author = decodeURIComponent(suffix);
  return respondWithMessages(ctx, author);
});
