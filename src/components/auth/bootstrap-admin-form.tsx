"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function BootstrapAdminForm() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/setup/bootstrap-admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, email, displayName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Erreur inconnue.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-risk-low-bg text-risk-low">
          <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-navy-950">Compte administrateur créé</h1>
        <p className="mt-2 text-sm text-slate-600">
          Un email vient d&apos;être envoyé à <strong>{email}</strong> pour définir le mot de passe.
        </p>
        <Button href="/connexion" className="mt-6 w-full">
          Aller à la connexion
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-white">
        <KeyRound className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h1 className="mt-4 text-lg font-semibold text-navy-950">Créer le premier administrateur CDF</h1>
      <p className="mt-1 text-sm text-slate-500">
        Réservé à l&apos;amorçage initial de la plateforme — nécessite le jeton d&apos;amorçage.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Jeton d'amorçage" htmlFor="token">
          <Input id="token" type="password" required value={token} onChange={(e) => setToken(e.target.value)} />
        </Field>
        <Field label="Nom complet" htmlFor="displayName">
          <Input id="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>

        {error && <p className="text-sm font-medium text-risk-critical">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Création...
            </>
          ) : (
            <>
              Créer mon compte
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </>
          )}
        </Button>
      </form>

      <Link href="/connexion" className="mt-5 block text-center text-xs font-medium text-navy-700 hover:underline">
        Retour à la connexion
      </Link>
    </div>
  );
}
