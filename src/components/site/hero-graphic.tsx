import { ShieldCheck } from "lucide-react";

// Abstract "continuous supervision" mark for the hero — concentric scan rings
// with a few monitored-point dots (colored on the same risk scale used across
// the dashboard) and a slow radar sweep. Deliberately not a literal magnifying
// glass / detective visual — the brand brief calls for something subtle.
export function HeroGraphic() {
  return (
    <div className="relative h-[360px] w-[360px]" aria-hidden>
      <div className="absolute inset-0 rounded-full border border-navy-700/70" />
      <div className="absolute inset-[36px] rounded-full border border-navy-700/60" />
      <div className="absolute inset-[72px] rounded-full border border-navy-600/60" />

      <div
        className="absolute inset-[36px] rounded-full opacity-40 [animation:cdf-hero-spin_9s_linear_infinite] motion-reduce:[animation:none]"
        style={{
          background: "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(201,147,40,0.55) 360deg)",
        }}
      />

      <div className="absolute inset-[108px] flex items-center justify-center rounded-full bg-navy-900/80 shadow-[0_0_60px_rgba(0,0,0,0.35)] ring-1 ring-navy-600/60 backdrop-blur-sm">
        <ShieldCheck className="h-14 w-14 text-white" strokeWidth={1.5} />
      </div>

      {[
        { top: "6%", left: "48%", tone: "bg-risk-low" },
        { top: "46%", left: "0%", tone: "bg-risk-moderate" },
        { top: "80%", left: "20%", tone: "bg-risk-high" },
        { top: "20%", left: "88%", tone: "bg-risk-critical" },
        { top: "72%", left: "82%", tone: "bg-risk-low" },
      ].map((dot, i) => (
        <span
          key={i}
          className={`absolute h-2.5 w-2.5 rounded-full ${dot.tone} shadow-[0_0_0_4px_rgba(11,21,38,0.9)]`}
          style={{ top: dot.top, left: dot.left }}
        />
      ))}
    </div>
  );
}
