import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, AlertTriangle,
  Activity, ChevronRight, Settings,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { aiAgents, approvalQueue } from "@/lib/data";

const agentColorMap: Record<string, { bg: string; text: string; glow: string }> = {
  blue: { bg: "bg-blue-500/15", text: "text-blue-400", glow: "shadow-blue-500/20" },
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
  purple: { bg: "bg-purple-500/15", text: "text-purple-400", glow: "shadow-purple-500/20" },
  orange: { bg: "bg-orange-500/15", text: "text-orange-400", glow: "shadow-orange-500/20" },
  yellow: { bg: "bg-yellow-500/15", text: "text-yellow-400", glow: "shadow-yellow-500/20" },
  red: { bg: "bg-red-500/15", text: "text-red-400", glow: "shadow-red-500/20" },
};

interface AIAgentsProps {
  onNavigate: (page: string) => void;
}

export function AIAgents({ onNavigate }: AIAgentsProps) {
  const [selectedAgent, setSelectedAgent] = useState<typeof aiAgents[0] | null>(null);

  const historyLogs = [
    { time: "09:42", action: "Processed 24 new photos from Marina Complex site", status: "success" },
    { time: "09:38", action: "Generated draft escalation letter for Pinnacle Hotels", status: "pending" },
    { time: "09:15", action: "Updated cash flow forecast with June actuals", status: "success" },
    { time: "08:52", action: "Detected structural anomaly in Marina foundation photo", status: "alert" },
    { time: "08:30", action: "Reconciled 34 vendor invoices automatically", status: "success" },
    { time: "07:00", action: "Generated weekly executive summary report", status: "success" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">AI Agents</h2>
          <p className="text-xs text-muted-foreground">6 specialized agents · All running 24/7 · Human oversight enabled</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8"><Settings className="w-3 h-3" />Configure</Button>
          <Button size="sm" className="gap-1.5 text-xs h-8"><Sparkles className="w-3 h-3" />Deploy Agent</Button>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Tasks Completed Today", value: "3,834", sub: "Across all agents", color: "text-blue-400" },
          { label: "Pending Approvals", value: "7", sub: "Need human review", color: "text-orange-400" },
          { label: "Average Confidence", value: "93.2%", sub: "Accuracy rate", color: "text-emerald-400" },
          { label: "Hours Automated", value: "847h", sub: "This month", color: "text-purple-400" },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-lg glass-subtle border-border/60">
            <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs font-medium text-foreground">{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Agent Cards */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {aiAgents.map(agent => {
            const colors = agentColorMap[agent.color] || agentColorMap.blue;
            const isSelected = selectedAgent?.id === agent.id;
            return (
              <Card
                key={agent.id}
                className={cn(
                  "glass-subtle cursor-pointer transition-all hover:border-border",
                  isSelected ? "border-primary/40 shadow-lg" : "border-border/60"
                )}
                onClick={() => setSelectedAgent(isSelected ? null : agent)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0", colors.bg)}>
                        {agent.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", agent.status === "active" ? "bg-emerald-500" : "bg-muted-foreground")} />
                          <span className={cn("text-[10px] font-medium", agent.status === "active" ? "text-emerald-400" : "text-muted-foreground")}>
                            {agent.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); }}>
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-1 mb-3">{agent.currentTask}</p>

                  <div className="space-y-2 mb-3">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className={cn("font-medium", colors.text)}>{agent.confidence}%</span>
                      </div>
                      <Progress value={agent.confidence} className="h-1" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>{agent.tasksCompleted.toLocaleString()} tasks</span>
                      {agent.pendingApprovals > 0 && (
                        <span className="flex items-center gap-0.5 text-orange-400">
                          <AlertTriangle className="w-2.5 h-2.5" />{agent.pendingApprovals} pending
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{agent.lastActivity}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Agent Detail / Activity Feed */}
        <div className="w-72 flex-shrink-0 space-y-3">
          {selectedAgent ? (
            <Card className="glass-subtle border-border/60">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{selectedAgent.name}</p>
                  <button onClick={() => setSelectedAgent(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
                </div>

                <p className="text-xs text-muted-foreground">{selectedAgent.description}</p>

                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                  <p className="text-[10px] font-semibold text-primary mb-1">Current Task</p>
                  <p className="text-xs text-foreground/80">{selectedAgent.currentTask}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Tasks Done", value: selectedAgent.tasksCompleted.toLocaleString() },
                    { label: "Confidence", value: `${selectedAgent.confidence}%` },
                    { label: "Pending", value: selectedAgent.pendingApprovals },
                    { label: "Last Active", value: selectedAgent.lastActivity },
                  ].map(m => (
                    <div key={m.label} className="p-2 rounded-lg bg-muted">
                      <p className="text-[9px] text-muted-foreground">{m.label}</p>
                      <p className="text-xs font-medium text-foreground">{m.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 text-xs h-7 gap-1">
                    <Eye className="w-3 h-3" />Review
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-7 gap-1">
                    <Settings className="w-3 h-3" />Config
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card className="glass-subtle border-border/60">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-primary" />
                Live Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2.5">
              {historyLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                    log.status === "success" ? "bg-emerald-500" :
                    log.status === "alert" ? "bg-red-500" :
                    "bg-orange-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-foreground line-clamp-1">{log.action}</p>
                    <p className="text-[10px] text-muted-foreground">{log.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="glass-subtle border-border/60">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                Pending Approvals
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[9px]">7</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {approvalQueue.slice(0, 3).map(item => (
                <div key={item.id} className="p-2 rounded-lg bg-muted hover:bg-muted cursor-pointer transition-colors" onClick={() => onNavigate("administration")}>
                  <p className="text-[11px] font-medium text-foreground line-clamp-1">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground">AI {item.confidence}% · Due in {item.dueBy}</p>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full text-xs h-7" onClick={() => onNavigate("administration")}>
                View All <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
