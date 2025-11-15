import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProfile } from '@/contexts/ProfileContext';
import { getHomeRouteForRole } from '@/lib/roleUtils';

const RoleRedirect = () => {
  const navigate = useNavigate();
  const { role, loadingProfile } = useProfile();

  useEffect(() => {
    if (loadingProfile) return;
    const targetRoute = getHomeRouteForRole(role);
    navigate(targetRoute, { replace: true });
  }, [role, loadingProfile, navigate]);

  return <LoadingSpinner fullScreen />;
};

export default RoleRedirect;

