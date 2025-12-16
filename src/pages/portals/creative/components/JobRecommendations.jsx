import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  TrendingUp, 
  Target,
  Zap,
  Star,
  DollarSign,
  Clock,
  ArrowRight,
  Brain,
  CheckCircle
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const JobRecommendations = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch AI-powered recommendations from API
    const fetchRecommendations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Simulated AI recommendations based on user skills and history
        setRecommendations([
          {
            id: 1,
            title: 'Animación 3D para Producto',
            category: '3D Animation',
            matchScore: 95,
            reason: 'Coincide perfectamente con tus habilidades en Blender y After Effects',
            budget: 2500,
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            skills: ['Blender', 'After Effects', '3D Modeling'],
            urgency: 'high'
          },
          {
            id: 2,
            title: 'VFX para Comercial',
            category: 'VFX',
            matchScore: 88,
            reason: 'Basado en tus trabajos anteriores de alta calidad en VFX',
            budget: 3500,
            deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            skills: ['Nuke', 'Houdini', 'Compositing'],
            urgency: 'medium'
          },
          {
            id: 3,
            title: 'Motion Graphics para Branding',
            category: 'Motion Graphics',
            matchScore: 82,
            reason: 'Similar a proyectos que has completado exitosamente',
            budget: 1800,
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            skills: ['After Effects', 'Illustrator', 'Motion Design'],
            urgency: 'high'
          }
        ]);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const getMatchColor = (score) => {
    if (score >= 90) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (score >= 75) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  const getUrgencyColor = (urgency) => {
    if (urgency === 'high') return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (urgency === 'medium') return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-green-400 bg-green-500/10 border-green-500/30';
  };

  if (loading) {
    return <div className="text-center py-12 text-white/70">Analizando recomendaciones...</div>;
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
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <span className="truncate">Trabajos Recomendados para Ti</span>
          </h2>
          <p className="text-sm sm:text-base text-white/70">Basado en tus habilidades y historial de trabajo</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary text-xs sm:text-sm flex-shrink-0">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by AI
        </Badge>
      </div>

      {recommendations.length === 0 ? (
        <Card className="bg-card/40 border-border/40 text-center p-12">
          <Target className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <CardTitle className="text-white mb-2">No hay recomendaciones disponibles</CardTitle>
          <p className="text-white/70">
            Completa más trabajos para recibir recomendaciones personalizadas
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map((job, index) => {
            const daysUntil = differenceInDays(new Date(job.deadline), new Date());
            
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-card/60 via-card/40 to-card/20 border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group">
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 sm:gap-3 mb-2">
                          <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors flex-shrink-0">
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-primary transition-colors truncate">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {job.category}
                              </Badge>
                              <Badge className={`${getUrgencyColor(job.urgency)} text-xs`}>
                                {job.urgency === 'high' ? 'Urgente' : job.urgency === 'medium' ? 'Moderado' : 'Normal'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {/* Razón de la recomendación - Responsive */}
                        <div className="ml-0 sm:ml-10 md:ml-14 mb-3 sm:mb-4 p-2 sm:p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="flex items-start gap-1.5 sm:gap-2">
                            <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-xs sm:text-sm text-white/80">
                              <span className="font-semibold text-primary">¿Por qué te recomendamos esto?</span>
                              <br />
                              {job.reason}
                            </p>
                          </div>
                        </div>

                        {/* Match Score - Responsive */}
                        <div className="ml-0 sm:ml-10 md:ml-14 mb-3 sm:mb-4">
                          <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                            <span className="text-xs sm:text-sm text-white/70">Coincidencia con tu perfil</span>
                            <Badge className={`${getMatchColor(job.matchScore)} text-xs`}>
                              <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                              {job.matchScore}% Match
                            </Badge>
                          </div>
                          <Progress value={job.matchScore} className="h-1.5 sm:h-2" />
                        </div>

                        {/* Detalles - Responsive */}
                        <div className="ml-0 sm:ml-10 md:ml-14 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                          <div className="p-2 sm:p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                              <span className="text-xs text-white/60">Presupuesto</span>
                            </div>
                            <p className="font-bold text-white text-base sm:text-lg break-words">
                              ${job.budget.toLocaleString('es-ES')}
                            </p>
                          </div>
                          <div className="p-2 sm:p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                              <span className="text-xs text-white/60">Deadline</span>
                            </div>
                            <p className="font-bold text-white text-base sm:text-lg">
                              {daysUntil}d
                            </p>
                            <p className="text-xs text-white/50 truncate">
                              {format(new Date(job.deadline), 'dd MMM', { locale: currentLocale })}
                            </p>
                          </div>
                          <div className="p-2 sm:p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                              <span className="text-xs text-white/60">Habilidades</span>
                            </div>
                            <p className="font-bold text-white text-base sm:text-lg">
                              {job.skills.length}
                            </p>
                            <p className="text-xs text-white/50">Coinciden</p>
                          </div>
                        </div>

                        {/* Skills matching - Responsive */}
                        <div className="ml-0 sm:ml-10 md:ml-14 mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                          {job.skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-300">
                              <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-white/10 mt-3 sm:mt-4">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/60">
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="line-clamp-1">Alta probabilidad de éxito</span>
                      </div>
                      <Button asChild className="group/btn w-full sm:w-auto">
                        <Link to={`/creative/available`} className="flex items-center justify-center">
                          Ver Trabajo
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default JobRecommendations;
