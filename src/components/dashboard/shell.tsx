"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { Menu, X, LogOut, Bell } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardShellProps {
  navItems: DashboardNavItem[];
  brandLabel: string;
  brandSublabel: string;
  userName: string;
  userRoleLabel: string;
  children: React.ReactNode;
}

export function DashboardShell({ navItems, brandLabel, brandSublabel, userName, userRoleLabel, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOut(auth).catch(() => undefined);
    router.push("/connexion");
    router.refresh();
  }

  const nav = (
    <>
      <div className="px-4 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy-950 text-sm font-bold text-white">CDF</span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-navy-950">{brandLabel}</span>
            <span className="block text-[11px] text-slate-500">{brandSublabel}</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-navy-900 text-white" : "text-slate-600 hover:bg-navy-50 hover:text-navy-900"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-800">
            {userName.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-navy-950">{userName}</p>
            <p className="truncate text-xs text-slate-500">{userRoleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-navy-50 hover:text-risk-critical"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Se déconnecter
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-navy-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">{nav}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-end px-3 pt-3">
              <button type="button" className="rounded-md p-2 text-navy-900" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <button
            type="button"
            className="rounded-md p-2 text-navy-900 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <span className="hidden text-sm font-medium text-slate-500 lg:block">{brandSublabel}</span>
          <button type="button" className="relative rounded-md p-2 text-slate-500 hover:bg-navy-50 hover:text-navy-900" aria-label="Notifications">
            <Bell className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
