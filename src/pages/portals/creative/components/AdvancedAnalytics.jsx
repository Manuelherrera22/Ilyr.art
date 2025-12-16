import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Star,
  Clock,
  Target,
  Award,
  Download,
  Calendar,
  Zap,
  Activity
} from 'lucide-react';
import { format, subMonths, subDays } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StatsChart, { LineChart, DonutChart } from './StatsChart';

const AdvancedAnalytics = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  
  const [analytics, setAnalytics] = useState({
    earnings: {
      current: 45000,
      previous: 38000,
      trend: 'up',
      monthly: [
        { month: 'Ene', value: 3500 },
        { month: 'Feb', value: 4200 },
        { month: 'Mar', value: 5100 },
        { month: 'Abr', value: 4800 },
        { month: 'May', value: 5500 },
        { month: 'Jun', value: 6200 }
      ]
    },
    quality: {
      current: 92.5,
      previous: 89.3,
      trend: 'up',
      breakdown: [
        { category: 'Técnica', value: 94 },
        { category: 'Creativa', value: 91 },
        { category: 'Brief', value: 92 }
      ]
    },
    productivity: {
      jobsCompleted: 12,
      averageTime: 5.2,
      onTimeRate: 95,
      efficiency: 88
    },
    performance: {
      clientSatisfaction: 98,
      repeatClients: 75,
      referralRate: 12
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    // TODO: Fetch analytics from API
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Analytics data is already set in state
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, timeRange]);

  const earningsChange = ((analytics.earnings.current - analytics.earnings.previous) / analytics.earnings.previous * 100).toFixed(1);
  const qualityChange = (analytics.quality.current - analytics.quality.previous).toFixed(1);

  if (loading) {
    return <div className="text-center py-12 text-white/70">Cargando analytics...</div>;
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <span className="truncate">Analytics Avanzados</span>
          </h2>
          <p className="text-sm sm:text-base text-white/70">Análisis detallado de tu rendimiento y tendencias</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-initial text-xs sm:text-sm">
            <Link to="/creative/reports" className="flex items-center justify-center">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Exportar Reportes</span>
              <span className="xs:hidden">Reportes</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filtros de tiempo - Responsive */}
      <Card className="bg-card/40 border-border/40">
        <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="bg-transparent border-border/40 w-full overflow-x-auto scrollbar-hide">
              <TabsTrigger value="1month" className="text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">1 Mes</TabsTrigger>
              <TabsTrigger value="3months" className="text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">3 Meses</TabsTrigger>
              <TabsTrigger value="6months" className="text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">6 Meses</TabsTrigger>
              <TabsTrigger value="1year" className="text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">1 Año</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Métricas principales - Responsive */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm text-white/80">Ganancias Totales</CardTitle>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${analytics.earnings.current.toLocaleString('es-ES')}
            </div>
            <div className="flex items-center gap-2">
              {analytics.earnings.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm ${analytics.earnings.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {earningsChange}% vs período anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm text-white/80">Calidad Promedio</CardTitle>
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {analytics.quality.current.toFixed(1)}/100
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                +{qualityChange} puntos
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm text-white/80">Tasa de Puntualidad</CardTitle>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {analytics.productivity.onTimeRate}%
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/60">
                {analytics.productivity.jobsCompleted} trabajos
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm text-white/80">Satisfacción Cliente</CardTitle>
              <Award className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {analytics.performance.clientSatisfaction}%
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/60">
                {analytics.performance.repeatClients}% clientes recurrentes
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos - Responsive */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Tendencias de ganancias */}
        <LineChart
          title="Tendencias de Ganancias"
          data={analytics.earnings.monthly}
          color="primary"
        />

        {/* Desglose de calidad */}
        <Card className="bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-white">Desglose de Calidad</CardTitle>
            <CardDescription className="text-white/70">Por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.quality.breakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">{item.category}</span>
                    <span className="font-semibold text-white">{item.value}/100</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de productividad - Responsive */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Productividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Trabajos Completados</span>
                <span className="font-bold text-white text-xl">{analytics.productivity.jobsCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Tiempo Promedio</span>
                <span className="font-bold text-white text-xl">{analytics.productivity.averageTime} días</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Eficiencia</span>
                <span className="font-bold text-white text-xl">{analytics.productivity.efficiency}%</span>
              </div>
              <Progress value={analytics.productivity.efficiency} className="h-3 mt-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Satisfacción Cliente</span>
                <span className="font-bold text-white text-xl">{analytics.performance.clientSatisfaction}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Clientes Recurrentes</span>
                <span className="font-bold text-white text-xl">{analytics.performance.repeatClients}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Tasa de Referidos</span>
                <span className="font-bold text-white text-xl">{analytics.performance.referralRate}%</span>
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-white/70 mb-1">Puntuación General</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Progress value={95} className="h-2" />
                  </div>
                  <span className="font-bold text-primary text-lg">95/100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdvancedAnalytics;
