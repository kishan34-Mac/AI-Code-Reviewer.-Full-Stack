import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
const API_BASE = "http://localhost:4000";

 

interface ReviewStats {
  reviewCount: number;
  bugsFound: number;
  avgQualityScore: number | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isAuthed, setIsAuthed] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [stats, setStats] = useState<ReviewStats>({
    reviewCount: 0,
    bugsFound: 0,
    avgQualityScore: null,
  });

  // Auth guard – read token (and optionally email) from storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email"); // set this at login if you want

    if (!token) {
      navigate("/auth");
    } else {
      setIsAuthed(true);
      if (storedEmail) setEmail(storedEmail);
    }
  }, [navigate]);

  // Fetch stats from backend
  useEffect(() => {
    if (!isAuthed) return;

    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

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
      } catch (error: any) {
        console.error("Error fetching stats:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error?.response?.data?.message || "Failed to load stats",
        });
      }
    };

    fetchStats();
  }, [isAuthed, navigate, toast]);

  if (!isAuthed) {
    return null;
  }

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
                Welcome back{email ? `, ${email}` : "" }
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
                  <div className="text-2xl font-bold">
                    {stats.reviewCount}
                  </div>
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
                  <p className="text-xs text-muted-foreground">
                    Out of 100
                  </p>
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
