import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { footerNav, siteConfig } from "@/lib/data/site";
import { getContact } from "@/lib/content";

export async function SiteFooter() {
  const year = new Date().getFullYear();
  const contact = await getContact();

  return (
    <footer className="border-t border-slate-200 bg-navy-950 text-slate-300">
      <div className="container-cdf py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="sm:col-span-3 lg:col-span-2">
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">{siteConfig.tagline}</p>
            <ul className="mt-6 space-y-2.5 text-sm text-navy-200">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-navy-400" strokeWidth={1.75} />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0 text-navy-400" strokeWidth={1.75} />
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}`}
                  className="hover:text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-navy-400" strokeWidth={1.75} />
                <a href={`mailto:${contact.email}`} className="hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-navy-400" strokeWidth={1.75} />
                {contact.address}
              </li>
            </ul>
          </div>

          <FooterColumn title="Nos services" items={footerNav.services} />
          <FooterColumn title="Cabinet" items={footerNav.entreprise} />
          <FooterColumn title="Plateforme" items={footerNav.plateforme} />
        </div>

        <div className="mt-12 flex items-center gap-2 rounded-lg border border-navy-800 bg-navy-900/60 px-4 py-3 text-xs text-navy-200">
          <ShieldCheck className="h-4 w-4 shrink-0 text-navy-400" strokeWidth={1.75} />
          Données isolées par entreprise cliente — accès strictement réservé aux personnes autorisées.
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-navy-800 pt-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} CDF — Cabinet de Contrôle Opérationnel &amp; Prévention des Pertes. Tous droits
            réservés.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {footerNav.legal.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-navy-200 hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
