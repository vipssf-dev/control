import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExamSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all exams (filtered by semester)
  app.get("/api/exams", async (req, res) => {
    try {
      const semester = (req.query.semester as string) || "1";
      const exams = await storage.getExams(semester);
      res.json(exams);
    } catch (error) {
      console.error("Error fetching exams:", error);
      res.status(500).json({ error: "Failed to fetch exams" });
    }
  });

  // Get single exam
  app.get("/api/exams/:id", async (req, res) => {
    try {
      const exam = await storage.getExam(req.params.id);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.json(exam);
    } catch (error) {
      console.error("Error fetching exam:", error);
      res.status(500).json({ error: "Failed to fetch exam" });
    }
  });

  // Create exam
  app.post("/api/exams", async (req, res) => {
    try {
      const validation = insertExamSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: fromZodError(validation.error).message 
        });
      }
      
      const exam = await storage.createExam(validation.data);
      res.status(201).json(exam);
    } catch (error) {
      console.error("Error creating exam:", error);
      res.status(500).json({ error: "Failed to create exam" });
    }
  });

  // Update exam
  app.patch("/api/exams/:id", async (req, res) => {
    try {
      const exam = await storage.updateExam(req.params.id, req.body);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.json(exam);
    } catch (error) {
      console.error("Error updating exam:", error);
      res.status(500).json({ error: "Failed to update exam" });
    }
  });

  // Delete exam
  app.delete("/api/exams/:id", async (req, res) => {
    try {
      await storage.deleteExam(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting exam:", error);
      res.status(500).json({ error: "Failed to delete exam" });
    }
  });

  return httpServer;
}
