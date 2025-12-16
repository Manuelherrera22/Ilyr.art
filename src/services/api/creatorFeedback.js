import { supabase } from '@/lib/customSupabaseClient';

/**
 * Crea feedback para un creador
 */
export const createFeedback = async (jobId, deliverableId, fromUserId, toUserId, feedbackType, title, message, priority = 'normal') => {
  const { data, error } = await supabase
    .from('creator_feedback')
    .insert([
      {
        job_id: jobId,
        deliverable_id: deliverableId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        feedback_type: feedbackType,
        title: title,
        message: message,
        priority: priority,
        status: 'open',
      }
    ])
    .select(`
      id,
      job_id,
      deliverable_id,
      from_user_id,
      to_user_id,
      feedback_type,
      title,
      message,
      priority,
      status,
      created_at,
      profiles:from_user_id (
        full_name,
        profile_type
      )
    `)
    .single();

  if (error) {
    console.error('Error creating feedback:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Obtiene feedback para un creador
 */
export const getCreatorFeedback = async (userId, status = null) => {
  let query = supabase
    .from('creator_feedback')
    .select(`
      id,
      job_id,
      deliverable_id,
      from_user_id,
      to_user_id,
      feedback_type,
      title,
      message,
      priority,
      status,
      resolved_at,
      attachments,
      created_at,
      updated_at,
      profiles:from_user_id (
        full_name,
        profile_type
      ),
      creator_jobs (
        id,
        title
      )
    `)
    .eq('to_user_id', userId);

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching feedback:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Actualiza el estado del feedback
 */
export const updateFeedbackStatus = async (feedbackId, userId, newStatus) => {
  // Verificar que el feedback es para el usuario
  const { data: feedback } = await supabase
    .from('creator_feedback')
    .select('to_user_id')
    .eq('id', feedbackId)
    .single();

  if (!feedback || feedback.to_user_id !== userId) {
    throw new Error('No tienes acceso a este feedback');
  }

  const updateData = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === 'resolved') {
    updateData.resolved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('creator_feedback')
    .update(updateData)
    .eq('id', feedbackId)
    .select()
    .single();

  if (error) {
    console.error('Error updating feedback:', error);
    throw new Error(error.message);
  }

  return data;
};
