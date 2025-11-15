import { supabase } from '@/lib/customSupabaseClient';

const normalizeArrayField = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export const createClientBrief = async ({ accountId, userId, formData }) => {
  if (!accountId) {
    return { error: new Error('No se encontró una cuenta de cliente asociada al perfil.') };
  }

  const payload = {
    projectTitle: formData.projectTitle?.trim(),
    objective: formData.objective?.trim(),
    audience: formData.audience?.trim(),
    keyMessages: formData.keyMessages?.trim(),
    successMetrics: formData.successMetrics?.trim(),
    budgetRange: formData.budgetRange?.trim(),
    deadline: formData.deadline || null,
    distributionChannels: normalizeArrayField(formData.distributionChannels),
    references: normalizeArrayField(formData.references),
    additionalNotes: formData.additionalNotes?.trim(),
  };

  const metadata = {
    distribution_channels: payload.distributionChannels,
    success_metrics: payload.successMetrics,
    additional_notes: payload.additionalNotes,
  };

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      client_account_id: accountId,
      created_by: userId,
      title: payload.projectTitle || 'Nuevo proyecto',
      status: 'intake',
      metadata,
    })
    .select()
    .single();

  if (projectError) {
    return { error: projectError };
  }

  const { data: brief, error: briefError } = await supabase
    .from('project_briefs')
    .insert({
      project_id: project.id,
      client_id: userId,
      submitted_by: userId,
      status: 'submitted',
      objective: payload.objective,
      audience: payload.audience,
      key_messages: payload.keyMessages,
      budget_range: payload.budgetRange,
      deadline_date: payload.deadline || null,
      references_payload: payload.references,
      attachments: [],
      ai_insights: {},
    })
    .select()
    .single();

  if (briefError) {
    return { error: briefError };
  }

  return { project, brief };
};

