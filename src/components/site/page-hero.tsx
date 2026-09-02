import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  illustration,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  illustration?: React.ReactNode;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-slate-200 bg-navy-950 py-16 lg:py-20", className)}>
      {illustration && (
        <div className="pointer-events-none absolute right-[-40px] top-1/2 hidden -translate-y-1/2 opacity-90 lg:block">
          {illustration}
        </div>
      )}
      <div className="container-cdf relative">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-200">{description}</p>
        )}
      </div>
    </section>
  );
}
