import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Coins,
  TrendingUp,
  Shield,
  Calculator,
  X,
  Lightbulb,
  Zap,
  Star,
  Gift,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LearningNudgeProps {
  context?: "dashboard" | "transactions" | "investments" | "general";
  onDismiss?: () => void;
}

const contextualNudges = {
  dashboard: {
    title: "💡 Quick Learning: What is SIP?",
    description: "Learn about Systematic Investment Plans in 5 minutes",
    tokens: 50,
    icon: TrendingUp,
    color: "#3b82f6",
    content: `🎯 **Systematic Investment Plan (SIP) - Quick Guide**

**What is SIP?**
A SIP is like having a disciplined savings habit on autopilot! You invest small, fixed amounts regularly instead of large lump sums.

**Key Benefits:**
• **Rupee Cost Averaging**: Smooths out market volatility
• **Disciplined Investing**: Builds good financial habits
• **Flexibility**: Start with just ₹500/month
• **Compound Growth**: Small amounts grow into wealth

**Example:**
₹5,000/month for 10 years at 12% returns:
- Amount Invested: ₹6 Lakhs
- Final Value: ₹11.6 Lakhs
- Profit: ₹5.6 Lakhs!

**Getting Started:**
1. Choose amount (start with ₹1,000)
2. Select a good mutual fund
3. Set up auto-debit
4. Stay consistent!

🎁 **Complete this module to earn 50 tokens!**`,
  },
  transactions: {
    title: "🔍 Learn: Understanding Credit Scores",
    description: "Master credit score fundamentals and improve yours",
    tokens: 60,
    icon: Shield,
    color: "#10b981",
    content: `🎯 **Credit Score Mastery - Quick Guide**

**What is a Credit Score?**
A 3-digit number (300-900) showing how trustworthy you are with money.

**Score Ranges:**
• 750-900: Excellent (VIP loans!)
• 700-749: Good (Great rates)
• 650-699: Fair (Decent options)
• Below 650: Needs improvement

**What Affects Your Score:**
• Payment History (35%) - Pay on time!
• Credit Utilization (30%) - Keep below 30%
• Credit History Length (15%) - Keep old cards
• Credit Mix (10%) - Cards + loans
• New Credit (10%) - Don't apply too often

**Quick Improvement Tips:**
1. Set up auto-pay for all bills
2. Keep credit card usage below 30%
3. Don't close old credit cards
4. Pay multiple times per month
5. Check credit report monthly

🎁 **Complete to earn 60 tokens + Credit Expert badge!**`,
  },
  investments: {
    title: "📊 Learn: Tax Saving with 80C",
    description: "Optimize your taxes while building wealth",
    tokens: 70,
    icon: Calculator,
    color: "#8b5cf6",
    content: `💰 **Section 80C Tax Saving - Quick Guide**

**Save Up to ₹46,800 in Taxes!**
Section 80C lets you reduce taxable income by ₹1.5 lakhs annually.

**Best 80C Options:**
• **ELSS Funds**: 3-year lock, 12-15% returns
• **PPF**: 15-year lock, 7.1% tax-free returns  
• **NSC**: 5-year lock, 6.8% returns
• **Home Loan Principal**: Build asset + save tax

**Tax Calculation Example:**
Income: ₹8L → Tax: ₹78,000
With 80C: ₹6.5L → Tax: ₹31,200
**Tax Saved: ₹46,800!**

**ELSS vs PPF:**
- ELSS: Higher returns, shorter lock-in
- PPF: Guaranteed returns, tax-free maturity

**Action Plan:**
1. Calculate your tax liability
2. Choose ELSS for growth (recommended)
3. Start SIP of ₹12,500/month
4. Enjoy tax savings + wealth building!

🎁 **Complete to earn 70 tokens + Tax Saver badge!**`,
  },
  general: {
    title: "🛡️ Learn: Emergency Fund Basics",
    description: "Build your financial safety net step by step",
    tokens: 55,
    icon: Shield,
    color: "#f59e0b",
    content: `🛡️ **Emergency Fund Essentials - Quick Guide**

**Why You Need It:**
Life is unpredictable! Job loss, medical bills, home repairs - be prepared.

**How Much to Save:**
• Stable job: 6 months expenses
• Unstable job: 12 months expenses
• Freelancer: 12+ months expenses

**Quick Calculation:**
Monthly expenses: ₹40,000
Emergency fund: ₹40,000 × 6 = ₹2,40,000

**Where to Keep It:**
• 70% in high-yield savings account
• 30% in liquid mutual funds
• Goal: Easy access when needed

**Building Strategy:**
1. Start with ₹10,000 target
2. Save ₹5,000-10,000/month
3. Use bonuses and windfalls
4. Don't touch unless real emergency!

**Pro Tips:**
- Automate the savings
- Keep it separate from daily banking
- Build gradually, don't stress
- Review and increase annually

🎁 **Complete to earn 55 tokens + Safety Expert badge!**`,
  },
};

export default function LearningNudge({
  context = "general",
  onDismiss,
}: LearningNudgeProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [tokensEarned, setTokensEarned] = useState(false);
  const navigate = useNavigate();

  const nudge = contextualNudges[context];

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleComplete = () => {
    setTokensEarned(true);
    setTimeout(() => {
      setShowContent(false);
      navigate("/learning");
    }, 2000);
  };

  const handleGoToLearning = () => {
    navigate("/learning");
  };

  if (!isVisible) return null;

  return (
    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="p-2 rounded-lg mr-3"
              style={{ backgroundColor: nudge.color + "20" }}
            >
              <nudge.icon className="h-6 w-6" style={{ color: nudge.color }} />
            </div>
            <div>
              <CardTitle className="text-lg">{nudge.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {nudge.description}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Coins className="h-3 w-3 text-yellow-500" />
              {nudge.tokens} tokens
            </Badge>
            <Badge variant="outline">5 min read</Badge>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <Zap className="h-3 w-3 mr-1" />
              Quick Win
            </Badge>
          </div>
          <div className="flex gap-2">
            <Dialog open={showContent} onOpenChange={setShowContent}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Quick Learn
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <nudge.icon
                      className="mr-2 h-6 w-6"
                      style={{ color: nudge.color }}
                    />
                    {nudge.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">{nudge.content}</div>
                  </div>

                  {tokensEarned ? (
                    <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <Star className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                        Congratulations! 🎉
                      </h3>
                      <p className="text-green-700 dark:text-green-300 mb-4">
                        You've earned {nudge.tokens} tokens!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Redirecting to Learning Hub...
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setShowContent(false)}
                      >
                        Maybe Later
                      </Button>
                      <Button
                        onClick={handleComplete}
                        className="flex items-center gap-2"
                      >
                        <Gift className="h-4 w-4" />
                        Claim {nudge.tokens} Tokens
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button size="sm" onClick={handleGoToLearning}>
              <BookOpen className="h-4 w-4 mr-1" />
              Learning Hub
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
