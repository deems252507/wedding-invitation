"use client";

import { useEffect, useRef } from "react";

interface TextParticleProps {
  text?: string;
  particleDensity?: number;
  particleSize?: number;
  particleColor?: string;
  fontSize?: number;
  className?: string;
}

export function TextParticle({
  text = "Particle",
  particleDensity = 4,
  particleSize = 2,
  particleColor = "#f5f0e8",
  fontSize = 120,
  className = "",
}: TextParticleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: {
      x: number;
      y: number;
      ox: number;
      oy: number;
      vx: number;
      vy: number;
    }[] = [];
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(rect.width, rect.height);
    };

    const initParticles = (w: number, h: number) => {
      particles = [];
      // Offscreen canvas to sample text
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.fillStyle = "#fff";
      octx.font = `bold ${fontSize}px Georgia, "Times New Roman", serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(text, w / 2, h / 2);

      const imageData = octx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const gap = Math.max(2, Math.floor(6 / particleDensity));

      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const i = (y * w + x) * 4;
          if (data[i + 3] > 128) {
            particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              ox: x,
              oy: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        const t = e.touches[0];
        if (t) {
          mouse.x = t.clientX - rect.left;
          mouse.y = t.clientY - rect.top;
        }
      } else {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = particleColor;

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = Math.min(120 / dist, 8);

        if (dist < 80) {
          p.vx -= (dx / dist) * force * 0.4;
          p.vy -= (dy / dist) * force * 0.4;
        }

        // Spring back to origin
        p.vx += (p.ox - p.x) * 0.05;
        p.vy += (p.oy - p.y) * 0.05;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchend", onLeave);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchend", onLeave);
    };
  }, [text, particleDensity, particleSize, particleColor, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full ${className}`}
      style={{ display: "block" }}
    />
  );
}
