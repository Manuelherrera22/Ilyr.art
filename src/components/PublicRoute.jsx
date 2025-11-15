import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getHomeRouteForRole } from '@/lib/roleUtils';

const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const { role, loadingProfile } = useProfile();

  if (loading || loadingProfile) {
    return <LoadingSpinner fullScreen />;
  }

  if (isLoggedIn) {
    const destination = getHomeRouteForRole(role);
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default PublicRoute;
