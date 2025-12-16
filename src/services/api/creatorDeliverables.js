import { supabase } from '@/lib/customSupabaseClient';

/**
 * Sube una entrega para un trabajo
 */
export const submitDeliverable = async (jobId, userId, fileUrl, fileType, fileSize, notes = null) => {
  // Verificar que el trabajo está asignado al usuario y en progreso
  const { data: job, error: jobError } = await supabase
    .from('creator_jobs')
    .select('id, assigned_to, status')
    .eq('id', jobId)
    .eq('assigned_to', userId)
    .in('status', ['assigned', 'in_progress'])
    .single();

  if (jobError || !job) {
    throw new Error('No tienes acceso a este trabajo o no está en estado válido');
  }

  // Obtener la última versión
  const { data: lastVersion } = await supabase
    .from('creator_deliverables')
    .select('version')
    .eq('job_id', jobId)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  const nextVersion = lastVersion ? lastVersion.version + 1 : 1;

  // Crear la entrega
  const { data, error } = await supabase
    .from('creator_deliverables')
    .insert([
      {
        job_id: jobId,
        submitted_by: userId,
        version: nextVersion,
        file_url: fileUrl,
        file_type: fileType,
        file_size: fileSize,
        notes: notes,
        status: 'pending',
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error submitting deliverable:', error);
    throw new Error(error.message);
  }

  // Actualizar el estado del trabajo a "submitted"
  await supabase
    .from('creator_jobs')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId);

  return data;
};

/**
 * Obtiene entregas de un trabajo
 */
export const getJobDeliverables = async (jobId, userId) => {
  // Verificar acceso
  const { data: job } = await supabase
    .from('creator_jobs')
    .select('assigned_to, status')
    .eq('id', jobId)
    .single();

  if (!job) {
    throw new Error('Trabajo no encontrado');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('profile_type')
    .eq('id', userId)
    .single();

  const isCreator = job.assigned_to === userId;
  const isProducer = profile?.profile_type === 'producer' || profile?.profile_type === 'admin';

  if (!isCreator && !isProducer) {
    throw new Error('No tienes acceso a este trabajo');
  }

  const { data, error } = await supabase
    .from('creator_deliverables')
    .select(`
      id,
      job_id,
      submitted_by,
      version,
      file_url,
      file_type,
      file_size,
      notes,
      status,
      quality_review_id,
      created_at,
      creator_quality_reviews (
        id,
        overall_score,
        technical_score,
        creative_score,
        adherence_score,
        feedback,
        status,
        checklist,
        reviewed_by,
        created_at
      )
    `)
    .eq('job_id', jobId)
    .order('version', { ascending: false });

  if (error) {
    console.error('Error fetching deliverables:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Obtiene una entrega específica
 */
export const getDeliverableDetails = async (deliverableId, userId) => {
  const { data, error } = await supabase
    .from('creator_deliverables')
    .select(`
      id,
      job_id,
      submitted_by,
      version,
      file_url,
      file_type,
      file_size,
      notes,
      status,
      quality_review_id,
      created_at,
      creator_jobs (
        id,
        title,
        assigned_to
      ),
      creator_quality_reviews (
        id,
        overall_score,
        technical_score,
        creative_score,
        adherence_score,
        feedback,
        status,
        checklist,
        reviewed_by,
        created_at,
        profiles:reviewed_by (
          full_name
        )
      )
    `)
    .eq('id', deliverableId)
    .single();

  if (error) {
    console.error('Error fetching deliverable:', error);
    throw new Error(error.message);
  }

  // Verificar acceso
  const isCreator = data.creator_jobs?.assigned_to === userId;
  const { data: profile } = await supabase
    .from('profiles')
    .select('profile_type')
    .eq('id', userId)
    .single();
  const isProducer = profile?.profile_type === 'producer' || profile?.profile_type === 'admin';

  if (!isCreator && !isProducer) {
    throw new Error('No tienes acceso a esta entrega');
  }

  return data;
};
