import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Search, Plus, ChevronRight,
  Phone, Mail, MapPin, Building, Calendar, DollarSign,
  MessageSquare, FileText, FolderKanban, Sparkles, Activity
} from "lucide-react";
import { customers } from "@/lib/data";

interface CustomersProps {
  onNavigate: (page: string) => void;
}

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const healthColor = (score: number) => {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-orange-400";
  return "text-red-400";
};

const statusBadge = (status: string) => {
  if (status === "active") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (status === "at-risk") return "bg-red-500/20 text-red-400 border-red-500/30";
  return "bg-muted text-muted-foreground";
};

export function Customers({ onNavigate }: CustomersProps) {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = ["overview", "projects", "invoices", "meetings", "documents", "timeline"];

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Customer List */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Customers</h2>
            <p className="text-xs text-muted-foreground">{customers.length} total accounts</p>
          </div>
          <Button size="sm" className="h-8 gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
          {filtered.map(customer => (
            <div
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all",
                selectedCustomer.id === customer.id
                  ? "border-primary/40 bg-primary/8"
                  : "border-border/60 bg-card hover:border-border hover:bg-muted"
              )}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {customer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground truncate">{customer.name}</p>
                    <Badge className={cn("text-[9px] h-4 px-1 border", statusBadge(customer.status))}>
                      {customer.status}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{customer.contact}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium text-foreground">{formatCurrency(customer.totalValue)}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className={cn("text-[10px] font-medium", healthColor(customer.healthScore))}>
                      Health: {customer.healthScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Detail */}
      <Card className="flex-1 glass-subtle border-border/60 flex flex-col overflow-hidden">
        {selectedCustomer && (
          <>
            {/* Header */}
            <div className="p-5 border-b border-border/60">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                    {selectedCustomer.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-foreground">{selectedCustomer.name}</h2>
                      <Badge className={cn("text-[10px]", statusBadge(selectedCustomer.status))}>
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Building className="w-3 h-3" />{selectedCustomer.type}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedCustomer.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Since {selectedCustomer.since}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedCustomer.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[9px] h-4 px-1.5">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                    <Phone className="w-3 h-3" /> Call
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                    <Mail className="w-3 h-3" /> Email
                  </Button>
                  <Button size="sm" className="gap-1.5 text-xs h-8">
                    <MessageSquare className="w-3 h-3" /> Message
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-5 border-b border-border/60 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-shrink-0 text-xs px-3 py-2.5 capitalize border-b-2 transition-all",
                    activeTab === tab
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* KPI Row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Total Value", value: formatCurrency(selectedCustomer.totalValue), icon: DollarSign, color: "text-blue-400" },
                      { label: "Projects", value: selectedCustomer.projects, icon: FolderKanban, color: "text-purple-400" },
                      { label: "Health Score", value: `${selectedCustomer.healthScore}/100`, icon: Activity, color: healthColor(selectedCustomer.healthScore) },
                      { label: "Contact", value: selectedCustomer.contact, icon: Building, color: "text-orange-400" },
                    ].map(kpi => (
                      <div key={kpi.label} className="p-3 rounded-lg bg-muted border border-border/40">
                        <kpi.icon className={cn("w-4 h-4 mb-1.5", kpi.color)} />
                        <p className="text-sm font-bold text-foreground">{kpi.value}</p>
                        <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI Summary */}
                  <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary">AI Customer Summary</span>
                    </div>
                    <p className="text-sm text-foreground/80">{selectedCustomer.aiSummary}</p>
                  </div>

                  {/* Health Score breakdown */}
                  <Card className="border-border/40 bg-muted">
                    <CardHeader className="pb-2 pt-3 px-4">
                      <CardTitle className="text-sm">Customer Health Score: {selectedCustomer.healthScore}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-2.5">
                      {[
                        { label: "Payment History", score: selectedCustomer.healthScore + 5 > 100 ? 100 : selectedCustomer.healthScore + 5 },
                        { label: "Communication", score: selectedCustomer.healthScore - 3 },
                        { label: "Project Satisfaction", score: selectedCustomer.healthScore + 2 > 100 ? 100 : selectedCustomer.healthScore + 2 },
                        { label: "Contract Compliance", score: selectedCustomer.healthScore },
                      ].map(m => (
                        <div key={m.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{m.label}</span>
                            <span className={healthColor(m.score)}>{m.score}</span>
                          </div>
                          <Progress value={m.score} className="h-1.5" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card className="border-border/40 bg-muted">
                    <CardContent className="p-4 grid grid-cols-2 gap-3">
                      {[
                        { label: "Contact Person", value: selectedCustomer.contact, icon: Building },
                        { label: "Email", value: selectedCustomer.email, icon: Mail },
                        { label: "Phone", value: selectedCustomer.phone, icon: Phone },
                        { label: "Location", value: selectedCustomer.location, icon: MapPin },
                      ].map(info => (
                        <div key={info.label} className="flex items-start gap-2">
                          <info.icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-muted-foreground">{info.label}</p>
                            <p className="text-xs font-medium text-foreground">{info.value}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-foreground">{selectedCustomer.projects} Active Projects</p>
                    <Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3 h-3" />New Project</Button>
                  </div>
                  {Array.from({ length: selectedCustomer.projects }, (_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border/60 bg-card hover:border-border cursor-pointer" onClick={() => onNavigate("projects")}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">Project {String.fromCharCode(65 + i)} - {selectedCustomer.name}</p>
                        <Badge className="text-[9px] bg-blue-500/20 text-blue-400 border-blue-500/30">In Progress</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>PM: Carlos Rivera</span>
                        <span>·</span>
                        <span>$2.4M Budget</span>
                      </div>
                      <Progress value={40 + i * 15} className="h-1 mt-2" />
                    </div>
                  ))}
                </div>
              )}

              {(activeTab === "invoices" || activeTab === "meetings" || activeTab === "documents" || activeTab === "timeline") && (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground capitalize">{activeTab}</p>
                  <p className="text-xs text-muted-foreground">AI-powered {activeTab} management</p>
                  <Button size="sm" className="text-xs" onClick={() => onNavigate(activeTab === "invoices" ? "finance" : activeTab === "documents" ? "documents" : "inbox")}>
                    Open {activeTab} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
