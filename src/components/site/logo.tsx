import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md text-base font-bold tracking-tight",
          dark ? "bg-white text-navy-950" : "bg-navy-950 text-white"
        )}
      >
        CDF
      </span>
      <span className="hidden leading-tight sm:block">
        <span className={cn("block text-sm font-semibold", dark ? "text-white" : "text-navy-950")}>
          CDF
        </span>
        <span className={cn("block text-[11px]", dark ? "text-navy-200" : "text-slate-500")}>
          Contrôle Opérationnel &amp; Prévention des Pertes
        </span>
      </span>
    </Link>
  );
}
