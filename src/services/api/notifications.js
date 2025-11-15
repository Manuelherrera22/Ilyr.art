import { supabase } from '@/lib/customSupabaseClient';

/**
 * Obtiene las notificaciones de un usuario
 */
export const getUserNotifications = async (userId, options = {}) => {
  const { limit = 50, unreadOnly = false } = options;

  let query = supabase
    .from('notifications')
    .select(`
      id,
      type,
      payload,
      read_at,
      created_at,
      project_id,
      projects:project_id (
        id,
        title,
        status
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.is('read_at', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Marca una notificación como leída
 */
export const markNotificationAsRead = async (notificationId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) {
    console.error('Error marking notification as read:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Marca todas las notificaciones de un usuario como leídas
 */
export const markAllNotificationsAsRead = async (userId) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null);

  if (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error(error.message);
  }

  return true;
};

/**
 * Elimina una notificación
 */
export const deleteNotification = async (notificationId) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    console.error('Error deleting notification:', error);
    throw new Error(error.message);
  }

  return true;
};

/**
 * Obtiene el conteo de notificaciones no leídas
 */
export const getUnreadNotificationCount = async (userId) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('read_at', null);

  if (error) {
    console.error('Error counting unread notifications:', error);
    throw new Error(error.message);
  }

  return count || 0;
};

/**
 * Crea una notificación (usado por el backend/triggers)
 * Esta función normalmente sería llamada por triggers de Supabase,
 * pero la exponemos para casos especiales desde el frontend
 */
export const createNotification = async (userId, projectId, type, payload = {}) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userId,
        project_id: projectId,
        type,
        payload,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Helper: Crea notificaciones para todos los usuarios relacionados con un proyecto
 */
export const notifyProjectStakeholders = async (projectId, type, payload = {}, excludeUserId = null) => {
  try {
    // Obtener todos los usuarios relacionados con el proyecto
    const { data: project } = await supabase
      .from('projects')
      .select(`
        id,
        client_account_id,
        created_by,
        project_assignments (
          user_id
        )
      `)
      .eq('id', projectId)
      .single();

    if (!project) return;

    const userIds = new Set();

    // Agregar cliente (todos los usuarios de la cuenta)
    if (project.client_account_id) {
      const { data: clientUsers } = await supabase
        .from('profiles')
        .select('id')
        .eq('client_account_id', project.client_account_id);
      
      if (clientUsers) {
        clientUsers.forEach(u => userIds.add(u.id));
      }
    }

    // Agregar creador del proyecto
    if (project.created_by) {
      userIds.add(project.created_by);
    }

    // Agregar asignados
    if (project.project_assignments) {
      project.project_assignments.forEach(a => {
        if (a.user_id) userIds.add(a.user_id);
      });
    }

    // Crear notificaciones para todos (excepto el usuario que excluimos)
    const notifications = Array.from(userIds)
      .filter(id => id !== excludeUserId)
      .map(userId => ({
        user_id: userId,
        project_id: projectId,
        type,
        payload,
      }));

    if (notifications.length > 0) {
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) {
        console.error('Error creating notifications:', error);
      }
    }
  } catch (error) {
    console.error('Error in notifyProjectStakeholders:', error);
  }
};
