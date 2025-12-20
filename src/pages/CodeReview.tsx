import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2, AlertCircle, CheckCircle, Shield, Zap } from "lucide-react";
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

const CodeReview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isAuthed, setIsAuthed] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    } else {
      setIsAuthed(true);
    }
  }, [navigate]);

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
        }
      );

      console.log("analysis response:", data);

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
    } catch (error: any) {
      console.error("Error analyzing code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.message ||
          (error instanceof Error ? error.message : "Failed to analyze code"),
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
            <h1 className="text-2xl font-bold">Review Code</h1>
          </header>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Code Input Section */}
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Review Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., User Authentication Function"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="rust">Rust</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Code Editor</Label>
                      <div className="mt-1 border border-border rounded-lg overflow-hidden">
                        <Editor
                          height="400px"
                          language={language}
                          value={code}
                          onChange={(value) => setCode(value || "")}
                          theme="vs-dark"
                          options={{
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
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Code"
                      )}
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Analysis Results Section */}
              <div className="space-y-4">
                {!analysis && !isAnalyzing && (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Enter your code and click &quot;Analyze Code&quot; to get
                      started
                    </p>
                  </Card>
                )}

                {isAnalyzing && (
                  <Card className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">
                      Analyzing your code...
                    </p>
                  </Card>
                )}

                {analysis && (
                  <>
                    {/* Quality Score */}
                    <Card className="p-6 bg-gradient-hero border-primary/20">
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          Overall Quality Score
                        </h3>
                        <div className="text-5xl font-bold mb-2">
                          {analysis.overall_score}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          out of 100
                        </p>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Readability</div>
                          <div className="text-muted-foreground">
                            {analysis.code_quality.readability}/10
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Maintainability</div>
                          <div className="text-muted-foreground">
                            {analysis.code_quality.maintainability}/10
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Security</div>
                          <div className="text-muted-foreground">
                            {analysis.code_quality.security}/10
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Performance</div>
                          <div className="text-muted-foreground">
                            {analysis.code_quality.performance}/10
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Bugs */}
                    {analysis.bugs && analysis.bugs.length > 0 && (
                      <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          <h3 className="font-semibold">
                            Bugs Found ({analysis.bugs.length})
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {analysis.bugs.map((bug, idx) => (
                            <div
                              key={idx}
                              className="border border-border rounded-lg p-4"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant={getSeverityColor(bug.severity)}>
                                  {bug.severity}
                                </Badge>
                                {bug.line && (
                                  <span className="text-sm text-muted-foreground">
                                    Line {bug.line}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm mb-2">
                                {bug.description}
                              </p>
                              <div className="bg-muted/50 rounded p-2 text-sm">
                                <div className="font-medium mb-1 text-xs text-muted-foreground">
                                  Suggested Fix:
                                </div>
                                {bug.fix}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Security Issues */}
                    {analysis.security_issues &&
                      analysis.security_issues.length > 0 && (
                        <Card className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Shield className="h-5 w-5 text-accent" />
                            <h3 className="font-semibold">
                              Security Issues (
                              {analysis.security_issues.length})
                            </h3>
                          </div>
                          <div className="space-y-4">
                            {analysis.security_issues.map((issue, idx) => (
                              <div
                                key={idx}
                                className="border border-border rounded-lg p-4"
                              >
                                <Badge
                                  variant={getSeverityColor(issue.severity)}
                                  className="mb-2"
                                >
                                  {issue.severity}
                                </Badge>
                                <p className="text-sm mb-2">
                                  {issue.description}
                                </p>
                                <div className="bg-muted/50 rounded p-2 text-sm">
                                  <div className="font-medium mb-1 text-xs text-muted-foreground">
                                    Recommendation:
                                  </div>
                                  {issue.recommendation}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      )}

                    {/* Performance Issues */}
                    {analysis.performance_issues &&
                      analysis.performance_issues.length > 0 && (
                        <Card className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Zap className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">
                              Performance Issues (
                              {analysis.performance_issues.length})
                            </h3>
                          </div>
                          <div className="space-y-4">
                            {analysis.performance_issues.map((issue, idx) => (
                              <div
                                key={idx}
                                className="border border-border rounded-lg p-4"
                              >
                                <p className="text-sm font-medium mb-1">
                                  {issue.description}
                                </p>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Impact: {issue.impact}
                                </p>
                                <div className="bg-muted/50 rounded p-2 text-sm">
                                  <div className="font-medium mb-1 text-xs text-muted-foreground">
                                    Solution:
                                  </div>
                                  {issue.solution}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      )}

                    {/* Suggestions */}
                    {analysis.suggestions &&
                      analysis.suggestions.length > 0 && (
                        <Card className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Suggestions</h3>
                          </div>
                          <ul className="space-y-2">
                            {analysis.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="text-sm flex gap-2">
                                <span className="text-primary">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      )}

                    {/* Refactored Code */}
                    {analysis.refactored_code && (
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">
                          Refactored Code
                        </h3>
                        <div className="border border-border rounded-lg overflow-hidden">
                          <Editor
                            height="300px"
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CodeReview;
