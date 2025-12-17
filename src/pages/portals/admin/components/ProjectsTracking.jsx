import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Users,
  DollarSign,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const ProjectsTracking = () => {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchTrackingData();
  }, [timeRange]);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      // Datos mock para testing
      const mockData = {
        overview: {
          totalProjects: 24,
          activeProjects: 12,
          completedProjects: 8,
          onTimeProjects: 10,
          delayedProjects: 2,
          totalRevenue: 245000,
          avgCompletionTime: 45,
          teamUtilization: 78,
        },
        trends: {
          projectsGrowth: 12.5,
          revenueGrowth: 23.8,
          completionRate: 8.2,
          clientSatisfaction: 4.6,
        },
        milestones: [
          { id: '1', name: 'Brief Aprobado', due: new Date(), status: 'completed', project: 'Campaña Q1' },
          { id: '2', name: 'Primera Revisión', due: new Date(Date.now() + 86400000 * 3), status: 'pending', project: 'Rebranding' },
          { id: '3', name: 'Entrega Final', due: new Date(Date.now() + 86400000 * 7), status: 'pending', project: 'CGI Film' },
        ],
        recentActivity: [
          { id: '1', type: 'milestone', message: 'Hito completado: Brief Aprobado', project: 'Campaña Q1', time: new Date() },
          { id: '2', type: 'update', message: 'Actualización publicada', project: 'Rebranding', time: new Date(Date.now() - 3600000) },
          { id: '3', type: 'comment', message: 'Nuevo comentario del cliente', project: 'CGI Film', time: new Date(Date.now() - 7200000) },
        ],
        performance: {
          onTimeRate: 83.3,
          qualityScore: 4.7,
          clientSatisfaction: 4.6,
          teamProductivity: 92,
        },
      };
      setTrackingData(mockData);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los datos de seguimiento',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !trackingData) {
    return <LoadingSpinner />;
  }

  const overviewCards = [
    {
      title: 'Proyectos Activos',
      value: trackingData.overview.activeProjects,
      change: trackingData.trends.projectsGrowth,
      trend: 'up',
      icon: Activity,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Completados',
      value: trackingData.overview.completedProjects,
      change: trackingData.trends.completionRate,
      trend: 'up',
      icon: CheckCircle2,
      color: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    },
    {
      title: 'A Tiempo',
      value: trackingData.overview.onTimeProjects,
      change: 5.2,
      trend: 'up',
      icon: Target,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    },
    {
      title: 'Retrasados',
      value: trackingData.overview.delayedProjects,
      change: -15.3,
      trend: 'down',
      icon: AlertCircle,
      color: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    },
    {
      title: 'Ingresos Totales',
      value: `$${(trackingData.overview.totalRevenue / 1000).toFixed(0)}k`,
      change: trackingData.trends.revenueGrowth,
      trend: 'up',
      icon: DollarSign,
      color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    },
    {
      title: 'Tiempo Promedio',
      value: `${trackingData.overview.avgCompletionTime} días`,
      change: -8.5,
      trend: 'down',
      icon: Clock,
      color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    },
  ];

  const performanceMetrics = [
    {
      label: 'Tasa de Entrega a Tiempo',
      value: trackingData.performance.onTimeRate,
      target: 90,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Puntuación de Calidad',
      value: trackingData.performance.qualityScore,
      target: 5,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Satisfacción del Cliente',
      value: trackingData.performance.clientSatisfaction,
      target: 5,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Productividad del Equipo',
      value: trackingData.performance.teamProductivity,
      target: 100,
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                Seguimiento de Proyectos
              </h2>
              <p className="text-white/60 mt-1 text-sm">Métricas, tendencias y análisis de rendimiento</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`
                  ${timeRange === range
                    ? 'bg-primary/20 border-primary/50 text-primary'
                    : 'border-white/20 text-white hover:bg-white/10'
                  }
                `}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Métricas principales */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          const colors = card.color.split(' ');
          return (
            <motion.div key={index} variants={{
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
            }} whileHover={{ scale: 1.02, y: -4 }}>
              <Card className={`relative overflow-hidden bg-gradient-to-br ${colors[0]} ${colors[1]} border ${colors[2]} backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-white/70 uppercase tracking-wider">
                      {card.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-${colors[2].split('/')[0]}/20 border ${colors[2]}`}>
                      <Icon className={`w-5 h-5 ${colors[3]}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <motion.div
                        className="text-3xl font-bold text-white mb-2"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, type: 'spring' }}
                      >
                        {card.value}
                      </motion.div>
                      <div className="flex items-center gap-1.5 text-xs">
                        {card.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`font-semibold ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {Math.abs(card.change)}%
                        </span>
                        <span className="text-white/50">vs período anterior</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Métricas de rendimiento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-white/5 via-white/5 to-transparent border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Métricas de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {performanceMetrics.map((metric, index) => {
                const percentage = (metric.value / metric.target) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                      <span>{metric.label}</span>
                      <span className="font-semibold">{metric.value} / {metric.target}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <motion.div
                        className={`bg-gradient-to-r ${metric.color} h-3 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Próximos hitos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-white/5 via-white/5 to-transparent border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Próximos Hitos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trackingData.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${milestone.status === 'completed' ? 'bg-green-500/20 border-green-500/30' : 'bg-blue-500/20 border-blue-500/30'} border`}>
                    {milestone.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{milestone.name}</p>
                    <p className="text-white/60 text-sm">{milestone.project}</p>
                    <p className="text-white/50 text-xs mt-1">
                      {format(new Date(milestone.due), 'dd MMM yyyy', { locale: currentLocale })}
                    </p>
                  </div>
                  <Badge variant={milestone.status === 'completed' ? 'default' : 'outline'}>
                    {milestone.status === 'completed' ? 'Completado' : 'Pendiente'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actividad reciente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-white/5 via-white/5 to-transparent border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trackingData.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/60 text-xs">{activity.project}</span>
                      <span className="text-white/40 text-xs">•</span>
                      <span className="text-white/50 text-xs">
                        {format(new Date(activity.time), 'dd MMM, HH:mm', { locale: currentLocale })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProjectsTracking;
