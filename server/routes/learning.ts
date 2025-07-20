import { Request, Response } from "express";
import { db } from "../database/db";
import {
  learningModules,
  userProgress,
  userAchievements,
  userProfiles,
  users,
} from "../database/schema";
import { eq, and } from "drizzle-orm";

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

// Get all learning modules with user progress
export async function getLearningModules(req: Request, res: Response) {
  try {
    const user = await getDefaultUser();

    // Get all modules
    const modules = await db
      .select()
      .from(learningModules)
      .orderBy(learningModules.id);

    // Get user progress for each module
    const userProgressData = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, user.id));

    // Combine modules with progress
    const modulesWithProgress = modules.map((module) => {
      const progress = userProgressData.find(
        (p) => p.moduleId === module.moduleId,
      );

      return {
        ...module,
        completed: progress?.completed || false,
        score: progress?.score || 0,
        timeSpent: progress?.timeSpent || 0,
        completedAt: progress?.completedAt,
        locked: shouldModuleBeLocked(module, userProgressData),
      };
    });

    res.json({
      success: true,
      modules: modulesWithProgress,
    });
  } catch (error) {
    console.error("Error getting learning modules:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get learning modules",
    });
  }
}

// Check if module should be locked based on prerequisites
function shouldModuleBeLocked(module: any, userProgressData: any[]): boolean {
  if (!module.prerequisites) return false;

  try {
    const prerequisites = JSON.parse(module.prerequisites);
    if (!Array.isArray(prerequisites)) return false;

    // Check if all prerequisites are completed
    return !prerequisites.every((prereqId) => {
      const prereqProgress = userProgressData.find(
        (p) => p.moduleId === prereqId,
      );
      return prereqProgress?.completed;
    });
  } catch (error) {
    return false;
  }
}

// Get specific learning module
export async function getLearningModule(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const user = await getDefaultUser();

    const module = await db
      .select()
      .from(learningModules)
      .where(eq(learningModules.moduleId, moduleId))
      .limit(1);

    if (module.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Module not found",
      });
    }

    // Get user progress
    const progress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, user.id),
          eq(userProgress.moduleId, moduleId),
        ),
      )
      .limit(1);

    const moduleWithProgress = {
      ...module[0],
      completed: progress[0]?.completed || false,
      score: progress[0]?.score || 0,
      timeSpent: progress[0]?.timeSpent || 0,
      completedAt: progress[0]?.completedAt,
    };

    res.json({
      success: true,
      module: moduleWithProgress,
    });
  } catch (error) {
    console.error("Error getting learning module:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get learning module",
    });
  }
}

// Complete a learning module
export async function completeModule(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const { score, timeSpent } = req.body;
    const user = await getDefaultUser();

    // Get module info
    const module = await db
      .select()
      .from(learningModules)
      .where(eq(learningModules.moduleId, moduleId))
      .limit(1);

    if (module.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Module not found",
      });
    }

    const moduleData = module[0];

    // Check if already completed
    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, user.id),
          eq(userProgress.moduleId, moduleId),
        ),
      )
      .limit(1);

    let progressResult;

    if (existingProgress.length > 0) {
      // Update existing progress
      progressResult = await db
        .update(userProgress)
        .set({
          completed: true,
          completedAt: new Date().toISOString(),
          score: score || 100,
          timeSpent: timeSpent || moduleData.duration,
        })
        .where(
          and(
            eq(userProgress.userId, user.id),
            eq(userProgress.moduleId, moduleId),
          ),
        )
        .returning();
    } else {
      // Create new progress record
      progressResult = await db
        .insert(userProgress)
        .values({
          userId: user.id,
          moduleId: moduleId,
          completed: true,
          completedAt: new Date().toISOString(),
          score: score || 100,
          timeSpent: timeSpent || moduleData.duration,
        })
        .returning();
    }

    // Update user profile with tokens and completed modules
    const currentProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    if (currentProfile.length > 0) {
      await db
        .update(userProfiles)
        .set({
          totalTokens: currentProfile[0].totalTokens + moduleData.tokens,
          completedModules: currentProfile[0].completedModules + 1,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(userProfiles.userId, user.id));
    }

    // Check for achievements
    await checkAndAwardAchievements(user.id, moduleId);

    res.json({
      success: true,
      progress: progressResult[0],
      tokensEarned: moduleData.tokens,
      message: `Congratulations! You earned ${moduleData.tokens} tokens!`,
    });
  } catch (error) {
    console.error("Error completing module:", error);
    res.status(500).json({
      success: false,
      error: "Failed to complete module",
    });
  }
}

// Check and award achievements
async function checkAndAwardAchievements(userId: number, moduleId: string) {
  try {
    const achievements = [
      {
        id: "first-module",
        name: "First Steps",
        description: "Complete your first learning module",
        tokens: 25,
        condition: async () => {
          const completed = await db
            .select()
            .from(userProgress)
            .where(
              and(
                eq(userProgress.userId, userId),
                eq(userProgress.completed, true),
              ),
            );
          return completed.length === 1;
        },
      },
      {
        id: "sip-master",
        name: "SIP Master",
        description: "Complete SIP fundamentals",
        tokens: 50,
        condition: async () => moduleId === "what-is-sip",
      },
      {
        id: "credit-expert",
        name: "Credit Expert",
        description: "Master credit score basics",
        tokens: 50,
        condition: async () => moduleId === "credit-score-basics",
      },
    ];

    for (const achievement of achievements) {
      // Check if already earned
      const existing = await db
        .select()
        .from(userAchievements)
        .where(
          and(
            eq(userAchievements.userId, userId),
            eq(userAchievements.achievementId, achievement.id),
          ),
        )
        .limit(1);

      if (existing.length === 0 && (await achievement.condition())) {
        // Award achievement
        await db.insert(userAchievements).values({
          userId: userId,
          achievementId: achievement.id,
          name: achievement.name,
          description: achievement.description,
          tokensEarned: achievement.tokens,
        });

        // Add tokens to user profile
        const currentProfile = await db
          .select()
          .from(userProfiles)
          .where(eq(userProfiles.userId, userId))
          .limit(1);

        if (currentProfile.length > 0) {
          await db
            .update(userProfiles)
            .set({
              totalTokens: currentProfile[0].totalTokens + achievement.tokens,
            })
            .where(eq(userProfiles.userId, userId));
        }
      }
    }
  } catch (error) {
    console.error("Error checking achievements:", error);
  }
}

// Get user achievements
export async function getUserAchievements(req: Request, res: Response) {
  try {
    const user = await getDefaultUser();

    const achievements = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, user.id))
      .orderBy(userAchievements.earnedAt);

    res.json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error("Error getting user achievements:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user achievements",
    });
  }
}

// Get learning leaderboard
export async function getLeaderboard(req: Request, res: Response) {
  try {
    // Get top users by total tokens
    const leaderboard = await db
      .select({
        name: users.name,
        totalTokens: userProfiles.totalTokens,
        completedModules: userProfiles.completedModules,
        level: userProfiles.level,
      })
      .from(userProfiles)
      .innerJoin(users, eq(users.id, userProfiles.userId))
      .orderBy(userProfiles.totalTokens)
      .limit(50);

    // Add mock data for demo
    const mockLeaderboard = [
      {
        name: "Financial Guru",
        totalTokens: 2450,
        completedModules: 15,
        level: 8,
      },
      {
        name: "Investment Pro",
        totalTokens: 2100,
        completedModules: 12,
        level: 7,
      },
      {
        name: "Money Master",
        totalTokens: 1890,
        completedModules: 11,
        level: 6,
      },
      {
        name: "Budget Expert",
        totalTokens: 1650,
        completedModules: 9,
        level: 5,
      },
      {
        name: "Savings Star",
        totalTokens: 1420,
        completedModules: 8,
        level: 4,
      },
      ...leaderboard,
    ];

    res.json({
      success: true,
      leaderboard: mockLeaderboard,
    });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get leaderboard",
    });
  }
}

// Get user learning statistics
export async function getUserStats(req: Request, res: Response) {
  try {
    const user = await getDefaultUser();

    // Get user profile
    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    // Get completed modules
    const completedModules = await db
      .select()
      .from(userProgress)
      .where(
        and(eq(userProgress.userId, user.id), eq(userProgress.completed, true)),
      );

    // Get achievements
    const achievements = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, user.id));

    // Calculate total learning time
    const totalTime = completedModules.reduce(
      (sum, module) => sum + (module.timeSpent || 0),
      0,
    );

    const stats = {
      totalTokens: profile[0]?.totalTokens || 0,
      completedModules: completedModules.length,
      currentStreak: profile[0]?.currentStreak || 0,
      totalLearningTime: totalTime,
      level: profile[0]?.level || 1,
      badges: achievements.map((a) => a.name),
      rank: "Apprentice Investor", // Could be calculated based on level
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user stats",
    });
  }
}
