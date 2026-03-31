import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Code2, Loader2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { z } from "zod";
import axios from "axios";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const validateForm = (isSignup: boolean) => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (isSignup && !name.trim()) {
        throw new Error("Full name is required");
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: error.errors[0].message,
        });
      } else if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: error.message,
        });
      }
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setIsSigningUp(true);

    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/register`, {
        name,
        email,
        password,
      });

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("userName", name);
        toast({
          title: "Success!",
          description: "Account created successfully.",
        });
        navigate("/dashboard", { replace: true });
      } else {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: data.message || "Something went wrong.",
        });
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: message || "Server error",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setIsSigningIn(true);

    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        if (data.user?.name) {
          localStorage.setItem("userName", data.user.name);
        }
        toast({
          title: "Welcome back!",
          description: "Login successful.",
        });
        navigate("/dashboard", { replace: true });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: data.message || "Invalid credentials",
        });
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      toast({
        variant: "destructive",
        title: "Login failed",
        description: message || "Server error",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
      <div className="page-orb left-[-9rem] top-8 h-72 w-72 bg-primary/20" />
      <div className="page-orb bottom-0 right-[-8rem] h-80 w-80 bg-accent/20" />

      <div className="relative z-10 grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Card className="premium-card hidden overflow-hidden p-8 lg:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="section-eyebrow mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Review Workspace
              </div>
              <h1 className="max-w-md text-5xl font-bold leading-tight">
                Make every merge feel a little more confident.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                Audit logic, security, and maintainability inside a warm, modern
                workspace built for developers who move fast.
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Security aware",
                  copy: "Catch auth flaws, unsafe patterns, and risky assumptions.",
                },
                {
                  icon: Zap,
                  title: "Instant scoring",
                  copy: "Turn snippets into quality scores, findings, and fixes.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-white/60 bg-white/70 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.copy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="premium-card animate-rise w-full overflow-hidden">
          <CardHeader className="space-y-6 pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
              <Code2 className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <CardTitle className="text-3xl">Welcome back</CardTitle>
              <CardDescription className="mt-2 text-base">
                Sign in to review, save, and improve your code in one place.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid h-12 w-full grid-cols-2 rounded-full bg-muted/70 p-1">
                <TabsTrigger value="signin" className="rounded-full">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSigningIn || isSigningUp}
                      required
                      className="h-12 rounded-2xl border-white/60 bg-white/70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSigningIn || isSigningUp}
                      required
                      className="h-12 rounded-2xl border-white/60 bg-white/70"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-2xl"
                    disabled={isSigningIn || isSigningUp}
                  >
                    {isSigningIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Enter Workspace"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSigningIn || isSigningUp}
                      required
                      className="h-12 rounded-2xl border-white/60 bg-white/70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSigningIn || isSigningUp}
                      required
                      className="h-12 rounded-2xl border-white/60 bg-white/70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSigningIn || isSigningUp}
                      required
                      className="h-12 rounded-2xl border-white/60 bg-white/70"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-2xl"
                    disabled={isSigningIn || isSigningUp}
                  >
                    {isSigningUp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
