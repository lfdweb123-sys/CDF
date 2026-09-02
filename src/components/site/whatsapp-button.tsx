import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ phone }: { phone: string }) {
  const digits = phone.replace(/[^\d]/g, "");
  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter avec CDF sur WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-navy-950/20 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={2} />
    </a>
  );
}
