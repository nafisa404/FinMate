import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import LearningNudge from "@/components/LearningNudge";
import {
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  TrendingUp,
  Target,
  PiggyBank,
  Wallet,
  Plus,
  Eye,
  EyeOff,
  Brain,
  Zap,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for charts
const balanceData = [
  { month: "Jan", balance: 45000 },
  { month: "Feb", balance: 48000 },
  { month: "Mar", balance: 52000 },
  { month: "Apr", balance: 49000 },
  { month: "May", balance: 55000 },
  { month: "Jun", balance: 58000 },
];

const expenseData = [
  { category: "Food", amount: 8500, color: "#ef4444" },
  { category: "Transport", amount: 3200, color: "#f97316" },
  { category: "Shopping", amount: 5800, color: "#eab308" },
  { category: "Bills", amount: 12000, color: "#3b82f6" },
  { category: "Entertainment", amount: 2800, color: "#8b5cf6" },
  { category: "Other", amount: 1700, color: "#06b6d4" },
];

const recentTransactions = [
  {
    id: 1,
    description: "Grocery Store",
    amount: -85.5,
    category: "Food",
    date: "Today",
  },
  {
    id: 2,
    description: "Salary Credit",
    amount: 5500.0,
    category: "Income",
    date: "Yesterday",
  },
  {
    id: 3,
    description: "Netflix Subscription",
    amount: -12.99,
    category: "Entertainment",
    date: "2 days ago",
  },
  {
    id: 4,
    description: "Uber Ride",
    amount: -15.75,
    category: "Transport",
    date: "3 days ago",
  },
  {
    id: 5,
    description: "Coffee Shop",
    amount: -4.8,
    category: "Food",
    date: "3 days ago",
  },
];

const goals = [
  { name: "Emergency Fund", current: 15000, target: 50000, color: "#10b981" },
  { name: "Vacation", current: 3200, target: 8000, color: "#3b82f6" },
  { name: "New Laptop", current: 800, target: 1500, color: "#f59e0b" },
];

export default function Index() {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Good morning, John! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your financial overview for today
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setBalanceVisible(!balanceVisible)}
            >
              {balanceVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceVisible ? "₹58,420.00" : "••••••"}
            </div>
            <div className="flex items-center text-xs text-success">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+₹5,500.00</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              Same as last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Expenses
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              -₹3,421.50
            </div>
            <div className="flex items-center text-xs text-destructive">
              <TrendingDown className="mr-1 h-3 w-3" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38%</div>
            <div className="flex items-center text-xs text-success">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Nudge */}
      <LearningNudge context="dashboard" />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Balance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  axisLine={true}
                  tickLine={true}
                  tick={true}
                />
                <YAxis axisLine={true} tickLine={true} tick={true} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="amount"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {expenseData.map((item, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Financial Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-muted-foreground">
                    ₹{goal.current.toLocaleString()} / ₹
                    {goal.target.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={(goal.current / goal.target) * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {Math.round((goal.current / goal.target) * 100)}% complete
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.date}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {transaction.category}
                    </Badge>
                    <div
                      className={`font-medium text-sm ${
                        transaction.amount > 0
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}₹
                      {Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Insights */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
              <Brain className="mr-2 h-5 w-5" />
              ML Financial Insights
              <Badge variant="secondary" className="ml-2">
                AI Powered
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="font-medium text-sm mb-1 text-blue-800 dark:text-blue-200">
                🧠 Spending Pattern Analysis (K-Means Clustering)
              </div>
              <div className="text-sm text-muted-foreground">
                Your profile: <strong>Smart Saver</strong>. You save 38% of
                income and prefer quality over quantity purchases.
              </div>
            </div>
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="font-medium text-sm mb-1 text-blue-800 dark:text-blue-200">
                📊 Expense Prediction (Random Forest)
              </div>
              <div className="text-sm text-muted-foreground">
                Next month's predicted expenses: ₹3,280 (±₹150). Food costs may
                increase by 15%.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700 dark:text-green-300">
              <Zap className="mr-2 h-5 w-5" />
              AI Recommendations
              <Badge variant="secondary" className="ml-2">
                Hugging Face AI
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-green-100 dark:border-green-800">
              <div className="font-medium text-sm mb-1 text-green-800 dark:text-green-200">
                💡 Budget Optimization
              </div>
              <div className="text-sm text-muted-foreground">
                Reduce dining out by ₹200/month to reach vacation goal 2 months
                earlier.
              </div>
            </div>
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-green-100 dark:border-green-800">
              <div className="font-medium text-sm mb-1 text-green-800 dark:text-green-200">
                🎯 Investment Suggestion (Linear Regression)
              </div>
              <div className="text-sm text-muted-foreground">
                Based on risk profile: 40% Index Funds, 30% Bonds, 20% Growth
                Stocks, 10% Cash.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
