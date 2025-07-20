import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  Target,
  Zap,
  PieChart as PieIcon,
  BarChart3,
  Wallet,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
} from "recharts";

// Mock data for investment analytics
const portfolioData = [
  { month: "Jan", value: 450000, predicted: 452000, returns: 2.5 },
  { month: "Feb", value: 480000, predicted: 478000, returns: 6.7 },
  { month: "Mar", value: 520000, predicted: 515000, returns: 8.3 },
  { month: "Apr", value: 490000, predicted: 498000, returns: -5.8 },
  { month: "May", value: 550000, predicted: 542000, returns: 12.2 },
  { month: "Jun", value: 580000, predicted: 578000, returns: 5.5 },
];

const allocationData = [
  { name: "Stocks", value: 40, color: "#3b82f6", amount: 232000 },
  { name: "Bonds", value: 30, color: "#10b981", amount: 174000 },
  { name: "ETFs", value: 20, color: "#f59e0b", amount: 116000 },
  { name: "Cash", value: 10, color: "#6b7280", amount: 58000 },
];

const holdingsData = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    shares: 50,
    price: 2450,
    value: 122500,
    change: 2.3,
    sector: "Energy",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    shares: 25,
    price: 3680,
    value: 92000,
    change: -1.2,
    sector: "Technology",
  },
  {
    symbol: "INFY",
    name: "Infosys Limited",
    shares: 40,
    price: 1520,
    value: 60800,
    change: 0.8,
    sector: "Technology",
  },
  {
    symbol: "HDFC",
    name: "HDFC Bank",
    shares: 35,
    price: 1650,
    value: 57750,
    change: 1.5,
    sector: "Banking",
  },
  {
    symbol: "ICICI",
    name: "ICICI Bank",
    shares: 45,
    price: 980,
    value: 44100,
    change: -0.5,
    sector: "Banking",
  },
];

const sectorData = [
  { sector: "Technology", allocation: 35, performance: 8.2, risk: "Medium" },
  { sector: "Banking", allocation: 25, performance: 5.8, risk: "Low" },
  { sector: "Energy", allocation: 20, performance: 12.1, risk: "High" },
  { sector: "Healthcare", allocation: 10, performance: 6.5, risk: "Medium" },
  { sector: "Consumer", allocation: 10, performance: 4.2, risk: "Low" },
];

const sipData = [
  { month: "Jan", amount: 5000, units: 125.5, nav: 39.84 },
  { month: "Feb", amount: 5000, units: 118.2, nav: 42.31 },
  { month: "Mar", amount: 5000, units: 112.8, nav: 44.35 },
  { month: "Apr", amount: 5000, units: 127.4, nav: 39.24 },
  { month: "May", amount: 5000, units: 108.9, nav: 45.91 },
  { month: "Jun", amount: 5000, units: 115.3, nav: 43.37 },
];

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export default function Investments() {
  const navigate = useNavigate();

  const handleAutoRebalance = () => {
    // Simulate auto-rebalancing process
    alert(
      "Auto-rebalancing initiated! Your portfolio will be optimized based on ML recommendations.",
    );
  };

  const handleStartSIP = () => {
    // Navigate to goals page where SIP can be set up
    navigate("/goals");
  };

  const handleSetGoal = () => {
    // Navigate to goals page
    navigate("/goals");
  };

  const handleRiskAssessment = () => {
    // Navigate to profile page for risk assessment
    navigate("/profile");
  };

  const handleAIInvestmentChat = () => {
    // Navigate to chat with investment context
    navigate("/chat", {
      state: {
        initialMessage:
          "I need help with my investment portfolio. Can you analyze my current holdings and suggest optimizations?",
        context: "investment_portfolio",
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Investment Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            ML-powered portfolio optimization and recommendations
          </p>
        </div>
        <Badge variant="outline">
          <Brain className="mr-1 h-3 w-3" />8 ML Models Active
        </Badge>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(580000)}</div>
            <div className="text-xs text-success">+12.5% YTD</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              AI Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.4/10</div>
            <div className="text-xs text-muted-foreground">
              Well diversified
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Moderate</div>
            <div className="text-xs text-muted-foreground">β = 1.15</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Expected Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.4%</div>
            <div className="text-xs text-muted-foreground">Annual</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieIcon className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="holdings" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Holdings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="sip" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            SIP
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Performance vs ML Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolioData}>
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
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="5 5"
                      name="ML Prediction"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Current Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {allocationData.map((item, index) => (
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
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.value}%</div>
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
        </TabsContent>

        <TabsContent value="holdings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdingsData.map((stock, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {stock.name}
                      </div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {stock.sector}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {stock.shares} shares @ {formatCurrency(stock.price)}
                      </div>
                      <div className="font-medium">
                        {formatCurrency(stock.value)}
                      </div>
                      <div
                        className={`text-sm ${
                          stock.change >= 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sector Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="sector"
                      axisLine={true}
                      tickLine={true}
                      tick={true}
                    />
                    <YAxis axisLine={true} tickLine={true} tick={true} />
                    <Bar dataKey="performance" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Returns Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={portfolioData}>
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
                      dataKey="returns"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sector Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Sector Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorData.map((sector, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{sector.sector}</span>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            sector.risk === "High"
                              ? "destructive"
                              : sector.risk === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {sector.risk} Risk
                        </Badge>
                        <span className="text-sm text-success">
                          +{sector.performance}%
                        </span>
                      </div>
                    </div>
                    <Progress value={sector.allocation} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {sector.allocation}% allocation
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sip" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Invested
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(30000)}
                </div>
                <div className="text-xs text-muted-foreground">6 months</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(32850)}
                </div>
                <div className="text-xs text-success">+9.5% returns</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Units Accumulated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">708.1</div>
                <div className="text-xs text-muted-foreground">
                  Avg NAV: ₹42.38
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SIP Investment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sipData}>
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
                    dataKey="nav"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="NAV"
                  />
                  <Line
                    type="monotone"
                    dataKey="units"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    name="Units Purchased"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SIP History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sipData.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{entry.month} 2024</div>
                      <div className="text-sm text-muted-foreground">
                        NAV: ₹{entry.nav}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(entry.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.units.toFixed(1)} units
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* ML Models */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                  <Brain className="mr-2 h-5 w-5" />
                  Active ML Models
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        Linear Regression + MPT
                      </span>
                      <Badge variant="secondary">91.3%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Portfolio optimization using Modern Portfolio Theory
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">LSTM Network</span>
                      <Badge variant="secondary">87.9%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Price prediction and trend analysis
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Random Forest</span>
                      <Badge variant="secondary">89.2%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Risk assessment and stock selection
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        Sentiment Analysis
                      </span>
                      <Badge variant="secondary">84.7%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Market sentiment from news and social media
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        Reinforcement Learning
                      </span>
                      <Badge variant="secondary">88.6%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dynamic rebalancing and trade execution
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        XGBoost Classifier
                      </span>
                      <Badge variant="secondary">92.1%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Market regime detection and sector rotation
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">ARIMA-GARCH</span>
                      <Badge variant="secondary">85.3%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Volatility modeling and risk management
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        CNN Feature Extractor
                      </span>
                      <Badge variant="secondary">86.7%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Technical chart pattern recognition
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                  <Zap className="mr-2 h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="font-medium text-sm mb-1 text-green-800 dark:text-green-200">
                      🎯 Rebalancing Alert
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Stocks are 5% overweight. Consider rebalancing.
                    </p>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Auto-Rebalance
                    </Button>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="font-medium text-sm mb-1 text-green-800 dark:text-green-200">
                      📈 Growth Opportunity
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Tech sector showing bullish signals. +₹12,500 allocation
                      suggested.
                    </p>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      View Analysis
                    </Button>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="font-medium text-sm mb-1 text-green-800 dark:text-green-200">
                      🛡️ Risk Management
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Portfolio volatility at 18%. Consider adding bonds.
                    </p>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Optimize Risk
                    </Button>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="font-medium text-sm mb-1 text-green-800 dark:text-green-200">
                      💰 SIP Optimization
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Increase monthly SIP by ₹3,750 to reach goals faster.
                    </p>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Setup SIP
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleAutoRebalance}
            >
              <CheckCircle className="h-4 w-4" />
              Auto-Rebalance Portfolio
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleStartSIP}
            >
              <TrendingUp className="h-4 w-4" />
              Start New SIP
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleSetGoal}
            >
              <Target className="h-4 w-4" />
              Set Investment Goal
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleRiskAssessment}
            >
              <AlertTriangle className="h-4 w-4" />
              Risk Assessment
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={handleAIInvestmentChat}
            >
              <Brain className="h-4 w-4" />
              Ask AI About Investments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
