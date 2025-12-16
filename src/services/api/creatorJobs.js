import { supabase } from '@/lib/customSupabaseClient';

/**
 * Obtiene trabajos disponibles para creadores
 */
export const getAvailableJobs = async (userId = null) => {
  let query = supabase
    .from('creator_jobs')
    .select(`
      id,
      project_id,
      title,
      description,
      category,
      skills_required,
      budget_amount,
      budget_currency,
      estimated_hours,
      deadline_date,
      status,
      assigned_to,
      assigned_at,
      started_at,
      submitted_at,
      quality_score,
      metadata,
      created_at,
      projects (
        id,
        title,
        status
      )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching available jobs:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Obtiene trabajos asignados a un creador
 */
export const getMyJobs = async (userId, status = null) => {
  let query = supabase
    .from('creator_jobs')
    .select(`
      id,
      project_id,
      title,
      description,
      category,
      skills_required,
      budget_amount,
      budget_currency,
      estimated_hours,
      deadline_date,
      status,
      assigned_to,
      assigned_at,
      started_at,
      submitted_at,
      quality_score,
      metadata,
      created_at,
      projects (
        id,
        title,
        status
      ),
      creator_deliverables (
        id,
        version,
        status,
        created_at
      ),
      creator_quality_reviews (
        id,
        overall_score,
        status,
        feedback
      )
    `)
    .eq('assigned_to', userId);

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching my jobs:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Aplica a un trabajo (solicita asignación)
 */
export const applyToJob = async (jobId, userId) => {
  // Verificar que el trabajo está abierto
  const { data: job, error: jobError } = await supabase
    .from('creator_jobs')
    .select('id, status')
    .eq('id', jobId)
    .eq('status', 'open')
    .single();

  if (jobError || !job) {
    throw new Error('Este trabajo no está disponible');
  }

  // Actualizar el trabajo a asignado
  const { data, error } = await supabase
    .from('creator_jobs')
    .update({
      assigned_to: userId,
      assigned_at: new Date().toISOString(),
      status: 'assigned',
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Error applying to job:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Inicia un trabajo (marca como en progreso)
 */
export const startJob = async (jobId, userId) => {
  // Verificar que el trabajo está asignado al usuario
  const { data: job, error: jobError } = await supabase
    .from('creator_jobs')
    .select('id, assigned_to, status')
    .eq('id', jobId)
    .eq('assigned_to', userId)
    .in('status', ['assigned', 'in_progress'])
    .single();

  if (jobError || !job) {
    throw new Error('No tienes acceso a este trabajo');
  }

  const { data, error } = await supabase
    .from('creator_jobs')
    .update({
      status: 'in_progress',
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Error starting job:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Obtiene detalles de un trabajo
 */
export const getJobDetails = async (jobId, userId) => {
  const { data, error } = await supabase
    .from('creator_jobs')
    .select(`
      id,
      project_id,
      title,
      description,
      category,
      skills_required,
      budget_amount,
      budget_currency,
      estimated_hours,
      deadline_date,
      status,
      assigned_to,
      assigned_at,
      started_at,
      submitted_at,
      quality_score,
      metadata,
      created_at,
      projects (
        id,
        title,
        status,
        project_briefs (
          id,
          objective,
          audience,
          key_messages,
          references_payload
        )
      ),
      creator_deliverables (
        id,
        version,
        file_url,
        file_type,
        status,
        notes,
        created_at,
        creator_quality_reviews (
          id,
          overall_score,
          technical_score,
          creative_score,
          adherence_score,
          feedback,
          status,
          checklist
        )
      ),
      creator_feedback (
        id,
        feedback_type,
        title,
        message,
        priority,
        status,
        created_at,
        from_user_id,
        profiles:from_user_id (
          full_name,
          profile_type
        )
      )
    `)
    .eq('id', jobId)
    .single();

  if (error) {
    console.error('Error fetching job details:', error);
    throw new Error(error.message);
  }

  // Verificar acceso
  if (data.status !== 'open' && data.assigned_to !== userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('profile_type')
      .eq('id', userId)
      .single();

    if (profile?.profile_type !== 'producer' && profile?.profile_type !== 'admin') {
      throw new Error('No tienes acceso a este trabajo');
    }
  }

  return data;
};

/**
 * Obtiene estadísticas del creador
 */
export const getCreatorStats = async (userId) => {
  const [jobsData, paymentsData] = await Promise.all([
    supabase
      .from('creator_jobs')
      .select('status, budget_amount')
      .eq('assigned_to', userId),
    supabase
      .from('creator_payments')
      .select('amount, status')
      .eq('creator_id', userId),
  ]);

  const jobs = jobsData.data || [];
  const payments = paymentsData.data || [];

  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => ['assigned', 'in_progress'].includes(j.status)).length,
    completedJobs: jobs.filter(j => j.status === 'completed').length,
    totalEarned: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    pendingPayments: payments
      .filter(p => ['pending', 'processing'].includes(p.status))
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    averageQualityScore: jobs
      .filter(j => j.quality_score !== null)
      .reduce((sum, j, _, arr) => {
        if (arr.length === 0) return 0;
        return sum + (parseFloat(j.quality_score) / arr.length);
      }, 0),
  };
};
