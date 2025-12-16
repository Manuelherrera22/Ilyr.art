import { supabase } from '@/lib/customSupabaseClient';

/**
 * Obtiene pagos de un creador
 */
export const getCreatorPayments = async (userId, status = null) => {
  let query = supabase
    .from('creator_payments')
    .select(`
      id,
      job_id,
      creator_id,
      amount,
      currency,
      status,
      payment_method,
      transaction_id,
      paid_at,
      metadata,
      created_at,
      creator_jobs (
        id,
        title,
        budget_amount
      )
    `)
    .eq('creator_id', userId);

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching payments:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Obtiene estadísticas de pagos
 */
export const getPaymentStats = async (userId) => {
  const { data, error } = await supabase
    .from('creator_payments')
    .select('amount, status, currency')
    .eq('creator_id', userId);

  if (error) {
    console.error('Error fetching payment stats:', error);
    throw new Error(error.message);
  }

  const payments = data || [];

  return {
    totalEarned: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    pendingAmount: payments
      .filter(p => ['pending', 'processing'].includes(p.status))
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    completedPayments: payments.filter(p => p.status === 'completed').length,
    pendingPayments: payments.filter(p => ['pending', 'processing'].includes(p.status)).length,
  };
};
