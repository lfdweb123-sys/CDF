"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/data/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  // Close the drawer automatically if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setMobileOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
                      active && "bg-navy-50 font-semibold text-navy-900"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                  </Link>
                  {openDropdown === item.href && (
                    <div className="absolute left-0 top-full w-64 pt-2">
                      <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5">
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-navy-50 hover:text-navy-900",
                                childActive && "bg-navy-50 font-semibold text-navy-900"
                              )}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
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
                  active && "bg-navy-50 font-semibold text-navy-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/connexion" size="md">
            Espace client
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-navy-900 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="h-6 w-6" strokeWidth={1.75} />
        </button>
      </div>

      {/*
        Rendered via a portal into <body>: this drawer uses `position: fixed`
        to cover the viewport, but the header above sets `backdrop-blur`
        (backdrop-filter), which — per spec — creates a CSS containing block
        for fixed-position descendants. Left as a child of <header>, the
        drawer would be confined to the header's own 64px-tall box instead of
        the full screen. Portaling to <body> sidesteps that entirely.
      */}
      {mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-navy-950/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white shadow-xl">
              <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-4">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md p-2 text-navy-900 hover:bg-navy-50"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Retour"
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
                  <span className="text-sm font-medium">Retour</span>
                </button>
              </div>
              <nav className="flex-1 px-3 py-4">
                {mainNav.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  const expanded = mobileExpanded === item.href;
                  return (
                    <div key={item.href} className="mb-1">
                      <div
                        className={cn(
                          "flex items-center rounded-md text-base font-medium text-navy-950",
                          active && "bg-navy-50 font-semibold text-navy-900"
                        )}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block flex-1 px-3 py-2.5 hover:text-navy-900"
                        >
                          {item.label}
                        </Link>
                        {item.children && (
                          <button
                            type="button"
                            onClick={() => setMobileExpanded(expanded ? "" : item.href)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-500 hover:text-navy-900"
                            aria-label={expanded ? `Réduire ${item.label}` : `Développer ${item.label}`}
                            aria-expanded={expanded}
                          >
                            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} strokeWidth={2} />
                          </button>
                        )}
                      </div>
                      {item.children && expanded && (
                        <div className="ml-3 border-l border-slate-200 pl-3">
                          {item.children.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  "block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-navy-50 hover:text-navy-900",
                                  childActive && "bg-navy-50 font-semibold text-navy-900"
                                )}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
              <div className="space-y-3 border-t border-slate-200 p-5">
                <Button href="/connexion" onClick={() => setMobileOpen(false)}>
                  Espace client
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
