export interface SolutionDefinition {
  slug: string;
  name: string;
  domain: string;
  problem: string;
  risks: string[];
  howItWorks: string[];
  controls: string[];
  indicators: string[];
  deliverables: string[];
}

export const solutions: SolutionDefinition[] = [
  {
    slug: "cash-control",
    name: "Cash Control",
    domain: "Caisse",
    problem: "Les écarts de caisse non expliqués s'accumulent silencieusement, mois après mois.",
    risks: [
      "Absence de rapprochement quotidien entre encaissements et caisse physique",
      "Accès non tracé à la caisse par plusieurs personnes",
      "Annulations et remboursements non justifiés",
    ],
    howItWorks: [
      "Mise en place d'une procédure de clôture de caisse quotidienne",
      "Contrôles inopinés par les équipes CDF",
      "Vérification de la traçabilité des annulations et remises",
    ],
    controls: ["Comptage physique vs système", "Revue des annulations et remboursements", "Contrôle des accès à la caisse"],
    indicators: ["Taux d'écart de caisse", "Nombre d'annulations non justifiées", "Délai de rapprochement"],
    deliverables: ["Procédure de clôture de caisse", "Rapport de contrôle périodique", "Tableau de suivi des écarts"],
  },
  {
    slug: "stock-guard",
    name: "Stock Guard",
    domain: "Stocks",
    problem: "Des écarts entre stock théorique et stock physique érodent la marge sans être détectés à temps.",
    risks: [
      "Sorties de stock non justifiées ou non documentées",
      "Inventaires irréguliers ou peu fiables",
      "Absence de séparation entre gestion et contrôle du stock",
    ],
    howItWorks: [
      "Instauration d'inventaires tournants réguliers",
      "Vérification croisée des mouvements de stock",
      "Contrôle physique inopiné par les équipes CDF",
    ],
    controls: ["Comptage physique par échantillonnage", "Revue des bons de sortie", "Analyse des écarts récurrents"],
    indicators: ["Taux de rupture", "Taux de démarque", "Fréquence des écarts par référence"],
    deliverables: ["Rapport d'inventaire", "Cartographie des écarts", "Recommandations de sécurisation"],
  },
  {
    slug: "procurement-control",
    name: "Procurement Control",
    domain: "Achats",
    problem: "Des achats non compétitifs ou des fournisseurs favorisés indûment renchérissent les coûts.",
    risks: [
      "Absence de mise en concurrence systématique",
      "Liens non déclarés entre acheteurs et fournisseurs",
      "Écarts entre bons de commande, livraisons et factures",
    ],
    howItWorks: [
      "Vérification du processus de sélection fournisseurs",
      "Contrôle de cohérence commande / livraison / facture",
      "Analyse des prix par rapport au marché",
    ],
    controls: ["Revue des dossiers d'achat", "Vérification des trois-way match", "Contrôle des fournisseurs récurrents"],
    indicators: ["Écart de prix vs marché", "Taux de commandes non compétitives", "Délai moyen de validation"],
    deliverables: ["Procédure d'achat encadrée", "Rapport d'analyse fournisseurs", "Grille de validation des commandes"],
  },
  {
    slug: "restaurant-control",
    name: "Restaurant Control",
    domain: "Restauration",
    problem: "Les pertes en restauration se dispersent entre caisse, stock, boissons et personnel, rendant le pilotage difficile.",
    risks: [
      "Consommations non facturées",
      "Écarts entre recettes théoriques et consommations de matières premières",
      "Gestion approximative des stocks de boissons",
    ],
    howItWorks: [
      "Checklist digitale de contrôle multi-domaines",
      "Vérification croisée ventes / consommation matière",
      "Contrôle physique régulier sur site",
    ],
    controls: ["Vérification caisse", "Vérification stock et boissons", "Vérification des achats et fournisseurs"],
    indicators: ["Ratio food cost", "Taux d'écart boissons", "Taux de conformité checklist"],
    deliverables: ["Rapport de contrôle terrain", "Checklist CDF Restaurant Control", "Plan d'action correctif"],
  },
  {
    slug: "fuel-control",
    name: "Fuel Control",
    domain: "Carburant",
    problem: "La consommation de carburant du parc automobile échappe souvent à tout contrôle structuré.",
    risks: [
      "Pleins non justifiés par un trajet réel",
      "Absence de suivi kilométrique cohérent",
      "Cartes carburant partagées sans traçabilité",
    ],
    howItWorks: [
      "Mise en place d'un suivi kilométrique systématique",
      "Rapprochement consommation théorique / réelle",
      "Contrôle des justificatifs de plein",
    ],
    controls: ["Analyse des relevés de cartes carburant", "Vérification kilométrage vs consommation", "Contrôle des trajets déclarés"],
    indicators: ["Consommation moyenne au 100 km", "Taux d'écart théorique/réel", "Nombre de pleins non justifiés"],
    deliverables: ["Rapport de suivi carburant", "Procédure de gestion du parc", "Tableau de bord consommation"],
  },
  {
    slug: "delivery-control",
    name: "Delivery Control",
    domain: "Logistique",
    problem: "Les écarts entre commandes, livraisons et encaissements sur les tournées de livraison sont difficiles à détecter.",
    risks: [
      "Livraisons non conformes aux commandes",
      "Encaissements à la livraison non reversés",
      "Absence de preuve de livraison",
    ],
    howItWorks: [
      "Vérification systématique des bons de livraison",
      "Contrôle des encaissements en tournée",
      "Suivi des réclamations clients liées aux livraisons",
    ],
    controls: ["Rapprochement commande / livraison", "Contrôle des espèces collectées en tournée", "Vérification des signatures de réception"],
    indicators: ["Taux de non-conformité livraison", "Délai de reversement des encaissements", "Taux de réclamation"],
    deliverables: ["Procédure de contrôle logistique", "Rapport de tournées", "Plan d'action correctif"],
  },
  {
    slug: "mobile-money-control",
    name: "Mobile Money Control",
    domain: "Encaissements",
    problem: "La multiplication des paiements Mobile Money complique le rapprochement avec les ventes réelles.",
    risks: [
      "Transactions Mobile Money non rapprochées avec les ventes",
      "Comptes Mobile Money personnels utilisés à des fins professionnelles",
      "Frais et commissions mal suivis",
    ],
    howItWorks: [
      "Rapprochement quotidien transactions / ventes",
      "Vérification de la séparation comptes personnels / professionnels",
      "Contrôle des frais prélevés par les opérateurs",
    ],
    controls: ["Revue des relevés Mobile Money", "Rapprochement avec le chiffre d'affaires déclaré", "Contrôle des comptes utilisés"],
    indicators: ["Taux de rapprochement", "Écart transactions non expliquées", "Frais Mobile Money en % du CA"],
    deliverables: ["Procédure de gestion Mobile Money", "Rapport de rapprochement", "Recommandations de sécurisation"],
  },
  {
    slug: "project-control",
    name: "Project Control",
    domain: "Projets",
    problem: "Les dépassements de budget sur les projets et chantiers ne sont souvent identifiés qu'une fois le mal fait.",
    risks: [
      "Décaissements sans justificatifs suffisants",
      "Écarts entre avancement physique et avancement facturé",
      "Sous-traitants ou fournisseurs non vérifiés",
    ],
    howItWorks: [
      "Suivi périodique de l'avancement physique vs budgétaire",
      "Vérification des décaissements par étape",
      "Contrôle terrain sur les chantiers et projets",
    ],
    controls: ["Revue des situations de travaux", "Contrôle physique d'avancement", "Vérification des sous-traitants"],
    indicators: ["Taux de dépassement budgétaire", "Écart avancement physique/financier", "Nombre d'anomalies par phase"],
    deliverables: ["Rapport de suivi de projet", "Tableau de bord budgétaire", "Recommandations correctives"],
  },
  {
    slug: "commercial-control",
    name: "Commercial Control",
    domain: "Commercial",
    problem: "Des remises excessives ou des conditions commerciales dérogatoires grèvent la rentabilité sans validation formelle.",
    risks: [
      "Remises accordées hors barème sans autorisation",
      "Conditions de paiement dérogatoires non tracées",
      "Retours et avoirs non justifiés",
    ],
    howItWorks: [
      "Vérification du respect des barèmes commerciaux",
      "Contrôle des autorisations de remise",
      "Analyse des retours et avoirs par client",
    ],
    controls: ["Revue des dossiers clients à risque", "Vérification des autorisations", "Analyse des marges par transaction"],
    indicators: ["Taux de remise moyen", "Nombre de dérogations non autorisées", "Marge par client"],
    deliverables: ["Procédure de validation commerciale", "Rapport d'analyse des marges", "Grille de délégation de remises"],
  },
  {
    slug: "petty-cash-control",
    name: "Petty Cash Control",
    domain: "Caisse",
    problem: "La petite caisse, souvent perçue comme mineure, échappe fréquemment à tout contrôle formel.",
    risks: [
      "Dépenses sans pièce justificative",
      "Absence de plafond ou de règle de réapprovisionnement",
      "Cumul de fonctions entre gestion et contrôle de la caisse",
    ],
    howItWorks: [
      "Mise en place d'un règlement de petite caisse",
      "Contrôle périodique inopiné",
      "Vérification systématique des pièces justificatives",
    ],
    controls: ["Comptage physique inopiné", "Vérification des justificatifs", "Contrôle du plafond et des réapprovisionnements"],
    indicators: ["Taux de dépenses sans justificatif", "Écart de caisse", "Délai de justification"],
    deliverables: ["Règlement de petite caisse", "Rapport de contrôle", "Registre de suivi"],
  },
  {
    slug: "attendance-control",
    name: "Attendance Control",
    domain: "Personnel",
    problem: "Des présences déclarées ne reflétant pas la réalité du terrain faussent la masse salariale et la productivité.",
    risks: [
      "Pointages effectués pour des absents",
      "Heures supplémentaires non justifiées",
      "Effectifs déclarés supérieurs aux effectifs réels sur site",
    ],
    howItWorks: [
      "Vérification croisée pointage / présence terrain",
      "Contrôle inopiné des effectifs sur site",
      "Analyse des heures supplémentaires déclarées",
    ],
    controls: ["Contrôle physique de présence", "Rapprochement pointage / planning", "Vérification des heures supplémentaires"],
    indicators: ["Taux d'écart pointage/présence", "Coût des heures supplémentaires", "Taux d'absentéisme"],
    deliverables: ["Rapport de contrôle des présences", "Procédure de pointage renforcée", "Tableau de suivi RH"],
  },
  {
    slug: "supplier-check",
    name: "Supplier Check",
    domain: "Fournisseurs",
    problem: "Travailler avec des fournisseurs mal identifiés ou liés à des collaborateurs expose l'entreprise à des risques financiers et réputationnels.",
    risks: [
      "Fournisseurs fictifs ou insuffisamment identifiés",
      "Liens non déclarés entre fournisseurs et employés",
      "Absence de vérification de la capacité réelle du fournisseur",
    ],
    howItWorks: [
      "Vérification de l'existence légale et de la réputation du fournisseur",
      "Contrôle des liens potentiels avec le personnel",
      "Évaluation de la capacité opérationnelle réelle",
    ],
    controls: ["Vérification documentaire (registre, pièces légales)", "Recoupement des liens d'intérêt", "Visite de site si nécessaire"],
    indicators: ["Taux de fournisseurs vérifiés", "Nombre d'alertes de conflit d'intérêt", "Taux de renouvellement fournisseur"],
    deliverables: ["Fiche de vérification fournisseur", "Rapport de conformité", "Base fournisseurs qualifiée"],
  },
];

export function getSolutionBySlug(slug: string): SolutionDefinition | undefined {
  return solutions.find((s) => s.slug === slug);
}
