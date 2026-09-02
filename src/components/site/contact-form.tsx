"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/forms";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  async function onSubmit(values: ContactFormValues) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError("Une erreur est survenue. Merci de réessayer.");
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-risk-low-bg text-risk-low">
          <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-navy-950">Message envoyé</h2>
        <p className="mt-2 text-sm text-slate-600">Nous vous répondrons dans les meilleurs délais.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet" htmlFor="name" error={errors.name?.message}>
          <Input id="name" {...register("name")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register("email")} />
        </Field>
      </div>
      <Field label="Téléphone" htmlFor="phone" hint="Optionnel">
        <Input id="phone" type="tel" {...register("phone")} />
      </Field>
      <Field label="Sujet" htmlFor="subject" error={errors.subject?.message}>
        <Input id="subject" {...register("subject")} />
      </Field>
      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <Textarea id="message" rows={5} {...register("message")} />
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
            Envoyer le message
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </>
        )}
      </Button>
    </form>
  );
}
