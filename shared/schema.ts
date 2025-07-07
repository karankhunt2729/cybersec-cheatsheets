import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const cheatsheetPages = pgTable("cheatsheet_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  lastModified: timestamp("last_modified").notNull().defaultNow(),
  wordCount: integer("word_count").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCheatsheetPageSchema = createInsertSchema(cheatsheetPages).pick({
  title: true,
  content: true,
});

export const updateCheatsheetPageSchema = createInsertSchema(cheatsheetPages).pick({
  title: true,
  content: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CheatsheetPage = typeof cheatsheetPages.$inferSelect;
export type InsertCheatsheetPage = z.infer<typeof insertCheatsheetPageSchema>;
export type UpdateCheatsheetPage = z.infer<typeof updateCheatsheetPageSchema>;
