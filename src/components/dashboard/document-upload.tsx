"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/form";
import { readFileAsBase64, MAX_INLINE_FILE_BYTES, humanFileSize } from "@/lib/file-upload";
import type { DocumentCategory } from "@/types";

const CATEGORY_LABEL: Record<DocumentCategory, string> = {
  rapports: "Rapports",
  contrats: "Contrats",
  procedures: "Procédures",
  justificatifs: "Justificatifs",
  photos: "Photos",
  factures: "Factures",
  controle: "Documents de contrôle",
};

export function DocumentUpload() {
  const router = useRouter();
  const [category, setCategory] = useState<DocumentCategory>("justificatifs");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const { name, mimeType, data } = await readFileAsBase64(file);

      const res = await fetch("/api/portail/documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, mimeType, data, category }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Échec du téléversement.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Le téléversement a échoué. Merci de réessayer.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4">
      <Select value={category} onChange={(e) => setCategory(e.target.value as DocumentCategory)} className="w-auto">
        {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </Select>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" strokeWidth={1.75} />}
        {uploading ? "Envoi en cours..." : "Téléverser un document"}
        <input type="file" className="hidden" onChange={onFileChange} disabled={uploading} />
      </label>
      <span className="text-xs text-slate-400">{humanFileSize(MAX_INLINE_FILE_BYTES)} maximum</span>
      {error && <p className="text-xs font-medium text-risk-critical">{error}</p>}
    </div>
  );
}
