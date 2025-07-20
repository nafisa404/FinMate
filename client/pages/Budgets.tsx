import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Plus,
  Settings,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  Target,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Sparkles,
  PiggyBank,
  CreditCard,
  Home,
  Car,
  Utensils,
  ShoppingBag,
  Gamepad2,
  Briefcase,
  Heart,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Budget categories with icons and ML insights
const budgetCategories = [
  {
    id: "food",
    name: "Food & Dining",
    icon: Utensils,
    color: "#ef4444",
    budget: 800,
    spent: 642,
    predicted: 750,
    mlOptimization: -50,
    trend: "stable",
  },
  {
    id: "transport",
    name: "Transportation",
    icon: Car,
    color: "#f97316",
    budget: 300,
    spent: 240,
    predicted: 280,
    mlOptimization: 0,
    trend: "increasing",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Gamepad2,
    color: "#8b5cf6",
    budget: 200,
    spent: 95,
    predicted: 150,
    mlOptimization: +25,
    trend: "decreasing",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: ShoppingBag,
    color: "#06b6d4",
    budget: 400,
    spent: 1250,
    predicted: 450,
    mlOptimization: -100,
    trend: "spike",
  },
  {
    id: "bills",
    name: "Bills & Utilities",
    icon: Home,
    color: "#3b82f6",
    budget: 450,
    spent: 385,
    predicted: 420,
    mlOptimization: 0,
    trend: "stable",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Heart,
    color: "#10b981",
    budget: 150,
    spent: 45,
    predicted: 100,
    mlOptimization: +20,
    trend: "stable",
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    color: "#f59e0b",
    budget: 100,
    spent: 0,
    predicted: 50,
    mlOptimization: 0,
    trend: "stable",
  },
  {
    id: "other",
    name: "Other",
    icon: MoreHorizontal,
    color: "#6b7280",
    budget: 200,
    spent: 134,
    predicted: 180,
    mlOptimization: +10,
    trend: "stable",
  },
];

// Monthly budget performance data
const monthlyPerformance = [
  { month: "Jan", budgeted: 2600, actual: 2450 },
  { month: "Feb", budgeted: 2600, actual: 2780 },
  { month: "Mar", budgeted: 2600, actual: 2390 },
  { month: "Apr", budgeted: 2600, actual: 2650 },
  { month: "May", budgeted: 2600, actual: 2830 },
  { month: "Jun", budgeted: 2600, actual: 2791 },
];

// Budget insights data
const budgetInsights = [
  {
    type: "warning",
    category: "Shopping",
    message: "312% over budget - unusual luxury purchase detected",
    action: "Review and adjust for next month",
    severity: "high",
  },
  {
    type: "success",
    category: "Entertainment",
    message: "52% under budget - great discipline this month!",
    action: "Consider reallocating surplus to savings",
    severity: "low",
  },
  {
    type: "info",
    category: "Food & Dining",
    message: "ML suggests reducing by ₹50 based on patterns",
    action: "Try meal planning to optimize costs",
    severity: "medium",
  },
  {
    type: "alert",
    category: "Transportation",
    message: "80% budget used with 10 days remaining",
    action: "Monitor spending closely",
    severity: "medium",
  },
];

export default function Budgets() {
  const [categories, setCategories] = useState(budgetCategories);
  const [totalBudget, setTotalBudget] = useState(2600);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [autoAdjustEnabled, setAutoAdjustEnabled] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
  });

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalPredicted = categories.reduce(
    (sum, cat) => sum + cat.predicted,
    0,
  );
  const budgetUtilization = (totalSpent / totalBudget) * 100;

  const handleOptimizeBudget = () => {
    setIsOptimizing(true);
    // Simulate ML optimization
    setTimeout(() => {
      const optimizedCategories = categories.map((cat) => ({
        ...cat,
        budget: Math.max(50, cat.budget + cat.mlOptimization),
      }));
      setCategories(optimizedCategories);
      setIsOptimizing(false);
    }, 2500);
  };

  const handleUpdateBudget = (categoryId: string, newAmount: number) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, budget: newAmount } : cat,
      ),
    );
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return { status: "over", color: "destructive" };
    if (percentage > 80) return { status: "warning", color: "warning" };
    return { status: "good", color: "success" };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-3 w-3 text-destructive" />;
      case "decreasing":
        return <TrendingDown className="h-3 w-3 text-success" />;
      case "spike":
        return <AlertTriangle className="h-3 w-3 text-warning" />;
      default:
        return <Target className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "alert":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Brain className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Smart Budget Planner</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered budget optimization with behavior-based adjustments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex">
            <Brain className="mr-1 h-3 w-3" />4 ML Models Active
          </Badge>
          <Button
            onClick={handleOptimizeBudget}
            disabled={isOptimizing}
            variant="outline"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Optimize
              </>
            )}
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Budget Category</DialogTitle>
                <DialogDescription>
                  Create a new budget category with spending limits.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={newBudget.category}
                    onValueChange={(value) =>
                      setNewBudget({ ...newBudget, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="subscriptions">
                        Subscriptions
                      </SelectItem>
                      <SelectItem value="gifts">Gifts</SelectItem>
                      <SelectItem value="hobbies">Hobbies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Budget</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newBudget.amount}
                    onChange={(e) =>
                      setNewBudget({ ...newBudget, amount: e.target.value })
                    }
                  />
                </div>
                <Button className="w-full">Add Category</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalBudget.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">This month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ₹{totalSpent.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {budgetUtilization.toFixed(1)}% of budget
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ₹{(totalBudget - totalSpent).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {(100 - budgetUtilization).toFixed(1)}% available
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ML Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              ₹{totalPredicted.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalPredicted > totalBudget ? "Over" : "Under"} by ₹
              {Math.abs(totalPredicted - totalBudget)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Budget Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const percentage = (category.spent / category.budget) * 100;
              const status = getBudgetStatus(category.spent, category.budget);

              return (
                <Card key={category.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <IconComponent
                            className="h-4 w-4"
                            style={{ color: category.color }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-sm">
                            {category.name}
                          </CardTitle>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(category.trend)}
                            <span className="text-xs text-muted-foreground">
                              {category.trend}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Budget Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Spent</span>
                        <span className="font-medium">
                          ₹{category.spent} / ₹{category.budget}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className="h-2"
                        style={{
                          ["--progress-background" as any]: category.color,
                        }}
                      />
                      <div className="flex justify-between text-xs">
                        <span
                          className={`${
                            status.status === "over"
                              ? "text-destructive"
                              : status.status === "warning"
                                ? "text-warning"
                                : "text-success"
                          }`}
                        >
                          {percentage.toFixed(1)}% used
                        </span>
                        <span className="text-muted-foreground">
                          ₹{category.budget - category.spent} left
                        </span>
                      </div>
                    </div>

                    {/* ML Insights */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          ML Prediction
                        </span>
                        <Badge variant="outline" className="text-xs">
                          <Brain className="mr-1 h-2 w-2" />₹
                          {category.predicted}
                        </Badge>
                      </div>
                      {category.mlOptimization !== 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            AI Suggestion
                          </span>
                          <Badge
                            variant={
                              category.mlOptimization > 0
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {category.mlOptimization > 0 ? "+" : ""}₹
                            {category.mlOptimization}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    {status.status === "over" && (
                      <Badge
                        variant="destructive"
                        className="w-full justify-center"
                      >
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Over Budget
                      </Badge>
                    )}
                    {status.status === "warning" && (
                      <Badge
                        variant="secondary"
                        className="w-full justify-center bg-warning/10 text-warning"
                      >
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Near Limit
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget vs Actual */}
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      axisLine={true}
                      tickLine={true}
                      tick={true}
                    />
                    <YAxis axisLine={true} tickLine={true} tick={true} />
                    <Bar
                      dataKey="budgeted"
                      fill="hsl(var(--muted))"
                      name="Budgeted"
                    />
                    <Bar
                      dataKey="actual"
                      fill="hsl(var(--primary))"
                      name="Actual"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Category Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="budget"
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categories.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Utilization */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => {
                  const percentage = (category.spent / category.budget) * 100;
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-muted-foreground">
                          ₹{category.spent} / ₹{category.budget}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={Math.min(percentage, 100)}
                          className="flex-1 h-2"
                        />
                        <span
                          className={`text-xs font-medium ${
                            percentage > 100
                              ? "text-destructive"
                              : percentage > 80
                                ? "text-warning"
                                : "text-success"
                          }`}
                        >
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ML Model Status */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                  <Brain className="mr-2 h-5 w-5" />
                  Active ML Models
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Behavior-Based Adjuster
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Analyzing spending patterns
                      </div>
                    </div>
                    <Badge variant="secondary">92.1%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Expense Prediction
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Forecasting monthly spending
                      </div>
                    </div>
                    <Badge variant="secondary">88.4%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Budget Optimization
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Smart allocation recommendations
                      </div>
                    </div>
                    <Badge variant="secondary">89.7%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Seasonal Analysis
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Holiday and event adjustments
                      </div>
                    </div>
                    <Badge variant="secondary">85.3%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {budgetInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border-l-4 ${
                        insight.type === "warning"
                          ? "border-yellow-500"
                          : insight.type === "success"
                            ? "border-green-500"
                            : insight.type === "alert"
                              ? "border-red-500"
                              : "border-blue-500"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">
                            {insight.category}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {insight.message}
                          </div>
                          <div className="text-xs font-medium text-primary">
                            {insight.action}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optimization Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                AI Budget Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">Food & Dining</h3>
                      <Badge variant="outline">-₹50</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Based on your meal patterns, you can reduce dining out by
                      ₹50/month through meal planning.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Apply Suggestion
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">Entertainment</h3>
                      <Badge variant="outline">+₹25</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      You're consistently under budget. Consider increasing for
                      better life balance.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Apply Suggestion
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">Shopping</h3>
                      <Badge variant="outline">-₹100</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Recent luxury purchase spike. Reduce to normal spending
                      levels.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Apply Suggestion
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">Healthcare</h3>
                      <Badge variant="outline">+₹20</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Increase for preventive care and wellness activities.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Auto-Adjustment Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Auto-Adjustment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Behavior-Based Adjustment</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically adjust budgets based on spending patterns
                    </div>
                  </div>
                  <Switch
                    checked={autoAdjustEnabled}
                    onCheckedChange={setAutoAdjustEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Seasonal Adjustments</div>
                    <div className="text-sm text-muted-foreground">
                      Account for holidays and seasonal spending changes
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Overspending Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified when approaching budget limits
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Alert Threshold</label>
                  <Select defaultValue="80">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="70">70% of budget</SelectItem>
                      <SelectItem value="80">80% of budget</SelectItem>
                      <SelectItem value="90">90% of budget</SelectItem>
                      <SelectItem value="100">100% of budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Budget Period */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget Period</label>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Total Monthly Budget
                  </label>
                  <Input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reset Day</label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st of month</SelectItem>
                      <SelectItem value="15">15th of month</SelectItem>
                      <SelectItem value="last">Last day of month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
