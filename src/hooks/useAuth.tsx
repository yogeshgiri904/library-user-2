import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { libraryIdToAuthEmail, supabase } from '../lib/supabase';
import type { Student } from '../types';

type AuthContextValue = {
  session: Session | null;
  student: Student | null;
  loading: boolean;
  login: (libraryId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshStudent: () => Promise<void>;
  isActive: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isMembershipActive(student: Student | null) {
  if (!student) return false;
  const renewal = new Date(`${student.renewal_date}T23:59:59+05:30`);
  return student.membership_status === 'active' && renewal >= new Date();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = useCallback(async (authUserId?: string) => {
    const uid = authUserId || (await supabase.auth.getUser()).data.user?.id;
    if (!uid) {
      setStudent(null);
      return;
    }
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', uid)
      .single();
    if (error) throw error;
    setStudent(data as Student);
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user.id) {
        try {
          await fetchStudent(data.session.user.id);
          await supabase.rpc('lazy_auto_checkout');
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user.id) {
        try {
          await fetchStudent(nextSession.user.id);
          await supabase.rpc('lazy_auto_checkout');
        } catch (error) {
          console.error(error);
          setStudent(null);
        }
      } else {
        setStudent(null);
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchStudent]);

  const login = useCallback(async (libraryId: string, password: string) => {
    const email = libraryIdToAuthEmail(libraryId);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Invalid Library ID or password.');
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setStudent(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    student,
    loading,
    login,
    logout,
    refreshStudent: async () => fetchStudent(),
    isActive: isMembershipActive(student)
  }), [session, student, loading, login, logout, fetchStudent]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
