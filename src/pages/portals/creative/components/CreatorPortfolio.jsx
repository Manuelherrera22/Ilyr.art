import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Star, 
  Image as ImageIcon, 
  Video, 
  FileText,
  ExternalLink,
  Share2,
  Download,
  Eye,
  TrendingUp,
  Sparkles,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const CreatorPortfolio = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  
  const [portfolio, setPortfolio] = useState({
    completedJobs: [],
    skills: [],
    stats: {
      totalProjects: 0,
      averageQuality: 0,
      totalEarned: 0,
      clientSatisfaction: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    // TODO: Fetch portfolio data from API
    const fetchPortfolio = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Simulated data for now
        setPortfolio({
          completedJobs: [
            {
              id: 1,
              title: 'Animación 3D para Campaña Publicitaria',
              category: '3D Animation',
              thumbnail: null,
              qualityScore: 95,
              completedAt: new Date(),
              skills: ['Blender', 'After Effects', 'Cinema 4D']
            }
          ],
          skills: ['3D Animation', 'VFX', 'Motion Graphics', 'Video Editing'],
          stats: {
            totalProjects: 12,
            averageQuality: 92.5,
            totalEarned: 45000,
            clientSatisfaction: 98
          }
        });
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [user]);

  if (loading) {
    return <div className="text-center py-12 text-white/70">Cargando portfolio...</div>;
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <span className="truncate">Mi Portfolio</span>
          </h2>
          <p className="text-sm sm:text-base text-white/70">Muestra tus mejores trabajos y habilidades</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-initial text-xs sm:text-sm">
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Compartir</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-initial text-xs sm:text-sm">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Exportar PDF</span>
            <span className="xs:hidden">PDF</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas del Portfolio - Responsive */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">Proyectos</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{portfolio.stats.totalProjects}</p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">Calidad Promedio</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{portfolio.stats.averageQuality.toFixed(1)}</p>
              </div>
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">Ganancias</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words">
                  ${portfolio.stats.totalEarned.toLocaleString('es-ES')}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">Satisfacción</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{portfolio.stats.clientSatisfaction}%</p>
              </div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <Card className="bg-card/40 border-border/40">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Habilidades y Especialidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {portfolio.skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge 
                  variant="outline" 
                  className="text-base px-4 py-2 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trabajos Completados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Trabajos Destacados</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? 'Lista' : 'Grid'}
            </Button>
          </div>
        </div>

        {portfolio.completedJobs.length === 0 ? (
          <Card className="bg-card/40 border-border/40 text-center p-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <CardTitle className="text-white mb-2">No hay trabajos en tu portfolio aún</CardTitle>
            <CardDescription className="text-white/70">
              Los trabajos completados aparecerán aquí automáticamente
            </CardDescription>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3 sm:space-y-4'}>
            {portfolio.completedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-card/60 to-card/30 border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group cursor-pointer">
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg overflow-hidden">
                    {job.thumbnail ? (
                      <img src={job.thumbnail} alt={job.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Star className="w-3 h-3 mr-1" />
                        {job.qualityScore}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {job.category}
                      </Badge>
                      <span className="text-xs text-white/60">
                        {format(new Date(job.completedAt), 'MMM yyyy', { locale: currentLocale })}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs text-white/60 border-white/10">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CreatorPortfolio;
