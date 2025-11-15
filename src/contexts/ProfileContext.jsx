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
      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select('full_name, profile_type, client_account_id')
          .eq('id', user.id)
          .single();

        if (error && status !== 406) {
          console.error('Error fetching profile:', error);
          // Si hay error pero no es 406, intentamos crear perfil por defecto
          if (status === 404 || status === 0) {
            console.log('No profile found, creating default profile...');
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
          console.log('No profile found, creating default profile...');
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
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        // En caso de error, establecemos un perfil mínimo para que la app no se quede colgada
        setProfile({
          full_name: user?.email?.split('@')[0] || 'Usuario',
          profile_type: 'client'
        });
      } finally {
        setLoading(false);
      }
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('[ProfileContext] useEffect triggered, user:', user ? 'exists' : 'null');
    
    // Si no hay usuario, resolvemos inmediatamente
    if (!user) {
      console.log('[ProfileContext] No user, setting loading to false immediately');
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile(user);

    if (user && session && !accessTracked) {
      const trackUserAccess = async () => {
        console.log('[AccessTracker] Iniciando seguimiento de acceso de usuario...');
        try {
          console.log('[AccessTracker] Invocando función "log-user-access"...');
          await supabase.functions.invoke('log-user-access', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: { usuario_id: user.id, email: user.email },
          });
          console.log('[AccessTracker] Función "log-user-access" invocada exitosamente.');
          setAccessTracked(true);
        } catch (error) {
          console.error('[AccessTracker] Error rastreando el acceso del usuario:', error.message);
          if(error.context) console.error('[AccessTracker] Detalles del error:', error.context);
        }
      };
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