"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { missionRequestSchema, type MissionRequestFormValues } from "@/lib/validations/forms";

type MissionRequestFormInput = z.input<typeof missionRequestSchema>;
import { sectors } from "@/lib/data/sectors";

const requestTypeOptions: { value: MissionRequestFormValues["requestType"]; label: string }[] = [
  { value: "diagnostic", label: "Diagnostic" },
  { value: "investigation", label: "Investigation" },
  { value: "controle-ponctuel", label: "Contrôle ponctuel" },
  { value: "installation-systeme", label: "Installation d'un système" },
  { value: "supervision", label: "Supervision" },
  { value: "controle-terrain", label: "Contrôle terrain" },
  { value: "autre", label: "Autre" },
];

export function MissionRequestForm() {
  const searchParams = useSearchParams();
  const presetType = searchParams.get("type");
  const presetSolution = searchParams.get("solution");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MissionRequestFormInput, unknown, MissionRequestFormValues>({
    resolver: zodResolver(missionRequestSchema),
    defaultValues: {
      requestType: (requestTypeOptions.find((o) => o.value === presetType)?.value ?? "diagnostic"),
      urgency: "normale",
      solutionSlug: presetSolution ?? undefined,
    },
  });

  async function onSubmit(values: MissionRequestFormValues) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/mission-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError("Une erreur est survenue. Merci de réessayer dans un instant.");
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-risk-low-bg text-risk-low">
          <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-navy-950">Votre demande a bien été envoyée</h2>
        <p className="mt-2 text-sm text-slate-600">
          Un consultant CDF revient vers vous très prochainement pour préciser le périmètre de votre mission.
        </p>
        <Button href="/" variant="outline" className="mt-6">
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom de l'entreprise" htmlFor="companyName" error={errors.companyName?.message}>
          <Input id="companyName" {...register("companyName")} />
        </Field>
        <Field label="Secteur" htmlFor="sector" error={errors.sector?.message}>
          <Select id="sector" {...register("sector")}>
            <option value="">Sélectionnez un secteur</option>
            {sectors.map((s) => (
              <option key={s.slug} value={s.name}>{s.name}</option>
            ))}
            <option value="autre">Autre</option>
          </Select>
        </Field>
        <Field label="Nom du responsable" htmlFor="responsibleName" error={errors.responsibleName?.message}>
          <Input id="responsibleName" {...register("responsibleName")} />
        </Field>
        <Field label="Nombre d'employés" htmlFor="employeeCount" hint="Optionnel">
          <Input id="employeeCount" type="number" min={0} {...register("employeeCount")} />
        </Field>
        <Field label="Téléphone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" {...register("phone")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register("email")} />
        </Field>
        <Field label="Localisation" htmlFor="location" error={errors.location?.message}>
          <Input id="location" placeholder="Ville, pays" {...register("location")} />
        </Field>
        <Field label="Type de demande" htmlFor="requestType" error={errors.requestType?.message}>
          <Select id="requestType" {...register("requestType")}>
            {requestTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Décrivez le problème rencontré ou votre besoin" htmlFor="problemDescription" error={errors.problemDescription?.message}>
        <Textarea id="problemDescription" rows={5} {...register("problemDescription")} />
      </Field>

      <Field label="Niveau d'urgence" htmlFor="urgency" error={errors.urgency?.message}>
        <Select id="urgency" {...register("urgency")}>
          <option value="faible">Faible</option>
          <option value="normale">Normale</option>
          <option value="urgente">Urgente</option>
        </Select>
      </Field>

      {submitError && <p className="text-sm font-medium text-risk-critical">{submitError}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            Envoi en cours...
          </>
        ) : (
          <>
            Envoyer ma demande
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </>
        )}
      </Button>
    </form>
  );
}
