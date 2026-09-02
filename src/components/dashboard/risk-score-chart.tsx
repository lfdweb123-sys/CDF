"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function RiskScoreChart({ history }: { history: { date: string; score: number }[] }) {
  if (history.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
        L&apos;évolution du score s&apos;affichera après votre prochaine mission CDF.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={history} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71798a" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#71798a" }} axisLine={false} tickLine={false} width={32} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #dee2e8" }}
          labelStyle={{ color: "#10172a", fontWeight: 600 }}
        />
        <Line type="monotone" dataKey="score" stroke="#16304f" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
