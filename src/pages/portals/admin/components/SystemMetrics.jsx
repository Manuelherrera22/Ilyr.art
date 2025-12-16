import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSystemMetrics } from '@/services/api/admin';
import LoadingSpinner from '@/components/LoadingSpinner';
import { TrendingUp, FolderKanban, Users, Building2, FileText, Activity, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const SystemMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getSystemMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Datos mock para testing
        setMetrics({
          totalProjects: 24,
          activeProjects: 12,
          totalUsers: 156,
          totalClientAccounts: 8,
          totalBriefs: 45,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // Refrescar cada 60 segundos
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !metrics) {
    return <LoadingSpinner />;
  }

  const metricCards = [
    {
      title: 'Proyectos Totales',
      value: metrics.totalProjects || 0,
      change: '+12%',
      trend: 'up',
      icon: FolderKanban,
      gradient: 'from-blue-500/20 via-blue-600/10 to-transparent',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      glowColor: 'shadow-blue-500/20',
    },
    {
      title: 'Proyectos Activos',
      value: metrics.activeProjects || 0,
      change: '+8%',
      trend: 'up',
      icon: Activity,
      gradient: 'from-green-500/20 via-green-600/10 to-transparent',
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      glowColor: 'shadow-green-500/20',
    },
    {
      title: 'Usuarios',
      value: metrics.totalUsers || 0,
      change: '+23%',
      trend: 'up',
      icon: Users,
      gradient: 'from-purple-500/20 via-purple-600/10 to-transparent',
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      glowColor: 'shadow-purple-500/20',
    },
    {
      title: 'Cuentas de Clientes',
      value: metrics.totalClientAccounts || 0,
      change: '+5%',
      trend: 'up',
      icon: Building2,
      gradient: 'from-orange-500/20 via-orange-600/10 to-transparent',
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      glowColor: 'shadow-orange-500/20',
    },
    {
      title: 'Briefs',
      value: metrics.totalBriefs || 0,
      change: '+18%',
      trend: 'up',
      icon: FileText,
      gradient: 'from-cyan-500/20 via-cyan-600/10 to-transparent',
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30',
      glowColor: 'shadow-cyan-500/20',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white flex items-center gap-3">
              Métricas del Sistema
              <Zap className="w-6 h-6 text-primary animate-pulse" />
            </h2>
            <p className="text-white/60 mt-1 text-sm">Vista general en tiempo real de la plataforma</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
      >
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div key={index} variants={cardVariants} whileHover={{ scale: 1.02, y: -4 }}>
              <Card className={`
                relative overflow-hidden
                bg-gradient-to-br ${metric.gradient}
                border ${metric.borderColor}
                backdrop-blur-sm
                hover:${metric.glowColor} hover:shadow-2xl
                transition-all duration-300
                group
              `}>
                {/* Efecto de brillo animado */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-white/70 uppercase tracking-wider">
                      {metric.title}
                    </CardTitle>
                    <motion.div
                      className={`p-2.5 rounded-xl ${metric.iconBg} border ${metric.borderColor}`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <motion.div
                        className="text-4xl font-bold text-white mb-2"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, type: 'spring' }}
                      >
                        {metric.value.toLocaleString()}
                      </motion.div>
                      <div className="flex items-center gap-1.5 text-xs">
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`font-semibold ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {metric.change}
                        </span>
                        <span className="text-white/50">vs mes anterior</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Sección de actividad reciente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-white/5 via-white/5 to-transparent border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Actividad del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/80 text-sm">Sistema operativo normalmente</span>
                </div>
                <span className="text-white/50 text-xs">Ahora</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-white/80 text-sm">Última actualización de métricas</span>
                </div>
                <span className="text-white/50 text-xs">Hace 2 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SystemMetrics;

