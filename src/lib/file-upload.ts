// Shared constants and client-side helper for the app's only file storage
// mechanism: files are read as base64 and stored inline in Firestore
// documents as a `data:` URI (see e.g. src/app/api/portail/documents/route.ts).
// Firebase Storage is not used anywhere in this codebase — see the note in
// src/lib/firebase/client.ts.
//
// This trades off maximum file size against not standing up a second Firebase
// product: a Firestore document is capped at 1 MiB total, base64 inflates
// payload size by ~4/3, and every document also carries its other fields —
// so raw files are capped well below that ceiling.
export const MAX_INLINE_FILE_BYTES = 700 * 1024; // 700 KB

export function humanFileSize(bytes: number): string {
  return `${Math.round(bytes / 1024)} Ko`;
}

export interface ReadFileResult {
  data: string; // base64 payload, no "data:...;base64," prefix
  mimeType: string;
  name: string;
  size: number;
}

/** Approximate decoded byte size of a base64 string (no data: prefix). */
export function base64ByteSize(base64: string): number {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

export function buildDataUri(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`;
}

export function readFileAsBase64(file: File): Promise<ReadFileResult> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_INLINE_FILE_BYTES) {
      reject(new Error(`Fichier trop volumineux (${humanFileSize(MAX_INLINE_FILE_BYTES)} maximum).`));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossible de lire ce fichier."));
    reader.onload = () => {
      const result = reader.result as string; // "data:<mime>;base64,<data>"
      const base64 = result.slice(result.indexOf(",") + 1);
      resolve({ data: base64, mimeType: file.type || "application/octet-stream", name: file.name, size: file.size });
    };
    reader.readAsDataURL(file);
  });
}
