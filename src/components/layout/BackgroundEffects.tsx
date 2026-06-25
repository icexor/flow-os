import { useEffect, useRef } from "react";

export function BackgroundEffects() {
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

    // Color palette - electric blue / cyan / teal
    const COLORS = [
      "100, 200, 255",
      "80, 180, 240",
      "60, 220, 220",
      "100, 160, 255",
      "140, 200, 255",
    ];

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      targetAlpha: number;
      pulseSpeed: number;
      pulsePhase: number;
      connections: number;
    }

    const nodes: Node[] = [];
    const NODE_COUNT = Math.min(120, Math.floor((w * h) / 18000));

    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.4 + 0.15;
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2.5 + 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.15,
        targetAlpha: Math.random() * 0.5 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: 0,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw connections first (behind nodes)
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.connections = 0;

        for (let j = i + 1; j < nodes.length; j++) {
          const q = nodes[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && p.connections < 4) {
            p.connections++;
            const alpha = 0.12 * (1 - dist / 180);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${p.color}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Pulse alpha
        p.pulsePhase += p.pulseSpeed;
        const pulseAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.15;
        const clampedAlpha = Math.max(0.05, Math.min(0.7, pulseAlpha));

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${clampedAlpha * 0.15})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${clampedAlpha})`;
        ctx.fill();
      }

      // Draw subtle grid lines
      ctx.strokeStyle = "rgba(100, 180, 255, 0.02)";
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
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

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}
