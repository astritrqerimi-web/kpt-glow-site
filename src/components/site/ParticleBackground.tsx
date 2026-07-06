/**
 * Premium ambient background — mostly white with a static subtle grid and
 * a slow-moving mesh gradient / soft glow for an elegant, non-distracting
 * animation. Green is used only as a faint accent, matching the brand.
 */
export function ParticleBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Static, crisp grid — the visual anchor */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.35 0.04 210) 1px, transparent 1px), linear-gradient(90deg, oklch(0.35 0.04 210) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 45%, transparent 85%)",
        }}
      />

      {/* Slow-drifting mesh gradient — subtle premium motion */}
      <div className="absolute inset-0 animate-mesh-drift">
        <div
          className="absolute -top-40 -right-32 h-[42rem] w-[42rem] rounded-full blur-3xl opacity-[0.28]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, oklch(0.85 0.10 170 / 0.55), transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 -left-48 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-[0.22]"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, oklch(0.80 0.06 210 / 0.45), transparent 70%)",
          }}
        />
      </div>

      {/* Soft slow-glow overlay */}
      <div
        className="absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full blur-3xl opacity-[0.18] animate-soft-glow"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.13 170 / 0.5), transparent 70%)",
        }}
      />
    </div>
  );
}
