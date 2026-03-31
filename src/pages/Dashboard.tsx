import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE } from "@/lib/api";
import axios from "axios";

interface ReviewStats {
  reviewCount: number;
  bugsFound: number;
  avgQualityScore: number | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [userName, setUserName] = useState<string>("");
  const [stats, setStats] = useState<ReviewStats>({
    reviewCount: 0,
    bugsFound: 0,
    avgQualityScore: null,
  });

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("email");
    setUserName(storedName || storedEmail || "");
  }, []);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await axios.get(`${API_BASE}/api/reviews/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data.success) {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.message || "Failed to load stats",
          });
          return;
        }

        setStats({
          reviewCount: data.reviewCount ?? 0,
          bugsFound: data.bugsFound ?? 0,
          avgQualityScore:
            typeof data.avgQualityScore === "number"
              ? data.avgQualityScore
              : null,
        });
      } catch (error: unknown) {
        console.error("Error fetching stats:", error);
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;
        toast({
          variant: "destructive",
          title: "Error",
          description: message || "Failed to load stats",
        });
      }
    };

    fetchStats();
  }, [toast]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <main className="flex-1">
          <header className="h-16 border-b border-border/40 flex items-center px-6 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back{userName ? `, ${userName}` : ""}
              </p>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Reviews
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.reviewCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Code reviews completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Bugs Found
                  </CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.bugsFound ?? "-"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Issues detected
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Quality Score
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.avgQualityScore != null
                      ? Math.round(stats.avgQualityScore)
                      : "-"}
                  </div>
                  <p className="text-xs text-muted-foreground">Out of 100</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-primary/20 bg-gradient-hero">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Start Code Review
                    </h2>
                    <p className="text-muted-foreground">
                      Analyze your code for bugs, security issues, and
                      performance problems
                    </p>
                  </div>
                  <Button size="lg" onClick={() => navigate("/review")}>
                    Review Code
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  No recent activity. Start by reviewing your first code!
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
