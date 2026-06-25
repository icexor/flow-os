import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Inbox,
  Users,
  FolderKanban,
  CheckSquare,
  FileText,
  Image,
  BarChart3,
  DollarSign,
  Zap,
  Bot,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  LogOut,
  Activity,
  BrainCircuit,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { PermissionModule } from "@/lib/permissions";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

const allNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "inbox", label: "Inbox", icon: Inbox, badge: 34, badgeColor: "blue" },
  { id: "customers", label: "Customers", icon: Users },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tasks", label: "Tasks", icon: CheckSquare, badge: 7, badgeColor: "orange" },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "media", label: "Media", icon: Image },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "automation", label: "Automation", icon: Zap },
  { id: "ai-agents", label: "AI Agents", icon: Bot, badge: 3, badgeColor: "emerald" },
  { id: "administration", label: "Administration", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
];

const intelligenceItems: NavItem[] = [
  { id: "ai-dataflow", label: "AI Data Flow", icon: Activity },
  { id: "business-intelligence", label: "Business Intel", icon: BrainCircuit },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  allowedModules?: PermissionModule[];
}

export function AppSidebar({ currentPage, onNavigate, collapsed, onToggle, onLogout, allowedModules = [] }: SidebarProps) {
  const { roleData } = useAuth();

  const isAllowed = (id: string) => {
    if (!allowedModules.length) return true;
    return allowedModules.includes(id as PermissionModule);
  };

  const visibleNavItems = allNavItems.filter((item) => isAllowed(item.id));
  const visibleIntelItems = intelligenceItems.filter((item) => isAllowed(item.id));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out",
        "bg-sidebar/90 backdrop-blur-xl border-r border-sidebar-border",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", collapsed ? "justify-center" : "gap-3")}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-blue">
          <Hexagon className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground tracking-tight">FlowOS</span>
            <span className="text-[10px] text-muted-foreground">AI Business OS</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-hide">
        <ul className="space-y-0.5 px-2">
          {visibleNavItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "w-full flex items-center rounded-md transition-all duration-150 outline-none group relative",
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2",
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4", isActive ? "text-primary" : "")} />
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                          item.badgeColor === "blue" ? "bg-primary/20 text-primary" :
                          item.badgeColor === "orange" ? "bg-orange-500/20 text-orange-400" :
                          "bg-emerald-500/20 text-emerald-400"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isActive && collapsed && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {!collapsed && visibleIntelItems.length > 0 && (
          <>
            <Separator className="my-3 mx-2" />
            <div className="px-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">Intelligence</p>
              {visibleIntelItems.map((item) => {
                const isActive = currentPage === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent",
                      isActive && "bg-primary/15 text-primary border-primary/20"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {!collapsed && allowedModules.length > 0 && (
          <div className="px-5 mt-4">
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-1.5">
                <Lock className="w-3 h-3 text-primary" />
                <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Role Access</p>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {roleData?.name || "User"} — {visibleNavItems.length + visibleIntelItems.length} modules
              </p>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-sidebar-border p-3", collapsed ? "flex justify-center" : "")}>
        {!collapsed ? (
          <div className="flex items-center gap-3 px-1 mb-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
              {roleData?.avatar || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{roleData?.user || "User"}</p>
              <p className="text-[10px] text-muted-foreground">{roleData?.name || "User"}</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => onLogout?.()}>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("w-full h-7 text-muted-foreground hover:text-foreground", collapsed ? "w-9" : "")}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  );
}
