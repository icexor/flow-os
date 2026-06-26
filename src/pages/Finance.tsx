import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign, TrendingUp, ArrowDownRight,
  Eye,
  Download, Plus, Sparkles, Building,
  Send
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  PieChart as RPieChart, Pie, Cell
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { finances, revenueData, cashFlowData } from "@/lib/data";

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const invoiceStatus = {
  paid: { badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  outstanding: { badge: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  overdue: { badge: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const tabs = ["Overview", "Invoices", "Budgets", "Expenses", "Payroll", "Forecast"];

interface FinanceProps {
  onNavigate?: (page: string) => void;
}

const expenseData = [
  { category: "Labor", amount: 1420000, pct: 48 },
  { category: "Materials", amount: 880000, pct: 30 },
  { category: "Equipment", amount: 295000, pct: 10 },
  { category: "Subcontractors", amount: 210000, pct: 7 },
  { category: "Overhead", amount: 135000, pct: 5 },
];

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-5)" },
};

const cashConfig = {
  inflow: { label: "Inflow", color: "var(--chart-2)" },
  outflow: { label: "Outflow", color: "var(--chart-5)" },
};

export function Finance({ }: FinanceProps) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Finance</h2>
          <p className="text-xs text-muted-foreground">Real-time financial intelligence · AI-powered forecasting</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8"><Download className="w-3 h-3" /><span className="hidden sm:inline">Export</span></Button>
          <Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" /><span className="hidden sm:inline">New Invoice</span></Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/60 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-shrink-0 text-sm px-4 py-2 border-b-2 transition-all",
              activeTab === tab ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="space-y-4">
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Monthly Revenue", value: "$4.28M", change: "+12.4%", positive: true, icon: TrendingUp, color: "text-blue-400 bg-blue-500/15" },
              { label: "Monthly Expenses", value: "$2.94M", change: "+3.2%", positive: false, icon: ArrowDownRight, color: "text-red-400 bg-red-500/15" },
              { label: "Net Profit", value: "$1.34M", change: "+24.1%", positive: true, icon: DollarSign, color: "text-emerald-400 bg-emerald-500/15" },
              { label: "Cash Balance", value: "$3.12M", change: "-2.1%", positive: false, icon: Building, color: "text-purple-400 bg-purple-500/15" },
            ].map(kpi => (
              <Card key={kpi.label} className="glass-subtle border-border/60">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={cn("w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center", kpi.color.split(" ")[1])}>
                      <kpi.icon className={cn("w-3.5 h-3.5 md:w-4 md:h-4", kpi.color.split(" ")[0])} />
                    </div>
                    <span className={cn("text-xs font-medium", kpi.positive ? "text-emerald-400" : "text-red-400")}>
                      {kpi.change}
                    </span>
                  </div>
                  <p className="text-base md:text-xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-1 lg:col-span-2 glass-subtle border-border/60">
              <CardHeader className="pb-2 pt-4 px-4 md:px-5">
                <CardTitle className="text-sm font-semibold text-foreground">Revenue & Expenses Trend</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-5 pb-4">
                <ChartContainer config={revenueConfig} className="h-44">
                  <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000000}M`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="var(--chart-5)" radius={[4, 4, 0, 0]} opacity={0.7} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="glass-subtle border-border/60">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-center justify-center mb-3">
                  <RPieChart width={120} height={120}>
                    <Pie data={expenseData} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="amount" paddingAngle={2}>
                      {expenseData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                  </RPieChart>
                </div>
                <div className="space-y-1.5">
                  {expenseData.map((e, i) => (
                    <div key={e.category} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-[10px] text-muted-foreground flex-1 truncate">{e.category}</span>
                      <span className="text-[10px] font-medium text-foreground">{e.pct}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow */}
          <Card className="glass-subtle border-border/60">
            <CardHeader className="pb-2 pt-4 px-4 md:px-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-sm font-semibold text-foreground">Cash Flow - Current Month</CardTitle>
                <div className="flex items-center gap-1 text-xs flex-wrap">
                  <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Inflow</span>
                  <span className="ml-2 flex items-center gap-1 text-red-400"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Outflow</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 md:px-5 pb-4">
              <ChartContainer config={cashConfig} className="h-32">
                <BarChart data={cashFlowData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000000}M`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="inflow" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outflow" fill="var(--chart-5)" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "Invoices" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-2 sm:gap-4 text-xs flex-wrap">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Paid: $1.66M</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />Outstanding: $1.52M</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />Overdue: $340K</span>
            </div>
            <Button size="sm" className="gap-1.5 text-xs h-7 flex-shrink-0"><Plus className="w-3 h-3" />New Invoice</Button>
          </div>
          <Card className="glass-subtle border-border/60 overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border/60">
                    {["Invoice #", "Customer", "Amount", "Due Date", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left p-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {finances.invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-border/40 hover:bg-muted transition-colors">
                      <td className="p-3 text-xs font-medium text-primary whitespace-nowrap">{inv.number}</td>
                      <td className="p-3 text-xs text-foreground truncate max-w-[150px]">{inv.customer}</td>
                      <td className="p-3 text-xs font-semibold text-foreground whitespace-nowrap">{formatCurrency(inv.amount)}</td>
                      <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{inv.dueDate}</td>
                      <td className="p-3">
                        <Badge className={cn("text-[9px] border", invoiceStatus[inv.status as keyof typeof invoiceStatus]?.badge)}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Eye className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hidden sm:flex"><Send className="w-3 h-3" /></Button>
                          {inv.status === "overdue" && (
                            <Button size="sm" className="h-6 text-[10px] px-2 bg-red-600 hover:bg-red-700 text-white">Collect</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "Budgets" && (
        <div className="space-y-3">
          {finances.budgets.map(budget => {
            const pct = Math.round(budget.spent / budget.total * 100);
            const isOverrun = pct > 85;
            return (
              <Card key={budget.project} className="glass-subtle border-border/60">
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{budget.project}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>Total: {formatCurrency(budget.total)}</span>
                        <span>Spent: {formatCurrency(budget.spent)}</span>
                        <span className="hidden sm:inline">Committed: {formatCurrency(budget.committed)}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className={cn("text-sm font-bold", isOverrun ? "text-orange-400" : "text-emerald-400")}>
                        {pct}% used
                      </p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(budget.remaining)} remaining</p>
                    </div>
                  </div>
                  <Progress value={pct} className={cn("h-2", isOverrun && "[&>div]:bg-orange-500")} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {(activeTab === "Expenses" || activeTab === "Payroll" || activeTab === "Forecast") && (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">{activeTab} Module</p>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            AI-powered {activeTab.toLowerCase()} management. All data collected and processed automatically.
          </p>
          <Button size="sm" className="text-xs gap-1.5">
            <Sparkles className="w-3 h-3" />Generate {activeTab} Report
          </Button>
        </div>
      )}
    </div>
  );
}
