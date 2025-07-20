import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Brain,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Receipt,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Sparkles,
  Shield,
  Target,
  Clock,
  X,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock transaction data with ML insights
const mockTransactions = [
  {
    id: "1",
    date: "2024-01-15",
    description: "Starbucks Coffee #1234",
    amount: -4.85,
    category: "Food & Dining",
    account: "Chase Checking",
    status: "completed",
    mlCategory: "Coffee",
    confidence: 98.5,
    isRecurring: false,
    isAnomaly: false,
    receipt: null,
  },
  {
    id: "2",
    date: "2024-01-15",
    description: "Salary Deposit - Tech Corp",
    amount: 5500.0,
    category: "Income",
    account: "Chase Checking",
    status: "completed",
    mlCategory: "Salary",
    confidence: 99.9,
    isRecurring: true,
    isAnomaly: false,
    receipt: null,
  },
  {
    id: "3",
    date: "2024-01-14",
    description: "Netflix Subscription",
    amount: -15.99,
    category: "Entertainment",
    account: "Chase Checking",
    status: "completed",
    mlCategory: "Streaming",
    confidence: 99.2,
    isRecurring: true,
    isAnomaly: false,
    receipt: null,
  },
  {
    id: "4",
    date: "2024-01-14",
    description: "Luxury Store XYZ",
    amount: -1250.0,
    category: "Shopping",
    account: "Chase Checking",
    status: "completed",
    mlCategory: "Luxury",
    confidence: 89.3,
    isRecurring: false,
    isAnomaly: true,
    receipt: null,
  },
  {
    id: "5",
    date: "2024-01-13",
    description: "Uber Ride",
    amount: -18.75,
    category: "Transportation",
    account: "Chase Checking",
    status: "completed",
    mlCategory: "Rideshare",
    confidence: 95.7,
    isRecurring: false,
    isAnomaly: false,
    receipt: null,
  },
  {
    id: "6",
    date: "2024-01-13",
    description: "Grocery Store Plus",
    amount: -89.32,
    category: "Food & Dining",
    account: "Chase Checking",
    status: "completed",
    mlCategory: "Groceries",
    confidence: 97.1,
    isRecurring: false,
    isAnomaly: false,
    receipt: null,
  },
  {
    id: "7",
    date: "2024-01-12",
    description: "Electric Bill",
    amount: -124.5,
    category: "Bills & Utilities",
    account: "Chase Checking",
    status: "completed",
    mlCategory: "Utilities",
    confidence: 99.8,
    isRecurring: true,
    isAnomaly: false,
    receipt: null,
  },
  {
    id: "8",
    date: "2024-01-12",
    description: "Investment Transfer",
    amount: -1000.0,
    category: "Investments",
    account: "Chase Checking",
    status: "completed",
    mlCategory: "Investment",
    confidence: 94.6,
    isRecurring: true,
    isAnomaly: false,
    receipt: null,
  },
];

// Analytics data
const categorySpending = [
  { category: "Food & Dining", amount: 420, color: "#ef4444" },
  { category: "Transportation", amount: 180, color: "#f97316" },
  { category: "Entertainment", amount: 95, color: "#8b5cf6" },
  { category: "Bills & Utilities", amount: 350, color: "#3b82f6" },
  { category: "Shopping", amount: 1250, color: "#06b6d4" },
];

const spendingTrend = [
  { day: "Mon", amount: 45 },
  { day: "Tue", amount: 89 },
  { day: "Wed", amount: 125 },
  { day: "Thu", amount: 67 },
  { day: "Fri", amount: 234 },
  { day: "Sat", amount: 156 },
  { day: "Sun", amount: 78 },
];

const categories = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Bills & Utilities",
  "Shopping",
  "Income",
  "Investments",
  "Healthcare",
  "Education",
  "Other",
];

export default function Transactions() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    account: "Chase Checking",
  });

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    if (selectedDateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();
      switch (selectedDateRange) {
        case "today":
          filterDate.setDate(now.getDate());
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      filtered = filtered.filter((t) => new Date(t.date) >= filterDate);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedCategory, selectedDateRange]);

  const handleAddTransaction = () => {
    setIsAnalyzing(true);
    // Simulate ML analysis
    setTimeout(() => {
      const mlCategory = categorizeMerchant(newTransaction.description);
      const transaction = {
        id: Date.now().toString(),
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        status: "completed",
        mlCategory: mlCategory.category,
        confidence: mlCategory.confidence,
        isRecurring: false,
        isAnomaly: Math.abs(parseFloat(newTransaction.amount)) > 500,
        receipt: null,
      };
      setTransactions([transaction, ...transactions]);
      setNewTransaction({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        account: "Chase Checking",
      });
      setShowAddDialog(false);
      setIsAnalyzing(false);
    }, 2000);
  };

  const categorizeMerchant = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes("starbucks") || desc.includes("coffee")) {
      return { category: "Coffee", confidence: 98.5 };
    }
    if (desc.includes("uber") || desc.includes("lyft")) {
      return { category: "Rideshare", confidence: 95.7 };
    }
    if (desc.includes("netflix") || desc.includes("spotify")) {
      return { category: "Streaming", confidence: 99.2 };
    }
    if (desc.includes("grocery") || desc.includes("supermarket")) {
      return { category: "Groceries", confidence: 97.1 };
    }
    return { category: "General", confidence: 85.0 };
  };

  const formatCurrency = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString("en-IN");
    return amount < 0 ? `-₹${formatted}` : `+₹${formatted}`;
  };

  const getTransactionIcon = (amount: number) => {
    return amount > 0 ? (
      <ArrowUpRight className="h-4 w-4 text-success" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-destructive" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Smart Transactions</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered transaction management with automatic categorization
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
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Enter transaction details. Our AI will automatically
                  categorize it.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="e.g., Starbucks Coffee, Uber Ride"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          amount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Category (Optional)
                  </label>
                  <Select
                    value={newTransaction.category}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="AI will categorize automatically" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddTransaction}
                  className="w-full"
                  disabled={
                    !newTransaction.description ||
                    !newTransaction.amount ||
                    isAnalyzing
                  }
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Add & Categorize
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-₹2,295</div>
            <div className="flex items-center text-xs text-destructive">
              <TrendingDown className="mr-1 h-3 w-3" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Anomalies Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">1</div>
            <div className="text-xs text-muted-foreground">
              ₹1,250 luxury purchase flagged
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Auto-Categorized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">94.2%</div>
            <div className="text-xs text-muted-foreground">
              7 of 8 transactions this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDateRange}
              onValueChange={setSelectedDateRange}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Transactions Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>ML Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(transaction.amount)}
                        <div>
                          <div className="font-medium">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.account}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {transaction.category}
                        </Badge>
                        {transaction.isRecurring && (
                          <Badge variant="outline" className="text-xs">
                            <RefreshCw className="mr-1 h-2 w-2" />
                            Recurring
                          </Badge>
                        )}
                        {transaction.isAnomaly && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="mr-1 h-2 w-2" />
                            Anomaly
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          transaction.amount > 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          <Brain className="mr-1 h-2 w-2" />
                          {transaction.confidence.toFixed(1)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
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
                  </PieChart>
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

            {/* Weekly Spending Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Spending Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={spendingTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      axisLine={true}
                      tickLine={true}
                      tick={true}
                    />
                    <YAxis axisLine={true} tickLine={true} tick={true} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
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
                        NLP Classification
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Auto-categorizing transactions
                      </div>
                    </div>
                    <Badge variant="secondary">94.2%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Anomaly Detection
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Monitoring for unusual patterns
                      </div>
                    </div>
                    <Badge variant="secondary">97.8%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        Pattern Recognition
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Identifying subscriptions
                      </div>
                    </div>
                    <Badge variant="secondary">91.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI Insights & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="font-medium text-sm">
                        Anomaly Detected
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ₹1,250 luxury purchase is 4.2x your normal spending.
                      Review if necessary.
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center mb-1">
                      <RefreshCw className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="font-medium text-sm">
                        Subscription Detected
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Netflix subscription identified. Automatically categorized
                      as Entertainment.
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center mb-1">
                      <TrendingDown className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium text-sm">
                        Spending Insight
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Coffee spending decreased 15% this week. You're meeting
                      your budget goals!
                    </p>
                  </div>

                  <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-center mb-1">
                      <Target className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="font-medium text-sm">Budget Alert</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Transportation category is 80% of monthly budget with 10
                      days remaining.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recurring Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Detected Recurring Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions
                  .filter((t) => t.isRecurring)
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div>
                          <div className="font-medium text-sm">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.category} • Monthly
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {formatCurrency(transaction.amount)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          <Brain className="mr-1 h-2 w-2" />
                          {transaction.confidence.toFixed(1)}%
                        </Badge>
                      </div>
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
