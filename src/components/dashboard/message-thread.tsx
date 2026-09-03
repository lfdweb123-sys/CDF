"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { isCdfStaff } from "@/lib/auth/roles";
import type { Message } from "@/types";

interface MessageThreadProps {
  initialMessages: Message[];
  currentUserId: string;
  postUrl: string;
  extraFields?: Record<string, string>;
  emptyLabel: string;
  placeholder: string;
}

export function MessageThread({ initialMessages, currentUserId, postUrl, extraFields, emptyLabel, placeholder }: MessageThreadProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, ...extraFields }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Échec de l'envoi.");
        return;
      }
      setMessages((prev) => [...prev, data.message]);
      setText("");
      router.refresh();
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch {
      setError("Échec de l'envoi. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[65vh] flex-col rounded-xl border border-slate-200 bg-white">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
        {messages.length === 0 && <p className="py-10 text-center text-sm text-slate-400">{emptyLabel}</p>}
        {messages.map((m) => {
          const mine = m.authorId === currentUserId;
          const staffAuthor = isCdfStaff(m.authorRole);
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm", mine ? "bg-navy-900 text-white" : "bg-slate-100 text-navy-950")}>
                <div className={cn("flex items-center gap-2 text-xs", mine ? "text-white/70" : "text-slate-500")}>
                  <span className="font-medium">{m.authorName}</span>
                  {staffAuthor && (
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", mine ? "bg-white/15" : "bg-navy-100 text-navy-800")}>
                      CDF
                    </span>
                  )}
                  <span>{formatDateTime(m.createdAt)}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap leading-relaxed">{m.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={submit} className="border-t border-slate-200 p-3 sm:p-4">
        {error && <p className="mb-2 text-xs text-risk-critical">{error}</p>}
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
            rows={1}
            placeholder={placeholder}
            className="flex-1 resize-none rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex shrink-0 items-center justify-center rounded-md bg-navy-900 px-4 text-white hover:bg-navy-800 disabled:opacity-50"
            aria-label="Envoyer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" strokeWidth={1.75} />}
          </button>
        </div>
      </form>
    </div>
  );
}
