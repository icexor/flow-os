import { useState } from "react";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Inbox } from "@/pages/Inbox";
import { Customers } from "@/pages/Customers";
import { Projects } from "@/pages/Projects";
import { Tasks } from "@/pages/Tasks";
import { Documents } from "@/pages/Documents";
import { Media } from "@/pages/Media";
import { Reports } from "@/pages/Reports";
import { Finance } from "@/pages/Finance";
import { Automation } from "@/pages/Automation";
import { AIAgents } from "@/pages/AIAgents";
import { Administration } from "@/pages/Administration";
import { Settings } from "@/pages/Settings";
import { AIDataFlow } from "@/pages/AIDataFlow";
import { BusinessIntelligence } from "@/pages/BusinessIntelligence";
import { useAppearance } from "@/hooks/use-appearance";
import { useAuth } from "@/lib/auth-context";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Page =
  | "dashboard" | "inbox" | "customers" | "projects" | "tasks"
  | "documents" | "media" | "reports" | "finance" | "automation"
  | "ai-agents" | "administration" | "settings" | "ai-dataflow"
  | "business-intelligence";

export function App() {
  const { isLoggedIn, login, logout, allowedModules } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const appearance = useAppearance();
  const isMobile = useIsMobile();

  const handleLogin = (role: string) => {
    login(role);
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  if (!isLoggedIn) {
    return (
      <>
        <BackgroundEffects />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  const renderPage = () => {
    const props = { onNavigate: handleNavigate };
    switch (currentPage) {
      case "dashboard": return <Dashboard {...props} />;
      case "inbox": return <Inbox {...props} />;
      case "customers": return <Customers {...props} />;
      case "projects": return <Projects {...props} />;
      case "tasks": return <Tasks {...props} />;
      case "documents": return <Documents {...props} />;
      case "media": return <Media {...props} />;
      case "reports": return <Reports {...props} />;
      case "finance": return <Finance {...props} />;
      case "automation": return <Automation {...props} />;
      case "ai-agents": return <AIAgents {...props} />;
      case "administration": return <Administration {...props} />;
      case "settings": return (
        <Settings
          {...props}
          themeMode={appearance.themeMode}
          accentColor={appearance.accentColor}
          onChangeTheme={appearance.changeThemeMode}
          onChangeAccent={appearance.changeAccentColor}
        />
      );
      case "ai-dataflow": return <AIDataFlow {...props} />;
      case "business-intelligence": return <BusinessIntelligence {...props} />;
      default: return <Dashboard {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundEffects />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={logout}
          allowedModules={allowedModules}
        />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
          <AppSidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            collapsed={false}
            onToggle={() => setMobileMenuOpen(false)}
            onLogout={logout}
            allowedModules={allowedModules}
          />
        </SheetContent>
      </Sheet>

      <Topbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        sidebarCollapsed={sidebarCollapsed}
        onMobileMenuToggle={toggleMobileMenu}
      />
      <main className={cn(
        "min-h-screen pt-16 transition-all duration-300 relative z-10",
        !isMobile && (sidebarCollapsed ? "lg:pl-16" : "lg:pl-60")
      )}>
        <div className="p-4 md:p-6 max-w-[1400px]">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
