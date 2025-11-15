import { supabase } from '@/lib/customSupabaseClient';

export const listProjectsForAccount = async (clientAccountId) => {
  if (!clientAccountId) {
    return { data: [], error: new Error('Cuenta de cliente no encontrada') };
  }

  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      status,
      created_at,
      metadata,
      project_briefs (
        id,
        status,
        objective,
        audience,
        key_messages,
        budget_range,
        deadline_date,
        created_at
      ),
      project_assignments (
        id,
        user_id,
        role,
        status
      ),
      project_milestones (
        id,
        name,
        due_at,
        status
      )
    `)
    .eq('client_account_id', clientAccountId)
    .order('created_at', { ascending: false });

  return { data, error };
};

/**
 * Obtiene los detalles completos de un proyecto para un cliente
 */
export const getClientProjectDetails = async (projectId, clientAccountId) => {
  // Verificar que el proyecto pertenece al cliente
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, client_account_id')
    .eq('id', projectId)
    .eq('client_account_id', clientAccountId)
    .single();

  if (projectError || !project) {
    throw new Error('No tienes acceso a este proyecto');
  }

  // Obtener detalles completos
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      status,
      created_at,
      updated_at,
      metadata,
      project_briefs (
        id,
        objective,
        audience,
        key_messages,
        budget_range,
        deadline_date,
        references_payload,
        status,
        created_at
      ),
      project_milestones (
        id,
        name,
        description,
        due_at,
        status,
        approved_at,
        approved_by,
        created_at
      ),
      project_assets (
        id,
        version,
        type,
        file_url,
        notes,
        is_final,
        metadata,
        created_at,
        uploaded_by,
        profiles:uploaded_by (
          full_name
        )
      ),
      project_comments (
        id,
        message,
        visibility,
        attachments,
        created_at,
        author_id,
        profiles:author_id (
          full_name,
          profile_type
        )
      ),
      project_assignments (
        id,
        role,
        stage,
        profiles:user_id (
          full_name,
          profile_type
        )
      )
    `)
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project details:', error);
    throw new Error(error.message);
  }

  return data;
};

export const listIncomingBriefs = async () => {
  const { data, error } = await supabase
    .from('project_briefs')
    .select(`
      id,
      project_id,
      status,
      objective,
      deadline_date,
      created_at,
      projects (
        id,
        title,
        status,
        created_at
      )
    `)
    .eq('status', 'submitted')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error listing incoming briefs:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const getBriefDetails = async (briefId) => {
  const { data, error } = await supabase
    .from('project_briefs')
    .select(`
      id,
      project_id,
      status,
      objective,
      audience,
      key_messages,
      budget_range,
      deadline_date,
      references_payload,
      attachments,
      created_at,
      projects (
        id,
        title,
        status
      )
    `)
    .eq('id', briefId)
    .single();

  if (error) {
    console.error('Error fetching brief details:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateBriefStatus = async (briefId, newStatus) => {
  const { error } = await supabase
    .from('project_briefs')
    .update({ status: newStatus })
    .eq('id', briefId);

  if (error) {
    console.error('Error updating brief status:', error);
    throw new Error(error.message);
  }

  return true;
};
