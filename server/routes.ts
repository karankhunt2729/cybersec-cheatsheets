import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCheatsheetPageSchema, updateCheatsheetPageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all pages
  app.get("/api/pages", async (req, res) => {
    try {
      const pages = await storage.getAllPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  // Get page by ID
  app.get("/api/pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid page ID" });
      }

      const page = await storage.getPageById(id);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Create new page
  app.post("/api/pages", async (req, res) => {
    try {
      const validatedData = insertCheatsheetPageSchema.parse(req.body);
      const page = await storage.createPage(validatedData);
      res.status(201).json(page);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid page data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  // Update page
  app.patch("/api/pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid page ID" });
      }

      const validatedData = updateCheatsheetPageSchema.parse(req.body);
      const updatedPage = await storage.updatePage(id, validatedData);
      
      if (!updatedPage) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.json(updatedPage);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid page data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  // Delete page
  app.delete("/api/pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid page ID" });
      }

      const deleted = await storage.deletePage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Search pages
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const pages = await storage.searchPages(query);
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to search pages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
