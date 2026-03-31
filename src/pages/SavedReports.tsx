import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Code, Loader2, Trash2 } from "lucide-react";
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
      console.error("Error fetching reviews:", error);
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
    fetchReviews();
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
      fetchReviews();
    } catch (error: unknown) {
      console.error("Error deleting review:", error);
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
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <main className="flex-1">
          <header className="h-16 border-b border-border/40 flex items-center px-6 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-2xl font-bold">Saved Reports</h1>
          </header>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : reviews.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by reviewing your first code
                </p>
                <Button onClick={() => navigate("/review")}>Review Code</Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            {review.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Code className="h-4 w-4" />
                            <span className="capitalize">
                              {review.language}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`text-3xl font-bold ${getScoreColor(
                            review.quality_score,
                          )}`}
                        >
                          {review.quality_score}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(review.created_at), "MMM d, yyyy")}
                        </span>
                      </div>

                      <div className="flex gap-2 mb-4">
                        {review.analysis?.bugs &&
                          review.analysis.bugs.length > 0 && (
                            <Badge variant="destructive">
                              {review.analysis.bugs.length} bugs
                            </Badge>
                          )}
                        {review.analysis?.security_issues &&
                          review.analysis.security_issues.length > 0 && (
                            <Badge variant="secondary">
                              {review.analysis.security_issues.length} security
                            </Badge>
                          )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/review?id=${review.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SavedReports;
