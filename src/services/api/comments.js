import { supabase } from '@/lib/customSupabaseClient';

/**
 * Obtiene los comentarios de un proyecto
 */
export const getProjectComments = async (projectId, userId) => {
  // Verificar acceso al proyecto (usuario asignado o cliente)
  const { data: assignment } = await supabase
    .from('project_assignments')
    .select('id')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  // Obtener información del proyecto y del usuario
  const { data: project } = await supabase
    .from('projects')
    .select('client_account_id, created_by')
    .eq('id', projectId)
    .single();

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('client_account_id, profile_type')
    .eq('id', userId)
    .single();

  // Verificar acceso: asignado, cliente de la cuenta, o productor/admin
  const hasAccess = 
    assignment || 
    (userProfile?.profile_type === 'client' && userProfile?.client_account_id === project?.client_account_id) ||
    (userProfile?.profile_type === 'producer' || userProfile?.profile_type === 'admin');

  if (!hasAccess) {
    throw new Error('No tienes acceso a los comentarios de este proyecto');
  }

  const { data, error } = await supabase
    .from('project_comments')
    .select(`
      id,
      message,
      visibility,
      attachments,
      created_at,
      updated_at,
      author_id,
      parent_id,
      profiles:author_id (
        full_name,
        profile_type
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Crea un nuevo comentario
 */
export const createComment = async (projectId, userId, message, visibility = 'client', parentId = null) => {
  const { data, error } = await supabase
    .from('project_comments')
    .insert([
      {
        project_id: projectId,
        author_id: userId,
        message,
        visibility,
        parent_id: parentId
      }
    ])
    .select(`
      id,
      message,
      visibility,
      created_at,
      author_id,
      parent_id,
      profiles:author_id (
        full_name,
        profile_type
      )
    `)
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw new Error(error.message);
  }

  return data;
};

