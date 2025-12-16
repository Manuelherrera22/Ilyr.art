import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getJobDetails, startJob } from '@/services/api/creatorJobs';
import { getJobDeliverables, submitDeliverable } from '@/services/api/creatorDeliverables';
import { getCreatorFeedback } from '@/services/api/creatorFeedback';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import AssetUpload from './AssetUpload';
import QualityReviewCard from './QualityReviewCard';
import FeedbackSection from './FeedbackSection';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Clock, 
  FileText,
  CheckCircle,
  AlertCircle,
  Play,
  Upload,
  Star,
  Zap,
  TrendingUp,
  Target,
  BarChart3,
  Award,
  Sparkles,
  ArrowRight,
  Download,
  Eye
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const JobDetailView = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  const [job, setJob] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !jobId) return;

      try {
        setLoading(true);
        const [jobData, deliverablesData, feedbackData] = await Promise.all([
          getJobDetails(jobId, user.id),
          getJobDeliverables(jobId, user.id),
          getCreatorFeedback(user.id, 'open'),
        ]);

        setJob(jobData);
        setDeliverables(deliverablesData);
        setFeedback(feedbackData.filter(f => f.job_id === jobId));
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'No se pudieron cargar los detalles del trabajo',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, jobId, toast]);

  const handleStartJob = async () => {
    if (!user || !jobId) return;

    setStarting(true);
    try {
      await startJob(jobId, user.id);
      toast({
        title: '¡Trabajo iniciado!',
        description: 'Ya puedes comenzar a trabajar en este proyecto.',
        className: 'bg-green-500 text-white',
      });
      // Recargar datos
      const jobData = await getJobDetails(jobId, user.id);
      setJob(jobData);
    } catch (error) {
      console.error('Error starting job:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo iniciar el trabajo',
      });
    } finally {
      setStarting(false);
    }
  };

  const handleDeliverableUpload = async (fileUrl, fileType, fileSize, notes) => {
    if (!user || !jobId) return;

    setUploading(true);
    try {
      await submitDeliverable(jobId, user.id, fileUrl, fileType, fileSize, notes);
      toast({
        title: '¡Entrega enviada!',
        description: 'Tu trabajo ha sido enviado para revisión de calidad.',
        className: 'bg-green-500 text-white',
      });
      // Recargar datos
      const [jobData, deliverablesData] = await Promise.all([
        getJobDetails(jobId, user.id),
        getJobDeliverables(jobId, user.id),
      ]);
      setJob(jobData);
      setDeliverables(deliverablesData);
    } catch (error) {
      console.error('Error submitting deliverable:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo enviar la entrega',
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!job) {
    return (
      <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <p className="text-xl font-semibold">Trabajo no encontrado</p>
        <Button asChild className="mt-4">
          <Link to="/creative">Volver a mis trabajos</Link>
        </Button>
      </div>
    );
  }

  const brief = job.projects?.project_briefs?.[0];
  const latestDeliverable = deliverables[0];
  const latestReview = latestDeliverable?.creator_quality_reviews?.[0];

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
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Calcular progreso del trabajo
  const jobProgress = useMemo(() => {
    if (!job) return 0;
    switch (job.status) {
      case 'completed': return 100;
      case 'approved': return 90;
      case 'in_review': return 75;
      case 'submitted': return 60;
      case 'in_progress': return 40;
      case 'assigned': return 10;
      default: return 0;
    }
  }, [job]);

  // Calcular días hasta deadline
  const daysUntilDeadline = useMemo(() => {
    if (!job?.deadline_date) return null;
    return differenceInDays(new Date(job.deadline_date), new Date());
  }, [job]);

  const getDeadlineUrgency = () => {
    if (!daysUntilDeadline) return null;
    if (daysUntilDeadline < 0) return { label: 'Vencido', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (daysUntilDeadline === 0) return { label: 'Hoy', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (daysUntilDeadline === 1) return { label: 'Mañana', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    if (daysUntilDeadline < 7) return { label: `${daysUntilDeadline}d restantes`, color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { label: `${daysUntilDeadline}d restantes`, color: 'text-green-400', bg: 'bg-green-500/10' };
  };

  const deadlineUrgency = getDeadlineUrgency();

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header mejorado - Responsive */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button asChild variant="outline" size="sm" className="border-white/20 hover:bg-white/10 w-full sm:w-auto">
            <Link to="/creative/jobs" className="flex items-center justify-center sm:justify-start">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
                  <span className="truncate">{job.title}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Badge className={`${getStatusColor(job.status)} text-xs`}>
                    {job.status}
                  </Badge>
                  {job.category && (
                    <Badge variant="outline" className="text-white/70 border-white/20 text-xs">
                      {job.category}
                    </Badge>
                  )}
                  {deadlineUrgency && (
                    <Badge className={`${deadlineUrgency.bg} ${deadlineUrgency.color} border-current/30 text-xs`}>
                      <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                      {deadlineUrgency.label}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progreso del trabajo - Responsive */}
        <Card className="bg-card/40 border-border/40">
          <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-white/80 font-medium">Progreso del Trabajo</span>
                <span className="font-bold text-white text-base sm:text-lg">{jobProgress}%</span>
              </div>
              <Progress value={jobProgress} className="h-2 sm:h-3" />
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/60 mt-1 gap-1">
                <span className="truncate">Asignado</span>
                <span className="truncate hidden sm:inline">En Progreso</span>
                <span className="truncate">Entregado</span>
                <span className="truncate hidden md:inline">Revisión</span>
                <span className="truncate">Completado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información del trabajo mejorada - Responsive */}
      <motion.div 
        className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-400/30 transition-all group h-full">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/80 flex items-center gap-1.5 sm:gap-2">
                <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                </div>
                <span className="truncate">Presupuesto</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent break-words">
                ${parseFloat(job.budget_amount).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-white/60 mt-1">{job.budget_currency}</p>
              <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs text-green-400">
                <TrendingUp className="w-3 h-3 flex-shrink-0" />
                <span className="line-clamp-1">Presupuesto fijo garantizado</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`bg-gradient-to-br ${deadlineUrgency?.bg || 'from-blue-500/10 to-blue-600/5'} border-${deadlineUrgency?.color?.split('-')[0] || 'blue'}-500/20 hover:border-${deadlineUrgency?.color?.split('-')[0] || 'blue'}-400/30 transition-all group h-full`}>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/80 flex items-center gap-1.5 sm:gap-2">
                <div className={`p-1.5 sm:p-2 ${deadlineUrgency?.bg || 'bg-blue-500/20'} rounded-lg group-hover:opacity-80 transition-colors flex-shrink-0`}>
                  <Calendar className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${deadlineUrgency?.color || 'text-blue-400'}`} />
                </div>
                <span className="truncate">Deadline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className={`text-lg sm:text-xl md:text-2xl font-bold ${deadlineUrgency?.color || 'text-white'} mb-1 break-words`}>
                {format(new Date(job.deadline_date), 'dd MMM yyyy', { locale: currentLocale })}
              </div>
              <p className="text-xs text-white/60 mt-1">
                {job.estimated_hours || 'N/A'} horas estimadas
              </p>
              {deadlineUrgency && (
                <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs">
                  <Clock className={`w-3 h-3 ${deadlineUrgency.color} flex-shrink-0`} />
                  <span className={`${deadlineUrgency.color} line-clamp-1`}>{deadlineUrgency.label}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {latestReview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-400/30 transition-all group h-full">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/80 flex items-center gap-1.5 sm:gap-2">
                <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors flex-shrink-0">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 fill-purple-400/20" />
                </div>
                <span className="truncate">Calidad</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                {latestReview.overall_score?.toFixed(1) || 'N/A'}/100
              </div>
              <Progress value={latestReview.overall_score || 0} className="h-1.5 sm:h-2 mt-2 bg-purple-500/10" />
              <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs text-purple-400">
                <Award className="w-3 h-3 flex-shrink-0" />
                <span className="line-clamp-1">Revisión completada</span>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Acciones principales mejoradas */}
      {job.status === 'assigned' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-yellow-500/10 via-yellow-600/5 to-yellow-500/10 border-yellow-500/30 hover:border-yellow-400/50 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Zap className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Trabajo Asignado</h3>
                      <p className="text-sm text-white/70">Inicia el trabajo para comenzar a trabajar</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleStartJob}
                  disabled={starting}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg shadow-yellow-500/20 group/btn"
                  size="lg"
                >
                  {starting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Sparkles className="w-4 h-4" />
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
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Tabs defaultValue="brief" className="space-y-3 sm:space-y-4">
        <TabsList className="bg-card/40 border-border/40 w-full justify-start overflow-x-auto scrollbar-hide">
          <TabsTrigger value="brief" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Brief</span>
          </TabsTrigger>
          <TabsTrigger value="deliverables" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Entregas</span>
            {deliverables.length > 0 && (
              <Badge variant="outline" className="ml-1 text-xs">
                {deliverables.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Calidad</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Feedback</span>
            {feedback.length > 0 && (
              <Badge variant="outline" className="ml-1 text-xs bg-orange-500/10 border-orange-500/30 text-orange-300">
                {feedback.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brief" className="space-y-4">
          {brief ? (
            <Card className="bg-card/40 border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5" />
                  Brief del Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {brief.objective && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Objetivo</h4>
                    <p className="text-white/80">{brief.objective}</p>
                  </div>
                )}
                {brief.audience && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Audiencia</h4>
                    <p className="text-white/80">{brief.audience}</p>
                  </div>
                )}
                {brief.key_messages && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Mensajes Clave</h4>
                    <p className="text-white/80">{brief.key_messages}</p>
                  </div>
                )}
                {brief.references_payload && brief.references_payload.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Referencias</h4>
                    <div className="grid gap-2">
                      {brief.references_payload.map((ref, idx) => (
                        <a
                          key={idx}
                          href={ref.url || ref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          {ref.title || ref.url || ref} →
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/40 border-border/40 text-center p-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-white/50" />
              <CardDescription className="text-white/70">
                No hay brief disponible para este trabajo
              </CardDescription>
            </Card>
          )}

          {job.status === 'in_progress' && (
            <Card className="bg-card/40 border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Upload className="w-5 h-5" />
                  Subir Entrega
                </CardTitle>
                <CardDescription className="text-white/70">
                  Sube tu trabajo para revisión de calidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AssetUpload
                  projectId={job.project_id}
                  onUploadSuccess={handleDeliverableUpload}
                  disabled={uploading}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deliverables" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Entregas
              </h2>
              <p className="text-white/70 text-sm mt-1">
                Gestiona las versiones de tu trabajo
              </p>
            </div>
            <Badge variant="outline" className="text-white/70 border-white/20 bg-primary/10">
              {deliverables.length} versión{deliverables.length !== 1 ? 'es' : ''}
            </Badge>
          </div>

          <AnimatePresence mode="wait">
            {deliverables.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="bg-card/40 border-border/40 text-center p-12">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-white/30" />
                  </motion.div>
                  <CardTitle className="text-white mb-2">No hay entregas aún</CardTitle>
                  <CardDescription className="text-white/70">
                    Sube tu trabajo cuando esté listo para revisión
                  </CardDescription>
                </Card>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {deliverables.map((deliverable, index) => (
                  <motion.div
                    key={deliverable.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-card/60 to-card/30 border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg text-white flex items-center gap-2">
                                  Versión {deliverable.version}
                                  {deliverable.status === 'approved' && (
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Aprobado
                                    </Badge>
                                  )}
                                  {deliverable.status === 'revision_requested' && (
                                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Revisión Requerida
                                    </Badge>
                                  )}
                                  {deliverable.status === 'pending' && (
                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                      <Clock className="w-3 h-3 mr-1" />
                                      Pendiente
                                    </Badge>
                                  )}
                                </CardTitle>
                                {deliverable.notes && (
                                  <CardDescription className="text-white/70 mt-2">
                                    {deliverable.notes}
                                  </CardDescription>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-white/70 border-white/20">
                            {deliverable.file_type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <div className="text-white/60 text-xs mb-1">Subido</div>
                            <div className="text-white font-medium">
                              {format(new Date(deliverable.created_at), 'dd MMM yyyy HH:mm', { locale: currentLocale })}
                            </div>
                          </div>
                          {deliverable.file_size && (
                            <div className="p-2 bg-white/5 rounded-lg">
                              <div className="text-white/60 text-xs mb-1">Tamaño</div>
                              <div className="text-white font-medium">
                                {(deliverable.file_size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {deliverable.creator_quality_reviews?.[0] && (
                          <QualityReviewCard review={deliverable.creator_quality_reviews[0]} />
                        )}
                        
                        <div className="flex gap-2">
                          <Button asChild variant="outline" className="flex-1 group/btn">
                            <a href={deliverable.file_url} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                              Ver
                            </a>
                          </Button>
                          <Button asChild variant="outline" className="flex-1 group/btn">
                            <a href={deliverable.file_url} download>
                              <Download className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                              Descargar
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          {latestReview ? (
            <QualityReviewCard review={latestReview} expanded />
          ) : (
            <Card className="bg-card/40 border-border/40 text-center p-8">
              <Star className="w-12 h-12 mx-auto mb-4 text-white/50" />
              <CardDescription className="text-white/70">
                Aún no hay revisiones de calidad para este trabajo
              </CardDescription>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <FeedbackSection
            jobId={jobId}
            feedback={feedback}
            onFeedbackUpdate={() => {
              // Recargar feedback
              getCreatorFeedback(user.id, 'open').then(data => {
                setFeedback(data.filter(f => f.job_id === jobId));
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default JobDetailView;
