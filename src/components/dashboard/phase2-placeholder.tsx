import type { LucideIcon } from "lucide-react";

export function Phase2Placeholder({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <h2 className="mt-4 text-base font-semibold text-navy-950">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      <span className="mt-4 inline-flex items-center rounded-full bg-navy-100 px-3 py-1 text-xs font-medium text-navy-800">
        Disponible en phase 2
      </span>
    </div>
  );
}
