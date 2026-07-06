import { useEffect, useRef } from "react";

/**
 * Elegant 3D particle wave background.
 * Thousands of tiny points forming slow, calm waves in white/light-gray/pale-green.
 * Very discreet — content stays fully readable.
 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let running = true;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Build grid of points projected in 3D
    const cols = 60;
    const rows = 40;
    const spacing = 34;
    const gridW = cols * spacing;
    const gridH = rows * spacing;

    const rotX = -0.9; // tilt like a plane receding into distance
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    // Colors sampled between deep teal, teal, mint on very light backdrop
    const colors = [
      "rgba(14, 92, 110, 0.55)",   // deep teal
      "rgba(45, 168, 158, 0.5)",   // teal
      "rgba(80, 200, 168, 0.45)",  // mint
      "rgba(140, 200, 190, 0.4)",  // pale green
      "rgba(170, 190, 200, 0.35)", // soft gray
    ];

    let t = 0;
    const focal = 620;

    const render = () => {
      if (!running) return;
      t += 0.006; // very slow

      // Soft near-white gradient wash
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#ffffff");
      bg.addColorStop(0.5, "#f7fafb");
      bg.addColorStop(1, "#f0f6f4");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.55;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing - gridW / 2;
          const z = j * spacing - gridH / 2;

          // Wave surface — layered sine waves, gentle amplitude
          const y =
            Math.sin(x * 0.012 + t * 1.2) * 18 +
            Math.cos(z * 0.014 + t * 0.9) * 22 +
            Math.sin((x + z) * 0.008 + t * 0.6) * 10;

          // Rotate around X axis so the plane recedes
          const y2 = y * cosX - z * sinX;
          const z2 = y * sinX + z * cosX;

          // Perspective projection
          const scale = focal / (focal + z2 + 400);
          if (scale <= 0) continue;
          const px = cx + x * scale;
          const py = cy + y2 * scale;

          if (px < -20 || px > width + 20 || py < -20 || py > height + 20) continue;

          // Depth-based size + color
          const depth = (z2 + gridH / 2) / gridH; // 0..1 roughly
          const size = Math.max(0.4, 1.6 * scale);
          const colorIdx = Math.min(
            colors.length - 1,
            Math.floor((1 - depth) * colors.length),
          );

          ctx.beginPath();
          ctx.fillStyle = colors[colorIdx];
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(render);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        raf = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
