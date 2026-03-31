import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, UserRound } from "lucide-react";
import { API_BASE } from "@/lib/api";
import axios from "axios";

interface ProfileData {
  email: string;
  name: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setIsLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data.success) {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.message || "Failed to load profile",
          });
          return;
        }

        const nextProfile: ProfileData = {
          email: data.user.email,
          name: data.user.name || "",
        };
        setProfile(nextProfile);
        setName(nextProfile.name);
      } catch (error: unknown) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;
        toast({
          variant: "destructive",
          title: "Error",
          description: message || "Failed to load profile",
        });
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, [toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    setIsSaving(true);
    try {
      const { data } = await axios.put(
        `${API_BASE}/api/profile`,
        { name: name.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!data.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to update profile",
        });
        return;
      }

      localStorage.setItem("userName", name.trim());

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <SidebarProvider>
        <div className="app-layout">
          <AppSidebar />
          <main className="app-main flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </main>
        </div>
      </SidebarProvider>
    );
  }

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
                  Account
                </p>
                <h1 className="text-3xl font-bold">Profile</h1>
              </div>
            </div>
          </header>

          <Card className="premium-card mx-auto max-w-3xl p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-3xl">Profile information</CardTitle>
              <p className="text-muted-foreground">
                Keep your identity details fresh so the workspace feels personal
                and consistent.
              </p>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/70 bg-white/70 p-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="mt-3 h-12 rounded-2xl border-white/60 bg-white"
                    />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Email stays locked to protect account identity.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/70 bg-white/70 p-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-3 h-12 rounded-2xl border-white/60 bg-white"
                    />
                    <p className="mt-3 text-sm text-muted-foreground">
                      This name appears across your dashboard and reports.
                    </p>
                  </div>
                </div>

                <Button type="submit" disabled={isSaving} className="rounded-full px-6">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
