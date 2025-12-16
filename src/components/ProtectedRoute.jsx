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
    // Si no hay role después de 2 segundos, redirigir a login
    if (!role) {
      // Timeout de seguridad: si no hay role en 2 segundos, asumir que no está autenticado
      const [shouldRedirect, setShouldRedirect] = React.useState(false);
      
      React.useEffect(() => {
        const timer = setTimeout(() => {
          if (!role) {
            console.warn('Role timeout in ProtectedRoute, redirecting to login');
            setShouldRedirect(true);
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      }, [role]);
      
      if (shouldRedirect) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
      
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
