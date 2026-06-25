import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Bell, ChevronDown, X, Loader2, Command } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const suggestions = [
  "Show projects delayed",
  "Generate quotation for Nexus",
  "Summarize today's meetings",
  "Create invoice for TechPark",
  "Show overdue invoices",
  "Analyze Marina Complex risks",
  "Generate weekly report",
  "Find customer David Kim",
  "Show pending approvals",
  "List urgent tasks",
];

interface AICommandBarProps {
  onNavigate: (page: string) => void;
}

export function AICommandBar({ onNavigate }: AICommandBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(s =>
    query ? s.toLowerCase().includes(query.toLowerCase()) : true
  ).slice(0, 5);

  const handleSubmit = (text: string) => {
    setQuery(text);
    setIsProcessing(true);
    setIsOpen(false);
    setTimeout(() => {
      setIsProcessing(false);
      const lower = text.toLowerCase();
      if (lower.includes("project") || lower.includes("delay") || lower.includes("risk")) {
        setResponse("Found 3 delayed projects: Harborview Marina (-11 days), Pinnacle Resort (-21 days). Navigating to Projects...");
        setTimeout(() => onNavigate("projects"), 1000);
      } else if (lower.includes("invoice") || lower.includes("finance") || lower.includes("payment")) {
        setResponse("Found 2 outstanding invoices totaling $1.54M. Navigating to Finance...");
        setTimeout(() => onNavigate("finance"), 1000);
      } else if (lower.includes("report")) {
        setResponse("Generating weekly executive report... This will take 30 seconds. Navigating to Reports...");
        setTimeout(() => onNavigate("reports"), 1000);
      } else if (lower.includes("customer") || lower.includes("david")) {
        setResponse("Found customer: David Kim at Nexus Property Group. Navigating to Customers...");
        setTimeout(() => onNavigate("customers"), 1000);
      } else if (lower.includes("approval") || lower.includes("pending")) {
        setResponse("7 items pending approval. 3 are urgent. Navigating to approvals...");
        setTimeout(() => onNavigate("administration"), 1000);
      } else if (lower.includes("task")) {
        setResponse("Found 24 tasks for today. 3 are overdue. Navigating to Tasks...");
        setTimeout(() => onNavigate("tasks"), 1000);
      } else {
        setResponse(`AI is analyzing: "${text}". Processing request across all modules...`);
        setTimeout(() => onNavigate("dashboard"), 1500);
      }
      setTimeout(() => setResponse(""), 4000);
    }, 1200);
  };

  return (
    <div className="relative flex-1 max-w-2xl">
      <div className={cn(
        "flex items-center gap-2 rounded-lg border transition-all duration-200 px-3 h-9",
        isOpen || isProcessing
          ? "border-primary/50 bg-card shadow-lg shadow-primary/10"
          : "border-border bg-card hover:border-primary/30"
      )}>
        {isProcessing ? (
          <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
        ) : (
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
        )}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) handleSubmit(query);
            if (e.key === "Escape") { setIsOpen(false); setQuery(""); }
          }}
          placeholder="Ask AI anything... (e.g., 'Show delayed projects')"
          className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground border border-border rounded px-1 py-0.5">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </div>

      {/* Response banner */}
      {response && (
        <div className="absolute top-10 left-0 right-0 z-50 mt-1 px-3 py-2 rounded-lg glass border border-primary/30 text-xs text-foreground animate-in fade-in slide-in-from-top-2">
          <span className="text-primary font-medium">AI: </span>{response}
        </div>
      )}

      {/* Dropdown suggestions */}
      {isOpen && !isProcessing && (
        <div className="absolute top-10 left-0 right-0 z-50 mt-1 rounded-lg border border-border bg-popover shadow-xl overflow-hidden">
          <div className="p-2">
            <p className="text-[10px] text-muted-foreground font-medium px-2 pb-1 uppercase tracking-wider">Suggestions</p>
            {filteredSuggestions.map((s, i) => (
              <button
                key={i}
                onMouseDown={() => handleSubmit(s)}
                className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent text-sm text-foreground/80 hover:text-foreground transition-colors"
              >
                <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TopbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  sidebarCollapsed: boolean;
}

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  inbox: "Inbox",
  customers: "Customers",
  projects: "Projects",
  tasks: "Tasks",
  documents: "Documents",
  media: "Media Center",
  reports: "Reports",
  finance: "Finance",
  automation: "Automation",
  "ai-agents": "AI Agents",
  administration: "Administration",
  settings: "Settings",
  "ai-dataflow": "AI Data Flow",
  "business-intelligence": "Business Intelligence",
};

export function Topbar({ currentPage, onNavigate, sidebarCollapsed }: TopbarProps) {
  const { roleData } = useAuth();

  return (
    <header className={cn(
      "fixed top-0 right-0 h-16 z-30 flex items-center gap-4 px-4 border-b border-border bg-background/95 backdrop-blur-sm transition-all duration-300",
      sidebarCollapsed ? "left-16" : "left-60"
    )}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-semibold text-foreground">{pageTitles[currentPage] || currentPage}</span>
        <Badge variant="outline" className="text-[10px] text-muted-foreground border-border hidden sm:flex">
          AI-Powered
        </Badge>
      </div>

      <AICommandBar onNavigate={onNavigate} />

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="ghost" size="icon" className="relative w-9 h-9 text-muted-foreground hover:text-foreground" onClick={() => onNavigate("inbox")}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </Button>
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent cursor-pointer transition-colors" onClick={() => onNavigate("settings")}>
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {roleData?.avatar || "U"}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-medium text-foreground">{roleData?.user || "User"}</span>
            <span className="text-[10px] text-muted-foreground">{roleData?.name || "User"}</span>
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
