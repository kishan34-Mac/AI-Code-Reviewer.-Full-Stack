import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE } from "@/lib/api";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import Editor from "@monaco-editor/react";

interface Bug {
  line?: number;
  severity: string;
  description: string;
  fix: string;
}

interface Analysis {
  bugs: Bug[];
  security_issues: Array<{
    severity: string;
    description: string;
    recommendation: string;
  }>;
  performance_issues: Array<{
    description: string;
    impact: string;
    solution: string;
  }>;
  code_quality: {
    readability: number;
    maintainability: number;
    security: number;
    performance: number;
  };
  overall_score: number;
  suggestions: string[];
  refactored_code: string;
  test_cases?: Array<{ name: string; input: string; expected: string }>;
}

interface SavedReviewResponse {
  id: string;
  title: string;
  language: string;
  code: string;
  analysis: Analysis;
}

const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "go",
  "rust",
];

const CodeReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    const reviewId = searchParams.get("id");
    const token = localStorage.getItem("token");

    if (!reviewId || !token) {
      return;
    }

    const fetchReview = async () => {
      setIsLoadingReview(true);

      try {
        const { data } = await axios.get<{
          success: boolean;
          review: SavedReviewResponse;
          message?: string;
        }>(`${API_BASE}/api/reviews/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data.success || !data.review) {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.message || "Failed to load review",
          });
          return;
        }

        setTitle(data.review.title);
        setLanguage(data.review.language);
        setCode(data.review.code || "");
        setAnalysis(data.review.analysis);
      } catch (error: unknown) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : error instanceof Error
            ? error.message
            : undefined;

        toast({
          variant: "destructive",
          title: "Error",
          description: message || "Failed to load review",
        });
      } finally {
        setIsLoadingReview(false);
      }
    };

    void fetchReview();
  }, [searchParams, toast]);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) {
      return;
    }

    const model = editorRef.current.getModel();

    if (!model) {
      return;
    }

    const markers =
      analysis?.bugs
        ?.filter((bug) => typeof bug.line === "number")
        .map((bug) => ({
          startLineNumber: bug.line,
          endLineNumber: bug.line,
          startColumn: 1,
          endColumn: model.getLineMaxColumn(bug.line),
          message: `${bug.description} Fix: ${bug.fix}`,
          severity:
            bug.severity.toLowerCase() === "high" ||
            bug.severity.toLowerCase() === "critical"
              ? monacoRef.current.MarkerSeverity.Error
              : monacoRef.current.MarkerSeverity.Warning,
        })) ?? [];

    monacoRef.current.editor.setModelMarkers(
      model,
      "review-analysis",
      markers,
    );
  }, [analysis, code]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter some code to analyze",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a title for this review",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "Please log in again.",
      });
      navigate("/auth");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data } = await axios.post(
        `${API_BASE}/api/code/analyze`,
        {
          title: title.trim(),
          code,
          language,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!data.success || !data.analysis) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to analyze code",
        });
        return;
      }

      setAnalysis(data.analysis);

      toast({
        title: "Success",
        description: "Code analyzed successfully!",
      });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to analyze code",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
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
                  Review Lab
                </p>
                <h1 className="text-3xl font-bold">Analyze your code</h1>
              </div>
            </div>
          </header>

          <div className="mb-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="premium-card p-8">
              <div className="section-eyebrow">
                <Sparkles className="h-3.5 w-3.5" />
                Guided analysis
              </div>
              <h2 className="mt-5 text-4xl font-bold">
                Turn raw snippets into findings, scores, and clear next steps.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                Paste code, pick a language, and let the workspace shape bugs,
                security concerns, and refactor ideas into one clean view.
              </p>
            </Card>

            <Card className="premium-card p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                Session state
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {[
                  [analysis ? "Loaded" : "Waiting", "Result"],
                  [language, "Language"],
                  [title ? "Ready" : "Untitled", "Title"],
                  [isLoadingReview ? "Fetching" : "Stable", "Status"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[1.35rem] border border-white/70 bg-white/70 p-4"
                  >
                    <p className="text-lg font-bold capitalize">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
            <Card className="premium-card p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Review title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Authentication middleware"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 h-12 rounded-2xl border-white/60 bg-white/70"
                  />
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger
                      id="language"
                      className="mt-2 h-12 rounded-2xl border-white/60 bg-white/70"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-5">
                <Label>Code editor</Label>
                <div className="mt-2 overflow-hidden rounded-[1.5rem] border border-slate-900/10 shadow-xl">
                  <Editor
                    height="520px"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    onMount={handleEditorMount}
                    theme="vs-dark"
                    options={{
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="mt-5 w-full rounded-2xl py-6"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <WandSparkles className="mr-2 h-4 w-4" />
                    Analyze Code
                  </>
                )}
              </Button>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.25rem] border border-white/70 bg-white/70 p-4">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    Bug lines
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {analysis?.bugs.filter((bug) => bug.line).length ?? 0}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-white/70 bg-white/70 p-4">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    Corrected code
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {analysis?.refactored_code ? "Ready" : "Pending"}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-white/70 bg-white/70 p-4">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    Save state
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {analysis ? "Saved" : "Waiting"}
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              {!analysis && !isAnalyzing && !isLoadingReview && (
                <Card className="premium-card p-10 text-center">
                  <Sparkles className="mx-auto h-10 w-10 text-primary" />
                  <h3 className="mt-5 text-3xl font-bold">Results will land here.</h3>
                  <p className="mt-3 text-lg text-muted-foreground">
                    Start an analysis to view bugs, security notes, scores, and
                    suggestions in this panel.
                  </p>
                </Card>
              )}

              {(isAnalyzing || isLoadingReview) && (
                <Card className="premium-card p-10 text-center">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                  <p className="mt-4 text-lg text-muted-foreground">
                    {isLoadingReview
                      ? "Loading saved review..."
                      : "Analyzing your code..."}
                  </p>
                </Card>
              )}

              {analysis && (
                <>
                  <Card className="premium-card overflow-hidden p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                          Overall quality score
                        </p>
                        <p className="mt-3 text-6xl font-bold hero-gradient-text">
                          {analysis.overall_score}
                        </p>
                        <p className="mt-2 text-muted-foreground">out of 100</p>
                      </div>
                      <div className="rounded-[1.5rem] bg-[image:var(--gradient-primary)] p-4 text-white shadow-[var(--shadow-glow)]">
                        <Sparkles className="h-8 w-8" />
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(analysis.code_quality).map(([key, value]) => (
                        <div
                          key={key}
                          className="rounded-[1.25rem] border border-white/70 bg-white/70 p-4"
                        >
                          <p className="text-sm capitalize text-muted-foreground">
                            {key}
                          </p>
                          <p className="mt-2 text-2xl font-bold">{value}/10</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {analysis.bugs.length > 0 && (
                    <Card className="premium-card p-6">
                      <div className="mb-5 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <h3 className="text-2xl font-bold">
                          Bugs Found ({analysis.bugs.length})
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {analysis.bugs.map((bug, idx) => (
                          <div
                            key={`${bug.description}-${idx}`}
                            className="rounded-[1.35rem] border border-white/70 bg-white/70 p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <Badge variant={getSeverityColor(bug.severity)}>
                                {bug.severity}
                              </Badge>
                              {bug.line && (
                                <span className="text-sm text-muted-foreground">
                                  Line {bug.line}
                                </span>
                              )}
                            </div>
                            <p className="mt-3">{bug.description}</p>
                            <div className="mt-4 rounded-2xl bg-muted/60 p-4 text-sm">
                              <p className="mb-1 font-semibold text-muted-foreground">
                                Suggested fix
                              </p>
                              {bug.fix}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {analysis.security_issues.length > 0 && (
                    <Card className="premium-card p-6">
                      <div className="mb-5 flex items-center gap-3">
                        <Shield className="h-5 w-5 text-accent" />
                        <h3 className="text-2xl font-bold">
                          Security Issues ({analysis.security_issues.length})
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {analysis.security_issues.map((issue, idx) => (
                          <div
                            key={`${issue.description}-${idx}`}
                            className="rounded-[1.35rem] border border-white/70 bg-white/70 p-5"
                          >
                            <Badge variant={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                            <p className="mt-3">{issue.description}</p>
                            <div className="mt-4 rounded-2xl bg-muted/60 p-4 text-sm">
                              <p className="mb-1 font-semibold text-muted-foreground">
                                Recommendation
                              </p>
                              {issue.recommendation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {analysis.performance_issues.length > 0 && (
                    <Card className="premium-card p-6">
                      <div className="mb-5 flex items-center gap-3">
                        <Zap className="h-5 w-5 text-primary" />
                        <h3 className="text-2xl font-bold">
                          Performance Issues ({analysis.performance_issues.length})
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {analysis.performance_issues.map((issue, idx) => (
                          <div
                            key={`${issue.description}-${idx}`}
                            className="rounded-[1.35rem] border border-white/70 bg-white/70 p-5"
                          >
                            <p className="font-semibold">{issue.description}</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Impact: {issue.impact}
                            </p>
                            <div className="mt-4 rounded-2xl bg-muted/60 p-4 text-sm">
                              <p className="mb-1 font-semibold text-muted-foreground">
                                Solution
                              </p>
                              {issue.solution}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {analysis.suggestions.length > 0 && (
                    <Card className="premium-card p-6">
                      <div className="mb-5 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <h3 className="text-2xl font-bold">Suggestions</h3>
                      </div>
                      <ul className="space-y-3">
                        {analysis.suggestions.map((suggestion, idx) => (
                          <li
                            key={`${suggestion}-${idx}`}
                            className="rounded-[1.2rem] border border-white/70 bg-white/70 px-4 py-3"
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {analysis.refactored_code && (
                    <Card className="premium-card p-6">
                      <h3 className="mb-4 text-2xl font-bold">Refactored code</h3>
                      <div className="overflow-hidden rounded-[1.5rem] border border-slate-900/10 shadow-xl">
                        <Editor
                          height="320px"
                          language={language}
                          value={analysis.refactored_code}
                          theme="vs-dark"
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                          }}
                        />
                      </div>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CodeReview;
