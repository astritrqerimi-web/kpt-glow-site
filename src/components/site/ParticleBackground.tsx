/**
 * Ambient premium background — replaces the previous dot-particle effect
 * with soft, blurred gradient orbs and a very faint mesh overlay. Pure CSS,
 * fixed positioning, non-interactive.
 */
export function ParticleBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base soft gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 85% -10%, oklch(0.94 0.09 175 / 0.55), transparent 60%), radial-gradient(900px 600px at -10% 110%, oklch(0.90 0.12 200 / 0.45), transparent 60%), linear-gradient(180deg, oklch(0.995 0.004 195) 0%, oklch(0.985 0.010 180) 100%)",
        }}
      />

      {/* Soft floating orbs */}
      <div
        className="absolute -top-32 -right-24 h-[38rem] w-[38rem] rounded-full opacity-60 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.82 0.16 165 / 0.55), transparent 65%)" }}
      />
      <div
        className="absolute top-1/3 -left-40 h-[32rem] w-[32rem] rounded-full opacity-50 blur-3xl animate-float-slow"
        style={{
          animationDelay: "1.5s",
          background: "radial-gradient(circle at 70% 40%, oklch(0.58 0.14 195 / 0.45), transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-[-10rem] right-1/4 h-[28rem] w-[28rem] rounded-full opacity-45 blur-3xl animate-float-slow"
        style={{
          animationDelay: "3s",
          background: "radial-gradient(circle at 50% 50%, oklch(0.78 0.15 170 / 0.55), transparent 65%)",
        }}
      />

      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.42 0.07 210) 1px, transparent 1px), linear-gradient(90deg, oklch(0.42 0.07 210) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
    </div>
  );
}
