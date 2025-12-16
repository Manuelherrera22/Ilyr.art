import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const ProfileContext = createContext(undefined);

export const ProfileProvider = ({ children }) => {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessTracked, setAccessTracked] = useState(false);

  const fetchProfile = useCallback(async (user) => {
    if (user) {
      setLoading(true);
      
      // Timeout de seguridad: si después de 10 segundos no hay respuesta, resolvemos con perfil por defecto
      const timeoutId = setTimeout(() => {
        console.warn('Profile fetch timeout, using default profile');
        setProfile({
          full_name: user.email?.split('@')[0] || 'Usuario',
          profile_type: 'client'
        });
        setLoading(false);
      }, 10000);
      
      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select('full_name, profile_type, client_account_id')
          .eq('id', user.id)
          .single();

        clearTimeout(timeoutId);

        if (error && status !== 406) {
          console.error('Error fetching profile:', error);
          // Si hay error pero no es 406, intentamos crear perfil por defecto
          if (status === 404 || status === 0) {
            console.log('No profile found, creating default profile...');
            try {
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([
                  {
                    id: user.id,
                    full_name: user.email?.split('@')[0] || 'Usuario',
                    profile_type: 'client'
                  }
                ]);

              if (insertError) {
                console.error('Error creating profile:', insertError);
                // Aún así establecemos un perfil mínimo para que la app funcione
                setProfile({
                  full_name: user.email?.split('@')[0] || 'Usuario',
                  profile_type: 'client'
                });
              } else {
                setProfile({
                  full_name: user.email?.split('@')[0] || 'Usuario',
                  profile_type: 'client'
                });
              }
            } catch (insertErr) {
              console.error('Error in profile creation:', insertErr);
              setProfile({
                full_name: user.email?.split('@')[0] || 'Usuario',
                profile_type: 'client'
              });
            }
          } else {
            // Para otros errores, establecemos un perfil mínimo
            setProfile({
              full_name: user.email?.split('@')[0] || 'Usuario',
              profile_type: 'client'
            });
          }
        } else if (data) {
          setProfile(data);
        } else {
          // Si no hay data ni error, creamos perfil por defecto
          try {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: user.id,
                  full_name: user.email?.split('@')[0] || 'Usuario',
                  profile_type: 'client'
                }
              ]);

            if (insertError) {
              if (process.env.NODE_ENV === 'development') {
                console.error('Error creating profile:', insertError);
              }
              setProfile({
                full_name: user.email?.split('@')[0] || 'Usuario',
                profile_type: 'client'
              });
            } else {
              setProfile({
                full_name: user.email?.split('@')[0] || 'Usuario',
                profile_type: 'client'
              });
            }
          } catch (insertErr) {
            console.error('Error in profile creation:', insertErr);
            setProfile({
              full_name: user.email?.split('@')[0] || 'Usuario',
              profile_type: 'client'
            });
          }
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error in fetchProfile:', error);
        // En caso de error, establecemos un perfil mínimo para que la app no se quede colgada
        setProfile({
          full_name: user?.email?.split('@')[0] || 'Usuario',
          profile_type: 'client'
        });
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Si no hay usuario, resolvemos inmediatamente
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile(user);

    // Track access de forma no bloqueante - no debe afectar la carga
    if (user && session && !accessTracked) {
      const trackUserAccess = async () => {
        try {
          // Timeout de 2 segundos para no bloquear
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Access tracking timeout')), 2000)
          );
          
          await Promise.race([
            supabase.functions.invoke('log-user-access', {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
              body: { usuario_id: user.id, email: user.email },
            }),
            timeoutPromise
          ]);
          setAccessTracked(true);
        } catch (error) {
          // Silently fail - access tracking is not critical
          setAccessTracked(true); // Marcar como tracked para no intentar de nuevo
          if (process.env.NODE_ENV === 'development') {
            console.warn('[AccessTracker] Error rastreando el acceso del usuario:', error.message);
          }
        }
      };
      // Ejecutar en background sin bloquear
      trackUserAccess();
    }
  }, [user, session, fetchProfile, accessTracked]);

  const value = useMemo(() => ({
    profile,
    role: profile?.profile_type ?? null,
    clientAccountId: profile?.client_account_id ?? null,
    loadingProfile: loading,
    refreshProfile: () => fetchProfile(user),
  }), [profile, loading, user, fetchProfile]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};