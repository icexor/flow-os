import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Database, Brain, CheckCircle, Zap, TrendingUp, Globe, Activity, Bot } from "lucide-react";

const pipelineSteps = [
  {
    id: 1,
    title: "Data Sources",
    icon: Database,
    color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    glow: "shadow-blue-500/20",
    items: ["Emails & WhatsApp", "Site Photos & Videos", "Invoices & Documents", "ClickUp & Google", "Field Reports", "GPS & Sensors"],
    desc: "Every touchpoint in your business feeds into FlowOS automatically",
  },
  {
    id: 2,
    title: "AI Understanding",
    icon: Brain,
    color: "bg-primary/15 text-primary border-primary/30",
    glow: "shadow-primary/20",
    items: ["Natural Language Processing", "Computer Vision", "OCR & Document Parsing", "Sentiment Analysis", "Pattern Recognition"],
    desc: "AI reads, understands, and interprets every piece of information",
  },
  {
    id: 3,
    title: "Classification",
    icon: Sparkles,
    color: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    glow: "shadow-purple-500/20",
    items: ["Priority Scoring", "Project Association", "Customer Linking", "Risk Assessment", "Confidence Rating"],
    desc: "Every item is classified, tagged, and routed to the right place",
  },
  {
    id: 4,
    title: "Task Generation",
    icon: Zap,
    color: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    glow: "shadow-orange-500/20",
    items: ["Auto-create Tasks", "Draft Emails", "Generate Reports", "Create Invoices", "Schedule Meetings"],
    desc: "AI prepares everything — humans only review and approve",
  },
  {
    id: 5,
    title: "Human Approval",
    icon: CheckCircle,
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    items: ["Review Queue", "One-Click Approve", "Edit & Refine", "Reject & Explain", "Audit Trail"],
    desc: "You stay in control — every AI action requires your sign-off",
  },
  {
    id: 6,
    title: "Automation",
    icon: Activity,
    color: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    glow: "shadow-pink-500/20",
    items: ["Execute Actions", "Send Notifications", "Update Systems", "Trigger Workflows", "Log Everything"],
    desc: "Approved actions execute instantly across all connected systems",
  },
  {
    id: 7,
    title: "Knowledge Base",
    icon: Globe,
    color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    glow: "shadow-cyan-500/20",
    items: ["Learn from Outcomes", "Build Context", "Historical Patterns", "Company Memory", "Continuous Improvement"],
    desc: "FlowOS learns from every decision to get smarter over time",
  },
  {
    id: 8,
    title: "Business Intelligence",
    icon: TrendingUp,
    color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    glow: "shadow-yellow-500/20",
    items: ["Real-time Dashboards", "Predictive Analytics", "Risk Forecasts", "Revenue Projections", "Performance Insights"],
    desc: "Complete visibility into every aspect of your business",
  },
];

interface AIDataFlowProps {
  onNavigate: (page: string) => void;
}

export function AIDataFlow({ onNavigate }: AIDataFlowProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (!animating) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % pipelineSteps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [animating]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          How <span className="text-gradient-blue">FlowOS</span> Works
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm">
          An AI-powered operating system where data flows automatically through your entire business.
          Humans stay in the loop only for approvals.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button size="sm" onClick={() => setAnimating(!animating)} variant="outline" className="text-xs h-8">
            {animating ? "Pause Animation" : "Resume"}
          </Button>
          <Button size="sm" className="text-xs h-8 gap-1.5" onClick={() => onNavigate("dashboard")}>
            <Sparkles className="w-3.5 h-3.5" />See Live Demo
          </Button>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-4">
          {pipelineSteps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i;
            const isPast = activeStep > i;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-full p-4 rounded-xl border cursor-pointer transition-all duration-500",
                    step.color,
                    isActive && `shadow-xl ${step.glow} scale-105`,
                    isPast && "opacity-70"
                  )}
                  onClick={() => { setActiveStep(i); setAnimating(false); }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={cn("w-5 h-5 flex-shrink-0", step.color.split(" ")[1])} />
                    <span className="text-xs font-bold text-foreground">{step.title}</span>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-current animate-pulse" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2">{step.desc}</p>
                  <div className="space-y-1">
                    {step.items.map(item => (
                      <div key={item} className="flex items-center gap-1.5 text-[10px] text-foreground/70">
                        <div className={cn("w-1 h-1 rounded-full flex-shrink-0", step.color.split(" ")[1].replace("text-", "bg-"))} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow between steps */}
                {i < pipelineSteps.length - 1 && (i + 1) % 4 !== 0 && (
                  <div className="hidden" />
                )}
              </div>
            );
          })}
        </div>

        {/* Flow indicator */}
        <div className="mt-6 flex items-center justify-between px-2">
          {pipelineSteps.map((step, i) => (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all",
                  activeStep === i ? "border-primary bg-primary text-primary-foreground scale-110" :
                  activeStep > i ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" :
                  "border-border bg-muted text-muted-foreground"
                )}
                onClick={() => { setActiveStep(i); setAnimating(false); }}
              >
                {activeStep > i ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {i < pipelineSteps.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-1 transition-all duration-500", activeStep > i ? "bg-emerald-500" : "bg-border")} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Active Step Detail */}
      {pipelineSteps[activeStep] && (
        <Card className="glass-subtle border-border/60">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", pipelineSteps[activeStep].color)}>
                {React.createElement(pipelineSteps[activeStep].icon, { className: "w-6 h-6" })}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-foreground">Step {activeStep + 1}: {pipelineSteps[activeStep].title}</h3>
                  <Badge className={cn("text-[10px] border", pipelineSteps[activeStep].color)}>Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{pipelineSteps[activeStep].desc}</p>
                <div className="flex flex-wrap gap-2">
                  {pipelineSteps[activeStep].items.map(item => (
                    <Badge key={item} variant="outline" className="text-xs">{item}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: "Zero Manual Entry", desc: "AI captures and processes all data automatically", icon: "🤖", color: "text-blue-400" },
          { title: "Human Oversight", desc: "Every AI action requires your approval before execution", icon: "👁️", color: "text-emerald-400" },
          { title: "Continuous Learning", desc: "FlowOS gets smarter with every decision you make", icon: "🧠", color: "text-purple-400" },
        ].map(b => (
          <div key={b.title} className="p-4 rounded-xl glass-subtle border-border/60 text-center">
            <div className="text-3xl mb-2">{b.icon}</div>
            <h3 className={cn("text-sm font-bold mb-1", b.color)}>{b.title}</h3>
            <p className="text-xs text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
