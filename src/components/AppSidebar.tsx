import { Home, Code2, FileText, User, LogOut, Sparkles } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Review Lab", url: "/review", icon: Code2 },
  { title: "Saved Reports", url: "/reports", icon: FileText },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userName");

    toast({
      title: "Signed out",
      description: "You have been signed out.",
    });

    navigate("/auth");
  };

  return (
    <Sidebar className="border-r-0 bg-transparent">
      <SidebarContent className="m-4 rounded-[1.75rem] border border-white/60 bg-white/80 p-2 shadow-[var(--shadow-card)] backdrop-blur-xl">
        <div className="mb-6 rounded-[1.5rem] bg-[image:var(--gradient-primary)] p-5 text-white shadow-[var(--shadow-glow)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">AI Code Reviewer</p>
              <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                Studio
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/80">
            Review faster, save cleaner reports, and keep your code quality in
            view.
          </p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-auto p-0">
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground/75 transition-all hover:bg-secondary/70 hover:text-foreground"
                      activeClassName="bg-secondary text-foreground shadow-sm"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-primary">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mx-4 mb-4 mt-0 rounded-[1.75rem] border border-white/60 bg-white/80 p-2 shadow-[var(--shadow-card)] backdrop-blur-xl">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="rounded-2xl px-4 py-3 text-sm transition hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
