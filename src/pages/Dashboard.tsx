import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AreaChart, Area, Line,
  XAxis, YAxis, CartesianGrid
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Clock, DollarSign, ArrowDownRight, Bot,
  FolderKanban, Activity, Sparkles, Eye,
  ChevronRight, RefreshCw, Shield, Lock
} from "lucide-react";
import { kpis, revenueData, projects, aiActivityFeed, approvalQueue, tasks } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { getAllowedModules } from "@/lib/permissions";

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function StatCard({
  title, value, change, period, icon: Icon, color, onClick
}: {
  title: string; value: string; change: number; period: string;
  icon: React.ComponentType<{ className?: string }>; color: string; onClick?: () => void;
}) {
  const isPositive = change >= 0;
  return (
    <Card className="glass-subtle border-border/60 hover:border-border transition-all cursor-pointer group dark-glow" onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", color)}>
            <Icon className="w-4 h-4" />
          </div>
          <div className={cn("flex items-center gap-1 text-xs font-medium", isPositive ? "text-emerald-400" : "text-red-400")}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{title} · {period}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { roleData, currentRole, can } = useAuth();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const name = roleData?.user?.split(" ")[0] || "User";
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  }, [roleData]);

  const allowedModules = useMemo(() => {
    return currentRole ? getAllowedModules(currentRole) : [];
  }, [currentRole]);

  const revenueConfig = {
    revenue: { label: "Revenue", color: "var(--chart-1)" },
    expenses: { label: "Expenses", color: "var(--chart-5)" },
    profit: { label: "Profit", color: "var(--chart-2)" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{greeting}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · AI has 12 suggestions for you today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <RefreshCw className="w-3 h-3" />
            Refresh
          </Button>
          <Button size="sm" className="gap-2 text-xs bg-primary hover:bg-primary/90" onClick={() => onNavigate("ai-agents")}>
            <Sparkles className="w-3 h-3" />
            AI Suggestions (12)
          </Button>
        </div>
      </div>

      {/* Role Banner */}
      {roleData && currentRole !== "ceo" && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-500">
          <Shield className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">
              Logged in as <span className="text-primary">{roleData.name}</span> — {allowedModules.length} modules available
            </p>
            <p className="text-[10px] text-muted-foreground">{roleData.description}</p>
          </div>
          <Lock className="w-3 h-3 text-muted-foreground" />
        </div>
      )}

      {/* Company Health Score */}
      <Card className="glass-subtle border-border/60 overflow-hidden dark-glow">
        <CardContent className="p-5">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="32" fill="none"
                  stroke="var(--primary)" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(87 / 100) * 201} 201`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground">87</span>
                <span className="text-[9px] text-muted-foreground">HEALTH</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground">Company Health Score</h3>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Good</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Based on 47 real-time metrics across all business units</p>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Projects", score: 82, color: "bg-blue-500" },
                  { label: "Finance", score: 91, color: "bg-emerald-500" },
                  { label: "Customers", score: 88, color: "bg-purple-500" },
                  { label: "Operations", score: 79, color: "bg-orange-500" },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">{m.label}</span>
                      <span className="text-[10px] font-medium text-foreground">{m.score}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-1000", m.color)} style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              {[
                { label: "Active Projects", value: "18", icon: FolderKanban, color: "text-blue-400" },
                { label: "Pending Reviews", value: "7", icon: Eye, color: "text-orange-400" },
                { label: "AI Actions Today", value: "142", icon: Bot, color: "text-primary" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                  <s.icon className={cn("w-3.5 h-3.5", s.color)} />
                  <span className="text-xs text-muted-foreground">{s.label}:</span>
                  <span className="text-xs font-semibold text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {can("finance", "view") && (
          <>
            <StatCard title="Revenue" value={formatCurrency(kpis.revenue.value)} change={kpis.revenue.change} period={kpis.revenue.period}
              icon={DollarSign} color="bg-blue-500/15 text-blue-400" onClick={() => onNavigate("finance")} />
            <StatCard title="Expenses" value={formatCurrency(kpis.expenses.value)} change={-kpis.expenses.change} period={kpis.expenses.period}
              icon={ArrowDownRight} color="bg-red-500/15 text-red-400" onClick={() => onNavigate("finance")} />
            <StatCard title="Profit" value={formatCurrency(kpis.profit.value)} change={kpis.profit.change} period={kpis.profit.period}
              icon={TrendingUp} color="bg-emerald-500/15 text-emerald-400" onClick={() => onNavigate("finance")} />
            <StatCard title="Cash Flow" value={formatCurrency(kpis.cashFlow.value)} change={kpis.cashFlow.change} period={kpis.cashFlow.period}
              icon={Activity} color="bg-purple-500/15 text-purple-400" onClick={() => onNavigate("finance")} />
          </>
        )}
        {!can("finance", "view") && (
          <div className="col-span-full flex items-center justify-center h-20 text-muted-foreground text-sm">
            <Lock className="w-4 h-4 mr-2" />
            Financial data restricted for your role
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <Card className="col-span-2 glass-subtle border-border/60 dark-glow">
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">Revenue vs Expenses</CardTitle>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Revenue</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Expenses</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Profit</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <ChartContainer config={revenueConfig} className="h-48">
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000000}M`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" stroke="var(--chart-2)" fill="url(#colorProfit)" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="var(--chart-5)" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="glass-subtle border-border/60 dark-glow">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-foreground">Project Status</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-3">
            {[
              { label: "On Track", count: 12, total: 18, color: "bg-emerald-500" },
              { label: "At Risk", count: 3, total: 18, color: "bg-orange-500" },
              { label: "Delayed", count: 2, total: 18, color: "bg-red-500" },
              { label: "Completed", count: 1, total: 18, color: "bg-blue-500" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-xs font-medium text-foreground">{s.count}/{s.total}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", s.color)} style={{ width: `${(s.count / s.total) * 100}%` }} />
                </div>
              </div>
            ))}
            <Separator />
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onNavigate("projects")}>
              View All Projects <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* AI Activity Feed */}
        {can("ai-agents", "view") && (
          <Card className="glass-subtle border-border/60 dark-glow">
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  AI Activity
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-muted-foreground" onClick={() => onNavigate("ai-agents")}>View all</Button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4 space-y-2.5">
              {aiActivityFeed.map(item => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <span className="text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.action}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{item.detail}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Pending Approvals */}
        {can("administration", "view") && (
          <Card className="glass-subtle border-border/60 dark-glow">
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400" />
                  Pending Approvals
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">7</Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4 space-y-2.5">
              {approvalQueue.slice(0, 4).map(item => (
                <div key={item.id} className="flex items-start gap-2.5 p-2 rounded-lg bg-muted hover:bg-muted cursor-pointer transition-colors" onClick={() => onNavigate("administration")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                    item.priority === "urgent" ? "bg-red-400" : item.priority === "high" ? "bg-orange-400" : "bg-blue-400")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">{item.category} · AI {item.confidence}%</p>
                  </div>
                  {item.amount && <span className="text-[10px] font-medium text-foreground flex-shrink-0">{formatCurrency(item.amount)}</span>}
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onNavigate("administration")}>
                Review All <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Today's Tasks */}
        {can("tasks", "view") && (
          <Card className="glass-subtle border-border/60 dark-glow">
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Today's Tasks
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">24</Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4 space-y-2.5">
              {tasks.map(task => (
                <div key={task.id} className="flex items-start gap-2.5 p-2 rounded-lg bg-muted hover:bg-muted cursor-pointer transition-colors" onClick={() => onNavigate("tasks")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                    task.priority === "urgent" ? "bg-red-400" : task.priority === "high" ? "bg-orange-400" : "bg-blue-400")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{task.title}</p>
                    <p className="text-[10px] text-muted-foreground">{task.assignee} · Due {task.deadline}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-[9px] h-4 px-1 border-0 flex-shrink-0",
                    task.priority === "urgent" ? "bg-red-500/20 text-red-400" :
                    task.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                    "bg-blue-500/20 text-blue-400"
                  )}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onNavigate("tasks")}>
                View All Tasks <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Projects at Risk */}
      {can("projects", "view") && (
        <Card className="glass-subtle border-border/60 dark-glow">
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                Projects Requiring Attention
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-muted-foreground" onClick={() => onNavigate("projects")}>View all projects</Button>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {projects.filter(p => p.risk !== "low").map(project => (
                <div key={project.id} className="p-3 rounded-lg border border-border/60 hover:border-border bg-muted hover:bg-muted/40 cursor-pointer transition-all dark-glow" onClick={() => onNavigate("projects")}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs font-medium text-foreground line-clamp-1 flex-1">{project.name}</p>
                    <Badge className={cn("text-[9px] ml-1 flex-shrink-0",
                      project.risk === "high" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    )}>
                      {project.risk}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2 line-clamp-1">{project.customer}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", project.risk === "high" ? "bg-red-500" : "bg-orange-500")} style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2">{project.aiInsight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
