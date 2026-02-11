import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
  args: {
    userId: v.string(),
    tag: v.string(),
    careerScore: v.number(),
    examsTaken: v.number(),
    avatarVariant: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        tag: args.tag,
        careerScore: args.careerScore,
        examsTaken: args.examsTaken,
        avatarVariant: args.avatarVariant,
        lastActive: Date.now(),
      });
    } else {
      await ctx.db.insert("users", {
        userId: args.userId,
        tag: args.tag,
        careerScore: args.careerScore,
        examsTaken: args.examsTaken,
        avatarVariant: args.avatarVariant,
        lastActive: Date.now(),
      });
    }
  },
});

export const syncExamAttempt = mutation({
  args: {
    userId: v.string(),
    score: v.number(),
    maxScore: v.number(),
    timeSpent: v.number(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("exam_attempts", {
      userId: args.userId,
      score: args.score,
      maxScore: args.maxScore,
      timeSpent: args.timeSpent,
      timestamp: args.timestamp,
    });
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_score")
      .order("desc")
      .take(50);
      
    return users.map((u, i) => ({
      rank: i + 1,
      id: u.userId,
      tag: u.tag,
      score: u.careerScore,
      avatarVariant: u.avatarVariant
    }));
  },
});
