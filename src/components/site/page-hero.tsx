import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-slate-200 bg-navy-950 py-16 lg:py-20", className)}>
      <div className="container-cdf">
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
