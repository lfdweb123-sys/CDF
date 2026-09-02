/**
 * Seeds one fictional demo company ("Restaurant Horizon") end to end, so the
 * platform can be demonstrated to prospects without exposing any real client
 * data. Safe to re-run — it looks up the company by name and reuses it
 * instead of duplicating records.
 *
 * Usage:
 *   npm run seed:demo
 *
 * Requires the same FIREBASE_ADMIN_* env vars as the app itself (see
 * .env.example), loaded from .env.local when run locally.
 */
import { config } from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

config({ path: ".env.local" });

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing FIREBASE_ADMIN_* env vars — aborting seed.");
  process.exit(1);
}

const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore(app);
const auth = getAuth(app);

const COMPANY_NAME = "Restaurant Horizon";
const DEMO_USER_EMAIL = "demo@restaurant-horizon.cdf-controle.com";

async function main() {
  console.log(`Seeding demo company "${COMPANY_NAME}"...`);

  const existing = await db.collection("companies").where("name", "==", COMPANY_NAME).limit(1).get();
  const companyId = existing.empty ? db.collection("companies").doc().id : existing.docs[0].id;

  const riskScoreHistory = [
    { date: "2026-02-01", score: 78 },
    { date: "2026-04-01", score: 71 },
    { date: "2026-06-01", score: 65 },
    { date: "2026-08-01", score: 62 },
  ];

  await db.collection("companies").doc(companyId).set(
    {
      name: COMPANY_NAME,
      sector: "Restaurants",
      responsableName: "Directeur Général (démo)",
      responsableEmail: DEMO_USER_EMAIL,
      responsablePhone: "+229 00 00 00 00",
      location: "Cotonou, Bénin",
      employeeCount: 34,
      status: "actif",
      subscriptionPlan: "anti-leak",
      riskScore: 62,
      riskScoreHistory,
      createdAt: existing.empty ? new Date().toISOString() : existing.docs[0].data().createdAt,
      demo: true,
    },
    { merge: true }
  );

  // --- Demo client user -----------------------------------------------------
  let uid: string;
  try {
    const user = await auth.getUserByEmail(DEMO_USER_EMAIL);
    uid = user.uid;
  } catch {
    const user = await auth.createUser({ email: DEMO_USER_EMAIL, displayName: "Démo Restaurant Horizon", password: crypto.randomUUID() });
    uid = user.uid;
  }
  await auth.setCustomUserClaims(uid, { role: "CLIENT_ADMIN", companyId });
  await db.collection("users").doc(uid).set(
    {
      uid,
      email: DEMO_USER_EMAIL,
      displayName: "Démo Restaurant Horizon",
      role: "CLIENT_ADMIN",
      companyId,
      active: true,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // --- Anomalies (5 total, 2 critical) ---------------------------------------
  const anomalyDefs = [
    { domain: "Caisse", riskLevel: "critique", description: "Écart de caisse non expliqué constaté sur trois clôtures consécutives.", status: "action-requise", amount: 185000 },
    { domain: "Stocks", riskLevel: "critique", description: "Sorties de stock de boissons non justifiées par les ventes enregistrées.", status: "en-analyse", amount: 340000 },
    { domain: "Achats", riskLevel: "eleve", description: "Commandes passées auprès d'un fournisseur sans mise en concurrence.", status: "en-correction", amount: 0 },
    { domain: "Personnel", riskLevel: "modere", description: "Écarts ponctuels entre les plannings et les présences réelles constatées.", status: "resolu", amount: 0 },
    { domain: "Procédures", riskLevel: "faible", description: "Documentation de la procédure de clôture de caisse incomplète.", status: "resolu", amount: 0 },
  ];

  const anomaliesSnap = await db.collection("anomalies").where("companyId", "==", companyId).get();
  if (anomaliesSnap.empty) {
    let i = 1;
    for (const a of anomalyDefs) {
      await db.collection("anomalies").add({
        number: `AN-2026-${String(i).padStart(4, "0")}`,
        companyId,
        date: "2026-07-1" + i,
        domain: a.domain,
        riskLevel: a.riskLevel,
        description: a.description,
        observation: "Constat réalisé lors du contrôle terrain CDF de juillet 2026.",
        amountConcerned: a.amount || null,
        status: a.status,
        evidenceUrls: [],
        createdBy: "seed-script",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      i++;
    }
  }

  // --- Recommendations (~68% action plan progress) ---------------------------
  const recoDefs = [
    { problem: "Absence de rapprochement quotidien de caisse", action: "Mettre en place une procédure de clôture quotidienne signée.", responsible: "Directeur financier", progress: 90 },
    { problem: "Sorties de stock boissons non justifiées", action: "Instaurer un inventaire tournant hebdomadaire du bar.", responsible: "Responsable de salle", progress: 70 },
    { problem: "Achats hors mise en concurrence", action: "Exiger trois devis pour tout achat supérieur à 100 000 FCFA.", responsible: "Directeur Général", progress: 60 },
    { problem: "Écarts planning / présence", action: "Renforcer le contrôle de présence en cuisine et en salle.", responsible: "Responsable RH", progress: 50 },
  ];
  const recoSnap = await db.collection("recommendations").where("companyId", "==", companyId).get();
  if (recoSnap.empty) {
    for (const r of recoDefs) {
      await db.collection("recommendations").add({
        companyId,
        problem: r.problem,
        action: r.action,
        responsible: r.responsible,
        priority: "haute",
        dueDate: "2026-09-15",
        status: r.progress >= 100 ? "terminee" : "en-cours",
        progress: r.progress,
        comments: [],
        createdAt: new Date().toISOString(),
      });
    }
  }

  // --- Controls (14 realized + 2 scheduled) ----------------------------------
  const controlsSnap = await db.collection("controls").where("companyId", "==", companyId).get();
  if (controlsSnap.empty) {
    const domains = ["Caisse", "Stocks", "Achats", "Personnel", "Procédures"];
    for (let i = 0; i < 14; i++) {
      await db.collection("controls").add({
        companyId,
        domain: domains[i % domains.length],
        date: `2026-0${(i % 6) + 2}-1${(i % 8) + 1}`,
        controllerName: "Contrôleur CDF (démo)",
        status: "realise",
        result: i % 4 === 0 ? "non-conforme" : "conforme",
        score: 60 + (i % 30),
        anomaliesDetected: i % 3,
        recommendations: i % 2,
        createdAt: new Date().toISOString(),
      });
    }
    for (let i = 0; i < 2; i++) {
      await db.collection("controls").add({
        companyId,
        domain: domains[i],
        date: "2026-09-1" + (i + 2),
        controllerName: "Contrôleur CDF (démo)",
        status: "programme",
        result: "conforme",
        score: null,
        anomaliesDetected: 0,
        recommendations: 0,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // --- Report -----------------------------------------------------------------
  const reportsSnap = await db.collection("reports").where("companyId", "==", companyId).get();
  if (reportsSnap.empty) {
    await db.collection("reports").add({
      companyId,
      type: "mensuel",
      title: "Rapport CDF — Août 2026 (démonstration)",
      fileUrl: "https://example.com/demo/rapport-cdf-aout-2026.pdf",
      confidential: false,
      publishedAt: "2026-08-30",
      publishedBy: "Équipe CDF",
    });
  }

  console.log(`Done. Demo company id: ${companyId}`);
  console.log(`Demo login (CLIENT_ADMIN): ${DEMO_USER_EMAIL} — use "Mot de passe oublié" to set a password.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
