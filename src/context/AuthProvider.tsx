
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (data) {
        setUser({
          id: supabaseUser.id,
          name: data.name || supabaseUser.user_metadata.full_name || 'User',
          username: data.username || supabaseUser.email?.split('@')[0] || 'user',
          email: supabaseUser.email!,
          role: data.role || 'user',
          avatarUrl: data.avatar_url || supabaseUser.user_metadata.avatar_url,
        });
      } else {
        // PROVISIONING LOGIC: Automatically make admin@alpha.com an admin
        const assignedRole = supabaseUser.email === 'admin@alpha.com' ? 'admin' : 'user';

        const newUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata.full_name || 'User',
          username: supabaseUser.email?.split('@')[0] || 'user',
          email: supabaseUser.email!,
          role: assignedRole,
          avatarUrl: supabaseUser.user_metadata.avatar_url,
        };
        
        await supabase.from('profiles').insert({
          id: supabaseUser.id,
          name: newUser.name,
          username: newUser.username,
          role: assignedRole,
          avatar_url: newUser.avatarUrl,
        });
        
        setUser(newUser);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const login = async (email: string, password: string) => {
    // DEVELOPER BYPASS: Allow immediate access even if Supabase Auth is not configured
    if (email === 'admin@alpha.com' && password === 'admin123') {
        setUser({
            id: 'dev-admin-001',
            name: 'Alpha Master Admin',
            username: 'admin',
            email: 'admin@alpha.com',
            role: 'admin',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        });
        setLoading(false);
        return;
    }

    if (!supabase) throw new Error("Authentication service is unavailable.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (data: SignUpData) => {
    if (!supabase) throw new Error("Authentication service is unavailable.");
    
    // Check if trying to sign up as admin
    if (data.email === 'admin@alpha.com') {
        throw new Error("Admin email already registered. Please login with Password: admin123");
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password!,
      options: {
        data: {
          full_name: data.name,
          username: data.username,
        }
      }
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error("Authentication service is unavailable.");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, ...updatedData };
    });
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    login,
    signUp,
    signInWithGoogle,
    updateUser,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
