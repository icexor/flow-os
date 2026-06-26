import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Plus, ChevronRight, ChevronLeft, Sparkles,
  MapPin,
  LayoutGrid, List, GitBranch,
  Filter
} from "lucide-react";
import { projects } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const riskConfig = {
  low: { badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  medium: { badge: "bg-orange-500/20 text-orange-400 border-orange-500/30", dot: "bg-orange-500", bar: "bg-orange-500" },
  high: { badge: "bg-red-500/20 text-red-400 border-red-500/30", dot: "bg-red-500", bar: "bg-red-500" },
};

const statusConfig = {
  "in-progress": { badge: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  "at-risk": { badge: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  "delayed": { badge: "bg-red-500/20 text-red-400 border-red-500/30" },
  "completed": { badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
};

interface ProjectsProps {
  onNavigate: (page: string) => void;
}

export function Projects({ onNavigate }: ProjectsProps) {
  const [view, setView] = useState<"kanban" | "list" | "gantt">("kanban");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const isMobile = useIsMobile();

  const kanbanGroups = [
    { label: "Planning", color: "bg-muted", projects: [] },
    { label: "In Progress", color: "bg-blue-500/10", projects: projects.filter(p => p.status === "in-progress") },
    { label: "At Risk", color: "bg-orange-500/10", projects: projects.filter(p => p.status === "at-risk" || p.status === "delayed") },
    { label: "Completed", color: "bg-emerald-500/10", projects: [] },
  ];

  const detailTabs = ["overview", "tasks", "budget", "team", "reports", "files", "ai-analysis"];

  const handleSelectProject = (project: typeof projects[0]) => {
    setSelectedProject(project);
    if (isMobile) {
      setMobileDetailOpen(true);
    }
  };

  const ProjectDetail = () => (
    <>
      <CardHeader className="pb-0 pt-4 px-4 md:px-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button onClick={() => { setSelectedProject(null); setMobileDetailOpen(false); }} className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm md:text-base font-bold text-foreground truncate">{selectedProject!.name}</h2>
                <Badge className={cn("text-[10px]", statusConfig[selectedProject!.status as keyof typeof statusConfig]?.badge)}>
                  {selectedProject!.status}
                </Badge>
                <Badge className={cn("text-[10px]", riskConfig[selectedProject!.risk as keyof typeof riskConfig]?.badge)}>
                  {selectedProject!.risk} risk
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{selectedProject!.customer} · PM: {selectedProject!.pm} · {selectedProject!.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="text-xs h-7">Edit</Button>
            <Button size="sm" className="text-xs h-7 gap-1"><Sparkles className="w-3 h-3" />AI Report</Button>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-3 overflow-x-auto scrollbar-hide">
          {detailTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-shrink-0 text-xs px-3 py-1.5 capitalize border-b-2 transition-all",
                activeTab === tab ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-5">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Budget", value: formatCurrency(selectedProject!.budget), sub: formatCurrency(selectedProject!.spent) + " spent", color: "text-blue-400" },
                { label: "Progress", value: `${selectedProject!.progress}%`, sub: `${selectedProject!.completedTasks}/${selectedProject!.tasks} tasks`, color: "text-purple-400" },
                { label: "Phase", value: selectedProject!.phase, sub: `Ends ${selectedProject!.endDate}`, color: "text-orange-400" },
                { label: "Risk Level", value: selectedProject!.risk, sub: "AI assessed", color: riskConfig[selectedProject!.risk as keyof typeof riskConfig]?.dot.replace("bg-", "text-") },
              ].map(kpi => (
                <div key={kpi.label} className="p-3 rounded-lg bg-muted border border-border/40 overflow-hidden">
                  <p className={cn("text-sm md:text-base font-bold truncate", kpi.color)}>{kpi.value}</p>
                  <p className="text-xs font-medium text-foreground">{kpi.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{kpi.sub}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="text-foreground font-medium">{selectedProject!.progress}%</span>
              </div>
              <Progress value={selectedProject!.progress} className="h-2" />
            </div>

            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">AI Risk Analysis</span>
              </div>
              <p className="text-sm text-foreground/80">{selectedProject!.aiInsight}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted border border-border/40">
                <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Project Team</p>
                <div className="flex flex-wrap gap-1">
                  {selectedProject!.team.map(member => (
                    <Badge key={member} variant="outline" className="text-[10px]">{member}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted border border-border/40">
                <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Budget Status</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Spent</span>
                    <span>{formatCurrency(selectedProject!.spent)} ({Math.round(selectedProject!.spent / selectedProject!.budget * 100)}%)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="text-emerald-400">{formatCurrency(selectedProject!.budget - selectedProject!.spent)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab !== "overview" && (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <p className="text-sm text-muted-foreground capitalize">{activeTab.replace("-", " ")} module loaded</p>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => onNavigate(activeTab === "tasks" ? "tasks" : activeTab === "reports" ? "reports" : "documents")}>
              Open Full View <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Projects</h2>
          <p className="text-xs text-muted-foreground">{projects.length} active · 3 at risk · AI monitoring all sites</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center border border-border rounded-lg p-0.5">
            {[
              { id: "kanban" as const, icon: LayoutGrid },
              { id: "list" as const, icon: List },
              { id: "gantt" as const, icon: GitBranch },
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setView(v.id as typeof view)}
                className={cn("p-1.5 rounded-md transition-all", view === v.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <v.icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8"><Filter className="w-3 h-3" />Filter</Button>
          <Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" />New Project</Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {[
          { label: "Total Budget", value: "$48.3M", sub: "All projects", color: "text-blue-400" },
          { label: "Total Spent", value: "$32.2M", sub: "66.7% utilized", color: "text-orange-400" },
          { label: "On Schedule", value: "67%", sub: "12/18 projects", color: "text-emerald-400" },
          { label: "Avg Progress", value: "56%", sub: "Across portfolio", color: "text-purple-400" },
          { label: "AI Alerts", value: "8", sub: "Require review", color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-lg glass-subtle border-border/60">
            <p className={cn("text-base md:text-lg font-bold", s.color)}>{s.value}</p>
            <p className="text-xs font-medium text-foreground truncate">{s.label}</p>
            <p className="text-[10px] text-muted-foreground truncate hidden sm:block">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Project Detail View - Desktop */}
      {selectedProject && !isMobile && (
        <Card className="glass-subtle border-border/60">
          <ProjectDetail />
        </Card>
      )}

      {/* Project Detail View - Mobile Sheet */}
      {selectedProject && isMobile && (
        <Sheet open={mobileDetailOpen} onOpenChange={(open) => { setMobileDetailOpen(open); if (!open) setSelectedProject(null); }}>
          <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4 pb-2 border-b border-border/60">
              <SheetTitle className="text-left truncate pr-8">{selectedProject?.name}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <Card className="h-full border-0 shadow-none flex flex-col overflow-hidden bg-transparent">
                <ProjectDetail />
              </Card>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Kanban View */}
      {!selectedProject && view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {kanbanGroups.map(group => (
            <div key={group.label} className="flex-shrink-0 w-64 md:w-72">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group.label}</span>
                <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{group.projects.length}</span>
              </div>
              <div className="space-y-3">
                {group.projects.length === 0 && (
                  <div className="h-24 rounded-lg border border-dashed border-border/40 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">No projects</p>
                  </div>
                )}
                {group.projects.map(project => (
                  <div
                    key={project.id}
                    className="p-3 rounded-lg border border-border/60 bg-card hover:border-border hover:shadow-sm cursor-pointer transition-all"
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground line-clamp-2">{project.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{project.customer}</p>
                      </div>
                      <Badge className={cn("text-[9px] flex-shrink-0", riskConfig[project.risk as keyof typeof riskConfig]?.badge)}>
                        {project.risk}
                      </Badge>
                    </div>
                    {project.aiInsight && (
                      <p className="text-[10px] text-muted-foreground mb-2 line-clamp-1 flex items-start gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="truncate">{project.aiInsight.substring(0, 50)}...</span>
                      </p>
                    )}
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{project.progress}%</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", riskConfig[project.risk as keyof typeof riskConfig]?.bar)}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1 truncate"><MapPin className="w-2.5 h-2.5 flex-shrink-0" />{project.phase}</span>
                      <span className="flex-shrink-0">{formatCurrency(project.budget)}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {project.team.slice(0, 3).map((m, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary border border-background">
                          {m.split(" ").map(n => n[0]).join("")}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] text-muted-foreground">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button className="w-full h-8 rounded-lg border border-dashed border-border/40 text-[10px] text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1">
                  <Plus className="w-3 h-3" /> Add Project
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!selectedProject && view === "list" && (
        <Card className="glass-subtle border-border/60 overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border/60">
                  {["Project", "Customer", "Progress", "Budget", "Risk", "PM", "Status"].map(h => (
                    <th key={h} className="text-left p-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id} className="border-b border-border/40 hover:bg-muted cursor-pointer transition-colors" onClick={() => handleSelectProject(project)}>
                    <td className="p-3">
                      <p className="text-xs font-medium text-foreground truncate max-w-[150px]">{project.name}</p>
                      <p className="text-[10px] text-muted-foreground">{project.phase}</p>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground truncate max-w-[100px]">{project.customer}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs text-foreground whitespace-nowrap">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-foreground font-medium whitespace-nowrap">{formatCurrency(project.budget)}</td>
                    <td className="p-3">
                      <Badge className={cn("text-[9px]", riskConfig[project.risk as keyof typeof riskConfig]?.badge)}>
                        {project.risk}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground truncate max-w-[80px]">{project.pm}</td>
                    <td className="p-3">
                      <Badge className={cn("text-[9px]", statusConfig[project.status as keyof typeof statusConfig]?.badge)}>
                        {project.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Gantt View */}
      {!selectedProject && view === "gantt" && (
        <Card className="glass-subtle border-border/60 overflow-hidden">
          <CardContent className="p-4 md:p-5 overflow-x-auto">
            <div className="min-w-[600px] md:min-w-[800px] space-y-2">
              <div className="flex">
                <div className="w-32 md:w-48 flex-shrink-0 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pb-2">Project</div>
                <div className="flex-1 flex text-[10px] text-muted-foreground pb-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                    <div key={m} className="flex-1 text-center">{m}</div>
                  ))}
                </div>
              </div>
              {projects.map((project) => {
                const start = parseInt(project.startDate.split("-")[1]) - 1;
                const end = parseInt(project.endDate.split("-")[1]);
                const width = ((end - start) / 12) * 100;
                const left = (start / 12) * 100;
                return (
                  <div key={project.id} className="flex items-center group cursor-pointer" onClick={() => handleSelectProject(project)}>
                    <div className="w-32 md:w-48 flex-shrink-0 pr-3">
                      <p className="text-xs font-medium text-foreground truncate">{project.name}</p>
                      <p className="text-[10px] text-muted-foreground">{project.pm}</p>
                    </div>
                    <div className="flex-1 relative h-7 bg-muted rounded-md">
                      <div
                        className={cn("absolute top-1 h-5 rounded flex items-center px-2 text-[10px] text-white font-medium transition-all group-hover:opacity-90",
                          riskConfig[project.risk as keyof typeof riskConfig]?.bar
                        )}
                        style={{ left: `${left}%`, width: `${width}%` }}
                      >
                        <span className="truncate">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
