import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories for fortunes
export const FortuneCategory = {
  LOVE: "love",
  CAREER: "career",
  WEALTH: "wealth",
  GENERAL: "general",
} as const;

export type FortuneCategoryType = typeof FortuneCategory[keyof typeof FortuneCategory];

// User table remains the same
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Fortunes table
export const fortunes = pgTable("fortunes", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  category: text("category").notNull(),
});

// Saved fortunes table to track user's saved fortunes
export const savedFortunes = pgTable("saved_fortunes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  fortuneId: integer("fortune_id"),
  savedAt: timestamp("saved_at").defaultNow(),
  // Add a unique constraint to prevent duplicate saves
  // This also makes it easy to "toggle" a save state
});

// Schemas for data validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFortuneSchema = createInsertSchema(fortunes).pick({
  message: true,
  category: true,
});

export const insertSavedFortuneSchema = createInsertSchema(savedFortunes).pick({
  userId: true,
  fortuneId: true,
});

// TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFortune = z.infer<typeof insertFortuneSchema>;
export type Fortune = typeof fortunes.$inferSelect;

export type InsertSavedFortune = z.infer<typeof insertSavedFortuneSchema>;
export type SavedFortune = typeof savedFortunes.$inferSelect;
