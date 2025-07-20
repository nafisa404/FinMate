import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  LayoutDashboard,
  ArrowRightLeft,
  Target,
  CreditCard,
  PiggyBank,
  TrendingUp,
  BarChart3,
  Bot,
  Settings,
  User,
  Bell,
  ChevronDown,
  Sparkles,
  Brain,
  MessageCircle,
  BookOpen,
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
        description: "Financial overview and insights",
      },
    ],
  },
  {
    title: "Manage",
    items: [
      {
        title: "Transactions",
        url: "/transactions",
        icon: ArrowRightLeft,
        description: "Track income and expenses",
        badge: "AI",
      },
      {
        title: "Budgets",
        url: "/budgets",
        icon: Target,
        description: "Set and monitor spending limits",
        badge: "Smart",
      },
      {
        title: "Goals",
        url: "/goals",
        icon: PiggyBank,
        description: "Savings goals and targets",
      },
      {
        title: "Cards",
        url: "/cards",
        icon: CreditCard,
        description: "Credit and debit cards",
      },
    ],
  },
  {
    title: "Invest & Analyze",
    items: [
      {
        title: "Investments",
        url: "/investments",
        icon: TrendingUp,
        description: "Portfolio management",
        badge: "ML",
      },
      {
        title: "Reports",
        url: "/reports",
        icon: BarChart3,
        description: "Financial insights and analytics",
        badge: "AI",
      },
    ],
  },
  {
    title: "AI Features",
    items: [
      {
        title: "Financial Coach",
        url: "/chat",
        icon: MessageCircle,
        description: "AI-powered financial advice",
        badge: "New",
      },
      {
        title: "Learning Hub",
        url: "/learning",
        icon: BookOpen,
        description: "Interactive financial education",
        badge: "Gamified",
      },
      {
        title: "Personality Profile",
        url: "/profile",
        icon: Brain,
        description: "ML-based financial personality",
        badge: "Beta",
      },
    ],
  },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showChatbot, setShowChatbot] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center space-x-2 px-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-sidebar-foreground">
                  FinMate
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  AI Financial Assistant
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {navigationItems.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === item.url}
                          tooltip={item.description}
                        >
                          <Link to={item.url} className="flex items-center">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="ml-auto text-xs"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>
                          {user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user?.name || "User"}</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <span className="mr-2">🚪</span>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          {/* Header */}
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChatbot(!showChatbot)}
              className="relative"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Chat
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">{children}</main>

          {/* Floating Chatbot */}
          {showChatbot && (
            <div className="fixed bottom-4 right-4 w-80 h-96 bg-card border border-border rounded-lg shadow-lg z-50">
              <div className="flex items-center justify-between p-3 border-b bg-primary/5">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="font-medium text-sm">FinMate AI</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChatbot(false)}
                >
                  ×
                </Button>
              </div>
              <div className="flex flex-col h-80">
                <div className="flex-1 p-3 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="bg-primary/10 rounded-lg p-3 text-sm">
                      <div className="font-medium mb-1">
                        🤖 Hi! I'm your AI Financial Assistant
                      </div>
                      <div className="text-muted-foreground">
                        I can help you with:
                        <ul className="mt-1 space-y-1">
                          <li>• Investment recommendations</li>
                          <li>• Spending analysis</li>
                          <li>• Budget optimization</li>
                          <li>• Financial planning</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 text-sm">
                      <div className="font-medium mb-1">💡 Quick Tips</div>
                      <div className="text-muted-foreground">
                        Try asking: "How can I improve my savings rate?" or
                        "Analyze my spending patterns"
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ask me anything about finances..."
                      className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button size="sm">Send</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
