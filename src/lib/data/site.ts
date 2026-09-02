const FALLBACK_URL = "https://cdf-controle.com";

// NEXT_PUBLIC_APP_URL can be unset, empty, or left as an un-replaced
// placeholder (e.g. copy-pasted from docs) in a given deployment's env vars —
// never let a bad value there crash the build via `new URL(siteConfig.url)`
// in the root layout's metadata. Vercel also exposes VERCEL_URL (host only,
// no scheme) for preview/production deployments as a same-build fallback.
function resolveAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) {
    try {
      return new URL(configured).toString().replace(/\/$/, "");
    } catch {
      console.warn(`[site] Ignoring invalid NEXT_PUBLIC_APP_URL: "${configured}"`);
    }
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return FALLBACK_URL;
}

export const siteConfig = {
  name: "CDF",
  fullName: "CDF — Cabinet de Contrôle Opérationnel & Prévention des Pertes",
  tagline: "Vous ne pouvez pas être partout. Nous vérifions pour vous.",
  description:
    "CDF aide les dirigeants à identifier les failles de leurs opérations, réduire leurs pertes et sécuriser leurs processus.",
  url: resolveAppUrl(),
  contact: {
    phone: "+229 00 00 00 00",
    whatsapp: "+229 00 00 00 00",
    email: "contact@cdf-controle.com",
    address: "Cotonou, Bénin",
  },
};

export const mainNav = [
  { label: "Accueil", href: "/" },
  {
    label: "Nos services",
    href: "/services",
    children: [
      { label: "CDF Diagnostic", href: "/services/diagnostic" },
      { label: "CDF Investigation", href: "/services/investigation" },
      { label: "CDF Anti-Leak", href: "/services/anti-leak" },
      { label: "CDF Control", href: "/services/control" },
      { label: "CDF Watch", href: "/services/watch" },
      { label: "Contrôle Terrain", href: "/services/controle-terrain" },
    ],
  },
  { label: "Solutions", href: "/solutions" },
  { label: "Secteurs", href: "/secteurs" },
  { label: "Diagnostic en ligne", href: "/diagnostic-en-ligne" },
  { label: "Ressources", href: "/ressources" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  services: [
    { label: "CDF Diagnostic", href: "/services/diagnostic" },
    { label: "CDF Investigation", href: "/services/investigation" },
    { label: "CDF Anti-Leak", href: "/services/anti-leak" },
    { label: "CDF Control", href: "/services/control" },
    { label: "CDF Watch", href: "/services/watch" },
    { label: "Contrôle Terrain", href: "/services/controle-terrain" },
  ],
  entreprise: [
    { label: "À propos", href: "/a-propos" },
    { label: "Secteurs", href: "/secteurs" },
    { label: "Ressources", href: "/ressources" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  plateforme: [
    { label: "Diagnostic en ligne", href: "/diagnostic-en-ligne" },
    { label: "Demande de mission", href: "/demande-mission" },
    { label: "Espace client", href: "/connexion" },
  ],
  legal: [
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "Mentions légales", href: "/mentions-legales" },
  ],
};
