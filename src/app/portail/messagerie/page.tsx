import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { listMessages } from "@/lib/queries";
import { MessageThread } from "@/components/dashboard/message-thread";

export const metadata: Metadata = { title: "Messagerie" };

export default async function MessagingPage() {
  const session = await getSessionUser();
  const messages = await listMessages(session!.companyId!);
  const sorted = [...messages].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Messagerie</h1>
        <p className="mt-1 text-sm text-slate-500">Échangez directement avec votre consultant CDF.</p>
      </div>
      <MessageThread
        initialMessages={sorted}
        currentUserId={session!.uid}
        postUrl="/api/portail/messagerie"
        emptyLabel="Aucun message pour le moment. Écrivez à votre consultant CDF ci-dessous."
        placeholder="Écrivez votre message..."
      />
    </div>
  );
}
