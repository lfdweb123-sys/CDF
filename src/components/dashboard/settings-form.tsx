"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SettingsForm({ email, twoFactorEnabled }: { email: string; twoFactorEnabled: boolean }) {
  const [twoFactor, setTwoFactor] = useState(twoFactorEnabled);
  const [savingTwoFactor, setSavingTwoFactor] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function toggleTwoFactor() {
    const next = !twoFactor;
    setTwoFactor(next);
    setSavingTwoFactor(true);
    try {
      await fetch("/api/portail/parametres", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ twoFactorEnabled: next }),
      });
    } finally {
      setSavingTwoFactor(false);
    }
  }

  async function sendReset() {
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-navy-950">Sécurité du compte</h2>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-medium text-navy-950">Authentification à deux facteurs</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Renforce la sécurité de votre compte. Fonctionnalité optionnelle, activable ici.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTwoFactor}
            disabled={savingTwoFactor}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${twoFactor ? "bg-navy-900" : "bg-slate-200"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${twoFactor ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 px-4 py-3">
          <p className="text-sm font-medium text-navy-950">Mot de passe</p>
          <p className="mt-0.5 text-xs text-slate-500">Recevez un lien pour définir un nouveau mot de passe.</p>
          {resetSent ? (
            <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-risk-low">
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
              Email de réinitialisation envoyé à {email}
            </p>
          ) : (
            <Button variant="outline" size="sm" className="mt-3" onClick={sendReset} disabled={resetLoading}>
              {resetLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Réinitialiser mon mot de passe"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
