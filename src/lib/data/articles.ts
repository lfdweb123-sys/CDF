export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  publishedAt: string;
}

export const articleCategories = [
  "Prévention des pertes",
  "Contrôle interne",
  "Gestion des stocks",
  "Gestion de caisse",
  "Risques PME",
  "Gouvernance",
];

export const articles: Article[] = [
  {
    slug: "5-signes-que-votre-entreprise-a-besoin-dun-controle-interne",
    title: "5 signes que votre entreprise a besoin d'un contrôle interne renforcé",
    category: "Contrôle interne",
    publishedAt: "2026-06-02",
    excerpt: "Des écarts de caisse récurrents à l'absence de séparation des tâches, voici les signaux qui doivent alerter un dirigeant.",
    content: [
      "Beaucoup de dirigeants découvrent l'importance du contrôle interne après avoir constaté une perte, plutôt qu'en amont. Certains signaux permettent pourtant d'anticiper.",
      "Premier signal : des écarts de caisse ou de stock qui reviennent mois après mois sans explication satisfaisante. Deuxième signal : une même personne qui commande, réceptionne et paie une facture, sans regard croisé. Troisième signal : une croissance rapide de l'entreprise sans que les procédures n'aient évolué en conséquence.",
      "Quatrième signal : l'absence de tout rapprochement périodique entre les documents comptables et la réalité opérationnelle. Cinquième signal : le dirigeant reste la seule personne capable de repérer une anomalie, ce qui ne tient pas à l'échelle de l'entreprise.",
      "Un diagnostic structuré permet de objectiver ces signaux et de prioriser les actions correctives.",
    ],
  },
  {
    slug: "rapprochement-de-caisse-quotidien-pourquoi-cest-non-negociable",
    title: "Rapprochement de caisse quotidien : pourquoi c'est non négociable",
    category: "Gestion de caisse",
    publishedAt: "2026-05-14",
    excerpt: "Le rapprochement quotidien de caisse est l'un des contrôles les plus simples à mettre en place — et l'un des plus souvent négligés.",
    content: [
      "Un rapprochement de caisse consiste à comparer, chaque jour, les encaissements enregistrés par le système avec le contenu réel de la caisse.",
      "Sans ce contrôle, les petits écarts s'accumulent sans être détectés à temps, et deviennent plus difficiles à expliquer une fois le temps écoulé.",
      "La mise en place d'une procédure de clôture quotidienne, avec un responsable clairement identifié, est l'un des contrôles les plus rentables qu'une entreprise puisse instaurer.",
    ],
  },
  {
    slug: "inventaire-tournant-vs-inventaire-annuel",
    title: "Inventaire tournant ou inventaire annuel : que choisir ?",
    category: "Gestion des stocks",
    publishedAt: "2026-04-22",
    excerpt: "L'inventaire annuel donne une photographie une fois par an. L'inventaire tournant permet un suivi continu, plus réactif face aux écarts.",
    content: [
      "L'inventaire annuel reste la pratique la plus répandue dans les PME, mais il présente une limite majeure : il ne détecte les écarts qu'une fois par an, quand la cause est souvent devenue difficile à retracer.",
      "L'inventaire tournant consiste à contrôler régulièrement des portions du stock, selon un calendrier défini. Il permet de détecter les écarts plus tôt et de concentrer les efforts sur les références les plus sensibles.",
      "Le choix dépend de la taille du stock et des ressources disponibles — une combinaison des deux approches est souvent la plus efficace.",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
