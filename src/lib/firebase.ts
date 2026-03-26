// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDZxNGOFmxyGXFi7qz0PnUy-tulDlzkCPY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "alpha-plumbing-electrical.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "alpha-plumbing-electrical",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "alpha-plumbing-electrical.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "388140139017",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:388140139017:web:8ae3562718181e55fceed8"
};

// Safety check: Prevents hard crashes during Next.js build/prerendering phase 
const isConfigAvailable = !!(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey);

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
