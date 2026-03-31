import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bug,
  FileText,
  Radar,
  Sparkles,
  TrendingUp,
} from "lucide-react";
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

    void fetchStats();
  }, [toast]);

  const statCards = [
    {
      label: "Total Reviews",
      value: stats.reviewCount,
      caption: "Saved review sessions",
      icon: FileText,
    },
    {
      label: "Issues Flagged",
      value: stats.bugsFound,
      caption: "Bugs surfaced in saved reports",
      icon: Bug,
    },
    {
      label: "Average Quality",
      value:
        stats.avgQualityScore != null ? Math.round(stats.avgQualityScore) : "-",
      caption: "Overall score out of 100",
      icon: TrendingUp,
    },
  ];

  return (
    <SidebarProvider>
      <div className="app-layout">
        <AppSidebar />

        <main className="app-main">
          <header className="app-header animate-rise">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="rounded-full border border-white/70 bg-white/80" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                  Overview
                </p>
                <h1 className="text-3xl font-bold">
                  Welcome back{userName ? `, ${userName}` : ""}.
                </h1>
              </div>
            </div>

            <Button className="rounded-full px-6" onClick={() => navigate("/review")}>
              New Review
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="premium-card animate-rise-delay-1 overflow-hidden p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="section-eyebrow">
                    <Sparkles className="h-3.5 w-3.5" />
                    Quality cockpit
                  </div>
                  <h2 className="mt-5 text-4xl font-bold">
                    Keep your review momentum high and your risk low.
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                    Review snippets, store reports, and spot patterns in your
                    code quality from one polished workspace.
                  </p>
                </div>
                <div className="hidden rounded-[1.75rem] bg-[image:var(--gradient-primary)] p-5 text-white shadow-[var(--shadow-glow)] lg:block">
                  <Radar className="h-10 w-10" />
                </div>
              </div>
            </Card>

            <Card className="premium-card animate-rise-delay-2 p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                Next best action
              </p>
              <h3 className="mt-4 text-3xl font-bold">
                Run another review and expand your history.
              </h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                Saved reports unlock better visibility into issue trends and the
                average quality signal of your code over time.
              </p>
              <Button
                className="mt-8 rounded-full px-6"
                onClick={() => navigate("/review")}
              >
                Open Review Lab
              </Button>
            </Card>
          </section>

          <section className="mt-6 grid gap-6 md:grid-cols-3">
            {statCards.map((item, index) => (
              <Card
                key={item.label}
                className={`metric-card ${index === 0 ? "animate-rise-delay-1" : index === 1 ? "animate-rise-delay-2" : "animate-rise-delay-3"}`}
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-4 text-5xl font-bold">{item.value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground">
                    {item.caption}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
