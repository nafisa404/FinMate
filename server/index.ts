import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { handleDemo } from "./routes/demo";
import { initializeDatabase, db } from "./database/db";
import { users } from "./database/schema";
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  getUserProfile,
  updateUserProfile,
  selectAICoach,
} from "./routes/chat";
import {
  getLearningModules,
  getLearningModule,
  completeModule,
  getUserAchievements,
  getLeaderboard,
  getUserStats,
} from "./routes/learning";
import { signup, login, logout, verifyToken } from "./routes/auth";

// Load environment variables
dotenv.config();

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize database
  initializeDatabase().catch(console.error);

  // Health check
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: "FinMate API Server is running! 🚀",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      features: {
        database: true,
        huggingface: !!process.env.HUGGINGFACE_API_KEY,
        chat: true,
        learning: true,
      },
    });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/verify", verifyToken);

  // Database health check
  app.get("/api/health/db", async (_req, res) => {
    try {
      const testQuery = await db.select().from(users).limit(1);
      res.json({
        success: true,
        database: "connected",
        message: "Database is working properly",
        userCount: testQuery.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        database: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Chat routes
  app.post("/api/chat/conversations", createConversation);
  app.get("/api/chat/conversations", getConversations);
  app.get("/api/chat/conversations/:conversationId/messages", getMessages);
  app.post("/api/chat/messages", sendMessage);
  app.post("/api/chat/ai-coach", selectAICoach);

  // User profile routes
  app.get("/api/user/profile", getUserProfile);
  app.put("/api/user/profile", updateUserProfile);

  // Learning routes
  app.get("/api/learning/modules", getLearningModules);
  app.get("/api/learning/modules/:moduleId", getLearningModule);
  app.post("/api/learning/modules/:moduleId/complete", completeModule);
  app.get("/api/learning/achievements", getUserAchievements);
  app.get("/api/learning/leaderboard", getLeaderboard);
  app.get("/api/learning/stats", getUserStats);

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Server error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  });

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
    });
  });

  return app;
}

// Default export for Netlify functions
const app = createServer();
export default app;
