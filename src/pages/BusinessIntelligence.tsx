import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, BarChart3, FolderKanban, Star,
  AlertTriangle, Brain, Sparkles,
  RefreshCw
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { revenueData } from "@/lib/data";

const performanceData = [
  { project: "I-70 Interchange", score: 96, budget: 98, timeline: 95, quality: 94 },
  { project: "TechPark Phase 4", score: 87, budget: 92, timeline: 88, quality: 82 },
  { project: "Downtown Tower", score: 78, budget: 85, timeline: 72, quality: 82 },
  { project: "Marina Complex", score: 61, budget: 67, timeline: 58, quality: 72 },
  { project: "Pinnacle Resort", score: 52, budget: 63, timeline: 45, quality: 60 },
];

const radarData = [
  { subject: "Revenue", value: 87 },
  { subject: "Projects", value: 72 },
  { subject: "Customer Sat.", value: 88 },
  { subject: "Efficiency", value: 79 },
  { subject: "Safety", value: 94 },
  { subject: "Quality", value: 83 },
];

const forecastData = [
  { month: "Jul", actual: null, forecast: 4600000 },
  { month: "Aug", actual: null, forecast: 4800000 },
  { month: "Sep", actual: null, forecast: 5100000 },
  { month: "Oct", actual: null, forecast: 4900000 },
  { month: "Nov", actual: null, forecast: 5300000 },
  { month: "Dec", actual: null, forecast: 5800000 },
];

const combinedForecast = [
  ...revenueData.map(d => ({ ...d, forecast: null })),
  ...forecastData,
];

const biTabs = ["Overview", "Revenue", "Projects", "Customers", "Risk", "Forecast"];

const revenueConfig = { revenue: { label: "Revenue", color: "var(--chart-1)" }, forecast: { label: "Forecast", color: "var(--chart-2)" } };

interface BusinessIntelligenceProps {
  onNavigate: (page: string) => void;
}

export function BusinessIntelligence({ }: BusinessIntelligenceProps) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Business Intelligence</h2>
          <p className="text-xs text-muted-foreground">AI-powered analytics · Real-time insights · Predictive forecasting</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8"><RefreshCw className="w-3 h-3" />Refresh</Button>
          <Button size="sm" className="gap-1.5 text-xs h-8"><Sparkles className="w-3 h-3" />AI Insights</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/60">
        {biTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn("text-sm px-4 py-2 border-b-2 transition-all",
              activeTab === tab ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Revenue Growth", value: "+24%", sub: "YoY comparison", icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/15" },
              { label: "Project Success", value: "78%", sub: "On-time delivery", icon: FolderKanban, color: "text-blue-400 bg-blue-500/15" },
              { label: "Customer NPS", value: "72", sub: "Industry avg: 54", icon: Star, color: "text-yellow-400 bg-yellow-500/15" },
              { label: "Risk Score", value: "Medium", sub: "3 critical items", icon: AlertTriangle, color: "text-orange-400 bg-orange-500/15" },
            ].map(kpi => (
              <Card key={kpi.label} className="glass-subtle border-border/60">
                <CardContent className="p-4">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", kpi.color.split(" ")[1])}>
                    <kpi.icon className={cn("w-4 h-4", kpi.color.split(" ")[0])} />
                  </div>
                  <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs font-medium text-foreground">{kpi.label}</p>
                  <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Revenue Trend */}
            <Card className="col-span-2 glass-subtle border-border/60">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold text-foreground">Revenue Trend & Forecast</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <ChartContainer config={revenueConfig} className="h-48">
                  <AreaChart data={combinedForecast}>
                    <defs>
                      <linearGradient id="biRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="biForeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000000}M`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#biRevGrad)" strokeWidth={2} connectNulls={false} />
                    <Area type="monotone" dataKey="forecast" stroke="var(--chart-2)" fill="url(#biForeGrad)" strokeWidth={2} strokeDasharray="4 2" connectNulls={false} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Company Score Radar */}
            <Card className="glass-subtle border-border/60">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground">Business Health Radar</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} />
                    <Radar name="Score" dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card className="glass-subtle border-border/60">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4 grid grid-cols-3 gap-3">
              {[
                { title: "Accelerate Pinnacle Collections", desc: "Outstanding $340K is 47 days past due. Initiate formal collections process before contractor lien risk activates.", impact: "High", type: "risk" },
                { title: "Secure Marina Complex Recovery Plan", desc: "Current 11-day delay requires 3-shift schedule to recover. Cost: ~$85K. Without action, penalty clauses trigger in 19 days.", impact: "High", type: "risk" },
                { title: "Expand TechPark Relationship", desc: "Client has $45M in planned capex. Submitting pre-qualification for Phase 5 now captures preferred contractor discount.", impact: "High", type: "opportunity" },
              ].map(rec => (
                <div key={rec.title} className="p-3 rounded-lg border border-border/60 bg-card">
                  <div className="flex items-start gap-2 mb-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", rec.type === "risk" ? "bg-red-500" : "bg-emerald-500")} />
                    <p className="text-xs font-semibold text-foreground">{rec.title}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{rec.desc}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={cn("text-[9px] border-0", rec.type === "risk" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400")}>
                      {rec.impact} {rec.type}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-5 text-[10px] text-primary p-0">Act Now</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "Projects" && (
        <div className="space-y-4">
          <Card className="glass-subtle border-border/60">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-foreground">Project Performance Scores</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <ChartContainer config={{ score: { label: "Score", color: "var(--chart-1)" }, budget: { label: "Budget", color: "var(--chart-2)" }, timeline: { label: "Timeline", color: "var(--chart-3)" } }} className="h-52">
                <BarChart data={performanceData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} domain={[0, 100]} />
                  <YAxis type="category" dataKey="project" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} axisLine={false} tickLine={false} width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="budget" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="timeline" fill="var(--chart-3)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {(activeTab === "Revenue" || activeTab === "Customers" || activeTab === "Risk" || activeTab === "Forecast") && (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">{activeTab} Analysis</p>
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            Deep {activeTab.toLowerCase()} analytics powered by AI. All data collected and processed automatically.
          </p>
          <Button size="sm" className="text-xs gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />Generate Full {activeTab} Report
          </Button>
        </div>
      )}
    </div>
  );
}
