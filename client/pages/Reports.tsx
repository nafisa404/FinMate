import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  Download,
  Filter,
  Eye,
  Zap,
  Target,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Mock data for financial reports
const monthlyTrends = [
  { month: "Jan", income: 75000, expenses: 52000, netWorth: 380000 },
  { month: "Feb", income: 78000, expenses: 48000, netWorth: 410000 },
  { month: "Mar", income: 82000, expenses: 55000, netWorth: 437000 },
  { month: "Apr", income: 77000, expenses: 49000, netWorth: 465000 },
  { month: "May", income: 85000, expenses: 58000, netWorth: 492000 },
  { month: "Jun", income: 88000, expenses: 62000, netWorth: 518000 },
];

const expenseCategories = [
  { category: "Housing", amount: 25000, percentage: 40.3, color: "#3b82f6" },
  { category: "Food", amount: 12000, percentage: 19.4, color: "#10b981" },
  {
    category: "Transportation",
    amount: 8000,
    percentage: 12.9,
    color: "#f59e0b",
  },
  { category: "Utilities", amount: 6000, percentage: 9.7, color: "#ef4444" },
  {
    category: "Entertainment",
    amount: 5000,
    percentage: 8.1,
    color: "#8b5cf6",
  },
  { category: "Shopping", amount: 4000, percentage: 6.5, color: "#f97316" },
  { category: "Others", amount: 2000, percentage: 3.2, color: "#6b7280" },
];

const personalityData = [
  { trait: "Conservative", A: 85, fullMark: 100 },
  { trait: "Risk Tolerance", A: 62, fullMark: 100 },
  { trait: "Savings Rate", A: 78, fullMark: 100 },
  { trait: "Investment Focus", A: 71, fullMark: 100 },
  { trait: "Budget Discipline", A: 89, fullMark: 100 },
  { trait: "Tech Adoption", A: 94, fullMark: 100 },
];

const taxOptimization = [
  { category: "80C Deductions", used: 125000, limit: 150000, savings: 31250 },
  {
    category: "80D Health Insurance",
    used: 45000,
    limit: 50000,
    savings: 11250,
  },
  { category: "80G Donations", used: 15000, limit: 50000, savings: 3750 },
  {
    category: "24B Home Loan Interest",
    used: 180000,
    limit: 200000,
    savings: 45000,
  },
];

const netWorthBreakdown = [
  { asset: "Real Estate", value: 2500000, percentage: 62.5 },
  { asset: "Stocks & Mutual Funds", value: 850000, percentage: 21.3 },
  { asset: "Fixed Deposits", value: 320000, percentage: 8.0 },
  { asset: "Emergency Fund", value: 180000, percentage: 4.5 },
  { asset: "Cash & Others", value: 150000, percentage: 3.7 },
];

const spendingPatterns = [
  { pattern: "Weekend Spending", increase: 35, trend: "up" },
  { pattern: "Online Shopping", increase: 22, trend: "up" },
  { pattern: "Dining Out", decrease: 15, trend: "down" },
  { pattern: "Subscription Services", increase: 12, trend: "up" },
  { pattern: "Fuel Expenses", decrease: 8, trend: "down" },
];

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive AI-powered financial insights and analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            <Brain className="mr-1 h-3 w-3" />
            12 ML Models Active
          </Badge>
          <Select defaultValue="6months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(4000000)}</div>
            <div className="text-xs text-success">+12.8% this quarter</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(26000)}</div>
            <div className="text-xs text-success">29.5% of income</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Investment Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18.4%</div>
            <div className="text-xs text-muted-foreground">Annualized</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Financial Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7/10</div>
            <div className="text-xs text-success">Excellent</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Reports Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieIcon className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="personality" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Personality
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Tax Report
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Income vs Expenses Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrends}>
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
                      dataKey="income"
                      stackId="1"
                      stroke="hsl(var(--success))"
                      fill="hsl(var(--success))"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stackId="2"
                      stroke="hsl(var(--destructive))"
                      fill="hsl(var(--destructive))"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expense Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieIcon className="mr-2 h-5 w-5" />
                  Expense Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {expenseCategories.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.percentage}%</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Net Worth Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Net Worth Composition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {netWorthBreakdown.map((asset, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{asset.asset}</span>
                      <div className="text-right">
                        <div className="font-bold">
                          {formatCurrency(asset.value)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {asset.percentage}%
                        </div>
                      </div>
                    </div>
                    <Progress value={asset.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Net Worth Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Net Worth Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      axisLine={true}
                      tickLine={true}
                      tick={true}
                    />
                    <YAxis axisLine={true} tickLine={true} tick={true} />
                    <Line
                      type="monotone"
                      dataKey="netWorth"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Spending Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Pattern Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spendingPatterns.map((pattern, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center">
                        {pattern.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-destructive mr-2" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-success mr-2" />
                        )}
                        <span className="font-medium">{pattern.pattern}</span>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${
                            pattern.trend === "up"
                              ? "text-destructive"
                              : "text-success"
                          }`}
                        >
                          {pattern.trend === "up" ? "+" : "-"}
                          {pattern.trend === "up"
                            ? pattern.increase
                            : pattern.decrease}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">
                          vs last month
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Savings Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">29.5%</div>
                <Progress value={29.5} className="mt-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  Above average (25%)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Emergency Fund
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6.2 months</div>
                <Progress value={82} className="mt-2" />
                <div className="text-xs text-success mt-1">Well prepared</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Debt-to-Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.3%</div>
                <Progress value={18.3} className="mt-2" />
                <div className="text-xs text-success mt-1">Healthy ratio</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Cash Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    axisLine={true}
                    tickLine={true}
                    tick={true}
                  />
                  <YAxis axisLine={true} tickLine={true} tick={true} />
                  <Bar
                    dataKey="income"
                    fill="hsl(var(--success))"
                    name="Income"
                  />
                  <Bar
                    dataKey="expenses"
                    fill="hsl(var(--destructive))"
                    name="Expenses"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Financial Personality Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={personalityData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="trait" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personality Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Conservative Investor
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You prefer stable, low-risk investments with predictable
                    returns. Your high savings discipline is commendable.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Tech-Savvy Budgeter
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    High adoption of financial technology tools helps you
                    maintain excellent budget discipline.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    Moderate Risk Tolerance
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Consider gradually increasing equity allocation to optimize
                    long-term growth potential.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Optimization Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {taxOptimization.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.category}</h4>
                        <p className="text-sm text-muted-foreground">
                          Used: {formatCurrency(item.used)} / Limit:{" "}
                          {formatCurrency(item.limit)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-success">
                          {formatCurrency(item.savings)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Tax saved
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={(item.used / item.limit) * 100}
                      className="h-2"
                    />
                    {item.used < item.limit && (
                      <div className="text-sm text-orange-600">
                        Opportunity: Save additional{" "}
                        {formatCurrency((item.limit - item.used) * 0.25)} in
                        taxes
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Total Tax Savings: {formatCurrency(91250)}
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Potential additional savings: {formatCurrency(18750)} by
                  maximizing remaining limits
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                  <Brain className="mr-2 h-5 w-5" />
                  AI Financial Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium text-sm">
                        Excellent Savings Rate
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your 29.5% savings rate is well above the recommended 20%.
                      ML models predict strong wealth accumulation.
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Target className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-sm">
                        Investment Optimization
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Consider increasing equity allocation by 10% to optimize
                      long-term returns based on your risk profile.
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="font-medium text-sm">
                        Spending Alert
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Weekend spending increased 35%. ML models suggest setting
                      automated limits for discretionary purchases.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                  <Zap className="mr-2 h-5 w-5" />
                  ML-Powered Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="font-medium text-sm mb-1 text-green-800 dark:text-green-200">
                      🎯 Tax Optimization
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Invest remaining ₹75,000 in ELSS to save ₹18,750 in taxes
                    </p>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Optimize Now
                    </Button>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="font-medium text-sm mb-1 text-green-800 dark:text-green-200">
                      📈 Rebalancing Alert
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Portfolio drift detected. Rebalance to maintain target
                      allocation
                    </p>
                    <Link to="/investments">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs"
                      >
                        View Portfolio
                      </Button>
                    </Link>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="font-medium text-sm mb-1 text-green-800 dark:text-green-200">
                      💰 Emergency Fund
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Consider moving ₹50,000 from savings to high-yield
                      instruments
                    </p>
                    <Link to="/goals">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs"
                      >
                        Adjust Goals
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ML Models Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Active ML Models Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      Expense Categorization
                    </span>
                    <Badge variant="secondary">94.2%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Random Forest Classifier
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      Anomaly Detection
                    </span>
                    <Badge variant="secondary">89.7%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Isolation Forest
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      Budget Prediction
                    </span>
                    <Badge variant="secondary">91.8%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    LSTM Neural Network
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Investment Risk</span>
                    <Badge variant="secondary">87.3%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    XGBoost Regressor
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      Personality Profiling
                    </span>
                    <Badge variant="secondary">92.5%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">K-Means + NLP</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      Cash Flow Forecast
                    </span>
                    <Badge variant="secondary">88.9%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ARIMA + Deep Learning
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
