import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LayoutGrid, User, LifeBuoy, LogOut, ChevronsLeft, Zap, ArrowLeftRight, BrainCircuit, Sparkles, Film, Lightbulb, History } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/components/ui/use-toast';

const DashboardSidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Flujo DIY', icon: LayoutGrid, path: '/dashboard/diy' },
    { name: 'Gestor de Ideas', icon: Lightbulb, path: '/dashboard/professional'},
    { name: 'Canvas IA Pro', icon: Film, path: '/dashboard/canvas' },
    { name: 'Análisis de Video', icon: BrainCircuit, path: '/analisis-creativo' },
    { name: 'Inspiración', icon: Sparkles, path: '/dashboard/feed' },
  ];

  const accountItems = [
    { name: 'Mi Cuenta', icon: User, path: '/dashboard/perfil' },
    { name: 'Mi Actividad', icon: History, path: '/dashboard/activity' },
    { name: 'Centro de Ayuda', icon: LifeBuoy },
  ];

  const handleMenuClick = (item) => {
    if (item.path) {
      navigate(item.path);
    } else {
      toast({
        title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀",
        description: `La sección "${item.name}" estará disponible pronto.`,
        duration: 4000,
      });
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-[#0B0D12]/90 backdrop-blur-xl flex-shrink-0 flex flex-col border-r border-white/10 relative shadow-2xl hidden lg:flex"
    >
      <div className={`flex items-center p-4 h-[89px] border-b border-white/10 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF3CAC] to-[#784BA0] rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] bg-clip-text text-transparent">ILYR.art</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="absolute -right-4 top-[96px] bg-[#0B0D12]/80 hover:bg-white/10 border border-white/20 rounded-full h-8 w-8 shadow-lg">
          <ChevronsLeft className={`h-4 w-4 transition-transform duration-300 text-white/70 ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      <nav className="flex-grow mt-6 px-2">
        <motion.ul variants={{ visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible" className="space-y-1">
          {menuItems.map(item => (
            <motion.li key={item.name} variants={itemVariants}>
              <Button 
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                onClick={() => handleMenuClick(item)}
                className={`w-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-start'} group ${location.pathname === item.path ? 'bg-white/10 text-white' : ''}`}
              >
                <item.icon className={`h-5 w-5 ${location.pathname === item.path ? 'text-[#FF3CAC]' : 'group-hover:text-[#FF3CAC]'} transition-colors ${!isCollapsed ? 'mr-3' : ''}`} /> 
                {!isCollapsed && <span className={`${location.pathname === item.path ? 'text-white' : 'group-hover:text-[#FF3CAC]'} transition-colors`}>{item.name}</span>}
              </Button>
            </motion.li>
          ))}
        </motion.ul>
      </nav>
      <div className="mt-auto px-2 pb-4">
        <ul className="space-y-1">
          <li>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className={`w-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-start'} group`}>
              <ArrowLeftRight className={`h-5 w-5 group-hover:text-[#FF3CAC] transition-colors ${!isCollapsed ? 'mr-3' : ''}`} /> {!isCollapsed && 'Cambiar Flujo'}
            </Button>
          </li>
          {accountItems.map(item => (
            <li key={item.name}>
              <Button 
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                onClick={() => handleMenuClick(item)}
                className={`w-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-start'} group ${location.pathname === item.path ? 'bg-white/10 text-white' : ''}`}
              >
                <item.icon className={`h-5 w-5 ${location.pathname === item.path ? 'text-[#FF3CAC]' : 'group-hover:text-[#FF3CAC]'} transition-colors ${!isCollapsed ? 'mr-3' : ''}`} /> 
                {!isCollapsed && <span className={`${location.pathname === item.path ? 'text-white' : 'group-hover:text-[#FF3CAC]'} transition-colors`}>{item.name}</span>}
              </Button>
            </li>
          ))}
          <li>
            <Button variant="ghost" onClick={signOut} className={`w-full text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-start'} group`}>
              <LogOut className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''}`} /> {!isCollapsed && 'Cerrar Sesión'}
            </Button>
          </li>
        </ul>
        <div className={`p-2 mt-4 border-t border-white/20 ${isCollapsed ? 'text-center' : ''}`}>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <p className="text-sm font-semibold text-white truncate">{profile?.full_name || user?.email}</p>
                <p className="text-xs text-white/60 capitalize">{profile?.profile_type || 'Usuario'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;