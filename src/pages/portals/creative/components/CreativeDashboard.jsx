import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getCreatorStats, getMyJobs } from '@/services/api/creatorJobs';
import { getPaymentStats } from '@/services/api/creatorPayments';
import { getCreatorQualityStats } from '@/services/api/creatorQuality';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Award,
  Star,
  FileText,
  Target,
  Zap,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  BarChart3,
  Sparkles
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatsChart, { LineChart, DonutChart } from './StatsChart';
import TimelineView from './TimelineView';
import { Link } from 'react-router-dom';
import { Brain, Calendar, BarChart3 } from 'lucide-react';

const CreativeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);
  const [qualityStats, setQualityStats] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [jobStats, payStats, qualStats, jobsData] = await Promise.all([
          getCreatorStats(user.id),
          getPaymentStats(user.id),
          getCreatorQualityStats(user.id),
          getMyJobs(user.id, null),
        ]);

        setStats(jobStats);
        setPaymentStats(payStats);
        setQualityStats(qualStats);
        setActiveJobs(jobsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse flex-shrink-0" />
              <span className="truncate">Mi Dashboard</span>
            </h2>
            <p className="text-sm sm:text-base text-white/70">Resumen de tu actividad y rendimiento</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto">
            <Link to="/creative/recommendations" className="flex-1 sm:flex-initial">
              <Badge variant="outline" className="text-xs px-2 sm:px-3 py-1 border-primary/30 text-primary hover:bg-primary/10 transition-colors cursor-pointer w-full sm:w-auto justify-center">
                <Brain className="w-3 h-3 mr-1" />
                <span className="hidden xs:inline">Recomendaciones IA</span>
                <span className="xs:hidden">IA</span>
              </Badge>
            </Link>
            <Link to="/creative/calendar" className="flex-1 sm:flex-initial">
              <Badge variant="outline" className="text-xs px-2 sm:px-3 py-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer w-full sm:w-auto justify-center">
                <Calendar className="w-3 h-3 mr-1" />
                <span className="hidden xs:inline">Calendario</span>
                <span className="xs:hidden">Cal</span>
              </Badge>
            </Link>
            <Link to="/creative/analytics" className="flex-1 sm:flex-initial">
              <Badge variant="outline" className="text-xs px-2 sm:px-3 py-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors cursor-pointer w-full sm:w-auto justify-center">
                <BarChart3 className="w-3 h-3 mr-1" />
                <span className="hidden xs:inline">Analytics</span>
                <span className="xs:hidden">Stats</span>
              </Badge>
            </Link>
            <Badge variant="outline" className="text-xs px-2 sm:px-3 py-1 border-primary/30 text-primary hidden sm:flex">
              <Activity className="w-3 h-3 mr-1" />
              En tiempo real
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas principales con animaciones - Responsive */}
      <motion.div 
        className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-500/20 via-blue-600/20 to-blue-700/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/80 truncate pr-1 sm:pr-2">Trabajos Activos</CardTitle>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="flex-shrink-0"
              >
                <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </motion.div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <motion.div 
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {stats?.activeJobs || 0}
              </motion.div>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                <p className="text-xs text-white/60 line-clamp-1">
                  de {stats?.totalJobs || 0} totales
                </p>
                {stats?.activeJobs > 0 && (
                  <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-300 flex-shrink-0">
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Activo</span>
                  </Badge>
                )}
              </div>
              {stats?.activeJobs > 0 && (
                <div className="mt-2 sm:mt-3">
                  <Progress 
                    value={(stats.activeJobs / stats.totalJobs) * 100} 
                    className="h-1.5 sm:h-2 bg-blue-500/10"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-green-500/20 via-green-600/20 to-emerald-700/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/80 truncate pr-1 sm:pr-2">Ganancias Totales</CardTitle>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                className="flex-shrink-0"
              >
                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-400 group-hover:text-green-300 transition-colors" />
              </motion.div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <motion.div 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 break-words"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                ${(paymentStats?.totalEarned || 0).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </motion.div>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                <p className="text-xs text-white/60 line-clamp-1">
                  ${(paymentStats?.pendingAmount || 0).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} pendientes
                </p>
                {paymentStats?.pendingAmount > 0 && (
                  <Badge variant="outline" className="text-xs bg-yellow-500/10 border-yellow-500/30 text-yellow-300 flex-shrink-0">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Pendiente</span>
                  </Badge>
                )}
              </div>
              {paymentStats?.totalEarned > 0 && (
                <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <span className="text-xs text-green-400 font-medium line-clamp-1">
                    +{((paymentStats.totalEarned / (paymentStats.totalEarned + paymentStats.pendingAmount)) * 100).toFixed(0)}% completado
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-500/20 via-purple-600/20 to-violet-700/20 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/80 truncate pr-1 sm:pr-2">Puntuación Promedio</CardTitle>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="flex-shrink-0"
              >
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-purple-400 group-hover:text-purple-300 transition-colors fill-purple-400/20" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10 p-3 sm:p-6 pt-0">
              <motion.div 
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                {qualityStats?.averageScore ? qualityStats.averageScore.toFixed(1) : '0.0'}
                <span className="text-sm sm:text-base md:text-lg text-white/60">/100</span>
              </motion.div>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                <p className="text-xs text-white/60">
                  {qualityStats?.totalReviews || 0} revisiones
                </p>
                {qualityStats?.averageScore >= 80 && (
                  <Badge variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-300 flex-shrink-0">
                    <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Excelente</span>
                  </Badge>
                )}
              </div>
              {qualityStats?.averageScore > 0 && (
                <div className="mt-2 sm:mt-3">
                  <Progress 
                    value={qualityStats.averageScore} 
                    className="h-1.5 sm:h-2 bg-purple-500/10"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-orange-500/20 via-orange-600/20 to-amber-700/20 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 group h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/80 truncate pr-1 sm:pr-2">Tasa de Aprobación</CardTitle>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                className="flex-shrink-0"
              >
                <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-orange-400 group-hover:text-orange-300 transition-colors" />
              </motion.div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <motion.div 
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                {qualityStats?.passRate ? qualityStats.passRate.toFixed(1) : '0.0'}%
              </motion.div>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                <p className="text-xs text-white/60">
                  Trabajos aprobados
                </p>
                {qualityStats?.passRate >= 90 && (
                  <Badge variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-300 flex-shrink-0">
                    <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Top</span>
                  </Badge>
                )}
              </div>
              {qualityStats?.passRate > 0 && (
                <div className="mt-2 sm:mt-3">
                  <Progress 
                    value={qualityStats.passRate} 
                    className="h-1.5 sm:h-2 bg-orange-500/10"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Detalles de calidad mejorado */}
      {qualityStats && qualityStats.totalReviews > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-card/60 via-card/40 to-card/20 border-border/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white mb-1">
                    <Target className="w-5 h-5 text-primary" />
                    Desglose de Calidad
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Análisis detallado de tus puntuaciones por categoría
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Análisis
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Puntuación Técnica */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-sm font-medium text-white/90">Puntuación Técnica</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">{qualityStats.averageTechnical.toFixed(1)}</span>
                    <span className="text-xs text-white/60">/100</span>
                    {qualityStats.averageTechnical >= 80 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : qualityStats.averageTechnical >= 60 ? (
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Progress 
                    value={qualityStats.averageTechnical} 
                    className="h-3 bg-blue-500/10"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/40 rounded-full"
                    style={{ width: `${qualityStats.averageTechnical}%` }}
                  />
                </div>
              </div>

              {/* Puntuación Creativa */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-sm font-medium text-white/90">Puntuación Creativa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">{qualityStats.averageCreative.toFixed(1)}</span>
                    <span className="text-xs text-white/60">/100</span>
                    {qualityStats.averageCreative >= 80 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : qualityStats.averageCreative >= 60 ? (
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Progress 
                    value={qualityStats.averageCreative} 
                    className="h-3 bg-purple-500/10"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-400/40 rounded-full"
                    style={{ width: `${qualityStats.averageCreative}%` }}
                  />
                </div>
              </div>

              {/* Cumplimiento del Brief */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-medium text-white/90">Cumplimiento del Brief</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">{qualityStats.averageAdherence.toFixed(1)}</span>
                    <span className="text-xs text-white/60">/100</span>
                    {qualityStats.averageAdherence >= 80 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : qualityStats.averageAdherence >= 60 ? (
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Progress 
                    value={qualityStats.averageAdherence} 
                    className="h-3 bg-green-500/10"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-400/40 rounded-full"
                    style={{ width: `${qualityStats.averageAdherence}%` }}
                  />
                </div>
              </div>

              {/* Resumen visual */}
              <div className="pt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400">{qualityStats.averageTechnical.toFixed(0)}</div>
                    <div className="text-xs text-white/60 mt-1">Técnica</div>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400">{qualityStats.averageCreative.toFixed(0)}</div>
                    <div className="text-xs text-white/60 mt-1">Creativa</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">{qualityStats.averageAdherence.toFixed(0)}</div>
                    <div className="text-xs text-white/60 mt-1">Brief</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Resumen de trabajos mejorado - Responsive */}
      <motion.div 
        className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-card/60 to-card/30 border-border/40 hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  Trabajos Completados
                </CardTitle>
                <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-300">
                  {stats?.completedJobs || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              >
                {stats?.completedJobs || 0}
              </motion.div>
              <p className="text-sm text-white/60 mb-3">
                Proyectos finalizados exitosamente
              </p>
              {stats?.totalJobs > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Progreso total</span>
                    <span>{((stats.completedJobs / stats.totalJobs) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={(stats.completedJobs / stats.totalJobs) * 100} 
                    className="h-2 bg-green-500/10"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-card/60 to-card/30 border-border/40 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  Pagos Pendientes
                </CardTitle>
                <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-300">
                  {paymentStats?.pendingPayments || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                ${(paymentStats?.pendingAmount || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
              <p className="text-sm text-white/60 mb-3">
                {paymentStats?.pendingPayments || 0} pagos en proceso
              </p>
              {paymentStats?.pendingAmount > 0 && (
                <div className="flex items-center gap-2 text-xs text-yellow-300">
                  <Calendar className="w-3 h-3" />
                  <span>Procesando próximamente</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Timeline de deadlines */}
      {activeJobs.length > 0 && (
        <motion.div variants={itemVariants}>
          <TimelineView jobs={activeJobs} />
        </motion.div>
      )}

      {/* Gráficos adicionales - Responsive */}
      {stats && paymentStats && (
        <motion.div 
          className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <StatsChart
              title="Distribución de Trabajos"
              data={[
                { label: 'Completados', value: stats.completedJobs || 0 },
                { label: 'En Progreso', value: stats.activeJobs || 0 },
                { label: 'Total', value: stats.totalJobs || 0 },
              ]}
              color="primary"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DonutChart
              title="Tasa de Completación"
              value={stats.completedJobs || 0}
              max={stats.totalJobs || 1}
              color="primary"
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreativeDashboard;
