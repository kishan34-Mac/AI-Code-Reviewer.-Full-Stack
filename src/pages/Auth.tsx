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
import { Code, Loader2 } from "lucide-react";
import { z } from "zod";
import axios from "axios";



// Validation schemas
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
  const [name, setname] = useState("");

  // Redirect if token already exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]);

  // Validate user input
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

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setIsSigningUp(true);

    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/register`, {
        name: name, // backend expects username
        email,
        password,
      });

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
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
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: err?.response?.data?.message || "Server error",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  // Handle Sign In
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
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err?.response?.data?.message || "Server error",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">AI Code Reviewer</span>
          </div>

          <div>
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to start reviewing your code with AI
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* SIGN IN FORM */}
            <TabsContent value="signin">
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
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSigningIn || isSigningUp}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSigningIn || isSigningUp}
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* SIGN UP FORM */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    disabled={isSigningIn || isSigningUp}
                    required
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
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSigningIn || isSigningUp}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
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
  );
};

export default Auth;
