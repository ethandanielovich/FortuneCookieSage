import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { FortuneCategory, insertFortuneSchema, insertSavedFortuneSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for fortunes
  
  // Get all fortunes
  app.get("/api/fortunes", async (req, res) => {
    const fortunes = await storage.getAllFortunes();
    res.json(fortunes);
  });
  
  // Get fortunes by category
  app.get("/api/fortunes/category/:category", async (req, res) => {
    const { category } = req.params;
    
    // Validate category
    if (!Object.values(FortuneCategory).includes(category as any)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    
    const fortunes = await storage.getFortunesByCategory(category);
    res.json(fortunes);
  });
  
  // Get a random fortune
  app.get("/api/fortunes/random", async (req, res) => {
    const { category } = req.query;
    
    // If category provided, validate it
    if (category && !Object.values(FortuneCategory).includes(category as any)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    
    const fortune = await storage.getRandomFortune(category as string);
    
    if (!fortune) {
      return res.status(404).json({ message: "No fortunes found" });
    }
    
    res.json(fortune);
  });
  
  // Get a specific fortune
  app.get("/api/fortunes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid fortune ID" });
    }
    
    const fortune = await storage.getFortune(id);
    
    if (!fortune) {
      return res.status(404).json({ message: "Fortune not found" });
    }
    
    res.json(fortune);
  });
  
  // Create a new fortune
  app.post("/api/fortunes", async (req, res) => {
    try {
      const parsedData = insertFortuneSchema.parse(req.body);
      const fortune = await storage.createFortune(parsedData);
      res.status(201).json(fortune);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Error creating fortune" });
    }
  });
  
  // API routes for saved fortunes
  
  // Get all saved fortunes for a user
  app.get("/api/saved-fortunes", async (req, res) => {
    // For demo purposes, use user ID 1
    const userId = 1;
    const savedFortunes = await storage.getSavedFortunes(userId);
    res.json(savedFortunes);
  });
  
  // Save a fortune
  app.post("/api/saved-fortunes", async (req, res) => {
    try {
      // For demo purposes, use user ID 1
      const userId = 1;
      
      // Validate the request
      const { fortuneId } = req.body;
      
      if (!fortuneId || isNaN(fortuneId)) {
        return res.status(400).json({ message: "Invalid fortune ID" });
      }
      
      // Check if the fortune exists
      const fortune = await storage.getFortune(parseInt(fortuneId));
      
      if (!fortune) {
        return res.status(404).json({ message: "Fortune not found" });
      }
      
      // Save the fortune
      const data = { userId, fortuneId: parseInt(fortuneId) };
      const parsedData = insertSavedFortuneSchema.parse(data);
      const savedFortune = await storage.saveFortune(parsedData);
      
      res.status(201).json(savedFortune);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Error saving fortune" });
    }
  });
  
  // Delete a saved fortune
  app.delete("/api/saved-fortunes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid saved fortune ID" });
    }
    
    const success = await storage.deleteSavedFortune(id);
    
    if (!success) {
      return res.status(404).json({ message: "Saved fortune not found" });
    }
    
    res.status(204).send();
  });
  
  // Clear all saved fortunes for a user
  app.delete("/api/saved-fortunes", async (req, res) => {
    // For demo purposes, use user ID 1
    const userId = 1;
    const success = await storage.clearSavedFortunes(userId);
    
    if (!success) {
      return res.status(500).json({ message: "Error clearing saved fortunes" });
    }
    
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
