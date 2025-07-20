import { useState } from "react";
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
  CreditCard,
  Plus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Settings,
  Bell,
  Gift,
  Shield,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Copy,
  RefreshCw,
  BarChart3,
  PieChart,
  Target,
  Sparkles,
  IndianRupee,
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Mock card data with ML insights
const mockCards = [
  {
    id: "1",
    name: "HDFC Bank Credit Card",
    type: "credit",
    network: "Visa",
    last4: "4567",
    creditLimit: 200000,
    currentBalance: 45000,
    availableCredit: 155000,
    dueDate: "2024-02-15",
    minimumDue: 4500,
    rewardPoints: 12500,
    status: "active",
    color: "#ef4444",
    isVirtual: false,
    expiryDate: "12/27",
    mlInsights: {
      utilizationTrend: "increasing",
      spendingPattern: "consistent",
      paymentBehavior: "excellent",
      riskScore: 15,
      recommendedAction: "consider_payment",
    },
  },
  {
    id: "2",
    name: "SBI Debit Card",
    type: "debit",
    network: "Mastercard",
    last4: "8901",
    balance: 85000,
    monthlySpend: 25000,
    status: "active",
    color: "#10b981",
    isVirtual: false,
    expiryDate: "08/26",
    mlInsights: {
      spendingPattern: "variable",
      categoryTrend: "food_increasing",
      riskScore: 5,
      recommendedAction: "set_limit",
    },
  },
  {
    id: "3",
    name: "ICICI Amazon Pay Card",
    type: "credit",
    network: "Visa",
    last4: "2345",
    creditLimit: 150000,
    currentBalance: 120000,
    availableCredit: 30000,
    dueDate: "2024-02-20",
    minimumDue: 12000,
    rewardPoints: 8750,
    status: "active",
    color: "#f97316",
    isVirtual: false,
    expiryDate: "03/28",
    mlInsights: {
      utilizationTrend: "high",
      spendingPattern: "irregular",
      paymentBehavior: "good",
      riskScore: 75,
      recommendedAction: "urgent_payment",
    },
  },
  {
    id: "4",
    name: "Axis Bank Virtual Card",
    type: "credit",
    network: "Mastercard",
    last4: "7890",
    creditLimit: 50000,
    currentBalance: 5000,
    availableCredit: 45000,
    dueDate: "2024-02-10",
    minimumDue: 500,
    rewardPoints: 1250,
    status: "active",
    color: "#8b5cf6",
    isVirtual: true,
    expiryDate: "06/25",
    mlInsights: {
      utilizationTrend: "low",
      spendingPattern: "light",
      paymentBehavior: "excellent",
      riskScore: 10,
      recommendedAction: "increase_usage",
    },
  },
];

// Spending analytics data
const spendingData = [
  { month: "Jan", total: 35000, credit: 25000, debit: 10000 },
  { month: "Feb", total: 42000, credit: 30000, debit: 12000 },
  { month: "Mar", total: 38000, credit: 28000, debit: 10000 },
  { month: "Apr", total: 45000, credit: 32000, debit: 13000 },
  { month: "May", total: 41000, credit: 29000, debit: 12000 },
  { month: "Jun", total: 47000, credit: 34000, debit: 13000 },
];

const categorySpending = [
  { category: "Food & Dining", amount: 18000, color: "#ef4444" },
  { category: "Shopping", amount: 15000, color: "#3b82f6" },
  { category: "Transportation", amount: 8000, color: "#f97316" },
  { category: "Entertainment", amount: 6000, color: "#8b5cf6" },
  { category: "Bills", amount: 12000, color: "#10b981" },
  { category: "Other", amount: 3000, color: "#6b7280" },
];

const cardInsights = [
  {
    type: "warning",
    cardName: "ICICI Amazon Pay Card",
    message: "High utilization at 80% - payment due in 5 days",
    recommendation: "Pay at least ₹25,000 to improve credit utilization",
    severity: "high",
  },
  {
    type: "success",
    cardName: "HDFC Bank Credit Card",
    message: "Excellent payment history maintained",
    recommendation: "Consider requesting credit limit increase",
    severity: "low",
  },
  {
    type: "info",
    cardName: "Axis Bank Virtual Card",
    message: "Low utilization - opportunity to earn more rewards",
    recommendation: "Use for online purchases to maximize cashback",
    severity: "medium",
  },
  {
    type: "alert",
    cardName: "SBI Debit Card",
    message: "Unusual spending pattern detected",
    recommendation: "Review recent transactions for security",
    severity: "medium",
  },
];

export default function Cards() {
  const [cards, setCards] = useState(mockCards);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardNumbers, setShowCardNumbers] = useState({});
  const [newCard, setNewCard] = useState({
    name: "",
    type: "credit",
    network: "visa",
    creditLimit: "",
    last4: "",
  });

  const totalCreditLimit = cards
    .filter((card) => card.type === "credit")
    .reduce((sum, card) => sum + (card.creditLimit || 0), 0);

  const totalUtilization = cards
    .filter((card) => card.type === "credit")
    .reduce((sum, card) => sum + (card.currentBalance || 0), 0);

  const totalRewardPoints = cards
    .filter((card) => card.rewardPoints)
    .reduce((sum, card) => sum + card.rewardPoints, 0);

  const utilizationPercentage = (totalUtilization / totalCreditLimit) * 100;

  const handleAddCard = () => {
    const card = {
      id: Date.now().toString(),
      ...newCard,
      creditLimit: parseFloat(newCard.creditLimit) || 0,
      currentBalance: 0,
      availableCredit: parseFloat(newCard.creditLimit) || 0,
      dueDate: "2024-03-15",
      minimumDue: 0,
      rewardPoints: 0,
      status: "active",
      color: "#3b82f6",
      isVirtual: false,
      expiryDate: "12/28",
      mlInsights: {
        utilizationTrend: "new",
        spendingPattern: "new",
        paymentBehavior: "new",
        riskScore: 0,
        recommendedAction: "activate",
      },
    };
    setCards([...cards, card]);
    setNewCard({
      name: "",
      type: "credit",
      network: "visa",
      creditLimit: "",
      last4: "",
    });
    setShowAddDialog(false);
  };

  const toggleCardVisibility = (cardId) => {
    setShowCardNumbers((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const getUtilizationColor = (utilization) => {
    if (utilization < 30) return "text-success";
    if (utilization < 70) return "text-warning";
    return "text-destructive";
  };

  const getNetworkIcon = (network) => {
    return <CreditCard className="h-5 w-5" />;
  };

  const getRiskBadgeColor = (riskScore) => {
    if (riskScore < 30) return "default";
    if (riskScore < 70) return "secondary";
    return "destructive";
  };

  const getInsightIcon = (type) => {
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

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Smart Card Manager</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered card management with fraud detection and spending
            insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex">
            <Brain className="mr-1 h-3 w-3" />6 ML Models Active
          </Badge>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Card</DialogTitle>
                <DialogDescription>
                  Add a new credit or debit card to your account.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Name</label>
                  <Input
                    placeholder="e.g., HDFC Bank Credit Card"
                    value={newCard.name}
                    onChange={(e) =>
                      setNewCard({ ...newCard, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card Type</label>
                    <Select
                      value={newCard.type}
                      onValueChange={(value) =>
                        setNewCard({ ...newCard, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="debit">Debit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Network</label>
                    <Select
                      value={newCard.network}
                      onValueChange={(value) =>
                        setNewCard({ ...newCard, network: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="rupay">RuPay</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last 4 Digits</label>
                    <Input
                      placeholder="1234"
                      maxLength={4}
                      value={newCard.last4}
                      onChange={(e) =>
                        setNewCard({ ...newCard, last4: e.target.value })
                      }
                    />
                  </div>
                  {newCard.type === "credit" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Credit Limit (₹)
                      </label>
                      <Input
                        type="number"
                        placeholder="100000"
                        value={newCard.creditLimit}
                        onChange={(e) =>
                          setNewCard({
                            ...newCard,
                            creditLimit: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleAddCard}
                  className="w-full"
                  disabled={!newCard.name || !newCard.last4}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards.length}</div>
            <div className="text-xs text-muted-foreground">
              {cards.filter((c) => c.type === "credit").length} credit,{" "}
              {cards.filter((c) => c.type === "debit").length} debit
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Credit Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getUtilizationColor(utilizationPercentage)}`}
            >
              {utilizationPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(totalUtilization)} of{" "}
              {formatCurrency(totalCreditLimit)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {totalRewardPoints.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              ≈ {formatCurrency(totalRewardPoints * 0.25)} value
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(47000)}</div>
            <div className="text-xs text-success">
              <TrendingUp className="inline mr-1 h-3 w-3" />
              +12% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="cards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cards">My Cards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cards.map((card) => {
              const utilization =
                card.type === "credit"
                  ? (card.currentBalance / card.creditLimit) * 100
                  : 0;

              return (
                <Card
                  key={card.id}
                  className="relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}08 100%)`,
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${card.color}20` }}
                        >
                          <CreditCard
                            className="h-5 w-5"
                            style={{ color: card.color }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{card.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                card.type === "credit" ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {card.type === "credit" ? "Credit" : "Debit"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {card.network}
                            </Badge>
                            {card.isVirtual && (
                              <Badge variant="secondary" className="text-xs">
                                Virtual
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleCardVisibility(card.id)}
                        >
                          {showCardNumbers[card.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Card Number */}
                    <div className="space-y-2">
                      <div className="text-lg font-mono tracking-wider">
                        **** **** ****{" "}
                        {showCardNumbers[card.id] ? card.last4 : "****"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Expires: {card.expiryDate}
                      </div>
                    </div>

                    {/* Credit Card Details */}
                    {card.type === "credit" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Current Balance
                            </span>
                            <span className="font-medium">
                              {formatCurrency(card.currentBalance)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Credit Limit
                            </span>
                            <span className="font-medium">
                              {formatCurrency(card.creditLimit)}
                            </span>
                          </div>
                          <Progress
                            value={utilization}
                            className="h-2"
                            style={{
                              ["--progress-background" as any]: card.color,
                            }}
                          />
                          <div className="flex justify-between text-xs">
                            <span
                              className={`font-medium ${getUtilizationColor(utilization)}`}
                            >
                              {utilization.toFixed(1)}% utilization
                            </span>
                            <span className="text-muted-foreground">
                              {formatCurrency(card.availableCredit)} available
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Due Date
                            </div>
                            <div className="font-medium text-sm">
                              {new Date(card.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Minimum Due
                            </div>
                            <div className="font-medium text-sm">
                              {formatCurrency(card.minimumDue)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Debit Card Details */}
                    {card.type === "debit" && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Available Balance
                          </span>
                          <span className="font-medium">
                            {formatCurrency(card.balance)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Monthly Spend
                          </span>
                          <span className="font-medium">
                            {formatCurrency(card.monthlySpend)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* ML Insights */}
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          AI Risk Score
                        </span>
                        <Badge
                          variant={getRiskBadgeColor(card.mlInsights.riskScore)}
                          className="text-xs"
                        >
                          <Brain className="mr-1 h-2 w-2" />
                          {card.mlInsights.riskScore}/100
                        </Badge>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">
                          Recommendation:
                        </span>
                        <span className="ml-1 font-medium">
                          {card.mlInsights.recommendedAction.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      {card.type === "credit" && (
                        <Button size="sm" className="flex-1">
                          Pay Bill
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={spendingData}>
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
                      dataKey="credit"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Credit Cards"
                    />
                    <Area
                      type="monotone"
                      dataKey="debit"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Debit Cards"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={categorySpending}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                    >
                      {categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categorySpending.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground truncate">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card Utilization Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Credit Card Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cards
                  .filter((card) => card.type === "credit")
                  .map((card) => {
                    const utilization =
                      (card.currentBalance / card.creditLimit) * 100;
                    return (
                      <div key={card.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{card.name}</span>
                          <span className="text-muted-foreground">
                            {formatCurrency(card.currentBalance)} /{" "}
                            {formatCurrency(card.creditLimit)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={utilization}
                            className="flex-1 h-2"
                          />
                          <span
                            className={`text-xs font-medium ${getUtilizationColor(utilization)}`}
                          >
                            {utilization.toFixed(0)}%
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
                      <div className="font-medium text-sm">Fraud Detection</div>
                      <div className="text-xs text-muted-foreground">
                        Real-time transaction monitoring
                      </div>
                    </div>
                    <Badge variant="secondary">97.3%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Spending Pattern Analysis
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Category and timing predictions
                      </div>
                    </div>
                    <Badge variant="secondary">94.8%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Credit Risk Assessment
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Payment behavior evaluation
                      </div>
                    </div>
                    <Badge variant="secondary">91.2%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Reward Optimization
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Maximizing cashback and points
                      </div>
                    </div>
                    <Badge variant="secondary">89.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Smart Card Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cardInsights.map((insight, index) => (
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
                            {insight.cardName}
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

          {/* Card Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                AI Card Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">
                      Payment Optimization
                    </h3>
                    <Badge variant="outline">High Priority</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Pay ₹25,000 on ICICI card to reduce utilization below 70%
                    and improve credit score.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Schedule Payment
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">
                      Reward Maximization
                    </h3>
                    <Badge variant="outline">Medium Priority</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Use HDFC card for fuel purchases to earn 5x reward points
                    this month.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">
                      Credit Limit Increase
                    </h3>
                    <Badge variant="outline">Low Priority</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Request limit increase on HDFC card based on excellent
                    payment history.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Request Increase
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Security Alert</h3>
                    <Badge variant="outline">Monitor</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Enable transaction alerts for real-time fraud detection on
                    all cards.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Enable Alerts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          {/* Reward Points Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reward Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {totalRewardPoints.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Cashback value: {formatCurrency(totalRewardPoints * 0.25)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Points This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,450</div>
                <div className="text-xs text-success">
                  <TrendingUp className="inline mr-1 h-3 w-3" />
                  +18% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">1,250</div>
                <div className="text-xs text-muted-foreground">
                  Expires in 30 days
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reward Cards */}
          <div className="space-y-4">
            {cards
              .filter((card) => card.rewardPoints > 0)
              .map((card) => (
                <Card key={card.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${card.color}20` }}
                        >
                          <CreditCard
                            className="h-4 w-4"
                            style={{ color: card.color }}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{card.name}</div>
                          <div className="text-sm text-muted-foreground">
                            **** {card.last4}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {card.rewardPoints.toLocaleString()} points
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ≈ {formatCurrency(card.rewardPoints * 0.25)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Redemption Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="mr-2 h-5 w-5" />
                Redemption Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <IndianRupee className="h-8 w-8 mx-auto mb-2 text-success" />
                  <h3 className="font-semibold mb-1">Cash Back</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Direct credit to account
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(totalRewardPoints * 0.25)}
                  </p>
                  <Button size="sm" className="w-full mt-2">
                    Redeem
                  </Button>
                </div>

                <div className="p-4 border rounded-lg text-center">
                  <Gift className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Gift Vouchers</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Amazon, Flipkart, etc.
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(totalRewardPoints * 0.3)}
                  </p>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    Browse
                  </Button>
                </div>

                <div className="p-4 border rounded-lg text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <h3 className="font-semibold mb-1">Travel Miles</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Convert to airline miles
                  </p>
                  <p className="text-lg font-bold">
                    {(totalRewardPoints * 0.8).toFixed(0)} miles
                  </p>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    Convert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
