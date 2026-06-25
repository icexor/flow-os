import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Plus, Sparkles, Clock,
  CheckCircle, Circle, User,
  MessageSquare, Paperclip, Calendar, Zap,
  Edit, Play, MoreHorizontal
} from "lucide-react";
import { tasks } from "@/lib/data";

const priorityConfig = {
  urgent: { badge: "bg-red-500/20 text-red-400 border-red-500/30", dot: "bg-red-500", bar: "bg-red-500" },
  high: { badge: "bg-orange-500/20 text-orange-400 border-orange-500/30", dot: "bg-orange-500", bar: "bg-orange-500" },
  medium: { badge: "bg-blue-500/20 text-blue-400 border-blue-500/30", dot: "bg-blue-500", bar: "bg-blue-500" },
  low: { badge: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground", bar: "bg-muted-foreground" },
};

const statusConfig = {
  pending: { icon: Circle, color: "text-muted-foreground" },
  "in-progress": { icon: Play, color: "text-blue-400" },
  "ai-ready": { icon: Sparkles, color: "text-primary" },
  scheduled: { icon: Calendar, color: "text-purple-400" },
  completed: { icon: CheckCircle, color: "text-emerald-400" },
};

interface TasksProps {
  onNavigate: (page: string) => void;
}

const allTasks = [
  ...tasks,
  {
    id: "t6", title: "Prepare TechPark Phase 4 - MEP Coordination Report",
    description: "Compile MEP progress and coordinate with all subcontractors for monthly update.",
    priority: "medium" as const, status: "in-progress", deadline: "2024-06-28",
    project: "TechPark Phase 4 Campus", projectId: "p5", customer: "TechPark Realty Trust",
    assignee: "Marcus Webb", dependencies: [], aiSuggestion: "AI can auto-draft this report in 5 minutes using existing data.",
    category: "Reporting",
  },
  {
    id: "t7", title: "Safety walkthrough - I-70 Bridge Section B",
    description: "Weekly safety inspection required by contract.", priority: "high" as const,
    status: "scheduled", deadline: "2024-06-26", project: "I-70 Highway Interchange",
    projectId: "p3", customer: "GreenState Infrastructure", assignee: "Diana Walsh",
    dependencies: [], aiSuggestion: "Last 3 inspections passed. Pre-filled checklist ready.", category: "Safety",
  },
];

export function Tasks({ onNavigate }: TasksProps) {
  const [selectedTask, setSelectedTask] = useState<typeof allTasks[0] | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filters = [
    { id: "all", label: "All Tasks", count: allTasks.length },
    { id: "urgent", label: "Urgent", count: allTasks.filter(t => t.priority === "urgent").length },
    { id: "ai-ready", label: "AI Ready", count: allTasks.filter(t => t.status === "ai-ready").length },
    { id: "pending", label: "Pending", count: allTasks.filter(t => t.status === "pending").length },
    { id: "in-progress", label: "In Progress", count: allTasks.filter(t => t.status === "in-progress").length },
  ];

  const filtered = allTasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchSearch;
    if (filter === "urgent") return t.priority === "urgent" && matchSearch;
    if (filter === "ai-ready") return t.status === "ai-ready" && matchSearch;
    if (filter === "pending") return t.status === "pending" && matchSearch;
    if (filter === "in-progress") return t.status === "in-progress" && matchSearch;
    return matchSearch;
  });

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Left Panel */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Tasks</h2>
            <p className="text-xs text-muted-foreground">{allTasks.length} total · 3 urgent · 1 AI-ready</p>
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs"><Plus className="w-3.5 h-3.5" />Add</Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "text-[11px] px-2 py-0.5 rounded-md transition-all flex items-center gap-1",
                filter === f.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
              <span className={cn("text-[10px] rounded-full px-1", filter === f.id ? "bg-white/20 text-white" : "bg-background text-muted-foreground")}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
          {filtered.map(task => {
            const priority = priorityConfig[task.priority as keyof typeof priorityConfig];
            const status = statusConfig[task.status as keyof typeof statusConfig];
            const StatusIcon = status?.icon || Circle;
            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  selectedTask?.id === task.id
                    ? "border-primary/40 bg-primary/8"
                    : "border-border/60 bg-card hover:border-border hover:bg-muted"
                )}
              >
                <div className="flex items-start gap-2">
                  <StatusIcon className={cn("w-3.5 h-3.5 flex-shrink-0 mt-0.5", status?.color || "text-muted-foreground")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-2">{task.title}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Badge className={cn("text-[9px] h-4 px-1 border", priority?.badge)}>
                        {task.priority}
                      </Badge>
                      {task.status === "ai-ready" && (
                        <Badge className="text-[9px] h-4 px-1 bg-primary/20 text-primary border-primary/30">
                          AI Ready
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><User className="w-2.5 h-2.5" />{task.assignee.split(" ")[0]}</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{task.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Detail */}
      <Card className="flex-1 glass-subtle border-border/60 flex flex-col overflow-hidden">
        {selectedTask ? (
          <>
            <div className="p-5 border-b border-border/60">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={cn("text-[10px] border", priorityConfig[selectedTask.priority as keyof typeof priorityConfig]?.badge)}>
                      {selectedTask.priority}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">{selectedTask.category}</Badge>
                    {selectedTask.status === "ai-ready" && (
                      <Badge className="text-[10px] bg-primary/20 text-primary border-primary/30">AI Ready</Badge>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{selectedTask.title}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="w-7 h-7"><Edit className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
              {/* Description */}
              <div className="p-4 rounded-lg bg-muted border border-border/40">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-foreground/80">{selectedTask.description}</p>
              </div>

              {/* AI Suggestion */}
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">AI Suggestion</span>
                </div>
                <p className="text-sm text-foreground/80">{selectedTask.aiSuggestion}</p>
                {selectedTask.status === "ai-ready" && (
                  <Button size="sm" className="mt-3 text-xs gap-1.5 h-7">
                    <Zap className="w-3 h-3" />
                    Execute with AI
                  </Button>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Assigned To", value: selectedTask.assignee },
                  { label: "Project", value: selectedTask.project },
                  { label: "Customer", value: selectedTask.customer },
                  { label: "Deadline", value: selectedTask.deadline },
                  { label: "Category", value: selectedTask.category },
                  { label: "Status", value: selectedTask.status },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-lg bg-muted border border-border/40">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Comments placeholder */}
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Comments</p>
                <div className="p-3 rounded-lg border border-dashed border-border/40 text-center">
                  <p className="text-xs text-muted-foreground">No comments yet. AI will auto-log all activity.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border/60 flex items-center gap-2">
              <Button size="sm" className="gap-2 flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs gap-2" onClick={() => onNavigate("inbox")}>
                <MessageSquare className="w-3.5 h-3.5" /> Comment
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-2">
                <Paperclip className="w-3.5 h-3.5" /> Attach
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">Select a task to view details</p>
              <p className="text-xs text-muted-foreground mt-1">AI monitors all tasks automatically</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
