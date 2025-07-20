import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create SQLite database
const dbPath =
  process.env.NODE_ENV === "production"
    ? "/tmp/finmate.db"
    : path.join(__dirname, "finmate.dev.db");

const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent access
sqlite.pragma("journal_mode = WAL");

// Create drizzle instance
export const db = drizzle(sqlite, { schema });

// Initialize database with sample data
export async function initializeDatabase() {
  console.log("Initializing database...");

  try {
    // Create tables if they don't exist
    sqlite.exec(`
            CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        title TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER REFERENCES conversations(id),
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        model TEXT,
        confidence REAL,
        category TEXT,
        sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
        tokens INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS learning_modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
        duration INTEGER NOT NULL,
        tokens INTEGER NOT NULL,
        content TEXT NOT NULL,
        prerequisites TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        module_id TEXT REFERENCES learning_modules(module_id),
        completed INTEGER DEFAULT 0,
        completed_at TEXT,
        score INTEGER,
        time_spent INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        achievement_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        tokens_earned INTEGER NOT NULL,
        earned_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        date TEXT NOT NULL,
        is_recurring INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        target_amount REAL NOT NULL,
        current_amount REAL DEFAULT 0,
        deadline TEXT,
        category TEXT NOT NULL,
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        category TEXT NOT NULL,
        allocated REAL NOT NULL,
        spent REAL DEFAULT 0,
        month TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS investments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        quantity REAL NOT NULL,
        avg_price REAL NOT NULL,
        current_price REAL,
        sector TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        monthly_income REAL,
        risk_tolerance TEXT CHECK (risk_tolerance IN ('low', 'medium', 'high')),
        financial_goals TEXT,
        personality_type TEXT,
        total_tokens INTEGER DEFAULT 0,
        completed_modules INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default user if not exists
    const existingUser = sqlite
      .prepare("SELECT * FROM users WHERE email = ?")
      .get("demo@finmate.app");

    if (!existingUser) {
      const insertUser = sqlite.prepare(`
        INSERT INTO users (name, email) VALUES (?, ?)
      `);
      const userResult = insertUser.run("Demo User", "demo@finmate.app");

      // Insert user profile
      const insertProfile = sqlite.prepare(`
        INSERT INTO user_profiles (user_id, monthly_income, risk_tolerance, personality_type, total_tokens, completed_modules, current_streak, level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertProfile.run(
        userResult.lastInsertRowid,
        65000,
        "medium",
        "Smart Conservative",
        165,
        2,
        5,
        3,
      );

      // Insert sample learning modules
      const insertModule = sqlite.prepare(`
        INSERT INTO learning_modules (module_id, title, description, category, difficulty, duration, tokens, content, prerequisites)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const modules = [
        {
          moduleId: "what-is-sip",
          title: "What is SIP?",
          description:
            "Learn about Systematic Investment Plans and how they help build wealth consistently",
          category: "Investment Basics",
          difficulty: "Beginner",
          duration: 5,
          tokens: 50,
          content: JSON.stringify({
            sections: [
              {
                title: "Introduction to SIP",
                content: "SIP content here...",
                type: "text",
              },
            ],
          }),
          prerequisites: null,
        },
        {
          moduleId: "credit-score-basics",
          title: "Credit Score Fundamentals",
          description:
            "Understanding credit scores, how they're calculated, and how to improve them",
          category: "Credit Management",
          difficulty: "Beginner",
          duration: 7,
          tokens: 60,
          content: JSON.stringify({
            sections: [
              {
                title: "What is a Credit Score?",
                content: "Credit score content here...",
                type: "text",
              },
            ],
          }),
          prerequisites: null,
        },
      ];

      modules.forEach((module) => {
        insertModule.run(
          module.moduleId,
          module.title,
          module.description,
          module.category,
          module.difficulty,
          module.duration,
          module.tokens,
          module.content,
          module.prerequisites,
        );
      });

      console.log("Sample data inserted successfully");
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Export the sqlite instance for raw queries if needed
export { sqlite };
