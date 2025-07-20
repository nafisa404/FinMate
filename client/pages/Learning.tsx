import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Brain,
  Trophy,
  Star,
  Coins,
  CheckCircle,
  Lock,
  Play,
  Award,
  Target,
  TrendingUp,
  Shield,
  CreditCard,
  PiggyBank,
  Calculator,
  Lightbulb,
  Zap,
  Clock,
  Users,
  BarChart3,
  DollarSign,
  Sparkles,
  Gift,
  Crown,
  Medal,
  Flame,
} from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number; // minutes
  tokens: number;
  icon: any;
  color: string;
  completed: boolean;
  locked: boolean;
  content: {
    sections: {
      title: string;
      content: string;
      type: "text" | "quiz" | "interactive";
      quiz?: {
        question: string;
        options: string[];
        correct: number;
        explanation: string;
      };
    }[];
  };
  prerequisites?: string[];
}

interface UserProgress {
  totalTokens: number;
  completedModules: number;
  currentStreak: number;
  totalLearningTime: number;
  level: number;
  badges: string[];
  rank: string;
}

const learningModules: LearningModule[] = [
  {
    id: "what-is-sip",
    title: "What is SIP?",
    description:
      "Learn about Systematic Investment Plans and how they help build wealth consistently",
    category: "Investment Basics",
    difficulty: "Beginner",
    duration: 5,
    tokens: 50,
    icon: TrendingUp,
    color: "#3b82f6",
    completed: false,
    locked: false,
    content: {
      sections: [
        {
          title: "Introduction to SIP",
          content: `🎯 **Systematic Investment Plan (SIP) Explained**

A SIP is like having a disciplined savings habit on autopilot! Instead of trying to invest a large amount at once, you invest small, fixed amounts regularly.

**Think of it like this:** Instead of buying groceries worth ₹3,000 once a month, you buy ₹100 worth every day. This way, you sometimes get vegetables when they're cheap, sometimes when they're expensive, but on average, you get a fair price.

**Key Benefits:**
• **Rupee Cost Averaging**: Buy more units when prices are low, fewer when high
• **Disciplined Investing**: Automatic investments build good habits
• **Flexibility**: Start with as little as ₹500/month
• **Compound Power**: Small amounts grow into large wealth over time`,
          type: "text",
        },
        {
          title: "How SIP Works",
          content: `📊 **The SIP Magic Formula**

Let's say you invest ₹5,000 every month in a mutual fund:

**Month 1:** NAV = ₹50, Units bought = 100
**Month 2:** NAV = ₹40, Units bought = 125 (Market down = More units!)
**Month 3:** NAV = ₹60, Units bought = 83.33 (Market up = Fewer units)

**Result:** Average cost = ₹49.09 (better than ₹50!)

**Real Example:**
₹5,000/month for 10 years at 12% returns = ₹11.6 Lakhs invested becomes ₹23.2 Lakhs!

**SIP vs Lump Sum:**
- SIP: Reduces timing risk, builds discipline
- Lump Sum: Requires market timing skills (difficult for beginners)`,
          type: "text",
        },
        {
          title: "Quick Quiz",
          content: "Test your SIP knowledge!",
          type: "quiz",
          quiz: {
            question:
              "What is the main advantage of rupee cost averaging in SIP?",
            options: [
              "It guarantees higher returns",
              "It reduces the impact of market volatility",
              "It eliminates all investment risks",
              "It requires less money to invest",
            ],
            correct: 1,
            explanation:
              "Rupee cost averaging helps reduce the impact of market volatility by spreading your investments over time, buying more units when prices are low and fewer when prices are high.",
          },
        },
        {
          title: "Getting Started",
          content: `🚀 **Start Your SIP Journey**

**Step 1: Choose Your Amount**
- Start small: ₹500-1,000/month
- Increase gradually: Add ₹500 every 6 months
- Target: 20-25% of your income

**Step 2: Select the Right Fund**
- Beginner: Large Cap or Index Funds
- Growth seeker: Mid Cap or Small Cap
- Conservative: Hybrid/Balanced Funds

**Step 3: Automate Everything**
- Set up auto-debit from bank
- Choose a fixed date (after salary credit)
- Enable step-up SIP (auto-increase)

**Pro Tips:**
• Start TODAY, even with ₹500
• Increase by 10% annually
• Don't stop during market crashes
• Review annually, don't change frequently`,
          type: "text",
        },
      ],
    },
  },
  {
    id: "credit-score-basics",
    title: "Credit Score Fundamentals",
    description:
      "Understanding credit scores, how they're calculated, and how to improve them",
    category: "Credit Management",
    difficulty: "Beginner",
    duration: 7,
    tokens: 60,
    icon: Shield,
    color: "#10b981",
    completed: false,
    locked: false,
    content: {
      sections: [
        {
          title: "What is a Credit Score?",
          content: `🎯 **Your Financial Report Card**

A credit score is a 3-digit number (300-900) that tells lenders how trustworthy you are with money. Think of it as your financial reputation score!

**Credit Score Ranges:**
• **750-900**: Excellent (VIP treatment from banks!)
• **700-749**: Good (Great loan terms)
• **650-699**: Fair (Decent options available)  
• **600-649**: Poor (Limited, expensive options)
• **Below 600**: Bad (Very difficult to get loans)

**Why It Matters:**
• **Loan Approvals**: Higher score = Easier approvals
• **Interest Rates**: Good score can save lakhs in interest
• **Credit Card Limits**: Higher limits and better cards
• **Employment**: Some companies check credit scores
• **Renting**: Landlords may check your score`,
          type: "text",
        },
        {
          title: "How Credit Score is Calculated",
          content: `📊 **The Credit Score Formula**

**1. Payment History (35% weightage)**
- On-time payments = Good score
- Late payments = Score goes down
- Missed payments = Major damage

**2. Credit Utilization (30% weightage)**
- Keep usage below 30% of limit
- Example: ₹1L limit → Use max ₹30,000
- Lower utilization = Better score

**3. Credit History Length (15% weightage)**
- Older accounts = Better score
- Don't close old credit cards
- Average account age matters

**4. Credit Mix (10% weightage)**
- Variety: Credit cards + loans
- Shows you can handle different credit types

**5. New Credit Inquiries (10% weightage)**
- Too many applications hurt score
- Space out credit applications
- Only apply when needed`,
          type: "text",
        },
        {
          title: "Knowledge Check",
          content: "Test your credit score understanding!",
          type: "quiz",
          quiz: {
            question:
              "What is the ideal credit utilization ratio to maintain a good credit score?",
            options: ["Below 10%", "Below 30%", "Below 50%", "Below 70%"],
            correct: 1,
            explanation:
              "Keeping your credit utilization below 30% of your total credit limit is ideal for maintaining a good credit score. Lower utilization shows responsible credit management.",
          },
        },
        {
          title: "Improving Your Credit Score",
          content: `🚀 **Credit Score Improvement Roadmap**

**Quick Wins (1-3 months):**
• Pay all bills on time (set auto-pay)
• Reduce credit card balances below 30%
• Pay off small balances completely
• Don't close old credit cards

**Medium-term Strategies (3-6 months):**
• Increase credit limits (but don't use them)
• Pay multiple times per month
• Keep old accounts active with small purchases
• Monitor your credit report monthly

**Long-term Building (6+ months):**
• Maintain payment discipline
• Build diverse credit mix
• Keep accounts open longer
• Dispute any errors on credit report

**Pro Tips:**
• Check free credit score monthly
• Set payment reminders
• Use credit cards like debit cards
• Keep credit utilization under 10% for excellent scores

**Emergency:** If you have missed payments, contact the bank immediately to discuss payment plans!`,
          type: "text",
        },
      ],
    },
  },
  {
    id: "emergency-fund-guide",
    title: "Building Emergency Fund",
    description:
      "Why you need an emergency fund and how to build one systematically",
    category: "Financial Planning",
    difficulty: "Beginner",
    duration: 6,
    tokens: 55,
    icon: Shield,
    color: "#f59e0b",
    completed: false,
    locked: false,
    content: {
      sections: [
        {
          title: "Why Emergency Fund is Critical",
          content: `🛡️ **Your Financial Safety Net**

An emergency fund is money set aside for unexpected expenses or income loss. It's like a financial insurance policy that you create for yourself!

**Real-life Emergencies:**
• Job loss or salary cuts
• Medical emergencies 
• Home or vehicle repairs
• Family emergencies
• Economic downturns (like COVID-19)

**Why You Need It:**
• **Peace of Mind**: Sleep better knowing you're protected
• **Avoid Debt**: Don't use credit cards for emergencies
• **Investment Protection**: Don't break investments for cash
• **Opportunity Fund**: Sometimes emergencies are opportunities!

**The Cost of Not Having One:**
Without an emergency fund, you might:
- Take expensive personal loans (15-20% interest)
- Break fixed deposits (penalty + tax)
- Sell investments at a loss
- Use credit cards (24-48% interest)`,
          type: "text",
        },
        {
          title: "How Much Do You Need?",
          content: `💰 **Emergency Fund Size Calculator**

**Standard Rule:** 6-12 months of expenses

**Personalize Based on Your Situation:**

**3-6 months if:**
- Stable government job
- Dual income household
- Good health insurance
- Strong family support

**6-9 months if:**
- Private sector job
- Single income household
- Moderate job security
- Some health coverage

**9-12 months if:**
- Freelancer/business owner
- Volatile industry (startups, sales)
- No health insurance
- Dependents to support

**Quick Calculation:**
Monthly Expenses = ₹40,000
Emergency Fund = ��40,000 × 6 = ₹2,40,000

**Pro Tip:** Start with 1 month, then build to 3, then 6, then target amount!`,
          type: "text",
        },
        {
          title: "Test Your Knowledge",
          content: "Emergency fund quiz time!",
          type: "quiz",
          quiz: {
            question:
              "Where should you keep your emergency fund for easy access?",
            options: [
              "Fixed deposits only",
              "Stock market investments",
              "High-yield savings account or liquid funds",
              "Real estate",
            ],
            correct: 2,
            explanation:
              "Emergency funds should be kept in easily accessible, low-risk options like high-yield savings accounts or liquid mutual funds that can be withdrawn quickly without penalties.",
          },
        },
        {
          title: "Building Your Emergency Fund",
          content: `🏗️ **Emergency Fund Building Strategy**

**Phase 1: Quick Start (Month 1-2)**
- Open high-yield savings account
- Set up automatic transfer of ₹5,000/month
- Target: ₹10,000 initial buffer

**Phase 2: Foundation (Month 3-6)**  
- Increase to ₹10,000/month
- Use windfalls (bonus, gifts)
- Target: 1 month expenses

**Phase 3: Expansion (Month 7-18)**
- Maintain steady contributions
- Add tax refunds, raises
- Target: 3-6 months expenses

**Where to Keep It:**
• **70% in Savings Account**: Instant access
• **30% in Liquid Funds**: Slightly higher returns

**Funding Sources:**
- Direct monthly allocation
- Tax refunds and bonuses  
- Side income/freelancing
- Expense optimization savings
- Gift money and windfalls

**Don't Touch Unless:**
It's a REAL emergency (not vacation or shopping!)`,
          type: "text",
        },
      ],
    },
  },
  {
    id: "tax-saving-strategies",
    title: "Tax Saving Under 80C",
    description:
      "Complete guide to tax-saving investments and deductions under Section 80C",
    category: "Tax Planning",
    difficulty: "Intermediate",
    duration: 8,
    tokens: 70,
    icon: Calculator,
    color: "#8b5cf6",
    completed: false,
    locked: true,
    prerequisites: ["what-is-sip"],
    content: {
      sections: [
        {
          title: "Understanding Section 80C",
          content: `💰 **Section 80C: Your Tax-Saving Toolkit**

Section 80C allows you to reduce your taxable income by up to ₹1.5 lakhs annually through eligible investments and expenses.

**Tax Savings Calculation:**
- Income: ₹8 lakhs
- 80C Investments: ₹1.5 lakhs  
- Taxable Income: ₹6.5 lakhs
- **Tax Saved: ₹46,800** (Old regime)

**Eligible Investments:**
• **PPF**: 15-year lock-in, tax-free returns
• **ELSS Mutual Funds**: 3-year lock-in, market returns
• **NSC**: 5-year lock-in, fixed returns  
• **Tax Saver FDs**: 5-year lock-in, taxable returns
• **LIC Premiums**: Life cover + tax benefits
• **Home Loan Principal**: Building asset + tax benefit

**Pro Tip:** Don't just save tax, build wealth! Choose investments that grow your money while saving taxes.`,
          type: "text",
        },
        {
          title: "ELSS vs PPF vs NSC Comparison",
          content: `📊 **Best Tax-Saving Options Compared**

**ELSS Mutual Funds**
- Lock-in: 3 years (shortest!)
- Returns: 12-15% potential (market-linked)
- Risk: Moderate to high
- Liquidity: Good after 3 years
- Best for: Young investors, growth seekers

**Public Provident Fund (PPF)**  
- Lock-in: 15 years (longest)
- Returns: 7.1% current (tax-free!)
- Risk: Nil (government backed)
- Liquidity: Partial withdrawal after 7 years
- Best for: Conservative, long-term planning

**National Savings Certificate (NSC)**
- Lock-in: 5 years
- Returns: 6.8% (taxable)
- Risk: Nil
- Liquidity: None till maturity
- Best for: Conservative investors

**Tax Saver Fixed Deposits**
- Lock-in: 5 years  
- Returns: 5-6% (taxable)
- Risk: Nil
- Liquidity: None
- Best for: Ultra-conservative

**Winner for Wealth Building:** ELSS (higher returns + shorter lock-in)`,
          type: "text",
        },
      ],
    },
  },
  {
    id: "mutual-fund-basics",
    title: "Mutual Funds Demystified",
    description:
      "Complete beginner's guide to mutual funds, types, and selection criteria",
    category: "Investment Basics",
    difficulty: "Intermediate",
    duration: 10,
    tokens: 80,
    icon: BarChart3,
    color: "#ef4444",
    completed: false,
    locked: true,
    prerequisites: ["what-is-sip"],
    content: {
      sections: [
        {
          title: "What are Mutual Funds?",
          content: `🎯 **Mutual Funds Simplified**

Imagine you and 999 other people pool ₹1,000 each to create a fund of ₹10 lakhs. A professional fund manager uses this money to buy shares of different companies. You own a small piece of this diversified portfolio!

**Key Players:**
• **You**: The investor putting money
• **Fund Manager**: Professional making investment decisions  
• **AMC**: Asset Management Company running the fund
• **Registrar**: Keeping track of your investments

**Why Mutual Funds Rock:**
• **Professional Management**: Experts handle your money
• **Diversification**: Don't put all eggs in one basket
• **Affordability**: Start with just ₹500
• **Liquidity**: Get your money back quickly (most funds)
• **Transparency**: Know exactly what you own

**Types by Investment:**
- **Equity Funds**: Invest in stocks (higher risk/return)
- **Debt Funds**: Invest in bonds (lower risk/return)  
- **Hybrid Funds**: Mix of stocks and bonds`,
          type: "text",
        },
      ],
    },
  },
  {
    id: "crypto-basics",
    title: "Cryptocurrency Fundamentals",
    description:
      "Understanding digital currencies, blockchain, and crypto investment basics",
    category: "Modern Investing",
    difficulty: "Advanced",
    duration: 12,
    tokens: 100,
    icon: Coins,
    color: "#f97316",
    completed: false,
    locked: true,
    prerequisites: ["mutual-fund-basics", "tax-saving-strategies"],
    content: {
      sections: [
        {
          title: "What is Cryptocurrency?",
          content: `🚀 **Digital Money Revolution**

Cryptocurrency is digital money that exists only electronically, secured by cryptography and operated on blockchain technology. Think of it as digital cash that no government or bank controls!

**Key Features:**
• **Decentralized**: No central authority
• **Secure**: Protected by advanced cryptography
• **Transparent**: All transactions recorded publicly
• **Global**: Works across borders instantly
• **Limited Supply**: Most cryptos have supply caps

**Popular Cryptocurrencies:**
- **Bitcoin (BTC)**: Digital gold, store of value
- **Ethereum (ETH)**: Smart contracts platform
- **Binance Coin (BNB)**: Exchange utility token

**⚠️ Important:** Crypto is highly volatile and risky. Only invest what you can afford to lose!`,
          type: "text",
        },
      ],
    },
  },
];

const userProgressData: UserProgress = {
  totalTokens: 165,
  completedModules: 2,
  currentStreak: 5,
  totalLearningTime: 45,
  level: 3,
  badges: ["Early Learner", "SIP Master", "Credit Wizard"],
  rank: "Apprentice Investor",
};

const achievements = [
  {
    id: "first-module",
    name: "First Steps",
    description: "Complete your first learning module",
    icon: Trophy,
    tokens: 25,
  },
  {
    id: "sip-master",
    name: "SIP Master",
    description: "Complete SIP fundamentals",
    icon: TrendingUp,
    tokens: 50,
  },
  {
    id: "credit-expert",
    name: "Credit Expert",
    description: "Master credit score basics",
    icon: Shield,
    tokens: 50,
  },
  {
    id: "streak-5",
    name: "Learning Streak",
    description: "Learn for 5 consecutive days",
    icon: Flame,
    tokens: 100,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Score 100% on 5 quizzes",
    icon: Star,
    tokens: 150,
  },
  {
    id: "speed-learner",
    name: "Speed Learner",
    description: "Complete 3 modules in one day",
    icon: Zap,
    tokens: 75,
  },
];

export default function Learning() {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(
    null,
  );
  const [currentSection, setCurrentSection] = useState(0);
  const [userProgress, setUserProgress] =
    useState<UserProgress>(userProgressData);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [moduleProgress, setModuleProgress] = useState<{
    [key: string]: number;
  }>({});
  const [modules, setModules] = useState<LearningModule[]>(learningModules);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch learning modules
        const modulesResponse = await fetch("/api/learning/modules");
        console.log("Modules API Response status:", modulesResponse.status);
        if (modulesResponse.ok) {
          const modulesData = await modulesResponse.json();
          if (modulesData.success && modulesData.modules) {
            setModules(modulesData.modules);
          } else {
            setModules(learningModules);
          }
        }

        // Fetch user stats
        const statsResponse = await fetch("/api/learning/stats");
        console.log("Stats API Response status:", statsResponse.status);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success && statsData.stats) {
            setUserProgress(statsData.stats);
          } else {
            setUserProgress(userProgressData);
          }
        }
      } catch (error) {
        console.error("Error fetching learning data:", error);
        // Use fallback data if API fails
        setModules(learningModules);
        setUserProgress(userProgressData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const completedModulesList = modules.filter((module) => module.completed);
  const availableModules = modules.filter(
    (module) => !module.locked && !module.completed,
  );
  const lockedModules = modules.filter((module) => module.locked);

  const handleCompleteModule = async (moduleId: string) => {
    try {
      const response = await fetch(
        `/api/learning/modules/${moduleId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: 100,
            timeSpent: selectedModule?.duration || 5,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();

        // Update local state
        setModules((prevModules) =>
          prevModules.map((mod) => {
            if (mod.id === moduleId) {
              return { ...mod, completed: true };
            }
            // Unlock modules that have this as prerequisite
            if (mod.prerequisites?.includes(moduleId)) {
              return { ...mod, locked: false };
            }
            return mod;
          }),
        );

        setUserProgress((prev) => ({
          ...prev,
          totalTokens: prev.totalTokens + data.tokensEarned,
          completedModules: prev.completedModules + 1,
          totalLearningTime:
            prev.totalLearningTime + (selectedModule?.duration || 5),
        }));

        // Show success message
        alert(`${data.message}`);
      } else {
        throw new Error("Failed to complete module");
      }
    } catch (error) {
      console.error("Error completing module:", error);

      // Fallback to local completion
      const module = modules.find((m) => m.id === moduleId);
      if (module) {
        setModules((prevModules) =>
          prevModules.map((mod) =>
            mod.id === moduleId ? { ...mod, completed: true } : mod,
          ),
        );

        setUserProgress((prev) => ({
          ...prev,
          totalTokens: prev.totalTokens + module.tokens,
          completedModules: prev.completedModules + 1,
          totalLearningTime: prev.totalLearningTime + module.duration,
        }));
      }
    }
  };

  const handleQuizSubmit = (answer: number) => {
    setQuizAnswer(answer);
    setShowQuizResult(true);
  };

  const nextSection = () => {
    if (
      selectedModule &&
      currentSection < selectedModule.content.sections.length - 1
    ) {
      setCurrentSection(currentSection + 1);
      setShowQuizResult(false);
      setQuizAnswer(null);
    } else if (selectedModule) {
      // Module completed
      handleCompleteModule(selectedModule.id);
      setSelectedModule(null);
      setCurrentSection(0);
    }
  };

  const getLevelProgress = () => {
    const progressToNextLevel = (userProgress.completedModules % 5) * 20;
    return progressToNextLevel;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading learning modules...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-primary" />
            FinMate Learning Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Interactive financial education with rewards and gamification
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Coins className="mr-2 h-5 w-5 text-yellow-500" />
            {userProgress.totalTokens} Tokens
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Crown className="mr-2 h-5 w-5 text-purple-500" />
            Level {userProgress.level}
          </Badge>
        </div>
      </div>

      {/* User Progress Dashboard */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
            Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {userProgress.completedModules}
              </div>
              <div className="text-sm text-muted-foreground">
                Modules Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {userProgress.currentStreak}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {formatTime(userProgress.totalLearningTime)}
              </div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {userProgress.rank}
              </div>
              <div className="text-sm text-muted-foreground">Current Rank</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Level {userProgress.level} Progress
              </span>
              <span className="text-sm text-muted-foreground">
                {getLevelProgress()}%
              </span>
            </div>
            <Progress value={getLevelProgress()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          {/* Available Modules */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Play className="mr-2 h-6 w-6 text-green-500" />
              Available Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableModules.map((module) => (
                <Card
                  key={module.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <module.icon
                        className="h-8 w-8"
                        style={{ color: module.color }}
                      />
                      <Badge
                        variant={
                          module.difficulty === "Beginner"
                            ? "secondary"
                            : module.difficulty === "Intermediate"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {module.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {module.duration} min
                      </div>
                      <div className="flex items-center text-sm font-medium text-yellow-600">
                        <Coins className="mr-1 h-4 w-4" />
                        {module.tokens} tokens
                      </div>
                    </div>
                    <Badge variant="outline" className="mb-4">
                      {module.category}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          onClick={() => {
                            setSelectedModule(module);
                            setCurrentSection(0);
                          }}
                        >
                          Start Learning
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <module.icon
                              className="mr-2 h-6 w-6"
                              style={{ color: module.color }}
                            />
                            {selectedModule?.title}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedModule && (
                          <div className="space-y-6">
                            {/* Progress Bar */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  Section {currentSection + 1} of{" "}
                                  {selectedModule.content.sections.length}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {Math.round(
                                    ((currentSection + 1) /
                                      selectedModule.content.sections.length) *
                                      100,
                                  )}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  ((currentSection + 1) /
                                    selectedModule.content.sections.length) *
                                  100
                                }
                                className="h-2"
                              />
                            </div>

                            {/* Content */}
                            <div className="bg-muted/30 p-6 rounded-lg">
                              <h3 className="text-xl font-bold mb-4">
                                {
                                  selectedModule.content.sections[
                                    currentSection
                                  ].title
                                }
                              </h3>

                              {selectedModule.content.sections[currentSection]
                                .type === "quiz" &&
                              selectedModule.content.sections[currentSection]
                                .quiz ? (
                                <div className="space-y-4">
                                  <h4 className="font-medium">
                                    {
                                      selectedModule.content.sections[
                                        currentSection
                                      ].quiz!.question
                                    }
                                  </h4>
                                  <div className="space-y-2">
                                    {selectedModule.content.sections[
                                      currentSection
                                    ].quiz!.options.map((option, index) => (
                                      <Button
                                        key={index}
                                        variant={
                                          quizAnswer === index
                                            ? "default"
                                            : "outline"
                                        }
                                        className="w-full text-left justify-start"
                                        onClick={() =>
                                          !showQuizResult &&
                                          handleQuizSubmit(index)
                                        }
                                        disabled={showQuizResult}
                                      >
                                        {String.fromCharCode(65 + index)}.{" "}
                                        {option}
                                      </Button>
                                    ))}
                                  </div>
                                  {showQuizResult && (
                                    <div
                                      className={`p-4 rounded-lg ${quizAnswer === selectedModule.content.sections[currentSection].quiz!.correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                                    >
                                      <div className="flex items-center mb-2">
                                        {quizAnswer ===
                                        selectedModule.content.sections[
                                          currentSection
                                        ].quiz!.correct ? (
                                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                        ) : (
                                          <Target className="h-5 w-5 text-red-600 mr-2" />
                                        )}
                                        <span className="font-medium">
                                          {quizAnswer ===
                                          selectedModule.content.sections[
                                            currentSection
                                          ].quiz!.correct
                                            ? "Correct!"
                                            : "Incorrect"}
                                        </span>
                                      </div>
                                      <p className="text-sm">
                                        {
                                          selectedModule.content.sections[
                                            currentSection
                                          ].quiz!.explanation
                                        }
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="prose prose-sm max-w-none">
                                  <div className="whitespace-pre-wrap">
                                    {
                                      selectedModule.content.sections[
                                        currentSection
                                      ].content
                                    }
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between">
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setCurrentSection(
                                    Math.max(0, currentSection - 1),
                                  )
                                }
                                disabled={currentSection === 0}
                              >
                                Previous
                              </Button>
                              <Button
                                onClick={nextSection}
                                disabled={
                                  selectedModule.content.sections[
                                    currentSection
                                  ].type === "quiz" && !showQuizResult
                                }
                              >
                                {currentSection ===
                                selectedModule.content.sections.length - 1
                                  ? "Complete Module"
                                  : "Next"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Completed Modules */}
          {completedModulesList.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                Completed Modules
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedModulesList.map((module) => (
                  <Card key={module.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <module.icon
                          className="h-8 w-8"
                          style={{ color: module.color }}
                        />
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {module.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Completed</Badge>
                        <div className="flex items-center text-sm font-medium text-yellow-600">
                          <Coins className="mr-1 h-4 w-4" />
                          {module.tokens} earned
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Locked Modules */}
          {lockedModules.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Lock className="mr-2 h-6 w-6 text-gray-500" />
                Locked Modules
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedModules.map((module) => (
                  <Card key={module.id} className="opacity-50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <module.icon className="h-8 w-8 text-gray-400" />
                        <Lock className="h-6 w-6 text-gray-400" />
                      </div>
                      <CardTitle className="text-lg text-gray-600">
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {module.description}
                      </p>
                      {module.prerequisites && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2">
                            Prerequisites:
                          </p>
                          {module.prerequisites.map((prereq) => {
                            const prereqModule = learningModules.find(
                              (m) => m.id === prereq,
                            );
                            return (
                              <Badge
                                key={prereq}
                                variant="outline"
                                className="mr-2"
                              >
                                {prereqModule?.title}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                      <Button disabled className="w-full">
                        <Lock className="mr-2 h-4 w-4" />
                        Locked
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Award className="mr-2 h-6 w-6 text-yellow-500" />
              Achievements & Badges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const isEarned = userProgress.badges.includes(achievement.name);
                return (
                  <Card
                    key={achievement.id}
                    className={
                      isEarned
                        ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20"
                        : "opacity-60"
                    }
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <achievement.icon
                          className={`h-8 w-8 ${isEarned ? "text-yellow-500" : "text-gray-400"}`}
                        />
                        {isEarned && (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                      </div>
                      <CardTitle
                        className={
                          isEarned
                            ? "text-yellow-800 dark:text-yellow-200"
                            : "text-gray-600"
                        }
                      >
                        {achievement.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant={isEarned ? "default" : "outline"}>
                          {isEarned ? "Earned" : "Locked"}
                        </Badge>
                        <div className="flex items-center text-sm font-medium text-yellow-600">
                          <Coins className="mr-1 h-4 w-4" />
                          {achievement.tokens} tokens
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Modules Completed</span>
                  <span className="font-bold">
                    {userProgress.completedModules}/6
                  </span>
                </div>
                <Progress value={(userProgress.completedModules / 6) * 100} />

                <div className="flex justify-between">
                  <span>Current Streak</span>
                  <span className="font-bold">
                    {userProgress.currentStreak} days
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Total Learning Time</span>
                  <span className="font-bold">
                    {formatTime(userProgress.totalLearningTime)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tokens Earned</span>
                  <span className="font-bold">{userProgress.totalTokens}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earned Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userProgress.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg"
                    >
                      <Medal className="h-6 w-6 text-yellow-500 mr-3" />
                      <span className="font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                Learning Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center">
                    <Crown className="h-8 w-8 text-yellow-500 mr-3" />
                    <div>
                      <div className="font-bold">You</div>
                      <div className="text-sm text-muted-foreground">
                        {userProgress.rank}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {userProgress.totalTokens} tokens
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rank #42
                    </div>
                  </div>
                </div>

                {/* Sample leaderboard entries */}
                {[
                  { name: "Financial Guru", tokens: 2450, rank: 1 },
                  { name: "Investment Pro", tokens: 2100, rank: 2 },
                  { name: "Money Master", tokens: 1890, rank: 3 },
                  { name: "Budget Expert", tokens: 1650, rank: 4 },
                  { name: "Savings Star", tokens: 1420, rank: 5 },
                ].map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {user.rank}
                      </div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <div className="font-bold">{user.tokens} tokens</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
