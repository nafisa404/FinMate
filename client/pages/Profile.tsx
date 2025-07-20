import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  TrendingUp,
  PiggyBank,
  ShoppingCart,
  Target,
  Zap,
  BarChart3,
  Sparkles,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Calendar,
  DollarSign,
  Download,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Enhanced ML personality analysis data
const personalityData = [
  { trait: "Saving Discipline", value: 88, fullMark: 100 },
  { trait: "Risk Tolerance", value: 52, fullMark: 100 },
  { trait: "Financial Planning", value: 91, fullMark: 100 },
  { trait: "Impulse Control", value: 76, fullMark: 100 },
  { trait: "Investment Knowledge", value: 64, fullMark: 100 },
  { trait: "Budget Adherence", value: 84, fullMark: 100 },
  { trait: "Tech Adoption", value: 95, fullMark: 100 },
  { trait: "Goal Orientation", value: 89, fullMark: 100 },
];

const spendingBehaviorData = [
  { month: "Jan", impulsive: 3200, planned: 21000, emotional: 1800 },
  { month: "Feb", impulsive: 2800, planned: 22000, emotional: 1200 },
  { month: "Mar", impulsive: 4500, planned: 19500, emotional: 2800 },
  { month: "Apr", impulsive: 3800, planned: 20500, emotional: 2100 },
  { month: "May", impulsive: 2900, planned: 21800, emotional: 1500 },
  { month: "Jun", impulsive: 3400, planned: 20800, emotional: 1900 },
];

const riskToleranceData = [
  { category: "Conservative Instruments", allocation: 45, returns: 7.2 },
  { category: "Moderate Risk Assets", allocation: 35, returns: 12.1 },
  { category: "High Risk Investments", allocation: 15, returns: 18.7 },
  { category: "Speculative Assets", allocation: 5, returns: 25.3 },
];

const behavioralBiases = [
  {
    bias: "Loss Aversion",
    severity: "Moderate",
    impact: 68,
    description: "Tendency to prefer avoiding losses over acquiring gains",
    recommendation: "Use SIP to overcome timing concerns",
  },
  {
    bias: "Anchoring Bias",
    severity: "Low",
    impact: 34,
    description: "Over-reliance on first piece of information",
    recommendation: "Diversify information sources for decisions",
  },
  {
    bias: "Confirmation Bias",
    severity: "Moderate",
    impact: 56,
    description: "Seeking information that confirms existing beliefs",
    recommendation: "Actively seek contrarian viewpoints",
  },
  {
    bias: "Present Bias",
    severity: "Low",
    impact: 41,
    description: "Overweighting immediate rewards vs future benefits",
    recommendation: "Automate long-term savings and investments",
  },
];

const spendingTriggers = [
  {
    trigger: "Social Situations",
    impact: "+45%",
    frequency: "8-12 times/month",
  },
  { trigger: "Stress/Anxiety", impact: "+28%", frequency: "4-6 times/month" },
  { trigger: "Seasonal Events", impact: "+65%", frequency: "3-4 times/year" },
  {
    trigger: "Online Promotions",
    impact: "+18%",
    frequency: "15-20 times/month",
  },
  { trigger: "Weekend Leisure", impact: "+32%", frequency: "8 times/month" },
];

const goalAchievementData = [
  { goal: "Emergency Fund", target: 100, achieved: 82, timeline: "On track" },
  { goal: "House Down Payment", target: 100, achieved: 35, timeline: "Behind" },
  {
    goal: "Retirement Savings",
    target: 100,
    achieved: 28,
    timeline: "On track",
  },
  { goal: "Vacation Fund", target: 100, achieved: 67, timeline: "Ahead" },
  { goal: "Car Purchase", target: 100, achieved: 23, timeline: "Behind" },
];

const mlModelsUsed = [
  {
    name: "Random Forest Classifier",
    purpose: "Personality type classification",
    accuracy: "94.7%",
    features: [
      "Spending patterns",
      "Saving rate",
      "Risk behavior",
      "Goal setting",
    ],
    dataPoints: "2,450+ transactions analyzed",
  },
  {
    name: "K-Means Clustering",
    purpose: "Behavioral pattern segmentation",
    accuracy: "89.3%",
    features: ["Transaction timing", "Amount clusters", "Category preferences"],
    dataPoints: "18 months of spending data",
  },
  {
    name: "LSTM Neural Network",
    purpose: "Behavioral prediction modeling",
    accuracy: "91.8%",
    features: [
      "Temporal patterns",
      "Seasonal variations",
      "Life events impact",
    ],
    dataPoints: "36 months predictive modeling",
  },
  {
    name: "NLP Sentiment Analysis",
    purpose: "Financial goal extraction",
    accuracy: "87.4%",
    features: ["Transaction notes", "App interactions", "Goal descriptions"],
    dataPoints: "5,800+ text inputs processed",
  },
  {
    name: "XGBoost Regressor",
    purpose: "Risk tolerance scoring",
    accuracy: "92.1%",
    features: [
      "Investment choices",
      "Portfolio allocation",
      "Market reactions",
    ],
    dataPoints: "24 months investment behavior",
  },
];

const personalityInsights = [
  {
    title: "Smart Conservative",
    confidence: 94.7,
    description:
      "You exhibit high savings discipline with growing investment interest",
    traits: [
      "High savings rate",
      "Methodical planning",
      "Tech-savvy",
      "Goal-oriented",
    ],
    strengths: [
      "Excellent emergency fund management",
      "Consistent savings habits",
      "Strong budgeting discipline",
      "Open to financial technology",
    ],
    growthAreas: [
      "Gradually increase equity exposure",
      "Explore international diversification",
      "Consider alternative investments",
      "Develop advanced tax strategies",
    ],
  },
];

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export default function Profile() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Brain className="mr-3 h-8 w-8 text-primary" />
            Financial Personality Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced ML-powered analysis of your financial behavior and
            personality
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            <Sparkles className="mr-1 h-3 w-3" />5 ML Models Active
          </Badge>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Profile
          </Button>
        </div>
      </div>

      {/* Main Personality Type Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
            <PiggyBank className="mr-2 h-6 w-6" />
            Your Financial Personality: Smart Conservative
            <Badge className="ml-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Confidence: 94.7%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                You are a methodical saver with strong financial discipline and
                growing investment interest. Your tech-savvy approach to money
                management sets you apart from traditional conservative
                investors.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                  Key Strengths:
                </h4>
                {personalityInsights[0].strengths.map((strength, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-blue-700 dark:text-blue-300">
                      {strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Growth Opportunities:
              </h4>
              <div className="space-y-2">
                {personalityInsights[0].growthAreas.map((area, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-blue-700 dark:text-blue-300">
                      {area}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="personality" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="risk">Risk Profile</TabsTrigger>
          <TabsTrigger value="biases">Biases</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="models">ML Models</TabsTrigger>
        </TabsList>

        <TabsContent value="personality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personality Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Personality Dimensions
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
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {personalityData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.trait}</span>
                        <span className="text-sm font-bold">
                          {item.value}/100
                        </span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {item.value >= 80
                          ? "Excellent"
                          : item.value >= 60
                            ? "Good"
                            : item.value >= 40
                              ? "Moderate"
                              : "Needs Improvement"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Behavior Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Behavior Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={spendingBehaviorData}>
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
                      dataKey="planned"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="impulsive"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="emotional"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex justify-center mt-4 space-x-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                    <span className="text-sm">Planned</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                    <span className="text-sm">Impulsive</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                    <span className="text-sm">Emotional</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spending Triggers */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Triggers Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spendingTriggers.map((trigger, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{trigger.trigger}</div>
                        <div className="text-sm text-muted-foreground">
                          {trigger.frequency}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${
                            parseInt(
                              trigger.impact.replace("+", "").replace("%", ""),
                            ) > 30
                              ? "text-red-600"
                              : parseInt(
                                    trigger.impact
                                      .replace("+", "")
                                      .replace("%", ""),
                                  ) > 20
                                ? "text-orange-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {trigger.impact}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          impact
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Tolerance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Tolerance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskToleranceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="category"
                      axisLine={true}
                      tickLine={true}
                      tick={true}
                    />
                    <YAxis axisLine={true} tickLine={true} tick={true} />
                    <Bar dataKey="allocation" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Current Risk Score: 52/100 (Moderate-Conservative)
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      You prefer stability over high returns, suitable for 65%
                      debt and 35% equity allocation.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {riskToleranceData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {item.category}
                          </span>
                          <div className="text-right">
                            <div className="font-bold">{item.allocation}%</div>
                            <div className="text-xs text-success">
                              +{item.returns}% returns
                            </div>
                          </div>
                        </div>
                        <Progress value={item.allocation} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Risk Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                  <h4 className="font-semibold mb-2">Conservative Approach</h4>
                  <p className="text-sm text-muted-foreground">
                    Your current 80% allocation to safe instruments aligns well
                    with your risk tolerance.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-semibold mb-2">Growth Opportunity</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider gradually increasing equity to 25% over 2 years for
                    better long-term returns.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <AlertCircle className="h-6 w-6 text-orange-600 mb-2" />
                  <h4 className="font-semibold mb-2">Diversification</h4>
                  <p className="text-sm text-muted-foreground">
                    Add international exposure (5-10%) to reduce single-country
                    risk concentration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Biases Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {behavioralBiases.map((bias, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{bias.bias}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {bias.description}
                        </p>
                      </div>
                      <Badge
                        variant={
                          bias.severity === "High"
                            ? "destructive"
                            : bias.severity === "Moderate"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {bias.severity}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Impact on Decisions</span>
                        <span className="text-sm font-medium">
                          {bias.impact}%
                        </span>
                      </div>
                      <Progress value={bias.impact} className="h-2" />
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">
                        💡 Recommendation:
                      </h5>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {bias.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Goal Achievement Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goalAchievementData.map((goal, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{goal.goal}</h4>
                        <p className="text-sm text-muted-foreground">
                          {goal.achieved}% completed
                        </p>
                      </div>
                      <Badge
                        variant={
                          goal.timeline === "Ahead"
                            ? "default"
                            : goal.timeline === "On track"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {goal.timeline === "Ahead" && (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        )}
                        {goal.timeline === "On track" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {goal.timeline === "Behind" && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {goal.timeline}
                      </Badge>
                    </div>
                    <Progress value={goal.achieved} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mlModelsUsed.map((model, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Brain className="mr-2 h-5 w-5" />
                      {model.name}
                    </span>
                    <Badge variant="secondary">{model.accuracy}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Purpose:</h4>
                      <p className="text-sm text-muted-foreground">
                        {model.purpose}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">
                        Features Analyzed:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {model.features.map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">
                        Data Processing:
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {model.dataPoints}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
