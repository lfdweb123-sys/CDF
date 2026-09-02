"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload, Loader2 } from "lucide-react";
import { storage } from "@/lib/firebase/client";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Company, ReportType } from "@/types";

const TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: "diagnostic", label: "Diagnostic" },
  { value: "mensuel", label: "Mensuel" },
  { value: "controle", label: "Contrôle" },
  { value: "investigation", label: "Investigation" },
  { value: "terrain", label: "Terrain" },
  { value: "suivi", label: "Suivi" },
];

export function AdminReportUpload({ companies, defaultCompanyId }: { companies: Company[]; defaultCompanyId?: string }) {
  const router = useRouter();
  const [companyId, setCompanyId] = useState(defaultCompanyId ?? "");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReportType>("diagnostic");
  const [confidential, setConfidential] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !companyId || !title) {
      setError("Merci de renseigner le client, le titre et le fichier.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const path = `companies/${companyId}/reports/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      const res = await fetch("/api/admin/rapports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ companyId, title, type, fileUrl, confidential }),
      });
      if (!res.ok) throw new Error();
      setTitle("");
      setFile(null);
      router.refresh();
    } catch {
      setError("La publication a échoué. Merci de réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client" htmlFor="companyId">
          <Select id="companyId" value={companyId} onChange={(e) => setCompanyId(e.target.value)} required>
            <option value="" disabled>Sélectionnez un client</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Type de rapport" htmlFor="type">
          <Select id="type" value={type} onChange={(e) => setType(e.target.value as ReportType)}>
            {TYPE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Titre du rapport" htmlFor="title">
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Rapport CDF — Août 2026" required />
      </Field>
      <div className="flex items-center gap-3">
        <input id="confidential" type="checkbox" checked={confidential} onChange={(e) => setConfidential(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
        <label htmlFor="confidential" className="text-sm text-navy-900">Rapport confidentiel (masqué aux utilisateurs en lecture seule)</label>
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-4 py-2.5 text-sm text-navy-900 hover:border-navy-400">
        <Upload className="h-4 w-4" strokeWidth={1.75} />
        {file ? file.name : "Sélectionner le fichier (PDF)"}
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      {error && <p className="text-xs font-medium text-risk-critical">{error}</p>}
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publier le rapport"}
      </Button>
    </form>
  );
}
