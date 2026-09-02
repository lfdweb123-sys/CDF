"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Comment {
  authorName: string;
  text: string;
  createdAt: string;
}

export function RecommendationComments({
  recommendationId,
  initialComments,
  canWrite,
}: {
  recommendationId: string;
  initialComments: Comment[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/portail/recommandations/${recommendationId}/commentaires`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setText("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Commentaires &amp; justificatifs</p>
      <div className="mt-3 space-y-2.5">
        {comments.length === 0 && <p className="text-xs text-slate-400">Aucun commentaire pour le moment.</p>}
        {comments.map((c, i) => (
          <div key={i} className="rounded-md bg-slate-50 px-3 py-2 text-sm">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-navy-900">{c.authorName}</span>
              <span>{formatDate(c.createdAt)}</span>
            </div>
            <p className="mt-1 text-slate-700">{c.text}</p>
          </div>
        ))}
      </div>
      {canWrite && (
        <form onSubmit={submit} className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ajouter un commentaire ou un justificatif..."
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center rounded-md bg-navy-900 px-3 text-white hover:bg-navy-800 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" strokeWidth={1.75} />}
          </button>
        </form>
      )}
    </div>
  );
}
