import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronRight,
  Code2,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { API_BASE } from "@/lib/api";
import axios from "axios";

interface ReviewAnalysis {
  bugs?: Array<{ severity: string; description: string }>;
  security_issues?: Array<{ severity: string; description: string }>;
}

interface CodeReview {
  id: string;
  title: string;
  language: string;
  quality_score: number;
  created_at: string;
  analysis: ReviewAnalysis;
}

const SavedReports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [reviews, setReviews] = useState<CodeReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to load reviews",
        });
        return;
      }

      setReviews(data.reviews || []);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to load reviews",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setDeletingId(id);
    try {
      const { data } = await axios.delete(`${API_BASE}/api/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to delete review",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      void fetchReviews();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to delete review",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <SidebarProvider>
      <div className="app-layout">
        <AppSidebar />

        <main className="app-main">
          <header className="app-header">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="rounded-full border border-white/70 bg-white/80" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                  Archive
                </p>
                <h1 className="text-3xl font-bold">Saved Reports</h1>
              </div>
            </div>
          </header>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <Card className="premium-card mx-auto max-w-3xl p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-6 text-3xl font-bold">No reports yet</h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Your saved reviews will appear here once you start analyzing
                code.
              </p>
              <Button
                onClick={() => navigate("/review")}
                className="mx-auto mt-8 rounded-full px-6"
              >
                Open Review Lab
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review) => (
                <Card key={review.id} className="premium-card p-6">
                  <CardHeader className="px-0 pt-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl">{review.title}</CardTitle>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                          <Code2 className="h-4 w-4" />
                          <span className="capitalize">{review.language}</span>
                        </div>
                      </div>
                      <div
                        className={`rounded-[1.25rem] bg-white px-4 py-3 text-3xl font-bold ${getScoreColor(review.quality_score)}`}
                      >
                        {review.quality_score}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-0 pb-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {review.analysis?.bugs &&
                        review.analysis.bugs.length > 0 && (
                          <Badge className="rounded-full bg-rose-100 text-rose-600 hover:bg-rose-100">
                            {review.analysis.bugs.length} bugs
                          </Badge>
                        )}
                      {review.analysis?.security_issues &&
                        review.analysis.security_issues.length > 0 && (
                          <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100">
                            {review.analysis.security_issues.length} security
                          </Badge>
                        )}
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-full border-white/60 bg-white/70"
                        onClick={() => navigate(`/review?id=${review.id}`)}
                      >
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full"
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                      >
                        {deletingId === review.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SavedReports;
