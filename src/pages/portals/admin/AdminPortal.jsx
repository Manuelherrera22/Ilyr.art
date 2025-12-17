import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SystemMetrics from './components/SystemMetrics';
import AccountsManagement from './components/AccountsManagement';
import UsersManagement from './components/UsersManagement';
import ServicesManagement from './components/ServicesManagement';
import ProjectsManagement from './components/ProjectsManagement';
import ProjectsTracking from './components/ProjectsTracking';
import NotificationsBell from '@/components/NotificationsBell';

const AdminOverview = () => (
  <div className="space-y-6">
    <SystemMetrics />
  </div>
);

import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

const AdminPortal = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-[#05070D] text-white relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-10 relative">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5">
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-4 h-4 text-primary" />
              </motion.div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50">
                ILYR Admin Console
              </p>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight flex items-center gap-2">
              Gobernanza y Métricas
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-5 h-5 text-primary" />
              </motion.div>
            </h1>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-2 sm:gap-3 items-center w-full sm:w-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              asChild
              variant={location.pathname === '/admin' || location.pathname === '/admin/' ? 'default' : 'outline'}
              size="sm"
              className={`
                border-white/20 text-white text-xs sm:text-sm flex-1 sm:flex-initial
                ${location.pathname === '/admin' || location.pathname === '/admin/' 
                  ? 'bg-primary/20 border-primary/50 hover:bg-primary/30' 
                  : 'hover:bg-white/10'
                }
                transition-all duration-200
              `}
            >
              <Link to=".">Métricas</Link>
            </Button>
            <Button
              asChild
              variant={location.pathname.includes('/accounts') ? 'default' : 'outline'}
              size="sm"
              className={`
                border-white/20 text-white text-xs sm:text-sm flex-1 sm:flex-initial
                ${location.pathname.includes('/accounts')
                  ? 'bg-primary/20 border-primary/50 hover:bg-primary/30' 
                  : 'hover:bg-white/10'
                }
                transition-all duration-200
              `}
            >
              <Link to="accounts">Cuentas</Link>
            </Button>
            <Button
              asChild
              variant={location.pathname.includes('/users') ? 'default' : 'outline'}
              size="sm"
              className={`
                border-white/20 text-white text-xs sm:text-sm flex-1 sm:flex-initial
                ${location.pathname.includes('/users')
                  ? 'bg-primary/20 border-primary/50 hover:bg-primary/30' 
                  : 'hover:bg-white/10'
                }
                transition-all duration-200
              `}
            >
              <Link to="users">Usuarios</Link>
            </Button>
            <Button
              asChild
              variant={location.pathname.includes('/services') ? 'default' : 'outline'}
              size="sm"
              className={`
                border-white/20 text-white text-xs sm:text-sm flex-1 sm:flex-initial
                ${location.pathname.includes('/services')
                  ? 'bg-primary/20 border-primary/50 hover:bg-primary/30' 
                  : 'hover:bg-white/10'
                }
                transition-all duration-200
              `}
            >
              <Link to="services">Servicios</Link>
            </Button>
            <Button
              asChild
              variant={location.pathname.includes('/projects') && !location.pathname.includes('/tracking') ? 'default' : 'outline'}
              size="sm"
              className={`
                border-white/20 text-white text-xs sm:text-sm flex-1 sm:flex-initial
                ${location.pathname.includes('/projects') && !location.pathname.includes('/tracking')
                  ? 'bg-primary/20 border-primary/50 hover:bg-primary/30' 
                  : 'hover:bg-white/10'
                }
                transition-all duration-200
              `}
            >
              <Link to="projects">Proyectos</Link>
            </Button>
            <Button
              asChild
              variant={location.pathname.includes('/tracking') ? 'default' : 'outline'}
              size="sm"
              className={`
                border-white/20 text-white text-xs sm:text-sm flex-1 sm:flex-initial
                ${location.pathname.includes('/tracking')
                  ? 'bg-primary/20 border-primary/50 hover:bg-primary/30' 
                  : 'hover:bg-white/10'
                }
                transition-all duration-200
              `}
            >
              <Link to="tracking">Seguimiento</Link>
            </Button>
            <div className="flex-shrink-0">
              <NotificationsBell />
            </div>
          </motion.div>
        </div>
      </div>
      <main className="mx-auto min-h-[calc(100vh-120px)] w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 md:py-10 relative">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="accounts" element={<AccountsManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="services" element={<ServicesManagement />} />
          <Route path="projects" element={<ProjectsManagement />} />
          <Route path="tracking" element={<ProjectsTracking />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPortal;

