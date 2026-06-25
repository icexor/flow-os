import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hexagon, Sparkles, Eye, EyeOff, Bot, Shield, TrendingUp, ArrowRight, Lock, UserCheck } from "lucide-react";
import { defaultRolePermissions } from "@/lib/permissions";

interface LoginProps {
  onLogin: (role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("arjay_ds@flowos.com");
  const [password, setPassword] = useState("••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ceo");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(selectedRole);
    }, 1200);
  };

  const demoUsers = defaultRolePermissions;

  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case "ceo": return "bg-blue-500";
      case "finance": return "bg-emerald-500";
      case "pm": return "bg-purple-500";
      case "construction": return "bg-orange-500";
      case "worker": return "bg-gray-500";
      case "customer": return "bg-green-500";
      default: return "bg-primary";
    }
  };

  const getRoleBorderColor = (roleId: string, isSelected: boolean) => {
    if (!isSelected) return "border-border/60 bg-card/80 text-muted-foreground hover:border-border hover:text-foreground";
    switch (roleId) {
      case "ceo": return "border-blue-500/50 bg-blue-500/10 text-foreground";
      case "finance": return "border-emerald-500/50 bg-emerald-500/10 text-foreground";
      case "pm": return "border-purple-500/50 bg-purple-500/10 text-foreground";
      case "construction": return "border-orange-500/50 bg-orange-500/10 text-foreground";
      case "worker": return "border-gray-500/50 bg-gray-500/10 text-foreground";
      case "customer": return "border-green-500/50 bg-green-500/10 text-foreground";
      default: return "border-primary/40 bg-primary/10 text-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, var(--primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.04,
        }} />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-2/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
      </div>

      {/* Left Panel */}
      <div className="flex-1 hidden lg:flex flex-col relative overflow-hidden z-10">
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-blue">
              <Hexagon className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">FlowOS</p>
              <p className="text-xs text-muted-foreground">AI Business Operating System</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="mb-auto animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered · Human-First
            </Badge>
            <h1 className="text-5xl font-bold text-foreground leading-tight mb-4">
              Your Business,<br />
              <span className="text-gradient-blue">Automated.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              FlowOS runs your entire company. AI gathers every piece of information,
              prepares every action, and keeps humans in the approval loop.
            </p>
          </div>

          {/* Feature Points */}
          <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
            {[
              { icon: Bot, title: "AI Agents Work 24/7", desc: "Specialized agents handle every department" },
              { icon: Shield, title: "Human Oversight Always", desc: "Every AI action requires your approval" },
              { icon: TrendingUp, title: "Real-time Intelligence", desc: "Live data from all business touchpoints" },
            ].map(feature => (
              <div key={feature.title} className="flex items-start gap-3 p-3 rounded-xl glass-subtle hover:border-primary/30 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
            {[
              { value: "847h", label: "Automated This Month" },
              { value: "97.2%", label: "AI Accuracy" },
              { value: "$4.28M", label: "Revenue Tracked" },
            ].map(stat => (
              <div key={stat.label} className="text-center p-3 rounded-xl glass-subtle">
                <p className="text-2xl font-bold text-gradient-blue">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[480px] flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Hexagon className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-lg font-bold">FlowOS</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your AI Business OS</p>
          </div>

          {/* Demo Role Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Demo: Select Role</p>
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                <UserCheck className="w-3 h-3 mr-1" />
                Role-Based Access
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map(role => (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setEmail(role.email);
                  }}
                  className={cn(
                    "text-left p-2.5 rounded-lg border text-xs transition-all duration-200 relative overflow-hidden",
                    getRoleBorderColor(role.id, selectedRole === role.id)
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-2 h-2 rounded-full", getRoleColor(role.id))} />
                    <p className="font-semibold">{role.name}</p>
                  </div>
                  <p className="text-[10px] opacity-70">{role.user}</p>
                  {selectedRole === role.id && (
                    <div className="absolute top-1.5 right-1.5">
                      <Lock className="w-3 h-3 opacity-50" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {demoUsers.find(r => r.id === selectedRole)?.description}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <Input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="h-9 text-sm pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full gap-2 h-9 text-sm group"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In to FlowOS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>

          <div className="p-3 rounded-lg border border-border/60 bg-card/50">
            <p className="text-[10px] text-muted-foreground text-center">
              Logging in as <span className="font-semibold text-foreground">{demoUsers.find(r => r.id === selectedRole)?.name}</span> with access to {demoUsers.find(r => r.id === selectedRole)?.permissions.filter(p => p.actions.includes("view")).length || 0} modules
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            This is a prototype for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
