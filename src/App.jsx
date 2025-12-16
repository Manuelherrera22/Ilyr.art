import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { VoiceAssistantProvider } from '@/contexts/VoiceAssistantContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import CookieBanner from '@/components/CookieBanner';
import HomePage from '@/pages/HomePage';

const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const PrivacyPolicyPage = React.lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('@/pages/TermsOfServicePage'));
const LegalNoticePage = React.lazy(() => import('@/pages/LegalNoticePage'));
const CookiePolicyPage = React.lazy(() => import('@/pages/CookiePolicyPage'));
const CreativeAnalysisPage = React.lazy(() => import('@/pages/CreativeAnalysisPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
const RoleRedirect = React.lazy(() => import('@/pages/RoleRedirect'));
const ClientPortal = React.lazy(() => import('@/pages/portals/client/ClientPortal'));
const ProducerPortal = React.lazy(() => import('@/pages/portals/producer/ProducerPortal'));
const CreativePortal = React.lazy(() => import('@/pages/portals/creative/CreativePortal'));
const AdminPortal = React.lazy(() => import('@/pages/portals/admin/AdminPortal'));

const AppRoutes = () => {
  const { loading: authLoading } = useAuth();
  const { loadingProfile } = useProfile();
  const [forceLoad, setForceLoad] = React.useState(false);

  // Timeout de seguridad global: si después de 6 segundos aún está cargando, forzar carga
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (authLoading || loadingProfile) {
        console.warn('Global loading timeout, forcing app to load');
        setForceLoad(true);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [authLoading, loadingProfile]);

  if ((authLoading || loadingProfile) && !forceLoad) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/*"
          element={
            <ProtectedRoute allowedRoles={['client', 'producer', 'admin']}>
              <ClientPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/*"
          element={
            <ProtectedRoute allowedRoles={['producer', 'admin']}>
              <ProducerPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creative/*"
          element={
            <ProtectedRoute allowedRoles={['creative', 'producer', 'admin']}>
              <CreativePortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPortal />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/analisis-creativo"
          element={
            <ProtectedRoute>
              <CreativeAnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/legal-notice" element={<LegalNoticePage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <VoiceAssistantProvider>
          <div className="min-h-screen bg-background text-foreground scroll-smooth flex flex-col">
            <AppRoutes />
            <Toaster />
            <CookieBanner />
          </div>
        </VoiceAssistantProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;