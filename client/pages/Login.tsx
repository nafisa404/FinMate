import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Brain,
  TrendingUp,
  Shield,
  Sparkles,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
      const payload = isSignUp
        ? { name, email, password }
        : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@finmate.com");
    setPassword("demo123");
    // Auto-submit demo credentials
    setTimeout(() => {
      const demoUser = {
        id: 1,
        name: "John Demo",
        email: "demo@finmate.com",
        avatar: "JD",
      };
      localStorage.setItem("user", JSON.stringify(demoUser));
      localStorage.setItem("token", "demo-token");
      navigate("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="space-y-8 text-center lg:text-left">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FinMate
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Your AI-Powered Financial Companion
            </p>
            <Badge variant="secondary" className="mt-4">
              Powered by Hugging Face AI
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">AI Financial Coach</h3>
                <p className="text-sm text-muted-foreground">
                  5 specialized AI coaches with 95%+ accuracy
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Smart Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time insights and predictive modeling
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Bank-Level Security</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced fraud detection and encryption
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold">Goal Achievement</h3>
                <p className="text-sm text-muted-foreground">
                  Gamified financial planning and tracking
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <div className="flex items-center space-x-1">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">10k+ Users</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">$2M+ Managed</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? "Start your financial journey with AI-powered insights"
                  : "Sign in to your FinMate account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </>
                  ) : (
                    <>{isSignUp ? "Create Account" : "Sign In"}</>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Try Demo Account
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                    setEmail("");
                    setPassword("");
                    setName("");
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {isSignUp ? "Sign In" : "Create Account"}
                </Button>
              </div>

              {!isSignUp && (
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>256-bit SSL encryption</span>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>GDPR compliant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
