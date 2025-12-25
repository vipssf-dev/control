import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { exams, type InsertExam, type Exam } from "@shared/schema";
import { eq } from "drizzle-orm";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  // Exam operations
  getExams(): Promise<Exam[]>;
  getExam(id: string): Promise<Exam | undefined>;
  createExam(exam: InsertExam): Promise<Exam>;
  updateExam(id: string, exam: Partial<InsertExam>): Promise<Exam | undefined>;
  deleteExam(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getExams(): Promise<Exam[]> {
    return await db.select().from(exams);
  }

  async getExam(id: string): Promise<Exam | undefined> {
    const result = await db.select().from(exams).where(eq(exams.id, id));
    return result[0];
  }

  async createExam(insertExam: InsertExam): Promise<Exam> {
    const result = await db.insert(exams).values(insertExam).returning();
    return result[0];
  }

  async updateExam(id: string, updateData: Partial<InsertExam>): Promise<Exam | undefined> {
    const result = await db
      .update(exams)
      .set(updateData)
      .where(eq(exams.id, id))
      .returning();
    return result[0];
  }

  async deleteExam(id: string): Promise<void> {
    await db.delete(exams).where(eq(exams.id, id));
  }
}

export const storage = new DatabaseStorage();
