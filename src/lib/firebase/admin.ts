import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Server-only Firebase Admin SDK — never import this file from a Client Component.
// Credentials come exclusively from environment variables (Vercel project settings
// in production, .env.local in development). The private key is never committed.
//
// NOTE — package.json pins `jose` to 4.15.9 via "overrides". firebase-admin's
// transitive dependency jwks-rsa@4.x does a plain `require("jose")`, but jose
// v5+ ships ESM-only (no "require" export condition), which crashes on Vercel
// with ERR_REQUIRE_ESM the moment `firebase-admin/auth` is imported. jose
// 4.15.9 is the last release with a working CJS build and the same
// importJWK/exportSPKI API jwks-rsa relies on — do not remove the override or
// bump firebase-admin without re-checking this.
//
// Initialization is lazy (first real use) rather than at module load, so that
// `next build`'s route-collection step — which imports every route module
// without running it — does not require these secrets to be present.
let cachedApp: App | null = null;

function getAdminApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().length) {
    cachedApp = getApps()[0];
    return cachedApp;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are missing. Set FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  cachedApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return cachedApp;
}

let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

function getAdminAuth(): Auth {
  if (!cachedAuth) cachedAuth = getAuth(getAdminApp());
  return cachedAuth;
}

function getAdminDb(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(getAdminApp());
    // Several call sites build Firestore payloads by spreading an object that
    // may contain an explicit `undefined` (e.g. `companyId: x ?? undefined`
    // for CDF staff, who have no company). The SDK rejects those by default
    // ("Cannot use 'undefined' as a Firestore value") — this setting drops
    // such keys instead of throwing, matching how `undefined` behaves
    // everywhere else in JS (an absent property).
    cachedDb.settings({ ignoreUndefinedProperties: true });
  }
  return cachedDb;
}

// Proxies keep call sites unchanged (`adminAuth.foo()`, `adminDb.collection(...)`)
// while deferring real initialization until a method is actually accessed.
// Functions are bound to the real instance so internal private-field access
// (used throughout the firebase-admin SDK) sees the real object, not the proxy.
function lazyProxy<T extends object>(getInstance: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      const instance = getInstance();
      const value = Reflect.get(instance as object, prop);
      return typeof value === "function" ? value.bind(instance) : value;
    },
  });
}

export const adminAuth: Auth = lazyProxy(getAdminAuth);
export const adminDb: Firestore = lazyProxy(getAdminDb);
