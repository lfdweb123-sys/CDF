export interface SectorDefinition {
  slug: string;
  name: string;
  frequentProblems: string[];
  solutions: string[];
  exampleControl: string;
}

export const sectors: SectorDefinition[] = [
  {
    slug: "restaurants",
    name: "Restaurants",
    frequentProblems: ["Écarts entre ventes et consommation matière", "Gestion peu rigoureuse des stocks de boissons", "Consommations non facturées"],
    solutions: ["Restaurant Control", "Cash Control", "Stock Guard"],
    exampleControl: "Contrôle croisé des ventes du jour avec les sorties de stock cuisine et bar.",
  },
  {
    slug: "commerce",
    name: "Commerce",
    frequentProblems: ["Démarque inconnue", "Écarts de caisse récurrents", "Remises non autorisées"],
    solutions: ["Stock Guard", "Cash Control", "Commercial Control"],
    exampleControl: "Inventaire tournant par catégorie de produits avec analyse des écarts.",
  },
  {
    slug: "distribution",
    name: "Distribution",
    frequentProblems: ["Écarts entre commandes et livraisons", "Fournisseurs non vérifiés", "Fuites sur les tournées de livraison"],
    solutions: ["Delivery Control", "Supplier Check", "Stock Guard"],
    exampleControl: "Vérification des bons de livraison contre les commandes et les encaissements de tournée.",
  },
  {
    slug: "btp",
    name: "BTP",
    frequentProblems: ["Dépassements budgétaires non détectés à temps", "Sous-traitants insuffisamment vérifiés", "Décaissements sans pièces suffisantes"],
    solutions: ["Project Control", "Supplier Check", "Procurement Control"],
    exampleControl: "Contrôle terrain de l'avancement physique comparé à l'avancement facturé.",
  },
  {
    slug: "transport",
    name: "Transport",
    frequentProblems: ["Consommation de carburant non maîtrisée", "Trajets non justifiés", "Entretien du parc mal suivi"],
    solutions: ["Fuel Control", "Attendance Control"],
    exampleControl: "Rapprochement kilométrage déclaré et consommation réelle de carburant.",
  },
  {
    slug: "logistique",
    name: "Logistique",
    frequentProblems: ["Écarts de stock en entrepôt", "Litiges de livraison fréquents", "Traçabilité insuffisante des mouvements"],
    solutions: ["Stock Guard", "Delivery Control"],
    exampleControl: "Audit physique d'entrepôt par échantillonnage avec traçabilité des mouvements.",
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    frequentProblems: ["Rapprochement paiement / commande incomplet", "Retours et remboursements mal contrôlés", "Fournisseurs et prestataires logistiques non vérifiés"],
    solutions: ["Mobile Money Control", "Supplier Check", "Delivery Control"],
    exampleControl: "Rapprochement des paiements Mobile Money et cartes avec les commandes livrées.",
  },
  {
    slug: "services",
    name: "Services",
    frequentProblems: ["Notes de frais peu contrôlées", "Facturation clients incohérente", "Temps facturé non vérifié"],
    solutions: ["Commercial Control", "Petty Cash Control"],
    exampleControl: "Revue par échantillonnage des notes de frais et de leur justification.",
  },
  {
    slug: "agriculture",
    name: "Agriculture",
    frequentProblems: ["Pertes de récolte non expliquées", "Intrants non rapprochés avec les surfaces exploitées", "Ventes non tracées sur les sites de production"],
    solutions: ["Stock Guard", "Procurement Control"],
    exampleControl: "Contrôle terrain des volumes récoltés comparés aux ventes déclarées.",
  },
  {
    slug: "ong-associations",
    name: "Associations / ONG",
    frequentProblems: ["Décaissements de projet peu documentés", "Suivi budgétaire par bailleur insuffisant", "Justificatifs manquants sur le terrain"],
    solutions: ["Project Control", "Petty Cash Control"],
    exampleControl: "Vérification terrain de la réalisation des activités financées par rapport aux décaissements.",
  },
  {
    slug: "pme",
    name: "PME",
    frequentProblems: ["Cumul de fonctions sans séparation des tâches", "Procédures non formalisées", "Dirigeant seul garant du contrôle"],
    solutions: ["Cash Control", "Stock Guard", "Attendance Control"],
    exampleControl: "Diagnostic global des points de contrôle existants et des zones non couvertes.",
  },
];

export function getSectorBySlug(slug: string): SectorDefinition | undefined {
  return sectors.find((s) => s.slug === slug);
}
