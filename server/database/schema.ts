import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Chat conversations
export const conversations = sqliteTable("conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  title: text("title"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Chat messages
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conversationId: integer("conversation_id").references(() => conversations.id),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  model: text("model"),
  confidence: real("confidence"),
  category: text("category"),
  sentiment: text("sentiment", { enum: ["positive", "neutral", "negative"] }),
  tokens: integer("tokens"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Learning modules
export const learningModules = sqliteTable("learning_modules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  moduleId: text("module_id").unique().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty", {
    enum: ["Beginner", "Intermediate", "Advanced"],
  }).notNull(),
  duration: integer("duration").notNull(),
  tokens: integer("tokens").notNull(),
  content: text("content").notNull(), // JSON string
  prerequisites: text("prerequisites"), // JSON array
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// User progress on learning modules
export const userProgress = sqliteTable("user_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  moduleId: text("module_id").references(() => learningModules.moduleId),
  completed: integer("completed", { mode: "boolean" }).default(false),
  completedAt: text("completed_at"),
  score: integer("score"),
  timeSpent: integer("time_spent"), // in minutes
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// User achievements and badges
export const userAchievements = sqliteTable("user_achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  achievementId: text("achievement_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  tokensEarned: integer("tokens_earned").notNull(),
  earnedAt: text("earned_at").default(sql`CURRENT_TIMESTAMP`),
});

// Transactions
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  amount: real("amount").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  date: text("date").notNull(),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Financial goals
export const goals = sqliteTable("goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  targetAmount: real("target_amount").notNull(),
  currentAmount: real("current_amount").default(0),
  deadline: text("deadline"),
  category: text("category").notNull(),
  priority: text("priority", { enum: ["high", "medium", "low"] }).default(
    "medium",
  ),
  status: text("status", { enum: ["active", "completed", "paused"] }).default(
    "active",
  ),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Budget categories
export const budgets = sqliteTable("budgets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  category: text("category").notNull(),
  allocated: real("allocated").notNull(),
  spent: real("spent").default(0),
  month: text("month").notNull(), // YYYY-MM format
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Investment portfolio
export const investments = sqliteTable("investments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // stock, mutual_fund, bond, etc.
  quantity: real("quantity").notNull(),
  avgPrice: real("avg_price").notNull(),
  currentPrice: real("current_price"),
  sector: text("sector"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// User financial profile
export const userProfiles = sqliteTable("user_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  monthlyIncome: real("monthly_income"),
  riskTolerance: text("risk_tolerance", { enum: ["low", "medium", "high"] }),
  financialGoals: text("financial_goals"), // JSON array
  personalityType: text("personality_type"),
  totalTokens: integer("total_tokens").default(0),
  completedModules: integer("completed_modules").default(0),
  currentStreak: integer("current_streak").default(0),
  level: integer("level").default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
