import { Request, Response } from "express";
import { db } from "../database/db";
import {
  generateContextualResponse,
  categorizeQuery,
  analyzeSentiment,
} from "../services/huggingface";
import {
  conversations,
  messages,
  users,
  userProfiles,
} from "../database/schema";
import { eq, desc } from "drizzle-orm";

// Get or create user (for demo purposes, we'll use a default user)
async function getDefaultUser() {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, "demo@finmate.app"))
      .limit(1);

    if (user.length > 0) {
      return user[0];
    }

    // Create default user if not exists
    const newUser = await db
      .insert(users)
      .values({
        name: "Demo User",
        email: "demo@finmate.app",
      })
      .returning();

    return newUser[0];
  } catch (error) {
    console.error("Error getting default user:", error);
    throw error;
  }
}

// Create new conversation
export async function createConversation(req: Request, res: Response) {
  try {
    const { title } = req.body;
    const user = await getDefaultUser();

    const conversation = await db
      .insert(conversations)
      .values({
        userId: user.id,
        title: title || "New Chat",
      })
      .returning();

    res.json({
      success: true,
      conversation: conversation[0],
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create conversation",
    });
  }
}

// Get conversations for user
export async function getConversations(req: Request, res: Response) {
  try {
    const user = await getDefaultUser();

    const userConversations = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, user.id))
      .orderBy(desc(conversations.updatedAt))
      .limit(50);

    res.json({
      success: true,
      conversations: userConversations,
    });
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get conversations",
    });
  }
}

// Get messages for a conversation
export async function getMessages(req: Request, res: Response) {
  try {
    const { conversationId } = req.params;

    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, parseInt(conversationId)))
      .orderBy(messages.createdAt);

    res.json({
      success: true,
      messages: conversationMessages,
    });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get messages",
    });
  }
}

// Send message and get AI response
export async function sendMessage(req: Request, res: Response) {
  try {
    const { conversationId, content, category } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message content is required",
      });
    }

    const user = await getDefaultUser();

    // Get user profile for context
    const userProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    // Get conversation history for context
    const conversationHistory = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(10);

    // Save user message
    const userMessage = await db
      .insert(messages)
      .values({
        conversationId: conversationId,
        role: "user",
        content: content.trim(),
        category: category || (await categorizeQuery(content)),
        sentiment: await analyzeSentiment(content),
      })
      .returning();

    // Generate AI response using Hugging Face
    const aiResponseData = await generateContextualResponse(content, {
      userProfile: userProfile[0] || null,
      conversationHistory: conversationHistory,
      category: category,
    });

    // Save AI response
    const aiMessage = await db
      .insert(messages)
      .values({
        conversationId: conversationId,
        role: "assistant",
        content: aiResponseData.content,
        model: aiResponseData.model,
        confidence: aiResponseData.confidence,
        category: aiResponseData.category,
        sentiment: aiResponseData.sentiment,
        tokens: aiResponseData.tokens,
      })
      .returning();

    // Update conversation timestamp
    await db
      .update(conversations)
      .set({
        updatedAt: new Date().toISOString(),
      })
      .where(eq(conversations.id, conversationId));

    res.json({
      success: true,
      userMessage: userMessage[0],
      aiMessage: aiMessage[0],
      aiResponse: aiResponseData,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send message",
    });
  }
}

// Get user profile
export async function getUserProfile(req: Request, res: Response) {
  try {
    const user = await getDefaultUser();

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    if (profile.length === 0) {
      // Create default profile
      const newProfile = await db
        .insert(userProfiles)
        .values({
          userId: user.id,
          monthlyIncome: 65000,
          riskTolerance: "medium",
          personalityType: "Smart Conservative",
          totalTokens: 165,
          completedModules: 2,
          currentStreak: 5,
          level: 3,
        })
        .returning();

      return res.json({
        success: true,
        profile: newProfile[0],
      });
    }

    res.json({
      success: true,
      profile: profile[0],
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user profile",
    });
  }
}

// Update user profile
export async function updateUserProfile(req: Request, res: Response) {
  try {
    const { monthlyIncome, riskTolerance, financialGoals } = req.body;
    const user = await getDefaultUser();

    const updatedProfile = await db
      .update(userProfiles)
      .set({
        monthlyIncome,
        riskTolerance,
        financialGoals: JSON.stringify(financialGoals),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userProfiles.userId, user.id))
      .returning();

    res.json({
      success: true,
      profile: updatedProfile[0],
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user profile",
    });
  }
}

// AI Coach selection endpoint
export async function selectAICoach(req: Request, res: Response) {
  try {
    const { message, coachType } = req.body;

    const category = await categorizeQuery(message);

    // Map coach types to categories
    const coachMapping: Record<string, string> = {
      "investment-advisor": "investment",
      "budget-planner": "budget",
      "goal-tracker": "goals",
      "risk-analyst": "security",
      "tax-optimizer": "tax",
    };

    const selectedCategory = coachMapping[coachType] || category;

    const response = await generateContextualResponse(message, {
      category: selectedCategory,
    });

    res.json({
      success: true,
      response,
      selectedCoach: coachType,
      category: selectedCategory,
    });
  } catch (error) {
    console.error("Error with AI coach selection:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get AI coach response",
    });
  }
}
