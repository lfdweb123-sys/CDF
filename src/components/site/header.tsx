"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/data/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-cdf flex h-16 items-center justify-between lg:h-20">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            if (item.children) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-navy-50 hover:text-navy-900",
                      active && "text-navy-900"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                  </Link>
                  {openDropdown === item.href && (
                    <div className="absolute left-0 top-full w-64 pt-2">
                      <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-navy-50 hover:text-navy-900"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-navy-50 hover:text-navy-900",
                  active && "text-navy-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/connexion" className="text-sm font-medium text-slate-700 hover:text-navy-900">
            Espace client
          </Link>
          <Button href="/diagnostic-en-ligne" size="md">
            Demander un diagnostic
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-navy-900 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-6 w-6" strokeWidth={1.75} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-navy-950/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
              <Logo />
              <button
                type="button"
                className="rounded-md p-2 text-navy-900"
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
              >
                <X className="h-6 w-6" strokeWidth={1.75} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4">
              {mainNav.map((item) => (
                <div key={item.href} className="mb-1">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-base font-medium text-navy-950 hover:bg-navy-50"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-3 border-l border-slate-200 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-navy-50 hover:text-navy-900"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="space-y-3 border-t border-slate-200 p-5">
              <Button href="/diagnostic-en-ligne" className="w-full" onClick={() => setMobileOpen(false)}>
                Demander un diagnostic
              </Button>
              <Button href="/connexion" variant="outline" className="w-full" onClick={() => setMobileOpen(false)}>
                Espace client
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
