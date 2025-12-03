'use client';

import { createContext, useContext, useEffect, useState, useRef, startTransition } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  profile: { nickname: string | null } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 서버 재시작 감지를 위한 키
const SERVER_RESTART_KEY = 'server_restart_timestamp';
const LAST_SESSION_KEY = 'last_session_timestamp';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<{ nickname: string | null } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const hasClearedSession = useRef(false);

  // 모든 세션을 만료시키는 함수
  const clearAllSessions = async () => {
    try {
      // Supabase 세션 만료
      await supabase.auth.signOut();

      // 로컬 스토리지의 Supabase 관련 데이터 삭제
      if (typeof window !== 'undefined') {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // 세션 스토리지의 Supabase 관련 데이터 삭제
        const sessionKeysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      }

      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error clearing sessions:', error);
    }
  };

  useEffect(() => {
    // 초기 세션 확인
    const initializeSession = async () => {
      if (hasClearedSession.current) return;

      try {
        // Supabase 세션 확인
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing session:', error);
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
    };

    initializeSession();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', userId)
        .eq('status', 'valid')
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data ? { nickname: data.nickname } : null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, logout, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

