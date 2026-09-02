import {
  SearchCheck,
  ShieldAlert,
  Radar,
  ClipboardCheck,
  Eye,
  Footprints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceDefinition {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: LucideIcon;
  summary: string;
  problem: string;
  approach: { title: string; description: string }[];
  deliverables: string[];
  forWho: string[];
}

export const services: ServiceDefinition[] = [
  {
    slug: "diagnostic",
    name: "CDF Diagnostic",
    shortName: "Diagnostic",
    tagline: "Identifier les vulnérabilités de l'entreprise",
    icon: SearchCheck,
    summary:
      "Une évaluation structurée de vos opérations — caisse, stocks, achats, personnel, procédures — pour situer précisément où se trouvent vos zones de risque avant qu'elles ne deviennent des pertes.",
    problem:
      "La plupart des dirigeants savent que des pertes existent quelque part dans leurs opérations, sans pouvoir les localiser ni les quantifier. Sans diagnostic structuré, les décisions de contrôle reposent sur des impressions plutôt que sur des faits.",
    approach: [
      { title: "Cadrage", description: "Compréhension de votre activité, de vos processus clés et de vos points de vente ou sites." },
      { title: "Collecte terrain", description: "Observation des opérations, entretiens, échantillonnage de documents et de transactions." },
      { title: "Analyse", description: "Croisement des constats avec les indicateurs financiers et opérationnels disponibles." },
      { title: "Restitution", description: "Présentation du CDF Risk Score™ et des vulnérabilités classées par priorité." },
    ],
    deliverables: [
      "Rapport de diagnostic détaillé par domaine",
      "CDF Risk Score™ initial",
      "Cartographie des vulnérabilités identifiées",
      "Plan de recommandations priorisées",
    ],
    forWho: ["Dirigeants souhaitant une première évaluation objective", "Entreprises en croissance rapide", "Repreneurs avant ou après acquisition"],
  },
  {
    slug: "investigation",
    name: "CDF Investigation",
    shortName: "Investigation",
    tagline: "Analyser une anomalie ou un problème déjà constaté",
    icon: Radar,
    summary:
      "Lorsqu'une anomalie a déjà été repérée — un écart de caisse, une rupture de stock inexpliquée, une facture suspecte — CDF mène une analyse rigoureuse pour en établir les faits, sans présumer de leur cause.",
    problem:
      "Face à une irrégularité constatée, agir dans la précipitation ou sans méthode expose l'entreprise à des erreurs d'appréciation, voire à des risques juridiques. Une analyse structurée protège autant l'entreprise que les personnes concernées.",
    approach: [
      { title: "Prise en charge du signalement", description: "Cadrage du périmètre et des faits initialement constatés." },
      { title: "Collecte de preuves", description: "Rassemblement documenté et horodaté des éléments factuels disponibles." },
      { title: "Analyse factuelle", description: "Reconstitution des faits sans qualification hâtive ni jugement anticipé." },
      { title: "Rapport et recommandations", description: "Restitution des constats et des options d'action, dans le cadre légal applicable." },
    ],
    deliverables: [
      "Rapport d'investigation factuel et daté",
      "Dossier de preuves organisé",
      "Recommandations de mesures correctives",
      "Appui à la décision, dans le respect du cadre juridique applicable",
    ],
    forWho: ["Entreprises confrontées à une anomalie déjà identifiée", "Directions souhaitant objectiver une situation sensible"],
  },
  {
    slug: "anti-leak",
    name: "CDF Anti-Leak",
    shortName: "Anti-Leak",
    tagline: "Identifier les sources de pertes et sécuriser vos opérations",
    icon: ShieldAlert,
    summary:
      "Un programme complet combinant diagnostic global et mise en place de mécanismes de sécurisation durables, pour traiter les principales sources de pertes de façon structurelle.",
    problem:
      "Un diagnostic ponctuel identifie des failles, mais sans mécanismes de sécurisation installés, les mêmes pertes réapparaissent. CDF Anti-Leak va au-delà du constat pour ancrer des solutions dans la durée.",
    approach: [
      { title: "Diagnostic global", description: "Évaluation complète des domaines à risque de l'entreprise." },
      { title: "Priorisation", description: "Identification des sources de pertes les plus significatives." },
      { title: "Sécurisation", description: "Déploiement de procédures, outils et points de contrôle adaptés." },
      { title: "Vérification", description: "Contrôle du bon fonctionnement des mécanismes mis en place." },
    ],
    deliverables: [
      "Cartographie des sources de pertes",
      "Mécanismes de sécurisation déployés",
      "Documentation des nouvelles procédures",
      "Rapport de mise en œuvre",
    ],
    forWho: ["Entreprises ayant déjà identifié des pertes récurrentes", "Directions souhaitant une action corrective globale"],
  },
  {
    slug: "control",
    name: "CDF Control",
    shortName: "Control",
    tagline: "Mettre en place des procédures et systèmes de contrôle",
    icon: ClipboardCheck,
    summary:
      "CDF conçoit et installe des procédures de contrôle interne adaptées à votre taille et à votre secteur — rapprochements, séparations de tâches, validations, checklists — pour que le contrôle devienne un réflexe organisationnel.",
    problem:
      "Beaucoup de PME fonctionnent sans procédures formalisées : le contrôle repose sur la confiance ou sur la présence du dirigeant. Cela ne tient pas à l'échelle, ni dans la durée.",
    approach: [
      { title: "État des lieux", description: "Analyse des procédures existantes, formelles ou informelles." },
      { title: "Conception", description: "Élaboration de procédures de contrôle adaptées à vos ressources." },
      { title: "Déploiement", description: "Formation des équipes et mise en application progressive." },
      { title: "Ajustement", description: "Revue après quelques semaines d'application réelle." },
    ],
    deliverables: [
      "Manuel de procédures de contrôle interne",
      "Checklists opérationnelles par domaine",
      "Formation des équipes concernées",
      "Indicateurs de suivi de conformité",
    ],
    forWho: ["Entreprises sans procédures formalisées", "PME en structuration de leur gouvernance interne"],
  },
  {
    slug: "watch",
    name: "CDF Watch",
    shortName: "Watch",
    tagline: "Supervision continue des opérations",
    icon: Eye,
    summary:
      "Un abonnement de supervision mensuelle : CDF suit vos indicateurs de risque dans la durée, réalise des contrôles réguliers et vous alerte dès qu'un point nécessite votre attention.",
    problem:
      "Un contrôle ponctuel donne une photographie à un instant donné. Sans supervision continue, une entreprise ne sait pas si sa situation s'améliore ou se dégrade entre deux missions.",
    approach: [
      { title: "Mise en place", description: "Définition des indicateurs suivis et de la fréquence de contrôle." },
      { title: "Contrôles périodiques", description: "Vérifications régulières selon un calendrier convenu." },
      { title: "Suivi du Risk Score", description: "Mesure de l'évolution du niveau de risque dans le temps." },
      { title: "Alertes", description: "Notification dès qu'une anomalie ou une échéance le justifie." },
    ],
    deliverables: [
      "Dashboard de supervision en continu",
      "Rapports mensuels",
      "Alertes en temps réel sur anomalies critiques",
      "Suivi de l'évolution du CDF Risk Score™",
    ],
    forWho: ["Entreprises multi-sites", "Directions souhaitant un suivi permanent plutôt que ponctuel"],
  },
  {
    slug: "controle-terrain",
    name: "Contrôle Terrain",
    shortName: "Contrôle Terrain",
    tagline: "Vérifications physiques réalisées par les équipes CDF",
    icon: Footprints,
    summary:
      "Des visites et vérifications physiques sur site — caisse, stocks, points de vente, chantiers — menées par des contrôleurs CDF formés, avec compte rendu détaillé et preuves à l'appui.",
    problem:
      "Certaines vérifications ne peuvent se faire qu'en présence physique : comptage de stock, observation d'un point de vente, vérification d'un chantier. CDF déploie des équipes formées pour ces contrôles de terrain.",
    approach: [
      { title: "Planification", description: "Définition du périmètre et de la fréquence des visites." },
      { title: "Visite terrain", description: "Contrôle sur site à l'aide de checklists digitales standardisées." },
      { title: "Preuves", description: "Collecte de photos, documents et observations horodatées." },
      { title: "Compte rendu", description: "Restitution rapide au client via le dashboard CDF." },
    ],
    deliverables: [
      "Rapport de contrôle terrain par visite",
      "Preuves photographiques et documentaires",
      "Score de conformité par site",
      "Recommandations immédiates si nécessaire",
    ],
    forWho: ["Réseaux de points de vente", "Restaurants et commerces multi-sites", "Chantiers et sites de production"],
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return services.find((s) => s.slug === slug);
}
