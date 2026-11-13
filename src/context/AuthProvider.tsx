
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

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
  login: (email: string, password: string) => Promise<void>;
  signUp: (signUpData: SignUpData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
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
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    if (!supabase) return;
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', supabaseUser.id).maybeSingle();
      if (profile) {
        setUser({
          id: supabaseUser.id,
          name: profile.full_name || supabaseUser.user_metadata.full_name || 'User',
          username: profile.username || supabaseUser.email?.split('@')[0] || 'user',
          email: supabaseUser.email!,
          role: (profile.role || 'user') as 'admin' | 'staff' | 'user',
          avatarUrl: profile.avatar_url || supabaseUser.user_metadata.avatar_url,
        });
      } else {
        const newUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata.full_name || 'User',
          username: supabaseUser.email?.split('@')[0] || 'user',
          email: supabaseUser.email!,
          role: 'user',
          avatarUrl: supabaseUser.user_metadata.avatar_url,
        };
        await supabase.from('profiles').upsert({ id: newUser.id, full_name: newUser.name, username: newUser.username, role: 'user', email: newUser.email });
        setUser(newUser);
      }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (nextAuthStatus === 'authenticated' && (nextAuthSession as any)?.id_token && !user && supabase) {
      supabase.auth.signInWithIdToken({ provider: 'google', token: (nextAuthSession as any).id_token }).then(({ data }) => {
        if (data.user) fetchProfile(data.user);
      });
    }
  }, [nextAuthSession, nextAuthStatus, user, fetchProfile]);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => { if (session?.user) fetchProfile(session.user); else setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) fetchProfile(session.user);
      else if (event === 'SIGNED_OUT') { setUser(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const value = {
    user,
    login: async (email, password) => { 
      const { error } = await supabase.auth.signInWithPassword({ email, password }); 
      if (error) throw error;
    },
    signUp: async (data) => { 
      const { error } = await supabase.auth.signUp({ 
        email: data.email, 
        password: data.password!, 
        options: { 
          data: { 
            full_name: data.name, 
            username: data.username,
            avatar_url: data.avatarUrl
          } 
        } 
      }); 
      if (error) throw error;
    },
    signInWithGoogle: async () => { await nextAuthSignIn('google'); },
    signInWithFacebook: async () => { await supabase.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo: `${window.location.origin}/auth/callback` } }); },
    signInWithApple: async () => { await supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: `${window.location.origin}/auth/callback` } }); },
    signInWithGithub: async () => { await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: `${window.location.origin}/auth/callback` } }); },
    updateUser: (data) => setUser(u => u ? { ...u, ...data } : null),
    logout: async () => { await supabase.auth.signOut(); await nextAuthSignOut({ redirect: false }); setUser(null); },
    loading: loading || nextAuthStatus === 'loading',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
