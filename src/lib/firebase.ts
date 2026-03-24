// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Safety check: Prevents hard crashes during Next.js build/prerendering phase 
// if environment variables are not yet provided to the build environment.
const isConfigAvailable = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const app = isConfigAvailable 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

/**
 * Initialize Firestore with experimentalForceLongPolling.
 * This is often necessary in cloud-based development environments (like Cloud Workstations or IDX)
 * where WebSocket connections (Firestore's default) may be blocked or unstable.
 */
const db = app ? initializeFirestore(app, {
  experimentalForceLongPolling: true,
}) : null as any;

const auth = app ? getAuth(app) : null as any;
const storage = app ? getStorage(app) : null as any;

export { app, db, auth, storage };
