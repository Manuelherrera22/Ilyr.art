import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreativeDashboard from './components/CreativeDashboard';
import AvailableJobsList from './components/AvailableJobsList';
import MyActiveJobs from './components/MyActiveJobs';
import JobDetailView from './components/JobDetailView';
import PaymentsView from './components/PaymentsView';
import CreativeTasksList from './components/CreativeTasksList';
import CreativeProjectDetail from './components/CreativeProjectDetail';
import CreatorPortfolio from './components/CreatorPortfolio';
import AchievementsSystem from './components/AchievementsSystem';
import JobRecommendations from './components/JobRecommendations';
import CalendarView from './components/CalendarView';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import ReportExport from './components/ReportExport';
import MessagingSystem from './components/MessagingSystem';
import SkillsManagement from './components/SkillsManagement';
import NotificationsBell from '@/components/NotificationsBell';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Briefcase, 
  DollarSign, 
  Sparkles,
  FileText,
  Zap,
  Trophy,
  Calendar,
  BarChart3,
  MessageSquare,
  Award
} from 'lucide-react';

const CreativePortal = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/jobs/')) return 'jobs';
    if (location.pathname.includes('/payments')) return 'payments';
    if (location.pathname.includes('/available')) return 'available';
    if (location.pathname.includes('/projects/')) return 'projects';
    return 'dashboard';
  });

  // Actualizar tab activo cuando cambia la ruta
  useEffect(() => {
    if (location.pathname.includes('/jobs/')) setActiveTab('jobs');
    else if (location.pathname.includes('/payments')) setActiveTab('payments');
    else if (location.pathname.includes('/available')) setActiveTab('available');
    else if (location.pathname.includes('/projects/')) setActiveTab('projects');
    else if (location.pathname.includes('/portfolio')) setActiveTab('portfolio');
    else if (location.pathname.includes('/achievements')) setActiveTab('achievements');
    else if (location.pathname.includes('/calendar')) setActiveTab('calendar');
    else if (location.pathname.includes('/analytics')) setActiveTab('analytics');
    else if (location.pathname.includes('/reports')) setActiveTab('analytics');
    else if (location.pathname.includes('/messages')) setActiveTab('messages');
    else if (location.pathname.includes('/skills')) setActiveTab('skills');
    else if (location.pathname.includes('/recommendations')) setActiveTab('available');
    else if (location.pathname.includes('/jobs')) setActiveTab('jobs');
    else setActiveTab('dashboard');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#05070D] text-white relative overflow-hidden">
      {/* Efecto de fondo animado */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-10 relative">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50">
                ILYR Creative Workspace
              </p>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight flex items-center gap-2">
              Dashboard de Creadores
              <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30 text-primary hidden sm:inline-flex">
                <Zap className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </h1>
          </div>
          <div className="flex-shrink-0">
            <NotificationsBell />
          </div>
        </div>
        
        {/* Navegación por pestañas mejorada - Responsive */}
        <div className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-white/10 rounded-none h-auto p-0 w-full justify-start overflow-x-auto scrollbar-hide">
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
              <TabsTrigger 
                value="dashboard" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Dashboard</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="available" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative/available" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Trabajos Disponibles</span>
                  <span className="hidden xs:inline md:hidden">Disponibles</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="jobs" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative/jobs" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Mis Trabajos</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative/payments" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Pagos</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative/projects" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Proyectos</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative/portfolio" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Portfolio</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative/achievements" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Logros</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="calendar" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative/calendar" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Calendario</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative/analytics" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Analytics</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative/messages" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Mensajes</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                asChild
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all flex-shrink-0"
              >
                <Link to="/creative/skills" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors rounded-t-lg text-xs sm:text-sm">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Habilidades</span>
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <main className="mx-auto min-h-[calc(100vh-180px)] w-full max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-10 relative z-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<CreativeDashboard />} />
            <Route path="available" element={<AvailableJobsList />} />
            <Route path="recommendations" element={<JobRecommendations />} />
            <Route path="jobs" element={<MyActiveJobs />} />
            <Route path="jobs/:jobId" element={<JobDetailView />} />
            <Route path="payments" element={<PaymentsView />} />
            <Route path="projects" element={<CreativeTasksList />} />
            <Route path="projects/:projectId" element={<CreativeProjectDetail />} />
            <Route path="portfolio" element={<CreatorPortfolio />} />
            <Route path="achievements" element={<AchievementsSystem />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="analytics" element={<AdvancedAnalytics />} />
            <Route path="reports" element={<ReportExport />} />
            <Route path="messages" element={<MessagingSystem />} />
            <Route path="skills" element={<SkillsManagement />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CreativePortal;

