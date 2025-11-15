import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { getHomeRouteForRole } from '@/lib/roleUtils';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { isLoggedIn, loading } = useAuth();
  const { role, loadingProfile } = useProfile();

  if (loading || loadingProfile) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!role) {
      return <LoadingSpinner fullScreen />;
    }

    const normalizedRole = role.toLowerCase();
    const isAllowed = allowedRoles.some((allowedRole) => allowedRole.toLowerCase() === normalizedRole);

    if (!isAllowed) {
      const fallback = getHomeRouteForRole(role);
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
