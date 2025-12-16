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
  const [roleTimeout, setRoleTimeout] = React.useState(false);

  // Si no hay sesión, redirigir inmediatamente sin esperar nada más
  if (!loading && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Timeout de seguridad: si después de 3 segundos aún está cargando, asumir que no hay sesión
  React.useEffect(() => {
    if (loading || loadingProfile) {
      const timer = setTimeout(() => {
        if (loading || loadingProfile) {
          console.warn('Auth/Profile loading timeout in ProtectedRoute');
          setRoleTimeout(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, loadingProfile]);

  // Si hay timeout y no está logueado, redirigir
  if (roleTimeout && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Mostrar loading solo si realmente está cargando y hay sesión
  if ((loading || loadingProfile) && isLoggedIn) {
    return <LoadingSpinner fullScreen />;
  }

  // Si no está logueado después de los timeouts, redirigir
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles solo si hay allowedRoles y el usuario está logueado
  if (allowedRoles && allowedRoles.length > 0) {
    // Si no hay role después de 1 segundo, usar un role por defecto o redirigir
    if (!role) {
      // Timeout más corto: 1 segundo
      React.useEffect(() => {
        const timer = setTimeout(() => {
          if (!role && isLoggedIn) {
            console.warn('Role timeout in ProtectedRoute, redirecting to login');
            setRoleTimeout(true);
          }
        }, 1000);
        return () => clearTimeout(timer);
      }, [role, isLoggedIn]);
      
      if (roleTimeout) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
      
      return <LoadingSpinner fullScreen />;
    }

    const normalizedRole = role.toLowerCase();
    const isAllowed = allowedRoles.some((allowedRole) => allowedRole.toLowerCase() === normalizedRole);

    if (!isAllowed) {
      const fallback = getHomeRouteForRole(role) || '/';
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
