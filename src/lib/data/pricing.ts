export interface PricingPlan {
  id: "diagnostic" | "secure" | "anti-leak" | "watch";
  name: string;
  tagline: string;
  priceLabel: string;
  billingNote: string;
  features: string[];
  highlighted?: boolean;
}

// Administrable depuis le back-office CDF (admin/abonnements) — ces valeurs sont
// le contenu par défaut tant qu'aucune configuration n'a été enregistrée dans
// Firestore (collection `content`, document `pricing`).
export const defaultPricingPlans: PricingPlan[] = [
  {
    id: "diagnostic",
    name: "CDF Diagnostic",
    tagline: "Mission ponctuelle",
    priceLabel: "Sur devis",
    billingNote: "Mission unique",
    features: [
      "Diagnostic complet multi-domaines",
      "CDF Risk Score™ initial",
      "Rapport détaillé et recommandations",
      "Restitution avec la direction",
    ],
  },
  {
    id: "secure",
    name: "CDF Secure",
    tagline: "Installation des systèmes de contrôle",
    priceLabel: "Sur devis",
    billingNote: "Mission de mise en place",
    features: [
      "Conception des procédures de contrôle",
      "Déploiement de checklists digitales",
      "Formation des équipes",
      "Suivi de mise en application",
    ],
  },
  {
    id: "anti-leak",
    name: "CDF Anti-Leak",
    tagline: "Diagnostic global + sécurisation",
    priceLabel: "Sur devis",
    billingNote: "Programme complet",
    highlighted: true,
    features: [
      "Diagnostic global de l'entreprise",
      "Mécanismes de sécurisation installés",
      "Accès au dashboard CDF",
      "Suivi du plan d'action",
    ],
  },
  {
    id: "watch",
    name: "CDF Watch",
    tagline: "Supervision mensuelle",
    priceLabel: "Abonnement mensuel",
    billingNote: "Facturation mensuelle",
    features: [
      "Contrôles périodiques programmés",
      "Dashboard de supervision continue",
      "Alertes en temps réel",
      "Rapports mensuels",
    ],
  },
];

export interface LossArea {
  domain: string;
  example: string;
}

export const lossAreas: LossArea[] = [
  { domain: "Caisse", example: "Écarts non rapprochés entre les encaissements et la caisse physique." },
  { domain: "Stocks", example: "Sorties de marchandises non justifiées ou non documentées." },
  { domain: "Achats", example: "Fournisseurs favorisés sans mise en concurrence réelle." },
  { domain: "Personnel", example: "Présences déclarées qui ne reflètent pas la réalité du terrain." },
  { domain: "Projets", example: "Décaissements engagés sans pièces justificatives suffisantes." },
  { domain: "Logistique", example: "Écarts entre commandes, livraisons et encaissements en tournée." },
  { domain: "Carburant", example: "Consommation du parc automobile sans suivi kilométrique fiable." },
  { domain: "Encaissements", example: "Transactions Mobile Money non rapprochées avec les ventes." },
  { domain: "Procédures", example: "Absence de séparation des tâches sur les opérations sensibles." },
];
