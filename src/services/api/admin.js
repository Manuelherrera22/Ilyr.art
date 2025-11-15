import { supabase } from '@/lib/customSupabaseClient';

/**
 * Obtiene todas las cuentas de clientes
 */
export const getAllClientAccounts = async () => {
  const { data, error } = await supabase
    .from('client_accounts')
    .select(`
      id,
      company_name,
      contact_email,
      status,
      metadata,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching client accounts:', error);
    throw new Error(error.message);
  }

  // Obtener usuarios asociados a cada cuenta
  if (data && data.length > 0) {
    const accountIds = data.map(acc => acc.id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, profile_type, client_account_id, created_at')
      .in('client_account_id', accountIds);

    // Agrupar perfiles por cuenta
    const profilesByAccount = {};
    if (profiles) {
      profiles.forEach(profile => {
        if (profile.client_account_id) {
          if (!profilesByAccount[profile.client_account_id]) {
            profilesByAccount[profile.client_account_id] = [];
          }
          profilesByAccount[profile.client_account_id].push(profile);
        }
      });
    }

    // Agregar perfiles a cada cuenta
    return data.map(account => ({
      ...account,
      profiles: profilesByAccount[account.id] || []
    }));
  }

  return data || [];
};

/**
 * Crea una nueva cuenta de cliente
 */
export const createClientAccount = async (accountData) => {
  const { data, error } = await supabase
    .from('client_accounts')
    .insert([
      {
        company_name: accountData.company_name,
        contact_email: accountData.contact_email,
        status: accountData.status || 'active',
        metadata: accountData.metadata || {},
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating client account:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Actualiza una cuenta de cliente
 */
export const updateClientAccount = async (accountId, updates) => {
  const { data, error } = await supabase
    .from('client_accounts')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', accountId)
    .select()
    .single();

  if (error) {
    console.error('Error updating client account:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Obtiene todos los usuarios
 */
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      profile_type,
      client_account_id,
      created_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }

  // Obtener información de cuentas para usuarios que tienen client_account_id
  if (data && data.length > 0) {
    const accountIds = data
      .map(u => u.client_account_id)
      .filter(Boolean);
    
    if (accountIds.length > 0) {
      const { data: accounts } = await supabase
        .from('client_accounts')
        .select('id, company_name')
        .in('id', accountIds);

      const accountsMap = {};
      if (accounts) {
        accounts.forEach(acc => {
          accountsMap[acc.id] = acc;
        });
      }

      // Agregar información de cuenta a cada usuario
      return data.map(user => ({
        ...user,
        client_accounts: user.client_account_id ? accountsMap[user.client_account_id] : null
      }));
    }
  }

  return data || [];
};

/**
 * Actualiza el rol de un usuario
 */
export const updateUserRole = async (userId, newRole, clientAccountId = null) => {
  const updates = {
    profile_type: newRole,
    updated_at: new Date().toISOString(),
  };

  if (clientAccountId !== undefined) {
    updates.client_account_id = clientAccountId;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user role:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Obtiene todos los paquetes de servicio
 */
export const getAllServicePackages = async () => {
  const { data, error } = await supabase
    .from('service_packages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching service packages:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Crea un nuevo paquete de servicio
 */
export const createServicePackage = async (packageData) => {
  const { data, error } = await supabase
    .from('service_packages')
    .insert([
      {
        name: packageData.name,
        description: packageData.description,
        from_price: packageData.from_price,
        deliverables: packageData.deliverables || [],
        metadata: packageData.metadata || {},
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating service package:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Actualiza un paquete de servicio
 */
export const updateServicePackage = async (packageId, updates) => {
  const { data, error } = await supabase
    .from('service_packages')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', packageId)
    .select()
    .single();

  if (error) {
    console.error('Error updating service package:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Elimina un paquete de servicio
 */
export const deleteServicePackage = async (packageId) => {
  const { error } = await supabase
    .from('service_packages')
    .delete()
    .eq('id', packageId);

  if (error) {
    console.error('Error deleting service package:', error);
    throw new Error(error.message);
  }

  return true;
};

/**
 * Obtiene métricas del sistema
 */
export const getSystemMetrics = async () => {
  try {
    const [
      { count: totalProjects },
      { count: activeProjects },
      { count: totalUsers },
      { count: totalClientAccounts },
      { count: totalBriefs },
    ] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }).in('status', ['production', 'in_review', 'approved']),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('client_accounts').select('*', { count: 'exact', head: true }),
      supabase.from('project_briefs').select('*', { count: 'exact', head: true }),
    ]);

    return {
      totalProjects: totalProjects || 0,
      activeProjects: activeProjects || 0,
      totalUsers: totalUsers || 0,
      totalClientAccounts: totalClientAccounts || 0,
      totalBriefs: totalBriefs || 0,
    };
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    throw new Error(error.message);
  }
};

