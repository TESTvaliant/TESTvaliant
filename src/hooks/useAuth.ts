// website for testvaliant
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type AuthUser = {
  id: string;
  email?: string | null;
} | null;

type AuthSession = {
  access_token: string;
  refresh_token?: string | null;
  user?: AuthUser;
} | null;

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser>(null);
  const [session, setSession] = useState<AuthSession>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const syncSessionState = async () => {
    const { data } = await supabase.auth.getSession();

    setSession(data.session ?? null);
    setUser((data.session?.user ?? data.user ?? null) as AuthUser);
    setIsAdmin(!!data.isAdmin);
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      await syncSessionState();

      if (mounted) {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) {
        return;
      }

      setSession(nextSession as AuthSession);
      setUser((nextSession?.user ?? null) as AuthUser);

      if (!nextSession) {
        setIsAdmin(false);
        return;
      }

      await syncSessionState();
    });

    void initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshAdminStatus = async () => {
    await syncSessionState();
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    setSession((data.session ?? null) as AuthSession);
    setUser((data.user ?? null) as AuthUser);
    setIsAdmin(!!data.isAdmin);

    return { data, error: null };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      return { error };
    }

    setSession((data.session ?? null) as AuthSession);
    setUser((data.user ?? null) as AuthUser);
    setIsAdmin(!!data.isAdmin);

    return { data, error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
    return { error };
  };

  return {
    user,
    session,
    isLoading,
    isAdmin,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
    refreshAdminStatus,
  };
};
