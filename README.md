# CDF — Plateforme de Contrôle Opérationnel & Prévention des Pertes

> « Vous ne pouvez pas être partout. Nous vérifions pour vous. »

Plateforme B2B pour CDF (Cabinet de Contrôle Opérationnel & Prévention des Pertes) :
site public, espace client sécurisé, back-office CDF, gestion multi-tenant des
missions, anomalies, recommandations, rapports et documents.

## Stack technique

- **Frontend / Backend** : Next.js 16 (App Router, React Server Components, Server Actions), TypeScript, Tailwind CSS v4
- **Base de données** : Firestore (multi-tenant, isolation stricte par `companyId`)
- **Authentification** : Firebase Authentication (email/mot de passe) + cookie de session httpOnly vérifié côté serveur (Firebase Admin SDK)
- **Stockage** : Firestore uniquement (aucun Firebase Storage) — les fichiers
  (documents, rapports) sont lus en base64 côté client et stockés en ligne
  dans le document Firestore lui-même, plafonnés à 700 Ko
- **Email transactionnel** : Brevo (API HTTP)
- **Icônes** : lucide-react (aucun émoji dans l'interface)
- **Déploiement cible** : Vercel

## Architecture

```
src/
  app/
    (site)/       Site public (accueil, services, solutions, secteurs, diagnostic en ligne, etc.)
    (auth)/        Connexion, mot de passe oublié
    portail/       Espace client (dashboard, anomalies, recommandations, plan d'action, rapports, documents, contrôles...)
    admin/         Back-office CDF (clients, missions, anomalies, contrôleurs, audit, CMS léger...)
    api/           Route Handlers (formulaires publics, sessions, uploads, notifications)
    sitemap.ts, robots.ts
  components/
    ui/            Primitives (Button, Card, Badge, Table, Form...)
    site/          Header, footer, formulaires publics
    dashboard/     Shell (sidebar + mobile nav), widgets client/admin
    auth/          Formulaires de connexion
  lib/
    firebase/      Client SDK (browser) + Admin SDK (serveur, lazy-initialisé)
    auth/          RBAC (rôles/permissions), session serveur
    actions/       Server Actions du back-office (écritures, toutes basées sur le rôle vérifié côté serveur)
    data/          Contenu structuré (services, solutions, secteurs, FAQ, navigation)
    email/         Abstraction Brevo
    queries.ts      Lecture Firestore (tenant-scoped)
  types/           Types de domaine partagés
scripts/
  seed-demo.ts     Jeu de données de démonstration ("Restaurant Horizon")
firestore.rules, firebase.json
```

### Multi-tenant & sécurité

- Chaque entreprise cliente est un tenant identifié par `companyId`. Toutes les
  requêtes serveur (Server Components, Server Actions, Route Handlers) sont
  filtrées par le `companyId` de la session **vérifiée côté serveur** — jamais
  par une valeur envoyée par le client.
- L'authentification utilise un cookie de session httpOnly (`cdf_session`),
  créé par `/api/auth/session` à partir d'un ID token Firebase, puis vérifié
  côté serveur (`src/lib/auth/session.ts`) sur chaque page protégée.
- Les rôles (`SUPER_ADMIN_CDF`, `ADMIN_CDF`, `CONSULTANT_CDF`,
  `CONTROLEUR_TERRAIN`, `CLIENT_ADMIN`, `CLIENT_MANAGER`, `CLIENT_VIEWER`)
  sont stockés en Custom Claims Firebase (source de vérité pour les
  autorisations) et mirorés dans Firestore (`users/{uid}`) pour l'affichage.
- `firestore.rules` applique une isolation par tenant en seconde ligne de
  défense (voir les commentaires dans ce fichier pour le détail du modèle de
  menace). Il n'y a pas de `storage.rules` : la plateforme n'utilise pas
  Firebase Storage — les fichiers téléversés (documents, rapports) sont
  stockés directement dans Firestore en base64 (`fileUrl`, une data URI),
  plafonnés à 700 Ko par fichier pour rester sous la limite de 1 Mo par
  document Firestore (`src/lib/file-upload.ts`). Au-delà, compressez le
  fichier avant de le téléverser.
- Le journal d'audit (`audit_logs`) est en écriture seule via le SDK Admin —
  aucune interface, y compris administrateur, ne permet de le modifier ou de
  le supprimer.

### Ce qui est réellement implémenté (MVP — Phase 1)

Site public complet, diagnostic en ligne (CDF Risk Score™ calculé
serveur-side), demande de mission, espace client (dashboard, anomalies,
recommandations, plan d'action, contrôles, rapports, coffre documentaire,
notifications, paramètres/2FA), back-office CDF complet (clients, utilisateurs,
missions, anomalies, recommandations, contrôles, rapports, documents, équipe,
tarifs, contenu, journal d'audit), RBAC, multi-tenancy, emails transactionnels
Brevo.

### Ce qui est délibérément en phase 2 / 3 (roadmap, non simulé)

Messagerie CDF ↔ client, calendrier partagé, facturation/paiements Mobile
Money, application mobile contrôleur terrain, scoring assisté par IA. Ces
pages existent déjà dans la navigation avec un état vide clairement identifié
« Disponible en phase 2 » plutôt que des données fictives présentées comme
réelles.

## Démarrage local

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs (voir ci-dessous)
npm run dev
```

## Variables d'environnement

Voir `.env.example`. Les valeurs Firebase (client + Admin SDK) et la clé
Brevo vous ont été communiquées séparément (jamais commitées dans ce dépôt) —
à reporter dans `.env.local` en local, et dans **Project Settings → Environment
Variables** sur Vercel pour la production.

## Déployer les règles de sécurité Firebase

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules --project <votre-project-id>
```

## Données de démonstration

```bash
npm run seed:demo
```

Crée/actualise l'entreprise fictive « Restaurant Horizon » (Risk Score 62,
5 anomalies dont 2 critiques, 14 contrôles, ~68 % de plan d'action terminé)
avec un compte `CLIENT_ADMIN` de démonstration, pour présenter la plateforme
à des prospects sans exposer de données réelles.

## Créer le tout premier administrateur CDF

La création d'utilisateurs se fait depuis le back-office (`/admin/controleurs`
pour l'équipe CDF, `/admin/clients/[id]` pour les utilisateurs client), ce qui
suppose qu'un premier compte `SUPER_ADMIN_CDF` existe déjà. Pour l'amorcer,
exécutez une fois, avec vos identifiants Admin SDK :

```ts
// scripts/bootstrap-admin.ts (à adapter avec votre email)
import { getAuth } from "firebase-admin/auth";
// ... initialiser l'app Admin comme dans scripts/seed-demo.ts ...
const user = await getAuth(app).createUser({ email: "vous@cdf-controle.com", displayName: "Votre nom" });
await getAuth(app).setCustomUserClaims(user.uid, { role: "SUPER_ADMIN_CDF", companyId: null });
```

puis créez le document Firestore `users/{uid}` correspondant (mêmes champs
que dans `scripts/seed-demo.ts`).

## Déploiement (Vercel)

1. Connecter ce dépôt à un projet Vercel.
2. Renseigner les variables d'environnement (voir `.env.example`).
3. Déployer — `next build` est utilisé tel quel, aucune configuration
   supplémentaire n'est nécessaire.

## Licence

Propriétaire — CDF.
