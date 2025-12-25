import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const exams = pgTable("exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  day: text("day").notNull(),
  date: text("date").notNull(),
  grade: text("grade").notNull(),
  subject: text("subject").notNull(),
  source: text("source").notNull(),
  questionsExport: boolean("questions_export").notNull().default(false),
  photocopying: boolean("photocopying").notNull().default(false),
  grading: boolean("grading").notNull().default(false),
  reviewing: boolean("reviewing").notNull().default(false),
  dataEntry: boolean("data_entry").notNull().default(false),
  auditing: boolean("auditing").notNull().default(false),
  randomSample: boolean("random_sample").notNull().default(false),
  reportSent: boolean("report_sent").notNull().default(false),
});

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
});

export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof exams.$inferSelect;
