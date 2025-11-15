import { supabase } from '@/lib/customSupabaseClient';

/**
 * Obtiene la lista de usuarios creativos disponibles
 */
export const getCreativeUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      profile_type,
      created_at
    `)
    .eq('profile_type', 'creative')
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching creative users:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Obtiene todos los usuarios (para admin/producer)
 */
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      profile_type,
      created_at
    `)
    .in('profile_type', ['creative', 'producer', 'client'])
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }

  return data || [];
};

