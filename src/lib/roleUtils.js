const ROLE_HOME_MAP = {
  client: '/client',
  producer: '/producer',
  creative: '/creative',
  admin: '/admin',
};

export const getHomeRouteForRole = (role) => {
  if (!role) return '/client';
  const normalized = role.toLowerCase();
  return ROLE_HOME_MAP[normalized] ?? '/client';
};

export const getAllowedRolesForRoute = (role) => {
  const normalized = role?.toLowerCase();
  if (normalized === 'admin') {
    return Object.keys(ROLE_HOME_MAP);
  }
  return [normalized].filter(Boolean);
};

