import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hexagon, Sparkles, Eye, EyeOff, Bot, Shield, TrendingUp, ArrowRight, Lock, UserCheck, Cpu, Workflow, Layers } from "lucide-react";
import { defaultRolePermissions } from "@/lib/permissions";

interface LoginProps {
  onLogin: (role: string) => void;
}

function LoginBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener("resize", resize);

    // AI / neural network color palette
    const COLORS = [
      "100, 200, 255",
      "80, 180, 240",
      "60, 220, 220",
      "120, 170, 255",
      "80, 200, 200",
      "140, 190, 255",
    ];

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      pulsePhase: number;
      connections: number;
      layer: number;
    }

    const nodes: Node[] = [];
    const NODE_COUNT = Math.min(140, Math.floor((w * h) / 15000));

    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.35 + 0.1;
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2.2 + 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.015 + 0.004,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: 0,
        layer: Math.floor(Math.random() * 3),
      });
    }

    // Floating geometric shapes
    const shapes: { x: number; y: number; size: number; vx: number; vy: number; rotation: number; rotSpeed: number; type: "hex" | "tri" | "circle"; alpha: number }[] = [];
    for (let i = 0; i < 12; i++) {
      shapes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 30 + 15,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        type: ["hex", "tri", "circle"][Math.floor(Math.random() * 3)] as "hex" | "tri" | "circle",
        alpha: Math.random() * 0.06 + 0.02,
      });
    }

    const drawHexagon = (x: number, y: number, size: number, rotation: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    };

    const drawTriangle = (x: number, y: number, size: number, rotation: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(80, 220, 220, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      // Dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "rgba(5, 8, 18, 1)");
      gradient.addColorStop(0.5, "rgba(8, 12, 28, 1)");
      gradient.addColorStop(1, "rgba(5, 10, 22, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Subtle radial glows
      const glow1 = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, 400);
      glow1.addColorStop(0, "rgba(60, 140, 220, 0.04)");
      glow1.addColorStop(1, "rgba(60, 140, 220, 0)");
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, w, h);

      const glow2 = ctx.createRadialGradient(w * 0.7, h * 0.6, 0, w * 0.7, h * 0.6, 350);
      glow2.addColorStop(0, "rgba(60, 200, 200, 0.03)");
      glow2.addColorStop(1, "rgba(60, 200, 200, 0)");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, w, h);

      // Draw floating shapes
      for (const shape of shapes) {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotSpeed;
        if (shape.x < -50) shape.x = w + 50;
        if (shape.x > w + 50) shape.x = -50;
        if (shape.y < -50) shape.y = h + 50;
        if (shape.y > h + 50) shape.y = -50;

        if (shape.type === "hex") drawHexagon(shape.x, shape.y, shape.size, shape.rotation, shape.alpha);
        else if (shape.type === "tri") drawTriangle(shape.x, shape.y, shape.size, shape.rotation, shape.alpha);
        else {
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.size * 0.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(100, 180, 255, ${shape.alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.connections = 0;
        for (let j = i + 1; j < nodes.length; j++) {
          const q = nodes[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && p.connections < 3) {
            p.connections++;
            const alpha = 0.1 * (1 - dist / 200);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${p.color}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes with glow
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        p.pulsePhase += p.pulseSpeed;
        const pulseAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.12;
        const clampedAlpha = Math.max(0.08, Math.min(0.65, pulseAlpha));

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${clampedAlpha * 0.08})`;
        ctx.fill();

        // Inner glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${clampedAlpha * 0.2})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${clampedAlpha})`;
        ctx.fill();
      }

      // Data flow lines (horizontal scanning effect)
      const time = Date.now() * 0.0003;
      for (let i = 0; i < 5; i++) {
        const y = ((time * 50 + i * h / 5) % (h + 100)) - 50;
        const scanAlpha = 0.03 * Math.sin(time * 2 + i);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.strokeStyle = `rgba(100, 200, 255, ${Math.abs(scanAlpha)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("arjay_ds@flowos.com");
  const [password, setPassword] = useState("••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ceo");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!isSelected) return "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/80";
    switch (roleId) {
      case "ceo": return "border-blue-400/50 bg-blue-500/15 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]";
      case "finance": return "border-emerald-400/50 bg-emerald-500/15 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]";
      case "pm": return "border-purple-400/50 bg-purple-500/15 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]";
      case "construction": return "border-orange-400/50 bg-orange-500/15 text-white shadow-[0_0_20px_rgba(249,115,22,0.15)]";
      case "worker": return "border-gray-400/50 bg-gray-500/15 text-white shadow-[0_0_20px_rgba(156,163,175,0.15)]";
      case "customer": return "border-green-400/50 bg-green-500/15 text-white shadow-[0_0_20px_rgba(34,197,94,0.15)]";
      default: return "border-primary/40 bg-primary/10 text-white";
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#050810]">
      <LoginBackground />

      {/* Left Panel - Hero */}
      <div className="flex-1 hidden lg:flex flex-col relative z-10">
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <div className={cn(
            "flex items-center gap-3 mb-auto transition-all duration-1000",
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center glow-blue">
              <Hexagon className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold text-white tracking-tight">FlowOS</p>
              <p className="text-xs text-white/40">AI Business Operating System</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className={cn(
            "mb-auto py-8 transition-all duration-1000 delay-200",
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs mb-6 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered · Human-First
            </Badge>

            <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-5">
              Your Business,<br />
              <span className="text-gradient-blue">Automated.</span>
            </h1>

            <p className="text-white/50 text-lg leading-relaxed max-w-md mb-8">
              FlowOS runs your entire company. AI gathers every piece of information,
              prepares every action, and keeps humans in the approval loop.
            </p>

            {/* Feature Cards */}
            <div className="space-y-3 max-w-md">
              {[
                { icon: Bot, title: "AI Agents Work 24/7", desc: "Specialized agents handle every department" },
                { icon: Shield, title: "Human Oversight Always", desc: "Every AI action requires your approval" },
                { icon: TrendingUp, title: "Real-time Intelligence", desc: "Live data from all business touchpoints" },
              ].map((feature, i) => (
                <div
                  key={feature.title}
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:border-primary/30 hover:bg-white/[0.06] transition-all duration-500 group cursor-default",
                    mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  )}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{feature.title}</p>
                    <p className="text-xs text-white/40">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={cn(
            "grid grid-cols-3 gap-3 max-w-md transition-all duration-1000",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )} style={{ transitionDelay: "600ms" }}>
            {[
              { value: "847h", label: "Automated This Month", icon: Cpu },
              { value: "97.2%", label: "AI Accuracy", icon: Workflow },
              { value: "$4.28M", label: "Revenue Tracked", icon: Layers },
            ].map(stat => (
              <div key={stat.label} className="text-center p-3 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
                <stat.icon className="w-4 h-4 text-primary/60 mx-auto mb-1.5" />
                <p className="text-xl font-bold text-gradient-blue">{stat.value}</p>
                <p className="text-[10px] text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[460px] flex items-center justify-center p-6 lg:p-8 relative z-10">
        <div className={cn(
          "w-full max-w-sm space-y-5 transition-all duration-1000",
          mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        )} style={{ transitionDelay: "200ms" }}>
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center glow-blue">
              <Hexagon className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <div>
              <p className="text-base font-bold text-white">FlowOS</p>
              <p className="text-[10px] text-white/40">AI Business OS</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-sm text-white/40 mt-1">Sign in to your AI Business OS</p>
          </div>

          {/* Demo Role Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Demo: Select Role</p>
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5">
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
                    "text-left p-2.5 rounded-lg border text-xs transition-all duration-300 relative overflow-hidden backdrop-blur-sm",
                    getRoleBorderColor(role.id, selectedRole === role.id)
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-2 h-2 rounded-full", getRoleColor(role.id))} />
                    <p className="font-semibold">{role.name}</p>
                  </div>
                  <p className="text-[10px] opacity-60">{role.user}</p>
                  {selectedRole === role.id && (
                    <div className="absolute top-1.5 right-1.5">
                      <Lock className="w-3 h-3 opacity-40" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/30 mt-2">
              {demoUsers.find(r => r.id === selectedRole)?.description}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-white/50">Email</label>
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                className="h-10 text-sm bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-white/50">Password</label>
              <div className="relative">
                <Input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="h-10 text-sm bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full gap-2 h-10 text-sm font-medium group bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In to FlowOS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>

          <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03]">
            <p className="text-[10px] text-white/40 text-center">
              Logging in as <span className="font-semibold text-white/70">{demoUsers.find(r => r.id === selectedRole)?.name}</span> with access to {demoUsers.find(r => r.id === selectedRole)?.permissions.filter(p => p.actions.includes("view")).length || 0} modules
            </p>
          </div>

          <p className="text-center text-[10px] text-white/20">
            This is a prototype for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
