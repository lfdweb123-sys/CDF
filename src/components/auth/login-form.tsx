"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ArrowRight, Loader2, LockKeyhole } from "lucide-react";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { homeRouteForRole } from "@/lib/auth/roles";
import type { Role } from "@/types";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Connexion impossible.");
      }

      const { role } = (await res.json()) as { role: Role };
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : homeRouteForRole(role));
      router.refresh();
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-white">
        <LockKeyhole className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h1 className="mt-4 text-lg font-semibold text-navy-950">Espace client &amp; équipe CDF</h1>
      <p className="mt-1 text-sm text-slate-500">Connectez-vous à votre espace sécurisé.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </Field>
        <Field label="Mot de passe" htmlFor="password">
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Field>

        {error && <p className="text-sm font-medium text-risk-critical">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Connexion...
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </>
          )}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between text-xs">
        <Link href="/mot-de-passe-oublie" className="font-medium text-navy-700 hover:underline">
          Mot de passe oublié ?
        </Link>
        <Link href="/" className="text-slate-500 hover:text-navy-900">
          Retour au site
        </Link>
      </div>
    </div>
  );
}
