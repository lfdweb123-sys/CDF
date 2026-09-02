import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Shared visual language for the site's decorative graphics: abstract
// "continuous supervision" motifs (scan rings, connected nodes, layered
// panels) built entirely in code — no external images. Deliberately not
// literal (no magnifying glass / detective clichés), per the brand brief.
//
// The illustrations themselves are drawn for a navy backdrop (that's the
// PageHero's background). To reuse the exact same components inside a
// white page section further down, wrap them in IllustrationPanel, which
// supplies that navy backdrop locally as a rounded card.

/** Dark rounded card that hosts an illustration inside an otherwise white
 * page section — keeps the artwork's contrast without a separate light
 * palette for every motif. */
export function IllustrationPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-navy-950 p-10",
        className
      )}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

const DOT_POSITIONS = [
  { top: "6%", left: "48%", tone: "bg-risk-low" },
  { top: "46%", left: "0%", tone: "bg-risk-moderate" },
  { top: "80%", left: "20%", tone: "bg-risk-high" },
  { top: "20%", left: "88%", tone: "bg-risk-critical" },
  { top: "72%", left: "82%", tone: "bg-risk-low" },
] as const;

/** Concentric scan rings with a slow radar sweep and a centered icon. */
export function RadarRingsIllustration({ icon: Icon, size = 360 }: { icon: LucideIcon; size?: number }) {
  return (
    <div className="relative" style={{ height: size, width: size }} aria-hidden>
      <div className="absolute inset-0 rounded-full border border-navy-700/70" />
      <div className="absolute inset-[10%] rounded-full border border-navy-700/60" />
      <div className="absolute inset-[20%] rounded-full border border-navy-600/60" />

      <div
        className="absolute inset-[10%] rounded-full opacity-40 [animation:cdf-hero-spin_9s_linear_infinite] motion-reduce:[animation:none]"
        style={{
          background: "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(201,147,40,0.55) 360deg)",
        }}
      />

      <div className="absolute inset-[30%] flex items-center justify-center rounded-full bg-navy-900/80 shadow-[0_0_60px_rgba(0,0,0,0.35)] ring-1 ring-navy-600/60 backdrop-blur-sm">
        <Icon className="h-[38%] w-[38%] text-white" strokeWidth={1.5} />
      </div>

      {DOT_POSITIONS.map((dot, i) => (
        <span
          key={i}
          className={`absolute h-2.5 w-2.5 rounded-full ${dot.tone} shadow-[0_0_0_4px_rgba(11,21,38,0.9)]`}
          style={{ top: dot.top, left: dot.left }}
        />
      ))}
    </div>
  );
}

interface Node {
  x: number;
  y: number;
  tone: "low" | "moderate" | "high" | "critical" | "navy";
}

const NETWORK_NODES: Node[] = [
  { x: 180, y: 60, tone: "navy" },
  { x: 70, y: 130, tone: "low" },
  { x: 290, y: 130, tone: "moderate" },
  { x: 40, y: 250, tone: "high" },
  { x: 180, y: 220, tone: "navy" },
  { x: 320, y: 260, tone: "critical" },
  { x: 150, y: 320, tone: "low" },
];

const NETWORK_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 4],
  [1, 3],
  [2, 5],
  [4, 3],
  [4, 5],
  [4, 6],
];

const NODE_FILL: Record<Node["tone"], string> = {
  low: "var(--color-risk-low)",
  moderate: "var(--color-risk-moderate)",
  high: "var(--color-risk-high)",
  critical: "var(--color-risk-critical)",
  navy: "var(--color-accent-500)",
};

/** Connected supervision points across sites/entities — used where the page's
 * subject is inherently plural (sectors, multi-site clients, the team). */
export function NetworkNodesIllustration({ size = 360 }: { size?: number }) {
  return (
    <svg viewBox="0 0 360 360" width={size} height={size} aria-hidden>
      {NETWORK_EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NETWORK_NODES[a].x}
          y1={NETWORK_NODES[a].y}
          x2={NETWORK_NODES[b].x}
          y2={NETWORK_NODES[b].y}
          stroke="var(--color-navy-700)"
          strokeWidth={1.5}
          strokeOpacity={0.7}
        />
      ))}
      {NETWORK_NODES.map((node, i) => (
        <g key={i}>
          <circle cx={node.x} cy={node.y} r={22} fill="var(--color-navy-900)" fillOpacity={0.8} stroke="var(--color-navy-600)" />
          <circle cx={node.x} cy={node.y} r={7} fill={NODE_FILL[node.tone]} />
        </g>
      ))}
    </svg>
  );
}

/** Stacked, gently offset panels — used to evoke layered procedures/controls. */
export function LayersIllustration({ size = 360 }: { size?: number }) {
  const layers = [
    { y: 60, opacity: 0.35 },
    { y: 130, opacity: 0.55 },
    { y: 200, opacity: 0.8 },
    { y: 270, opacity: 1 },
  ];
  return (
    <svg viewBox="0 0 360 360" width={size} height={size} aria-hidden>
      {layers.map((l, i) => (
        <rect
          key={i}
          x={40 + i * 8}
          y={l.y}
          width={280 - i * 16}
          height={56}
          rx={10}
          fill="var(--color-navy-900)"
          fillOpacity={l.opacity}
          stroke="var(--color-navy-600)"
          strokeOpacity={0.6}
        />
      ))}
      <circle cx={70} cy={298} r={7} fill="var(--color-risk-low)" />
      <circle cx={70} cy={228} r={7} fill="var(--color-risk-moderate)" />
      <circle cx={70} cy={158} r={7} fill="var(--color-risk-high)" />
    </svg>
  );
}
