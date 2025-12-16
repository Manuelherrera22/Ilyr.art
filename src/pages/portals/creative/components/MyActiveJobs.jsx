import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getMyJobs, startJob } from '@/services/api/creatorJobs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowRight,
  Play,
  CheckCircle,
  FileText,
  AlertCircle,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Filter,
  Sparkles
} from 'lucide-react';
import { format, differenceInDays, isPast, isToday, isTomorrow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const MyActiveJobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getMyJobs(user.id);
        setJobs(data);
      } catch (error) {
        console.error('Error fetching my jobs:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar tus trabajos',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, toast]);

  // Filtrar trabajos por estado
  const filteredJobs = useMemo(() => {
    if (statusFilter === 'all') return jobs;
    return jobs.filter(job => job.status === statusFilter);
  }, [jobs, statusFilter]);

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const urgent = jobs.filter(job => {
      if (!job.deadline_date) return false;
      const days = differenceInDays(new Date(job.deadline_date), new Date());
      return days >= 0 && days < 3;
    }).length;

    const totalBudget = jobs.reduce((sum, job) => sum + parseFloat(job.budget_amount || 0), 0);
    const avgQuality = jobs
      .filter(j => j.quality_score !== null)
      .reduce((sum, j, _, arr) => arr.length > 0 ? sum + parseFloat(j.quality_score) / arr.length : 0, 0);

    return { urgent, totalBudget, avgQuality };
  }, [jobs]);

  const handleStartJob = async (jobId) => {
    if (!user) return;

    setStarting({ ...starting, [jobId]: true });
    try {
      await startJob(jobId, user.id);
      toast({
        title: '¡Trabajo iniciado!',
        description: 'Ya puedes comenzar a trabajar en este proyecto.',
        className: 'bg-green-500 text-white',
      });
      // Actualizar el estado local
      setJobs(jobs.map(j => 
        j.id === jobId 
          ? { ...j, status: 'in_progress', started_at: new Date().toISOString() }
          : j
      ));
    } catch (error) {
      console.error('Error starting job:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo iniciar el trabajo',
      });
    } finally {
      setStarting({ ...starting, [jobId]: false });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'submitted':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'in_review':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'assigned': 'Asignado',
      'in_progress': 'En Progreso',
      'submitted': 'Entregado',
      'in_review': 'En Revisión',
      'approved': 'Aprobado',
      'rejected': 'Rechazado',
      'completed': 'Completado',
    };
    return labels[status] || status;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (jobs.length === 0) {
    return (
      <Card className="bg-card/40 border-border/40 text-center p-8">
        <FileText className="w-12 h-12 mx-auto mb-4 text-white/50" />
        <CardTitle className="text-2xl font-semibold text-white mb-4">
          No tienes trabajos activos
        </CardTitle>
        <CardDescription className="text-white/70">
          Aplica a trabajos disponibles para comenzar.
        </CardDescription>
      </Card>
    );
  }

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    return differenceInDays(new Date(deadline), new Date());
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return { label: 'Sin deadline', color: 'text-white/50', bg: 'bg-gray-500/10' };
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return { label: 'Vencido', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (days === 0) return { label: 'Hoy', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (days === 1) return { label: 'Mañana', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    if (days < 7) return { label: `${days}d restantes`, color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { label: `${days}d restantes`, color: 'text-green-400', bg: 'bg-green-500/10' };
  };

  const getProgressPercentage = (job) => {
    if (job.status === 'completed') return 100;
    if (job.status === 'approved') return 90;
    if (job.status === 'in_review') return 75;
    if (job.status === 'submitted') return 60;
    if (job.status === 'in_progress') return 40;
    if (job.status === 'assigned') return 10;
    return 0;
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header con estadísticas - Responsive */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              <span className="truncate">Mis Trabajos Activos</span>
            </h2>
            <p className="text-sm sm:text-base text-white/70">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'trabajo activo' : 'trabajos activos'}
            </p>
          </div>
        </div>

        {/* Estadísticas rápidas - Responsive */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 h-full">
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-white/60 mb-1">Urgentes</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{stats.urgent}</p>
                </div>
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 h-full">
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-white/60 mb-1">Presupuesto Total</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words">
                    ${stats.totalBudget.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 h-full">
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-white/60 mb-1">Calidad Promedio</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {stats.avgQuality > 0 ? stats.avgQuality.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros por estado - Responsive */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="bg-card/40 border-border/40 w-full overflow-x-auto scrollbar-hide">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">
              Todos ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="assigned" className="data-[state=active]:bg-blue-500/20 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">
              Asignados ({jobs.filter(j => j.status === 'assigned').length})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="data-[state=active]:bg-yellow-500/20 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">
              En Progreso ({jobs.filter(j => j.status === 'in_progress').length})
            </TabsTrigger>
            <TabsTrigger value="submitted" className="data-[state=active]:bg-purple-500/20 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">
              Entregados ({jobs.filter(j => j.status === 'submitted').length})
            </TabsTrigger>
            <TabsTrigger value="in_review" className="data-[state=active]:bg-orange-500/20 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">
              En Revisión ({jobs.filter(j => j.status === 'in_review').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Lista de trabajos */}
      <AnimatePresence mode="wait">
        {filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="bg-card/40 border-border/40 text-center p-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <CardTitle className="text-2xl font-semibold text-white mb-4">
                {statusFilter !== 'all' ? 'No hay trabajos con este estado' : 'No tienes trabajos activos'}
              </CardTitle>
              <CardDescription className="text-white/70">
                {statusFilter !== 'all' 
                  ? 'Intenta cambiar el filtro o aplica a trabajos disponibles'
                  : 'Aplica a trabajos disponibles para comenzar.'}
              </CardDescription>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredJobs.map((job, index) => {
              const latestDeliverable = job.creator_deliverables?.[0];
              const latestReview = job.creator_quality_reviews?.[0];
              const deadlineStatus = getDeadlineStatus(job.deadline_date);
              const progress = getProgressPercentage(job);
              
              return (
                <motion.div
                  key={job.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  <Card className="bg-gradient-to-br from-card/60 via-card/40 to-card/20 border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group relative overflow-hidden">
                    {/* Barra de progreso superior */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity" 
                         style={{ width: `${progress}%` }} />
                    
                    {/* Indicador de progreso */}
                    <div className="absolute top-4 right-4">
                      <div className="relative w-12 h-12">
                        <svg className="transform -rotate-90 w-12 h-12">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-white/10"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                            className="text-primary transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{progress}%</span>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between pr-14">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                              <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                                {job.title}
                              </CardTitle>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={getStatusColor(job.status)}>
                                  {getStatusLabel(job.status)}
                                </Badge>
                                {job.category && (
                                  <Badge variant="outline" className="text-white/70 border-white/20">
                                    {job.category}
                                  </Badge>
                                )}
                                {deadlineStatus && (
                                  <Badge className={`${deadlineStatus.bg} ${deadlineStatus.color} border-current/30`}>
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {deadlineStatus.label}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                      {job.projects && (
                        <div className="text-sm text-white/70 p-2 bg-white/5 rounded-lg">
                          <span className="font-medium text-white">Proyecto:</span> {job.projects.title}
                        </div>
                      )}

                      {/* Información financiera y temporal */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-white/60">Presupuesto</span>
                          </div>
                          <div className="font-bold text-white text-lg">
                            ${parseFloat(job.budget_amount).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                          <div className="text-xs text-white/50">{job.budget_currency}</div>
                        </div>
                        <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-white/60">Tiempo</span>
                          </div>
                          <div className="font-bold text-white text-lg">
                            {job.estimated_hours || 'N/A'}h
                          </div>
                          <div className="text-xs text-white/50">Estimado</div>
                        </div>
                      </div>

                      {/* Deadline con indicador visual */}
                      {job.deadline_date && (
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-white/60" />
                              <span className="text-sm text-white/70">Deadline:</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-white">
                                {format(new Date(job.deadline_date), 'dd MMM yyyy', { locale: currentLocale })}
                              </div>
                              {deadlineStatus && (
                                <div className={`text-xs ${deadlineStatus.color} mt-1`}>
                                  {deadlineStatus.label}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Progreso visual */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/70">Progreso del Trabajo</span>
                          <span className="font-semibold text-white">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      {/* Puntuación de calidad si existe */}
                      {latestReview && (
                        <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-purple-400" />
                              <span className="text-sm text-white/70">Calidad</span>
                            </div>
                            <span className="font-bold text-white text-lg">
                              {latestReview.overall_score?.toFixed(1) || 'N/A'}/100
                            </span>
                          </div>
                          <Progress 
                            value={latestReview.overall_score || 0} 
                            className="h-2 bg-purple-500/10"
                          />
                        </div>
                      )}

                      {/* Acciones según el estado */}
                      <div className="pt-2 border-t border-white/10">
                        {job.status === 'assigned' && (
                          <Button
                            onClick={() => handleStartJob(job.id)}
                            disabled={starting[job.id]}
                            className="w-full group/btn"
                            size="lg"
                          >
                            {starting[job.id] ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="mr-2"
                                >
                                  <Zap className="w-4 h-4" />
                                </motion.div>
                                Iniciando...
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                Iniciar Trabajo
                              </>
                            )}
                          </Button>
                        )}

                        {(job.status === 'in_progress' || job.status === 'submitted' || job.status === 'in_review') && (
                          <Button asChild className="w-full group/btn" size="lg">
                            <Link to={`/creative/jobs/${job.id}`}>
                              Ver Detalles
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        )}

                        {job.status === 'approved' && (
                          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-center gap-2 text-sm text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-medium">Trabajo aprobado. Pago en proceso.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyActiveJobs;
