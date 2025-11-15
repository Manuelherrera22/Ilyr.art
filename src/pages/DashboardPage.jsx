import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DIYDashboardPage from '@/pages/DIYDashboardPage';
import ProfessionalDashboardPage from '@/pages/ProfessionalDashboardPage';
import InspirationFeedPage from '@/pages/InspirationFeedPage';
import ProfilePage from '@/pages/ProfilePage';
import CanvasIAProPage from '@/pages/CanvasIAProPage';
import UserActivityPage from '@/pages/UserActivityPage';
import VoiceCopilotBubble from '@/components/voice/VoiceCopilotBubble';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const DashboardPage = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true); // Iniciar colapsado en móvil
  const [headerStepName, setHeaderStepName] = useState('');
  const [headerStepIndex, setHeaderStepIndex] = useState(0);
  const [headerTotalSteps, setHeaderTotalSteps] = useState(0);
  const { user, session } = useAuth();

  useEffect(() => {
    if (user && session) {
      const track = async () => {
        try {
          await supabase.functions.invoke('log-user-access', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: { usuario_id: user.id, email: user.email },
          });
        } catch (error) {
          console.error('Error tracking access:', error.message);
        }
      };
      track();
    }
  }, [user, session]);

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);
  
  const setHeaderStep = (name, index, total) => {
    setHeaderStepName(name);
    setHeaderStepIndex(index);
    setHeaderTotalSteps(total);
  }

  return (
    <div className="flex h-screen bg-[#0B0D12] overflow-hidden">
      <DashboardSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader 
          toggleSidebar={toggleSidebar} 
          currentStepName={headerStepName}
          currentStepIndex={headerStepIndex}
          totalSteps={headerTotalSteps}
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-pattern custom-scrollbar">
          <Routes>
            <Route path="diy" element={<DIYDashboardPage setHeaderStep={setHeaderStep} />} />
            <Route path="professional" element={<ProfessionalDashboardPage setHeaderStep={setHeaderStep} />} />
            <Route path="canvas" element={<CanvasIAProPage setHeaderStep={setHeaderStep} />} />
            <Route path="feed" element={<InspirationFeedPage setHeaderStep={setHeaderStep} />} />
            <Route path="perfil" element={<ProfilePage setHeaderStep={setHeaderStep} />} />
            <Route path="activity" element={<UserActivityPage setHeaderStep={setHeaderStep} />} />
            <Route path="*" element={<Navigate to="/dashboard/diy" replace />} />
          </Routes>
        </main>
      </div>
      <VoiceCopilotBubble />
    </div>
  );
};

export default DashboardPage;