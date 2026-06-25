import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Zap, Plus, Play, Settings, Clock, CheckCircle,
  MoreHorizontal,
  TrendingUp, ArrowRight, GitBranch
} from "lucide-react";
import { automationWorkflows } from "@/lib/data";

const nodeTypes = [
  { category: "Triggers", items: ["Email Received", "File Upload", "Schedule", "Webhook", "Real-time Monitor", "Form Submit"], color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { category: "AI Actions", items: ["Classify", "Extract Data", "Summarize", "Generate Text", "Risk Analysis", "OCR"], color: "bg-primary/15 text-primary border-primary/30" },
  { category: "Conditions", items: ["If/Else", "Switch", "Loop", "Filter", "Merge", "Split"], color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  { category: "Integrations", items: ["Email", "WhatsApp", "Slack", "ClickUp", "Google", "OpenAI"], color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { category: "Actions", items: ["Create Task", "Approval", "Invoice", "Notify", "Report", "Update Record"], color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
];

interface AutomationProps {
  onNavigate: (page: string) => void;
}

export function Automation({ }: AutomationProps) {
  const [activeWorkflow, setActiveWorkflow] = useState<typeof automationWorkflows[0] | null>(null);
  const [activeTab, setActiveTab] = useState<"workflows" | "builder">("workflows");

  const WorkflowVisual = ({ workflow }: { workflow: typeof automationWorkflows[0] }) => {
    const allNodes = [...workflow.triggers, ...workflow.actions];
    return (
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
        {allNodes.map((node, i) => (
          <React.Fragment key={node}>
            <div className={cn(
              "flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border",
              i < workflow.triggers.length
                ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                : i === workflow.triggers.length
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            )}>
              {node}
            </div>
            {i < allNodes.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Automation Center</h2>
          <p className="text-xs text-muted-foreground">Visual workflow builder · {automationWorkflows.filter(w => w.status === "active").length} active automations running</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab("workflows")}
              className={cn("text-xs px-3 py-1 rounded-md transition-all", activeTab === "workflows" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Workflows
            </button>
            <button
              onClick={() => setActiveTab("builder")}
              className={cn("text-xs px-3 py-1 rounded-md transition-all", activeTab === "builder" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Builder
            </button>
          </div>
          <Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" />New Workflow</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Runs", value: "26,761", sub: "All time", color: "text-blue-400" },
          { label: "Active Workflows", value: "3", sub: "Running now", color: "text-emerald-400" },
          { label: "Avg Success Rate", value: "97.1%", sub: "Last 30 days", color: "text-purple-400" },
          { label: "Hours Saved", value: "2,847", sub: "This quarter", color: "text-orange-400" },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-lg glass-subtle border-border/60">
            <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
            <p className="text-xs font-medium text-foreground">{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {activeTab === "workflows" && (
        <div className="space-y-3">
          {automationWorkflows.map(workflow => (
            <Card
              key={workflow.id}
              className={cn(
                "glass-subtle border-border/60 cursor-pointer hover:border-border transition-all",
                activeWorkflow?.id === workflow.id && "border-primary/40"
              )}
              onClick={() => setActiveWorkflow(workflow === activeWorkflow ? null : workflow)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                      workflow.status === "active" ? "bg-emerald-500/15" : "bg-muted"
                    )}>
                      <Zap className={cn("w-4 h-4", workflow.status === "active" ? "text-emerald-400" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{workflow.name}</p>
                        <Badge className={cn("text-[9px] border",
                          workflow.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch checked={workflow.status === "active"} className="scale-75" />
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={e => e.stopPropagation()}>
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <WorkflowVisual workflow={workflow} />

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Play className="w-3 h-3" />{workflow.runs.toLocaleString()} runs</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last: {workflow.lastRun}</span>
                  <span className={cn("flex items-center gap-1 ml-auto", workflow.successRate > 95 ? "text-emerald-400" : "text-orange-400")}>
                    <CheckCircle className="w-3 h-3" />{workflow.successRate}% success
                  </span>
                </div>

                {activeWorkflow?.id === workflow.id && (
                  <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-2">
                    <Button size="sm" className="text-xs h-7 gap-1"><Play className="w-3 h-3" />Run Now</Button>
                    <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><Settings className="w-3 h-3" />Configure</Button>
                    <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><TrendingUp className="w-3 h-3" />View Logs</Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 ml-auto gap-1 text-red-400 hover:text-red-400 hover:bg-red-500/10">
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "builder" && (
        <div className="flex gap-4">
          {/* Node Palette */}
          <Card className="w-52 flex-shrink-0 glass-subtle border-border/60 h-[500px] overflow-y-auto scrollbar-hide">
            <CardHeader className="py-3 px-3">
              <CardTitle className="text-xs font-semibold text-foreground">Node Library</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-3">
              {nodeTypes.map(category => (
                <div key={category.category}>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{category.category}</p>
                  <div className="space-y-1">
                    {category.items.map(item => (
                      <div
                        key={item}
                        className={cn("px-2 py-1.5 rounded-md border text-[11px] font-medium cursor-pointer hover:opacity-80 transition-opacity", category.color)}
                        draggable
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card className="flex-1 glass-subtle border-border/60 h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="w-8 h-8 text-primary/60" />
                </div>
                <p className="text-sm font-medium text-foreground">Visual Workflow Builder</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Drag nodes from the library to build automations. Connect triggers, AI actions, and outputs.
                </p>
                <Button size="sm" className="mt-4 gap-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" />Start with Template
                </Button>
              </div>
            </div>
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }} />
          </Card>
        </div>
      )}
    </div>
  );
}
