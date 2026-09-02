import { cn } from "@/lib/utils";
import { RISK_LEVEL_LABEL } from "@/lib/utils";
import type { RiskLevel } from "@/types";

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "navy" | "accent";
}) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700",
    navy: "bg-navy-100 text-navy-800",
    accent: "bg-accent-100 text-accent-600",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const RISK_DOT: Record<RiskLevel, string> = {
  faible: "bg-risk-low",
  modere: "bg-risk-moderate",
  eleve: "bg-risk-high",
  critique: "bg-risk-critical",
};

const RISK_TEXT: Record<RiskLevel, string> = {
  faible: "text-risk-low",
  modere: "text-risk-moderate",
  eleve: "text-risk-high",
  critique: "text-risk-critical",
};

const RISK_BG: Record<RiskLevel, string> = {
  faible: "bg-risk-low-bg",
  modere: "bg-risk-moderate-bg",
  eleve: "bg-risk-high-bg",
  critique: "bg-risk-critical-bg",
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        RISK_BG[level],
        RISK_TEXT[level],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", RISK_DOT[level])} aria-hidden />
      {RISK_LEVEL_LABEL[level]}
    </span>
  );
}

export function RiskDot({ level }: { level: RiskLevel }) {
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", RISK_DOT[level])} aria-hidden />;
}
