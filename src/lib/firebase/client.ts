"use client";

import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Public Firebase web config — these values are NOT secret (they identify the
// project to Google's servers; access is enforced by Firestore security
// rules, not by hiding this config). Provided via NEXT_PUBLIC_* env vars so the
// same build can target different Firebase projects (dev/staging/prod) without
// a code change.
//
// Firebase Storage is intentionally not used anywhere in this app — the
// platform's only storage backend is Firestore (files are kept inline as
// base64 data URIs, see src/lib/file-upload.ts). Do not add `firebase/storage`
// back without updating firebase.json / storage.rules accordingly.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
