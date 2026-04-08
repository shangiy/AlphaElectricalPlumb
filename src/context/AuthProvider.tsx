'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserByEmail, signUpUser } from '@/lib/data';
import type { MockUser } from '@/lib/types';
import { auth, db } from '@/lib/firebase';
import { 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  avatarUrl?: string;
}

interface SignUpData {
    name: string;
    username: string;
    email: string;
    password?: string;
    avatarUrl?: string;
    uid?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (signUpData: SignUpData) => Promise<User>;
  signInWithGoogle: () => Promise<User | null>;
  signInWithFacebook: () => Promise<User | null>;
  updateUser: (updatedData: Partial<User>) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // PERSISTENCE HANDSHAKE: Listen for auth state changes on mount
  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch the full profile from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || 'User',
              username: data.username || firebaseUser.email?.split('@')[0] || 'user',
              email: firebaseUser.email!,
              role: data.role || 'user',
              avatarUrl: data.avatarUrl || firebaseUser.photoURL || undefined,
            });
          } else {
            // If user exists in Auth but not Firestore, create the doc
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              username: firebaseUser.email?.split('@')[0] || 'user',
              email: firebaseUser.email!,
              role: 'user',
              avatarUrl: firebaseUser.photoURL || undefined,
            };
            await setDoc(doc(db, "users", firebaseUser.uid), {
              ...newUser,
              lastSeen: new Date().toISOString(),
              signedUp: new Date().toISOString()
            });
            setUser(newUser);
          }
        } catch (error) {
          console.error("Error restoring auth session:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) return;
    setLoading(true);
    try {
      // 1. Try to sign in with real Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // 2. Fallback: If user doesn't exist in Auth but exists in Mock Data (like admin)
      // we perform the "Handshake" by creating them in Auth automatically
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        const mockUser = await getUserByEmail(email);
        if (mockUser && mockUser.password === password) {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, "users", result.user.uid), {
            name: mockUser.name,
            username: mockUser.username,
            email: mockUser.email,
            role: mockUser.role,
            avatarUrl: mockUser.avatarUrl,
            lastSeen: new Date().toISOString(),
            signedUp: new Date().toISOString()
          });
          return;
        }
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (firebaseUser: FirebaseUser): Promise<User> => {
    if (!firebaseUser.email) {
        throw new Error('Social account must have an email address.');
    }
    
    // The profile sync is now handled by the central onAuthStateChanged listener
    // but we return the user object here for immediate feedback in the component
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    const data = userDoc.exists() ? userDoc.data() : {};
    
    return {
        id: firebaseUser.uid,
        name: data.name || firebaseUser.displayName || 'Social User',
        username: data.username || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        role: data.role || 'user',
        avatarUrl: data.avatarUrl || firebaseUser.photoURL || undefined,
    };
  };

  const signInWithGoogle = async (): Promise<User | null> => {
      const provider = new GoogleAuthProvider();
      try {
          const result = await signInWithPopup(auth, provider);
          return await handleSocialSignIn(result.user);
      } catch (error: any) {
          if (error.code === 'auth/popup-closed-by-user') return null;
          throw error;
      }
  }

  const signInWithFacebook = async (): Promise<User | null> => {
      const provider = new FacebookAuthProvider();
      try {
          const result = await signInWithPopup(auth, provider);
          return await handleSocialSignIn(result.user);
      } catch (error: any) {
           if (error.code === 'auth/popup-closed-by-user') return null;
          throw error;
      }
  }

  const signUp = async (data: SignUpData): Promise<User> => {
    if (!auth) throw new Error("Auth service unavailable");
    setLoading(true);
    try {
        const result = await createUserWithEmailAndPassword(auth, data.email, data.password!);
        const newUser: User = {
            id: result.user.uid,
            name: data.name,
            username: data.username,
            email: data.email,
            role: 'user',
            avatarUrl: data.avatarUrl,
        };
        await setDoc(doc(db, "users", result.user.uid), {
            ...newUser,
            lastSeen: new Date().toISOString(),
            signedUp: new Date().toISOString()
        });
        return newUser;
    } finally {
        setLoading(false);
    }
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, ...updatedData };
    })
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  const value = {
    user,
    login,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    updateUser,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
