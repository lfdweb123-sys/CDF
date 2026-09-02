"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import { Field, Input, Select, Textarea, CheckboxRow } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { diagnosticFormSchema, type DiagnosticFormValues } from "@/lib/validations/forms";

type DiagnosticFormInput = z.input<typeof diagnosticFormSchema>;
import { sectors } from "@/lib/data/sectors";
import { RISK_LEVEL_LABEL } from "@/lib/utils";
import type { RiskLevel } from "@/types";

const domainQuestions: { key: keyof DiagnosticFormValues; label: string }[] = [
  { key: "hasStockManagement", label: "Gestion de stock" },
  { key: "hasCashManagement", label: "Gestion de caisse" },
  { key: "hasMobileMoney", label: "Paiements Mobile Money" },
  { key: "hasProcurement", label: "Achats / approvisionnements" },
  { key: "hasVehicles", label: "Véhicules / flotte" },
  { key: "hasProjects", label: "Projets ou chantiers en cours" },
];

export function DiagnosticForm() {
  const [result, setResult] = useState<{ score: number; level: RiskLevel; label: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DiagnosticFormInput, unknown, DiagnosticFormValues>({
    resolver: zodResolver(diagnosticFormSchema),
    defaultValues: {
      hasStockManagement: false,
      hasCashManagement: false,
      hasMobileMoney: false,
      hasProcurement: false,
      hasVehicles: false,
      hasProjects: false,
      existingControls: "aucun",
      revenueRange: "10-50m",
      mainDifficulties: "",
    },
  });

  async function onSubmit(values: DiagnosticFormValues) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult({ score: data.score, level: data.level, label: data.label });
    } catch {
      setSubmitError("Une erreur est survenue. Merci de réessayer dans un instant.");
    }
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Votre CDF Risk Score™</p>
        <div className="mt-4 flex items-end justify-center gap-3">
          <span className="text-6xl font-semibold text-navy-950">{result.score}</span>
          <span className="mb-2 text-lg text-slate-400">/ 100</span>
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-risk-moderate-bg px-3 py-1 text-xs font-semibold text-risk-moderate">
          {RISK_LEVEL_LABEL[result.level].toUpperCase()}
        </span>
        <div className="mx-auto mt-6 h-2 w-full max-w-sm overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-navy-700" style={{ width: `${result.score}%` }} />
        </div>

        <div className="mx-auto mt-6 flex max-w-md items-start gap-2.5 rounded-lg border border-accent-100 bg-accent-100/50 px-4 py-3 text-left text-xs leading-relaxed text-navy-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.75} />
          Ce résultat est une première évaluation <strong>indicative</strong>, basée sur vos réponses. Il ne
          constitue pas un audit officiel. Un diagnostic professionnel permet une évaluation approfondie.
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/demande-mission?type=diagnostic">
            Demander un diagnostic professionnel
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Button>
          <Button href="/services/diagnostic" variant="outline">
            Comprendre CDF Diagnostic
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Secteur d'activité" htmlFor="sector" error={errors.sector?.message}>
          <Select id="sector" {...register("sector")}>
            <option value="">Sélectionnez un secteur</option>
            {sectors.map((s) => (
              <option key={s.slug} value={s.name}>{s.name}</option>
            ))}
            <option value="autre">Autre</option>
          </Select>
        </Field>
        <Field label="Nombre d'employés" htmlFor="employeeCount" error={errors.employeeCount?.message}>
          <Input id="employeeCount" type="number" min={0} {...register("employeeCount")} />
        </Field>
        <Field label="Chiffre d'affaires approximatif" htmlFor="revenueRange" error={errors.revenueRange?.message}>
          <Select id="revenueRange" {...register("revenueRange")}>
            <option value="moins-10m">Moins de 10 M FCFA</option>
            <option value="10-50m">10 à 50 M FCFA</option>
            <option value="50-200m">50 à 200 M FCFA</option>
            <option value="plus-200m">Plus de 200 M FCFA</option>
          </Select>
        </Field>
        <Field label="Nombre de points de vente / sites" htmlFor="outletsCount" error={errors.outletsCount?.message}>
          <Input id="outletsCount" type="number" min={0} {...register("outletsCount")} />
        </Field>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-navy-950">Domaines concernés par votre activité</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {domainQuestions.map((q) => (
            <CheckboxRow key={q.key} id={q.key} label={q.label} {...register(q.key as never)} />
          ))}
        </div>
      </div>

      <Field label="Contrôles existants" htmlFor="existingControls" error={errors.existingControls?.message}>
        <Select id="existingControls" {...register("existingControls")}>
          <option value="aucun">Aucun contrôle formalisé</option>
          <option value="partiel">Quelques contrôles ponctuels</option>
          <option value="structure">Contrôles structurés et documentés</option>
        </Select>
      </Field>

      <Field label="Principales difficultés rencontrées" htmlFor="mainDifficulties" hint="Optionnel">
        <Textarea id="mainDifficulties" placeholder="Ex. écarts de caisse récurrents, ruptures de stock..." {...register("mainDifficulties")} />
      </Field>

      <div className="grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
        <Field label="Nom de l'entreprise" htmlFor="companyName" hint="Optionnel">
          <Input id="companyName" {...register("companyName")} />
        </Field>
        <Field label="Email" htmlFor="contactEmail" hint="Pour recevoir votre score par email" error={errors.contactEmail?.message}>
          <Input id="contactEmail" type="email" {...register("contactEmail")} />
        </Field>
      </div>

      {submitError && <p className="text-sm font-medium text-risk-critical">{submitError}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            Calcul en cours...
          </>
        ) : (
          <>
            Obtenir mon CDF Risk Score™
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </>
        )}
      </Button>
    </form>
  );
}
