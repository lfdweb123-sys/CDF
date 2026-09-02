"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      setLoading(false);
      setSent(true);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-white">
        <KeyRound className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h1 className="mt-4 text-lg font-semibold text-navy-950">Réinitialiser votre mot de passe</h1>
      <p className="mt-1 text-sm text-slate-500">Nous vous enverrons un lien de réinitialisation par email.</p>

      {sent ? (
        <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-risk-low-bg bg-risk-low-bg px-4 py-3 text-sm text-risk-low">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
          Si un compte existe pour cet email, un lien de réinitialisation vient de lui être envoyé.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Envoi...
              </>
            ) : (
              <>
                Envoyer le lien
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </>
            )}
          </Button>
        </form>
      )}

      <Link href="/connexion" className="mt-5 block text-center text-xs font-medium text-navy-700 hover:underline">
        Retour à la connexion
      </Link>
    </div>
  );
}
