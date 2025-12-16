import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let timeoutId;
    let isResolved = false;
    let subscription = null;
    
    const getSession = async () => {
      try {
        // Timeout más corto para la petición individual (2 segundos)
        const sessionPromise = supabase.auth.getSession().catch(err => {
          console.warn('Session promise rejected:', err);
          return { data: { session: null }, error: err };
        });
        
        const timeoutPromise = new Promise((resolve) => 
          setTimeout(() => {
            console.warn('Session request timeout, using null session');
            resolve({ data: { session: null }, error: { message: 'Timeout' } });
          }, 2000)
        );
        
        const result = await Promise.race([sessionPromise, timeoutPromise]);
        const { data: { session } = {}, error } = result || { data: { session: null }, error: null };
        
        if (error && error.message !== 'Timeout') {
          console.error('Error getting session:', error);
        }
        
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          handleSession(session || null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        // Aún así resolvemos con null para que la app no se quede colgada
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          handleSession(null);
        }
      }
    };

    getSession();

    // Timeout de seguridad: si después de 5 segundos no hay respuesta, resolvemos como no autenticado
    timeoutId = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        console.warn('Session check timeout, resolving as unauthenticated');
        handleSession(null);
      }
    }, 5000);

    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!isResolved) {
            isResolved = true;
            clearTimeout(timeoutId);
          }
          handleSession(session);
        }
      );
      subscription = data.subscription;
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      // Si falla el listener, aún resolvemos
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeoutId);
        handleSession(null);
      }
    }

    return () => {
      clearTimeout(timeoutId);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isLoggedIn: Boolean(user),
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

