
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signUpUser, getUserByEmail } from '@/lib/data';
import type { MockUser } from '@/lib/types';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, User as FirebaseUser } from 'firebase/auth';


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
}

interface AuthContextType {
  user: User | null;
  login: (userData: Omit<User, 'id'>) => void;
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

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (userData: Omit<User, 'id'>) => {
    const existingUser = await getUserByEmail(userData.email);
    if(existingUser) {
        setUser({
            id: existingUser.id,
            name: existingUser.name,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
            avatarUrl: existingUser.avatarUrl,
        });
    }
  };

  const handleSocialSignIn = async (firebaseUser: FirebaseUser): Promise<User> => {
    if (!firebaseUser.email) {
        throw new Error('Social account must have an email address.');
    }
    
    let appUser = await getUserByEmail(firebaseUser.email);

    if (!appUser) {
        // If user doesn't exist, create a new one
        const newUser: SignUpData = {
            name: firebaseUser.displayName || 'Social User',
            username: firebaseUser.email.split('@')[0], // Create a username from email
            email: firebaseUser.email,
            avatarUrl: firebaseUser.photoURL || undefined,
        };
        appUser = await signUpUser(newUser);
    }
    
    login(appUser);
    return appUser;
  };

  const signInWithGoogle = async (): Promise<User | null> => {
      const provider = new GoogleAuthProvider();
      try {
          const result = await signInWithPopup(auth, provider);
          return await handleSocialSignIn(result.user);
      } catch (error: any) {
          console.error("Google sign-in error", error);
          if (error.code === 'auth/popup-closed-by-user') {
              return null;
          }
          throw new Error(error.message);
      }
  }

  const signInWithFacebook = async (): Promise<User | null> => {
      const provider = new FacebookAuthProvider();
      try {
          const result = await signInWithPopup(auth, provider);
          return await handleSocialSignIn(result.user);
      } catch (error: any) {
          console.error("Facebook sign-in error", error);
           if (error.code === 'auth/popup-closed-by-user') {
              return null;
          }
          throw new Error(error.message);
      }
  }

  const signUp = async (signUpData: SignUpData): Promise<User> => {
    const newUser = await signUpUser(signUpData);
    login(newUser);
    return newUser;
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, ...updatedData };
    })
  };

  const logout = () => {
    setUser(null);
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
