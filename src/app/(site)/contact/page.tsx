import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RadarRingsIllustration } from "@/components/site/illustrations";
import { ContactForm } from "@/components/site/contact-form";
import { getContact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez CDF pour parler à un consultant, demander un diagnostic ou obtenir plus d'informations.",
};

export default async function ContactPage() {
  const contact = await getContact();
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parler à un consultant CDF"
        description="Nous répondons généralement sous 24 heures ouvrées."
        illustration={<RadarRingsIllustration icon={MessageCircle} />}
      />
      <section className="container-cdf grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <ContactItem icon={Phone} label="Téléphone" value={contact.phone} href={`tel:${contact.phone.replace(/\s/g, "")}`} />
          <ContactItem icon={MessageCircle} label="WhatsApp" value={contact.whatsapp} href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}`} />
          <ContactItem icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
          <ContactItem icon={MapPin} label="Adresse" value={contact.address} />
        </div>
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </section>
    </>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-navy-950">{value}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block hover:border-navy-300">
        {content}
      </a>
    );
  }
  return content;
}
