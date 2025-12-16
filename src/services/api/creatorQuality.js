import { supabase } from '@/lib/customSupabaseClient';

/**
 * Crea una revisión de calidad
 */
export const createQualityReview = async (deliverableId, jobId, reviewedBy, scores, feedback, checklist) => {
  const { data, error } = await supabase
    .from('creator_quality_reviews')
    .insert([
      {
        deliverable_id: deliverableId,
        job_id: jobId,
        reviewed_by: reviewedBy,
        overall_score: scores.overall,
        technical_score: scores.technical,
        creative_score: scores.creative,
        adherence_score: scores.adherence,
        feedback: feedback,
        checklist: checklist,
        status: scores.overall >= 70 ? 'passed' : 'needs_revision',
        passed_at: scores.overall >= 70 ? new Date().toISOString() : null,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating quality review:', error);
    throw new Error(error.message);
  }

  // Actualizar la entrega con el review_id
  await supabase
    .from('creator_deliverables')
    .update({
      quality_review_id: data.id,
      status: data.status === 'passed' ? 'approved' : 'revision_requested',
      updated_at: new Date().toISOString(),
    })
    .eq('id', deliverableId);

  // Si pasó, actualizar el trabajo
  if (data.status === 'passed') {
    await supabase
      .from('creator_jobs')
      .update({
        status: 'approved',
        quality_score: scores.overall,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);
  }

  return data;
};

/**
 * Obtiene revisiones de calidad de un trabajo
 */
export const getJobQualityReviews = async (jobId) => {
  const { data, error } = await supabase
    .from('creator_quality_reviews')
    .select(`
      id,
      deliverable_id,
      job_id,
      reviewed_by,
      overall_score,
      technical_score,
      creative_score,
      adherence_score,
      feedback,
      checklist,
      status,
      passed_at,
      created_at,
      profiles:reviewed_by (
        full_name,
        profile_type
      )
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quality reviews:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Obtiene estadísticas de calidad del creador
 */
export const getCreatorQualityStats = async (userId) => {
  const { data, error } = await supabase
    .from('creator_jobs')
    .select(`
      id,
      quality_score,
      status,
      creator_quality_reviews (
        overall_score,
        technical_score,
        creative_score,
        adherence_score,
        status
      )
    `)
    .eq('assigned_to', userId)
    .not('quality_score', 'is', null);

  if (error) {
    console.error('Error fetching quality stats:', error);
    throw new Error(error.message);
  }

  const jobs = data || [];
  const reviews = jobs.flatMap(j => j.creator_quality_reviews || []);

  if (reviews.length === 0) {
    return {
      averageScore: 0,
      averageTechnical: 0,
      averageCreative: 0,
      averageAdherence: 0,
      passRate: 0,
      totalReviews: 0,
    };
  }

  const passed = reviews.filter(r => r.status === 'passed').length;
  const total = reviews.length;

  return {
    averageScore: reviews.reduce((sum, r) => sum + parseFloat(r.overall_score || 0), 0) / total,
    averageTechnical: reviews.reduce((sum, r) => sum + parseFloat(r.technical_score || 0), 0) / total,
    averageCreative: reviews.reduce((sum, r) => sum + parseFloat(r.creative_score || 0), 0) / total,
    averageAdherence: reviews.reduce((sum, r) => sum + parseFloat(r.adherence_score || 0), 0) / total,
    passRate: (passed / total) * 100,
    totalReviews: total,
  };
};
