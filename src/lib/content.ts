import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { defaultPricingPlans, type PricingPlan } from "@/lib/data/pricing";
import { siteConfig } from "@/lib/data/site";

export interface SiteContactContent {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

/** Contact details shown on the public site — editable from admin/contenu. */
export async function getContact(): Promise<SiteContactContent> {
  try {
    const snap = await adminDb.collection("content").doc("contact").get();
    if (snap.exists) return snap.data() as SiteContactContent;
  } catch {
    // Firestore unreachable (e.g. static build step) — fall back to defaults.
  }
  return siteConfig.contact;
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const snap = await adminDb.collection("content").doc("pricing").get();
  if (!snap.exists) return defaultPricingPlans;
  const stored = snap.data()?.plans as Record<string, { priceLabel: string; billingNote: string }> | undefined;
  if (!stored) return defaultPricingPlans;
  return defaultPricingPlans.map((plan) => ({
    ...plan,
    priceLabel: stored[plan.id]?.priceLabel ?? plan.priceLabel,
    billingNote: stored[plan.id]?.billingNote ?? plan.billingNote,
  }));
}
