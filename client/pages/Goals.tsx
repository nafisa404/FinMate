import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar,
  Plus,
  Target,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  DollarSign,
  PiggyBank,
  Home,
  Car,
  Plane,
  GraduationCap,
  Heart,
  Briefcase,
  Gift,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Trophy,
  RefreshCw,
  Calendar as CalendarIcon,
  Calculator,
  Shield,
  BarChart3,
  TrendingRight,
  Lightbulb,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Goal categories with ML insights
const goalCategories = [
  { id: "emergency", name: "Emergency Fund", icon: Shield, color: "#ef4444" },
  { id: "vacation", name: "Vacation", icon: Plane, color: "#3b82f6" },
  { id: "house", name: "House Down Payment", icon: Home, color: "#10b981" },
  { id: "car", name: "Car Purchase", icon: Car, color: "#f97316" },
  { id: "education", name: "Education", icon: GraduationCap, color: "#8b5cf6" },
  { id: "retirement", name: "Retirement", icon: PiggyBank, color: "#06b6d4" },
  { id: "wedding", name: "Wedding", icon: Heart, color: "#ec4899" },
  { id: "business", name: "Business", icon: Briefcase, color: "#f59e0b" },
  { id: "other", name: "Other", icon: Gift, color: "#6b7280" },
];

// Mock financial goals data with ML insights
const mockGoals = [
  {
    id: "1",
    name: "Emergency Fund",
    category: "emergency",
    targetAmount: 50000,
    currentAmount: 15000,
    targetDate: "2024-12-31",
    monthlyContribution: 2000,
    priority: "high",
    description: "6-month emergency fund for financial security",
    mlPrediction: {
      completionDate: "2025-02-15",
      recommendedContribution: 2200,
      achievabilityScore: 85,
      riskLevel: "low",
    },
    milestones: [
      { amount: 10000, reached: true, date: "2024-01-15" },
      { amount: 25000, reached: false, date: null },
      { amount: 40000, reached: false, date: null },
      { amount: 50000, reached: false, date: null },
    ],
    autoContribute: true,
    isActive: true,
  },
  {
    id: "2",
    name: "European Vacation",
    category: "vacation",
    targetAmount: 8000,
    currentAmount: 3200,
    targetDate: "2024-07-15",
    monthlyContribution: 800,
    priority: "medium",
    description: "Dream trip to Europe for 2 weeks",
    mlPrediction: {
      completionDate: "2024-08-01",
      recommendedContribution: 950,
      achievabilityScore: 92,
      riskLevel: "low",
    },
    milestones: [
      { amount: 2000, reached: true, date: "2024-01-01" },
      { amount: 4000, reached: false, date: null },
      { amount: 6000, reached: false, date: null },
      { amount: 8000, reached: false, date: null },
    ],
    autoContribute: true,
    isActive: true,
  },
  {
    id: "3",
    name: "New Laptop",
    category: "other",
    targetAmount: 1500,
    currentAmount: 800,
    targetDate: "2024-03-31",
    monthlyContribution: 350,
    priority: "low",
    description: "MacBook Pro for freelance work",
    mlPrediction: {
      completionDate: "2024-03-15",
      recommendedContribution: 300,
      achievabilityScore: 95,
      riskLevel: "very_low",
    },
    milestones: [
      { amount: 500, reached: true, date: "2024-01-01" },
      { amount: 1000, reached: false, date: null },
      { amount: 1500, reached: false, date: null },
    ],
    autoContribute: false,
    isActive: true,
  },
  {
    id: "4",
    name: "House Down Payment",
    category: "house",
    targetAmount: 100000,
    currentAmount: 25000,
    targetDate: "2026-12-31",
    monthlyContribution: 2500,
    priority: "high",
    description: "20% down payment for dream home",
    mlPrediction: {
      completionDate: "2026-10-15",
      recommendedContribution: 2300,
      achievabilityScore: 78,
      riskLevel: "medium",
    },
    milestones: [
      { amount: 20000, reached: true, date: "2023-12-01" },
      { amount: 40000, reached: false, date: null },
      { amount: 60000, reached: false, date: null },
      { amount: 80000, reached: false, date: null },
      { amount: 100000, reached: false, date: null },
    ],
    autoContribute: true,
    isActive: true,
  },
];

// Goal progress data for charts
const progressData = [
  { month: "Jan", emergency: 12000, vacation: 2400, laptop: 500, house: 22000 },
  { month: "Feb", emergency: 14000, vacation: 2800, laptop: 650, house: 24500 },
  { month: "Mar", emergency: 15000, vacation: 3200, laptop: 800, house: 25000 },
];

// Goal insights data
const goalInsights = [
  {
    type: "success",
    goalName: "Emergency Fund",
    message: "On track to complete 2 months ahead of schedule",
    recommendation:
      "Consider increasing contribution to reach 6-month target faster",
    impact: "high",
  },
  {
    type: "warning",
    goalName: "European Vacation",
    message: "May miss target date by 2 weeks with current contribution",
    recommendation: "Increase monthly contribution by ₹150 to stay on track",
    impact: "medium",
  },
  {
    type: "info",
    goalName: "New Laptop",
    message: "Excellent progress! Will complete ahead of schedule",
    recommendation: "Consider redirecting excess to emergency fund",
    impact: "low",
  },
  {
    type: "alert",
    goalName: "House Down Payment",
    message: "Large goal requires consistent discipline over 30 months",
    recommendation: "Set up automatic transfers to ensure steady progress",
    impact: "high",
  },
];

export default function Goals() {
  const [goals, setGoals] = useState(mockGoals);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    category: "",
    targetAmount: "",
    targetDate: "",
    monthlyContribution: "",
    description: "",
    priority: "medium",
  });

  const totalGoalsValue = goals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0,
  );
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalMonthlyContributions = goals.reduce(
    (sum, goal) => sum + goal.monthlyContribution,
    0,
  );

  const handleAddGoal = () => {
    const goal = {
      id: Date.now().toString(),
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      monthlyContribution: parseFloat(newGoal.monthlyContribution),
      currentAmount: 0,
      mlPrediction: {
        completionDate: "2024-12-31",
        recommendedContribution: parseFloat(newGoal.monthlyContribution),
        achievabilityScore: 85,
        riskLevel: "medium",
      },
      milestones: [],
      autoContribute: false,
      isActive: true,
    };
    setGoals([...goals, goal]);
    setNewGoal({
      name: "",
      category: "",
      targetAmount: "",
      targetDate: "",
      monthlyContribution: "",
      description: "",
      priority: "medium",
    });
    setShowAddDialog(false);
  };

  const handleOptimizeGoals = () => {
    setIsOptimizing(true);
    // Simulate ML optimization
    setTimeout(() => {
      const optimizedGoals = goals.map((goal) => ({
        ...goal,
        monthlyContribution: goal.mlPrediction.recommendedContribution,
      }));
      setGoals(optimizedGoals);
      setIsOptimizing(false);
    }, 2500);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTimeToCompletion = (current, target, monthlyContribution) => {
    if (monthlyContribution <= 0) return "∞";
    const remaining = target - current;
    const months = Math.ceil(remaining / monthlyContribution);
    return months < 12
      ? `${months} months`
      : `${Math.round(months / 12)} years`;
  };

  const getCategoryIcon = (categoryId) => {
    const category = goalCategories.find((cat) => cat.id === categoryId);
    return category ? category.icon : Gift;
  };

  const getCategoryColor = (categoryId) => {
    const category = goalCategories.find((cat) => cat.id === categoryId);
    return category ? category.color : "#6b7280";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Lightbulb className="h-4 w-4 text-primary" />;
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case "very_low":
        return "default";
      case "low":
        return "secondary";
      case "medium":
        return "default";
      case "high":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered goal tracking with smart progress optimization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex">
            <Brain className="mr-1 h-3 w-3" />5 ML Models Active
          </Badge>
          <Button
            onClick={handleOptimizeGoals}
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
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Financial Goal</DialogTitle>
                <DialogDescription>
                  Set up a new savings goal with AI-powered recommendations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Goal Name</label>
                    <Input
                      placeholder="e.g., Emergency Fund"
                      value={newGoal.name}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={newGoal.category}
                      onValueChange={(value) =>
                        setNewGoal({ ...newGoal, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {goalCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center">
                              <cat.icon className="mr-2 h-4 w-4" />
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Amount</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newGoal.targetAmount}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, targetAmount: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Date</label>
                    <Input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, targetDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Monthly Contribution
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newGoal.monthlyContribution}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          monthlyContribution: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={newGoal.priority}
                      onValueChange={(value) =>
                        setNewGoal({ ...newGoal, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe your goal..."
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
                    }
                  />
                </div>
                <Button
                  onClick={handleAddGoal}
                  className="w-full"
                  disabled={!newGoal.name || !newGoal.targetAmount}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <div className="text-xs text-muted-foreground">Active goals</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ₹{totalSaved.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {((totalSaved / totalGoalsValue) * 100).toFixed(1)}% of all goals
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalMonthlyContributions.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Per month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Emergency Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">85%</div>
            <div className="text-xs text-muted-foreground">
              ₹15K of ₹50K target
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">My Goals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Fund</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const IconComponent = getCategoryIcon(goal.category);
              const progressPercentage = getProgressPercentage(
                goal.currentAmount,
                goal.targetAmount,
              );
              const timeToCompletion = getTimeToCompletion(
                goal.currentAmount,
                goal.targetAmount,
                goal.monthlyContribution,
              );

              return (
                <Card key={goal.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: `${getCategoryColor(goal.category)}20`,
                          }}
                        >
                          <IconComponent
                            className="h-5 w-5"
                            style={{ color: getCategoryColor(goal.category) }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{goal.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={getPriorityColor(goal.priority)}
                              className="text-xs"
                            >
                              {goal.priority} priority
                            </Badge>
                            <Badge
                              variant={getRiskBadgeColor(
                                goal.mlPrediction.riskLevel,
                              )}
                              className="text-xs"
                            >
                              {goal.mlPrediction.riskLevel} risk
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          ₹{goal.currentAmount.toLocaleString()} / ₹
                          {goal.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className="h-3"
                        style={{
                          ["--progress-background" as any]: getCategoryColor(
                            goal.category,
                          ),
                        }}
                      />
                      <div className="flex justify-between text-xs">
                        <span className="text-success font-medium">
                          {progressPercentage.toFixed(1)}% complete
                        </span>
                        <span className="text-muted-foreground">
                          ₹
                          {(
                            goal.targetAmount - goal.currentAmount
                          ).toLocaleString()}{" "}
                          remaining
                        </span>
                      </div>
                    </div>

                    {/* ML Insights */}
                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          AI Prediction
                        </span>
                        <Badge variant="outline" className="text-xs">
                          <Brain className="mr-1 h-2 w-2" />
                          {goal.mlPrediction.achievabilityScore}% achievable
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Estimated completion
                        </span>
                        <span className="font-medium">
                          {new Date(
                            goal.mlPrediction.completionDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Recommended contribution
                        </span>
                        <Badge
                          variant={
                            goal.mlPrediction.recommendedContribution >
                            goal.monthlyContribution
                              ? "destructive"
                              : "default"
                          }
                          className="text-xs"
                        >
                          ₹{goal.mlPrediction.recommendedContribution}/month
                        </Badge>
                      </div>
                    </div>

                    {/* Goal Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Monthly contribution
                        </span>
                        <span className="font-medium">
                          ₹{goal.monthlyContribution}/month
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Target date
                        </span>
                        <span className="font-medium">
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Time to completion
                        </span>
                        <span className="font-medium">{timeToCompletion}</span>
                      </div>
                    </div>

                    {/* Auto Contribute Toggle */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Auto-contribute</span>
                      </div>
                      <Switch
                        checked={goal.autoContribute}
                        onCheckedChange={() => {}}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Goal Progress Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
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
                      dataKey="emergency"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Emergency Fund"
                    />
                    <Line
                      type="monotone"
                      dataKey="vacation"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Vacation"
                    />
                    <Line
                      type="monotone"
                      dataKey="laptop"
                      stroke="#6b7280"
                      strokeWidth={2}
                      name="Laptop"
                    />
                    <Line
                      type="monotone"
                      dataKey="house"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="House"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Goal Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Contribution Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={goals.map((goal) => ({
                        name: goal.name,
                        value: goal.monthlyContribution,
                        color: getCategoryColor(goal.category),
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {goals.map((goal, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getCategoryColor(goal.category)}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {goals.map((goal, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: getCategoryColor(goal.category),
                        }}
                      />
                      <span className="text-muted-foreground truncate">
                        {goal.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal Completion Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Goal Completion Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals
                  .sort(
                    (a, b) =>
                      new Date(a.mlPrediction.completionDate) -
                      new Date(b.mlPrediction.completionDate),
                  )
                  .map((goal, index) => {
                    const IconComponent = getCategoryIcon(goal.category);
                    const progressPercentage = getProgressPercentage(
                      goal.currentAmount,
                      goal.targetAmount,
                    );

                    return (
                      <div
                        key={goal.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${getCategoryColor(goal.category)}20`,
                            }}
                          >
                            <IconComponent
                              className="h-4 w-4"
                              style={{
                                color: getCategoryColor(goal.category),
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-medium">{goal.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ₹{goal.currentAmount.toLocaleString()} / ₹
                              {goal.targetAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {new Date(
                                goal.mlPrediction.completionDate,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {progressPercentage.toFixed(1)}% complete
                            </div>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className="w-20 h-2"
                          />
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
                        Goal Achievement Predictor
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Analyzing completion probability
                      </div>
                    </div>
                    <Badge variant="secondary">91.2%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Contribution Optimizer
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Optimizing monthly allocations
                      </div>
                    </div>
                    <Badge variant="secondary">88.7%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Emergency Fund Calculator
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Calculating readiness index
                      </div>
                    </div>
                    <Badge variant="secondary">94.5%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Risk Assessor</div>
                      <div className="text-xs text-muted-foreground">
                        Evaluating goal feasibility
                      </div>
                    </div>
                    <Badge variant="secondary">86.3%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Milestone Tracker
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Monitoring progress patterns
                      </div>
                    </div>
                    <Badge variant="secondary">92.8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Smart Goal Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {goalInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border-l-4 ${
                        insight.type === "success"
                          ? "border-green-500"
                          : insight.type === "warning"
                            ? "border-yellow-500"
                            : insight.type === "alert"
                              ? "border-red-500"
                              : "border-blue-500"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">
                            {insight.goalName}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {insight.message}
                          </div>
                          <div className="text-xs font-medium text-primary">
                            💡 {insight.recommendation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal Optimization Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                AI Goal Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Emergency Fund</h3>
                    <Badge variant="outline">Increase +₹200</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Boost monthly contribution to reach target 2 months earlier
                    and improve financial security.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Apply Suggestion
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">European Vacation</h3>
                    <Badge variant="outline">Increase +₹150</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Small increase ensures you hit target date for summer
                    vacation without stress.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Apply Suggestion
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">New Laptop</h3>
                    <Badge variant="outline">Reduce -₹50</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    You're ahead of schedule. Redirect excess to higher priority
                    goals.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Apply Suggestion
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Auto-Contribute</h3>
                    <Badge variant="outline">Enable</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Set up automatic transfers to maintain consistent progress
                    toward all goals.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Setup Auto-Transfer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          {/* Emergency Fund Analyzer */}
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 dark:from-red-950/20 dark:to-orange-950/20 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700 dark:text-red-300">
                <Shield className="mr-2 h-6 w-6" />
                Emergency Fund Readiness Analysis
                <Badge className="ml-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  85% Ready
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">₹15,000</div>
                  <div className="text-sm text-muted-foreground">
                    Current Emergency Fund
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    ₹50,000
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recommended Target (6 months)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">3.6</div>
                  <div className="text-sm text-muted-foreground">
                    Months Covered
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Emergency Fund Progress</span>
                    <span>₹15,000 / ₹50,000</span>
                  </div>
                  <Progress value={30} className="h-3" />
                </div>

                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    🧠 AI Readiness Assessment
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Job Security Risk</span>
                      <Badge variant="secondary">Low</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Health Risk Factors</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Expense Volatility</span>
                      <Badge variant="secondary">Low</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Overall Readiness</span>
                      <Badge variant="default">85%</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                  <h3 className="font-semibold mb-2">📊 Monthly Expenses</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Essential Expenses</span>
                      <span className="font-medium">₹4,200</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Non-Essential</span>
                      <span className="font-medium">₹1,800</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Emergency Target</span>
                      <span className="font-medium">₹8,333/month</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                  <h3 className="font-semibold mb-2">💡 AI Recommendations</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      • Increase monthly contribution by ₹200 to reach target 2
                      months earlier
                    </li>
                    <li>
                      • Consider high-yield savings account for emergency funds
                    </li>
                    <li>
                      • Review health insurance coverage to reduce potential
                      medical expenses
                    </li>
                    <li>
                      • Set up automatic transfers on payday to maintain
                      consistency
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crisis Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Crisis Scenario Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">Job Loss</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Coverage</span>
                      <span className="font-medium text-warning">
                        3.6 months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Need 2.4 more months of coverage for full protection.
                    </p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">
                    Medical Emergency
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Coverage</span>
                      <span className="font-medium text-success">Good</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level</span>
                      <Badge variant="secondary">Low</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Health insurance + emergency fund provides good coverage.
                    </p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">Major Repair</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Coverage</span>
                      <span className="font-medium text-success">
                        Excellent
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level</span>
                      <Badge variant="secondary">Very Low</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current fund covers most major repair scenarios.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
