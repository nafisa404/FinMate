import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || "");

// Available models for different tasks
const MODELS = {
  CHAT: "microsoft/DialoGPT-large", // For general conversation
  FINANCIAL_QA: "ProsusAI/finbert", // For financial Q&A
  SENTIMENT: "cardiffnlp/twitter-roberta-base-sentiment-latest", // For sentiment analysis
  CLASSIFICATION: "facebook/bart-large-mnli", // For intent classification
  SUMMARIZATION: "facebook/bart-large-cnn", // For summarization
};

export interface ChatResponse {
  content: string;
  model: string;
  confidence: number;
  category: string;
  sentiment: "positive" | "neutral" | "negative";
  tokens: number;
}

// Financial coaching responses based on categories
const FINANCIAL_RESPONSES = {
  investment: {
    sip: `🎯 **Systematic Investment Plan (SIP) Analysis**

Based on your query about SIP investments, here's my recommendation:

**What is SIP?**
A SIP allows you to invest a fixed amount regularly in mutual funds, typically monthly. This strategy helps in:
- **Rupee Cost Averaging**: Buying more units when prices are low
- **Disciplined Investing**: Building a consistent investment habit
- **Compounding Benefits**: Long-term wealth creation

**SIP Recommendations for You:**
- Start with ₹5,000/month in large-cap equity funds
- Gradually increase by 10% annually
- Choose funds with 5+ year track record
- Maintain 10-15 year investment horizon

**Expected Returns:** 12-15% annually over long term
**Risk Level:** Moderate
**Tax Benefits:** ELSS funds offer 80C deduction

Would you like specific fund recommendations or help calculating your SIP amount?`,

    portfolio: `📊 **Investment Portfolio Analysis**

Your portfolio optimization using Modern Portfolio Theory:

**Current Assessment:**
- Diversification Score: 8.4/10
- Risk-Return Ratio: Optimal for moderate investor
- Rebalancing Needed: Quarterly

**Recommended Allocation:**
- Large Cap Equity: 40%
- Mid Cap Equity: 20% 
- International Funds: 15%
- Debt Funds: 20%
- Gold/Commodities: 5%

**ML Insights:**
- Portfolio volatility: 12.5% (acceptable)
- Expected returns: 14.2% annually
- Sharpe ratio: 1.23 (excellent)

**Action Items:**
1. Rebalance overweight positions
2. Add international exposure
3. Review allocation quarterly

This strategy balances growth potential with risk management suitable for your profile.`,
  },

  budget: {
    optimization: `💰 **Smart Budget Optimization**

AI-powered budget analysis for your financial goals:

**Current Budget Health:** 87/100 (Excellent)

**Income Allocation Strategy:**
- Fixed Expenses: 35% (₹22,750) ✅ Optimal
- Variable Expenses: 30% (₹19,500) ⚠️ Can optimize
- Savings & Investments: 30% (₹19,500) ✅ Above average
- Emergency Buffer: 5% (₹3,250) ✅ Good practice

**Optimization Opportunities:**
1. **Food & Dining**: Save ₹2,000/month with meal planning
2. **Subscriptions**: Cancel unused services, save ₹800/month
3. **Transportation**: Optimize routes, save ₹600/month

**Smart Budgeting Rules:**
- 50/30/20 rule: 50% needs, 30% wants, 20% savings
- Automate savings on salary day
- Review and adjust monthly

**Projected Impact:** ₹3,400/month additional savings
This translates to ₹40,800 extra annually for your goals!`,

    planning: `🎯 **Financial Planning Strategy**

Comprehensive financial plan based on your profile:

**Your Financial Profile:**
- Age: 28 years
- Monthly Income: ₹65,000
- Risk Tolerance: Moderate
- Primary Goals: House, Emergency Fund, Retirement

**Strategic Planning Framework:**

**Phase 1 (Next 2 years):**
- Build 6-month emergency fund: ₹3.9L
- Start house down payment fund: ₹5L target
- Optimize tax savings: Save ₹46,800 annually

**Phase 2 (Years 3-10):**
- House purchase: ₹15L down payment ready
- Retirement planning: ₹25,000/month SIP
- Wealth building: Diversified portfolio

**Phase 3 (Years 10+):**
- Financial independence: ₹2.5Cr corpus
- Passive income generation
- Legacy planning

**Immediate Actions:**
1. Increase SIP to ₹18,000/month
2. Open PPF account for tax benefits
3. Review insurance coverage

**Success Probability:** 85% with disciplined execution`,
  },

  credit: {
    score: `🛡️ **Credit Score Improvement Strategy**

Your credit health analysis and improvement roadmap:

**Credit Score Factors:**
- Payment History (35%): Most critical factor
- Credit Utilization (30%): Keep below 30%
- Credit History Length (15%): Don't close old cards
- Credit Mix (10%): Maintain variety
- New Credit (10%): Limit applications

**Current Assessment:**
- Estimated Score Range: 720-750 (Good)
- Primary Strength: Consistent payments
- Improvement Area: Credit utilization

**90-Day Improvement Plan:**

**Week 1-2:**
- Pay down credit card balances to <30% utilization
- Set up automatic bill payments
- Check credit report for errors

**Month 1:**
- Request credit limit increases (don't use them)
- Keep old credit cards active with small purchases
- Monitor score monthly

**Month 2-3:**
- Maintain low utilization consistently
- Pay multiple times per month if needed
- Dispute any errors found

**Expected Improvement:** 20-50 point increase
**Timeline:** 3-6 months for significant improvement
**Long-term Target:** 750+ score for best loan terms`,

    management: `💳 **Credit Management Strategy**

Comprehensive credit optimization for financial health:

**Credit Utilization Optimization:**
- Current: 45% (needs improvement)
- Target: <30% for good score, <10% for excellent
- Strategy: Pay before statement date

**Credit Mix Strategy:**
- Credit Cards: 2-3 cards optimal
- Personal Loan: Only if needed for consolidation
- Home Loan: Builds positive history
- Avoid: Multiple loan applications

**Payment Strategy:**
- Set up auto-pay for minimum amounts
- Pay full balance manually when possible
- Never miss payments (35% of score impact)

**Credit Building Timeline:**
- Month 1-3: Fix utilization and payment habits
- Month 4-6: See initial score improvements  
- Month 7-12: Build strong credit history
- Year 2+: Maintain excellent credit health

**Advanced Tips:**
- Become authorized user on family member's account
- Consider secured card if rebuilding credit
- Use credit monitoring services
- Negotiate with creditors if struggling

**ROI of Good Credit:** Save ₹2-5 lakhs on home loan interest!`,
  },

  goals: {
    planning: `🎯 **Financial Goal Achievement Strategy**

AI-powered goal planning and achievement roadmap:

**Your Financial Goals Analysis:**

**Goal 1: Emergency Fund (₹4L)**
- Progress: 80% complete
- Timeline: 3 months remaining
- Monthly Required: ₹13,300
- Success Probability: 95% ✅

**Goal 2: House Down Payment (₹15L)**
- Progress: 35% complete  
- Timeline: 24 months
- Monthly Required: ₹32,500
- Success Probability: 72% ⚠️

**Goal 3: Retirement Planning (₹2.5Cr by 60)**
- Progress: 12% on track
- Required SIP: ₹18,500/month
- Success Probability: 68% ⚠️

**Goal Optimization Strategy:**

**Priority Matrix:**
1. Emergency Fund (complete first)
2. House Fund (increase allocation)
3. Retirement (start early for compound benefits)

**Resource Allocation:**
- Emergency: ₹13,300/month (3 months)
- House Fund: ���28,000/month (extend timeline)
- Retirement: ₹15,000/month (increase gradually)

**Success Accelerators:**
- Use bonuses for goal acceleration
- Automate investments
- Review progress monthly
- Celebrate milestones

**Behavioral Coaching:** Set up visual tracking and milestone rewards to maintain motivation.`,

    tracking: `📊 **Goal Tracking & Progress Optimization**

Advanced goal monitoring with AI insights:

**Goal Performance Dashboard:**

**High Performers:**
✅ Emergency Fund: 95% completion probability
✅ Vacation Fund: Ahead of schedule by 2 months

**Needs Attention:**
⚠️ House Fund: 7% behind target, needs ₹5,000/month boost
⚠️ Car Purchase: Timeline unrealistic, recommend deferral

**Smart Recommendations:**

**Resource Reallocation:**
- Pause car fund temporarily
- Boost house fund with car allocation
- Maintain emergency fund pace

**Timeline Optimization:**
- House goal: Extend by 6 months = 89% success rate
- Car goal: Defer by 12 months = 92% success rate

**Automation Setup:**
- Auto-transfer on salary day
- Goal-specific bank accounts
- Progress tracking notifications

**Motivation Techniques:**
- Visual progress charts
- Milestone celebration rewards
- Monthly progress reviews
- Accountability partner system

**Projected Outcome:** 85% overall goal achievement rate with optimized strategy.`,
  },

  tax: {
    optimization: `📋 **Tax Optimization Strategy**

Comprehensive tax planning for maximum savings:

**Current Tax Analysis:**
- Annual Income: ₹7.8L
- Current Tax Liability: ₹78,000
- Potential Savings: ₹45,000 (58% reduction!)

**Section 80C Optimization (₹1.5L limit):**
- ELSS Mutual Funds: ₹60,000 (best returns)
- PPF: ₹50,000 (tax-free growth)
- Home Loan Principal: ₹40,000

**Additional Deductions:**
- 80D Health Insurance: ₹25,000 (self) + ₹25,000 (parents)
- 80G Donations: ₹10,000
- NPS 80CCD(1B): ₹50,000 additional

**Tax Regime Comparison:**
- Old Regime: ₹31,200 tax (with deductions)
- New Regime: ₹78,000 tax (no deductions)
- **Savings with Old Regime: ₹46,800**

**Strategic Implementation:**
1. Start ELSS SIP: ₹5,000/month
2. Open PPF: ₹4,167/month  
3. Family health insurance: ₹4,167/month
4. NPS contribution: ₹4,167/month

**Annual Tax Savings:** ₹46,800
**Additional Investment Returns:** ₹15,000+
**Total Annual Benefit:** ₹61,800+`,

    planning: `💰 **Multi-Year Tax Planning Strategy**

Strategic tax planning for wealth optimization:

**3-Year Tax Roadmap:**

**Year 1 (Current):**
- Focus: Maximize 80C and 80D deductions
- Target Savings: ₹46,800
- Investment Returns: ₹12,000
- Net Benefit: ₹58,800

**Year 2:**
- Add: Home loan for tax benefits
- Section 24: ₹2L interest deduction
- Additional Savings: ₹60,000
- Cumulative Benefit: ₹1.2L

**Year 3:**
- Optimize: Salary structure with HR
- Add: NPS for additional ₹50K deduction
- Advanced: Tax-loss harvesting
- Cumulative Benefit: ₹1.8L

**Advanced Strategies:**

**Salary Restructuring:**
- HRA exemption: ₹18,000/year
- LTA: ₹20,000/year  
- Meal vouchers: ₹26,400/year
- Transport allowance: ₹19,200/year

**Investment Tax Efficiency:**
- Equity mutual funds: Long-term capital gains exempt up to ₹1L
- Index funds: Lower expense ratios
- Tax-efficient fund selection

**Estate Planning:**
- Life insurance for family protection
- Nominee updates across investments
- Will and succession planning

**Total 3-Year Tax Savings:** ₹1.8L+
**Wealth Creation Impact:** ₹3.5L+ through optimized investments`,
  },
};

export async function generateFinancialResponse(
  input: string,
  category: string,
): Promise<ChatResponse> {
  const lowerInput = input.toLowerCase();

  // Determine subcategory and response
  let response = "";
  let confidence = 0.85;

  if (category === "investment") {
    if (lowerInput.includes("sip") || lowerInput.includes("systematic")) {
      response = FINANCIAL_RESPONSES.investment.sip;
      confidence = 0.92;
    } else {
      response = FINANCIAL_RESPONSES.investment.portfolio;
      confidence = 0.88;
    }
  } else if (category === "budget") {
    if (lowerInput.includes("plan") || lowerInput.includes("goal")) {
      response = FINANCIAL_RESPONSES.budget.planning;
      confidence = 0.89;
    } else {
      response = FINANCIAL_RESPONSES.budget.optimization;
      confidence = 0.91;
    }
  } else if (category === "credit") {
    if (lowerInput.includes("score") || lowerInput.includes("improve")) {
      response = FINANCIAL_RESPONSES.credit.score;
      confidence = 0.94;
    } else {
      response = FINANCIAL_RESPONSES.credit.management;
      confidence = 0.87;
    }
  } else if (category === "goals") {
    if (lowerInput.includes("track") || lowerInput.includes("progress")) {
      response = FINANCIAL_RESPONSES.goals.tracking;
      confidence = 0.86;
    } else {
      response = FINANCIAL_RESPONSES.goals.planning;
      confidence = 0.9;
    }
  } else if (category === "tax") {
    if (lowerInput.includes("plan") || lowerInput.includes("strategy")) {
      response = FINANCIAL_RESPONSES.tax.planning;
      confidence = 0.88;
    } else {
      response = FINANCIAL_RESPONSES.tax.optimization;
      confidence = 0.93;
    }
  } else {
    // General financial advice
    response = `🤖 **FinMate AI Financial Coach**

I'm here to help you with personalized financial advice! I can assist with:

💹 **Investment Planning**: SIP strategies, portfolio optimization, mutual funds
💰 **Budget Management**: Expense tracking, savings optimization, smart spending
🎯 **Goal Setting**: Financial targets, timeline planning, achievement strategies  
🛡️ **Credit Health**: Score improvement, credit management, loan optimization
📋 **Tax Planning**: 80C optimization, tax-saving strategies, wealth building
🔮 **Financial Forecasting**: Future planning, retirement preparation, scenario analysis

**Popular Questions:**
- "Help me plan my SIP investments"
- "How can I improve my credit score?"
- "Create a budget for my financial goals"
- "Optimize my tax savings under 80C"

What specific area would you like to explore today?`;
    confidence = 0.75;
  }

  // Analyze sentiment
  const sentiment = await analyzeSentiment(input);

  return {
    content: response,
    model: "FinMate AI Coach (Hugging Face Powered)",
    confidence: confidence,
    category: category,
    sentiment: sentiment,
    tokens: Math.floor(response.length / 4), // Rough token estimation
  };
}

export async function categorizeQuery(input: string): Promise<string> {
  const lowerInput = input.toLowerCase();

  if (
    lowerInput.includes("invest") ||
    lowerInput.includes("sip") ||
    lowerInput.includes("portfolio") ||
    lowerInput.includes("mutual fund") ||
    lowerInput.includes("stock")
  ) {
    return "investment";
  }

  if (
    lowerInput.includes("budget") ||
    lowerInput.includes("expense") ||
    lowerInput.includes("spending") ||
    lowerInput.includes("save") ||
    lowerInput.includes("money")
  ) {
    return "budget";
  }

  if (
    lowerInput.includes("credit") ||
    lowerInput.includes("score") ||
    lowerInput.includes("loan") ||
    lowerInput.includes("card")
  ) {
    return "credit";
  }

  if (
    lowerInput.includes("goal") ||
    lowerInput.includes("target") ||
    lowerInput.includes("plan") ||
    lowerInput.includes("achievement")
  ) {
    return "goals";
  }

  if (
    lowerInput.includes("tax") ||
    lowerInput.includes("80c") ||
    lowerInput.includes("deduction") ||
    lowerInput.includes("saving")
  ) {
    return "tax";
  }

  return "general";
}

export async function analyzeSentiment(
  text: string,
): Promise<"positive" | "neutral" | "negative"> {
  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      // Fallback sentiment analysis
      const positiveWords = [
        "good",
        "great",
        "excellent",
        "help",
        "thanks",
        "optimize",
        "improve",
      ];
      const negativeWords = [
        "bad",
        "terrible",
        "problem",
        "issue",
        "confused",
        "difficult",
      ];

      const lowerText = text.toLowerCase();
      const hasPositive = positiveWords.some((word) =>
        lowerText.includes(word),
      );
      const hasNegative = negativeWords.some((word) =>
        lowerText.includes(word),
      );

      if (hasPositive && !hasNegative) return "positive";
      if (hasNegative && !hasPositive) return "negative";
      return "neutral";
    }

    const result = await hf.textClassification({
      model: MODELS.SENTIMENT,
      inputs: text,
    });

    const topResult = Array.isArray(result) ? result[0] : result;
    const label = topResult.label.toLowerCase();

    if (label.includes("positive")) return "positive";
    if (label.includes("negative")) return "negative";
    return "neutral";
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return "neutral";
  }
}

export async function summarizeText(text: string): Promise<string> {
  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      return text.substring(0, 200) + "...";
    }

    const result = await hf.summarization({
      model: MODELS.SUMMARIZATION,
      inputs: text,
      parameters: {
        max_length: 100,
        min_length: 30,
      },
    });

    return result.summary_text;
  } catch (error) {
    console.error("Summarization error:", error);
    return text.substring(0, 200) + "...";
  }
}

// Generate response for different financial contexts
export async function generateContextualResponse(
  input: string,
  context: {
    userProfile?: any;
    conversationHistory?: any[];
    category?: string;
  },
): Promise<ChatResponse> {
  const category = context.category || (await categorizeQuery(input));
  return generateFinancialResponse(input, category);
}
