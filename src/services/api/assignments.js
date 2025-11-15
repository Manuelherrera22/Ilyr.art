import { supabase } from '@/lib/customSupabaseClient';

/**
 * Obtiene todas las asignaciones de un creativo
 */
export const getCreativeAssignments = async (userId) => {
  const { data, error } = await supabase
    .from('project_assignments')
    .select(`
      id,
      project_id,
      role,
      stage,
      status,
      workload,
      created_at,
      projects (
        id,
        title,
        status,
        created_at,
        project_briefs (
          id,
          objective,
          deadline_date
        ),
        project_milestones (
          id,
          name,
          due_at,
          status,
          description
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching creative assignments:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Obtiene las asignaciones de un proyecto
 */
export const getProjectAssignments = async (projectId) => {
  const { data, error } = await supabase
    .from('project_assignments')
    .select(`
      id,
      user_id,
      role,
      stage,
      status,
      workload,
      created_at,
      profiles:user_id (
        id,
        full_name,
        profile_type
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching project assignments:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Crea una nueva asignación
 */
export const createAssignment = async (projectId, userId, role, stage = null, workload = {}) => {
  // Verificar si ya existe una asignación activa
  const { data: existing } = await supabase
    .from('project_assignments')
    .select('id')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (existing) {
    throw new Error('Este usuario ya está asignado a este proyecto');
  }

  const { data, error } = await supabase
    .from('project_assignments')
    .insert([
      {
        project_id: projectId,
        user_id: userId,
        role,
        stage,
        status: 'active',
        workload,
      }
    ])
    .select(`
      id,
      user_id,
      role,
      stage,
      status,
      created_at,
      profiles:user_id (
        id,
        full_name,
        profile_type
      )
    `)
    .single();

  if (error) {
    console.error('Error creating assignment:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Actualiza una asignación
 */
export const updateAssignment = async (assignmentId, updates) => {
  const { data, error } = await supabase
    .from('project_assignments')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', assignmentId)
    .select(`
      id,
      user_id,
      role,
      stage,
      status,
      workload,
      profiles:user_id (
        id,
        full_name,
        profile_type
      )
    `)
    .single();

  if (error) {
    console.error('Error updating assignment:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Elimina/desactiva una asignación
 */
export const removeAssignment = async (assignmentId) => {
  const { error } = await supabase
    .from('project_assignments')
    .update({
      status: 'inactive',
      updated_at: new Date().toISOString(),
    })
    .eq('id', assignmentId);

  if (error) {
    console.error('Error removing assignment:', error);
    throw new Error(error.message);
  }

  return true;
};

/**
 * Obtiene los detalles de un proyecto asignado
 */
export const getAssignedProjectDetails = async (projectId, userId) => {
  // Verificar que el usuario está asignado al proyecto
  const { data: assignment, error: assignmentError } = await supabase
    .from('project_assignments')
    .select('id, role, stage, status')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (assignmentError || !assignment) {
    throw new Error('No tienes acceso a este proyecto');
  }

  // Obtener detalles completos del proyecto
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      status,
      created_at,
      project_briefs (
        id,
        objective,
        audience,
        key_messages,
        deadline_date,
        references_payload,
        attachments
      ),
      project_milestones (
        id,
        name,
        description,
        due_at,
        status,
        approved_at
      ),
      project_assets (
        id,
        version,
        type,
        file_url,
        notes,
        is_final,
        created_at,
        uploaded_by
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
      )
    `)
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project details:', error);
    throw new Error(error.message);
  }

  return { ...data, assignment };
};
