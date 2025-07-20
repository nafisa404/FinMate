import { Request, Response } from "express";
import { db } from "../database/db";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";

// Simple password hashing (in production, use bcrypt)
const hashPassword = (password: string): string => {
  return Buffer.from(password).toString("base64");
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return Buffer.from(password).toString("base64") === hashedPassword;
};

// Generate a simple JWT-like token (in production, use proper JWT)
const generateToken = (userId: number): string => {
  return Buffer.from(`user:${userId}:${Date.now()}`).toString("base64");
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // Create new user
    const hashedPassword = hashPassword(password);
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      });

    const user = newUser[0];
    const token = generateToken(user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.name
          .split(" ")
          .map((n) => n[0])
          .join(""),
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Demo login
    if (email === "demo@finmate.com" && password === "demo123") {
      const demoUser = {
        id: 1,
        name: "John Demo",
        email: "demo@finmate.com",
        avatar: "JD",
        createdAt: new Date().toISOString(),
      };

      return res.json({
        success: true,
        user: demoUser,
        token: "demo-token",
      });
    }

    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const user = userResult[0];

    // Verify password
    if (!verifyPassword(password, user.password || "")) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.name
          .split(" ")
          .map((n) => n[0])
          .join(""),
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  // In a real app, you'd invalidate the token here
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    // Demo token
    if (token === "demo-token") {
      return res.json({
        success: true,
        user: {
          id: 1,
          name: "John Demo",
          email: "demo@finmate.com",
          avatar: "JD",
        },
      });
    }

    // Decode token (in production, use proper JWT verification)
    try {
      const decoded = Buffer.from(token, "base64").toString();
      const parts = decoded.split(":");
      if (parts.length !== 3 || parts[0] !== "user") {
        throw new Error("Invalid token format");
      }

      const userId = parseInt(parts[1]);
      const user = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user.length === 0) {
        return res.status(401).json({
          success: false,
          error: "Invalid token",
        });
      }

      res.json({
        success: true,
        user: {
          ...user[0],
          avatar: user[0].name
            .split(" ")
            .map((n) => n[0])
            .join(""),
        },
      });
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
