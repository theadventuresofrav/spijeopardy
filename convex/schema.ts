import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // The local GUID from UserProfile.id
    tag: v.string(),
    careerScore: v.number(),
    examsTaken: v.number(),
    avatarVariant: v.string(), // 'echo' | 'hertz' | 'harvey'
    lastActive: v.number(),
  })
  .index("by_userId", ["userId"])
  .index("by_score", ["careerScore"]),

  exam_attempts: defineTable({
    userId: v.string(),
    score: v.number(),
    maxScore: v.number(),
    timeSpent: v.number(),
    timestamp: v.number(),
  })
  .index("by_userId", ["userId"]),
});
