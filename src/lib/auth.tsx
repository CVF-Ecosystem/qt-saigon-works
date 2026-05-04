import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface Profile {
  id: string;
  company_id: string;
  full_name: string;
  role: 'owner' | 'accountant' | 'project_manager' | 'site_supervisor' | 'hr' | 'viewer';
  phone: string | null;
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isE2eAuthBypassEnabled() {
  return (
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    window.localStorage.getItem('qt-e2e-auth-bypass') === '1'
  );
}

const e2eUser = {
  id: '00000000-0000-4000-8000-000000000001',
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2026-05-05T00:00:00.000Z',
  email: 'e2e@qtsaigon.local',
  user_metadata: {},
} as User;

const e2eProfile: Profile = {
  id: e2eUser.id,
  company_id: '00000000-0000-0000-0000-000000000001',
  full_name: 'E2E Owner',
  role: 'owner',
  phone: null,
  active: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const e2eAuthBypass = isE2eAuthBypassEnabled();
  const [user, setUser] = useState<User | null>(e2eAuthBypass ? e2eUser : null);
  const [profile, setProfile] = useState<Profile | null>(
    e2eAuthBypass ? e2eProfile : null
  );
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!e2eAuthBypass);

  useEffect(() => {
    if (e2eAuthBypass) {
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .eq('active', true)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    if (e2eAuthBypass) {
      return { error: null };
    }

    if (!supabase) {
      return { error: new Error('Supabase chưa được cấu hình') };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signOut() {
    if (e2eAuthBypass) {
      return;
    }

    if (!supabase) return;
    await supabase.auth.signOut();
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
