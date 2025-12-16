import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getAvailableJobs, applyToJob } from '@/services/api/creatorJobs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Briefcase, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Search,
  Filter,
  Grid3x3,
  List,
  X,
  TrendingUp,
  Zap
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const AvailableJobsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getAvailableJobs(user.id);
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Error fetching available jobs:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar los trabajos disponibles',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, toast]);

  // Filtros y búsqueda
  useEffect(() => {
    let filtered = [...jobs];

    // Búsqueda por texto
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.category?.toLowerCase().includes(query) ||
        job.skills_required?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(job => job.category === categoryFilter);
    }

    // Filtro por presupuesto
    if (budgetFilter !== 'all') {
      filtered = filtered.filter(job => {
        const budget = parseFloat(job.budget_amount);
        switch (budgetFilter) {
          case 'low':
            return budget < 500;
          case 'medium':
            return budget >= 500 && budget < 2000;
          case 'high':
            return budget >= 2000;
          default:
            return true;
        }
      });
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'budget_high':
          return parseFloat(b.budget_amount) - parseFloat(a.budget_amount);
        case 'budget_low':
          return parseFloat(a.budget_amount) - parseFloat(b.budget_amount);
        case 'deadline_soon':
          return new Date(a.deadline_date) - new Date(b.deadline_date);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, categoryFilter, budgetFilter, sortBy]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = [...new Set(jobs.map(job => job.category).filter(Boolean))];
    return cats.sort();
  }, [jobs]);

  const handleApply = async (jobId) => {
    if (!user) return;

    setApplying({ ...applying, [jobId]: true });
    try {
      await applyToJob(jobId, user.id);
      toast({
        title: '¡Aplicación exitosa!',
        description: 'Has sido asignado a este trabajo. Revisa tus trabajos activos.',
        className: 'bg-green-500 text-white',
      });
      // Remover el trabajo de la lista
      const updatedJobs = jobs.filter(j => j.id !== jobId);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo aplicar al trabajo',
      });
    } finally {
      setApplying({ ...applying, [jobId]: false });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (jobs.length === 0) {
    return (
      <Card className="bg-card/40 border-border/40 text-center p-8">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-white/50" />
        <CardTitle className="text-2xl font-semibold text-white mb-4">
          No hay trabajos disponibles
        </CardTitle>
        <CardDescription className="text-white/70">
          Los nuevos trabajos aparecerán aquí cuando estén disponibles.
        </CardDescription>
      </Card>
    );
  }

  const getDaysUntilDeadline = (deadline) => {
    const days = differenceInDays(new Date(deadline), new Date());
    return days;
  };

  const getUrgencyColor = (days) => {
    if (days < 3) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (days < 7) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-green-400 bg-green-500/10 border-green-500/30';
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header con búsqueda y filtros - Responsive */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              <span className="truncate">Trabajos Disponibles</span>
            </h2>
            <p className="text-sm sm:text-base text-white/70">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'trabajo disponible' : 'trabajos disponibles'}
              {filteredJobs.length !== jobs.length && ` de ${jobs.length} totales`}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="border-white/20 text-white hover:bg-white/10 flex-shrink-0"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Barra de búsqueda y filtros - Responsive */}
        <Card className="bg-card/40 border-border/40 p-3 sm:p-4">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Búsqueda */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Buscar trabajos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-background/50 border-white/10 text-white placeholder:text-white/40 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filtro por categoría */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-background/50 border-white/10 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por presupuesto */}
            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger className="bg-background/50 border-white/10 text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Presupuesto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los presupuestos</SelectItem>
                <SelectItem value="low">Menos de $500</SelectItem>
                <SelectItem value="medium">$500 - $2,000</SelectItem>
                <SelectItem value="high">Más de $2,000</SelectItem>
              </SelectContent>
            </Select>

            {/* Ordenamiento */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-background/50 border-white/10 text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="oldest">Más antiguos</SelectItem>
                <SelectItem value="budget_high">Presupuesto: Mayor</SelectItem>
                <SelectItem value="budget_low">Presupuesto: Menor</SelectItem>
                <SelectItem value="deadline_soon">Deadline: Próximos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
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
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <CardTitle className="text-2xl font-semibold text-white mb-4">
                {searchQuery || categoryFilter !== 'all' || budgetFilter !== 'all' 
                  ? 'No se encontraron trabajos' 
                  : 'No hay trabajos disponibles'}
              </CardTitle>
              <CardDescription className="text-white/70 mb-4">
                {searchQuery || categoryFilter !== 'all' || budgetFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Los nuevos trabajos aparecerán aquí cuando estén disponibles.'}
              </CardDescription>
              {(searchQuery || categoryFilter !== 'all' || budgetFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setBudgetFilter('all');
                  }}
                  className="mt-4"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </Button>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className={viewMode === 'grid' ? 'grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2' : 'space-y-3 sm:space-y-4'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredJobs.map((job, index) => {
              const daysUntil = getDaysUntilDeadline(job.deadline_date);
              const isUrgent = daysUntil < 7;
              
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
                    {/* Efecto de brillo al hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                              <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                                {job.title}
                              </CardTitle>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                                  {job.category}
                                </Badge>
                                {job.projects && (
                                  <Badge variant="outline" className="text-white/70 border-white/20">
                                    {job.projects.title}
                                  </Badge>
                                )}
                                {isUrgent && (
                                  <Badge className={getUrgencyColor(daysUntil)}>
                                    <Zap className="w-3 h-3 mr-1" />
                                    {daysUntil < 0 ? 'Vencido' : `${daysUntil}d restantes`}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                      {job.description && (
                        <p className="text-white/80 text-sm line-clamp-2 group-hover:text-white transition-colors">
                          {job.description}
                        </p>
                      )}

                      {job.skills_required && job.skills_required.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.skills_required.slice(0, 4).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs text-white/70 border-white/20 hover:border-primary/50 transition-colors">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills_required.length > 4 && (
                            <Badge variant="outline" className="text-xs text-white/60 border-white/10">
                              +{job.skills_required.length - 4} más
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 text-sm p-2 bg-green-500/5 rounded-lg border border-green-500/10">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <div>
                            <div className="font-bold text-white text-lg">
                              ${parseFloat(job.budget_amount).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </div>
                            <div className="text-xs text-white/60">{job.budget_currency}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm p-2 bg-blue-500/5 rounded-lg border border-blue-500/10">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="font-bold text-white text-lg">
                              {job.estimated_hours || 'N/A'}h
                            </div>
                            <div className="text-xs text-white/60">Estimado</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-white/70 pt-2 border-t border-white/10">
                        <Calendar className="w-4 h-4" />
                        <span>Deadline:</span>
                        <span className={`font-medium ${isUrgent ? 'text-red-400' : ''}`}>
                          {format(new Date(job.deadline_date), 'dd MMM yyyy', { locale: currentLocale })}
                        </span>
                        {daysUntil >= 0 && (
                          <span className="text-xs text-white/50">
                            ({daysUntil} {daysUntil === 1 ? 'día' : 'días'})
                          </span>
                        )}
                      </div>

                      <Button
                        onClick={() => handleApply(job.id)}
                        disabled={applying[job.id]}
                        className="w-full mt-4 group/btn"
                        size="lg"
                      >
                        {applying[job.id] ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Sparkles className="w-4 h-4" />
                            </motion.div>
                            Aplicando...
                          </>
                        ) : (
                          <>
                            Aplicar al Trabajo
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
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
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold text-white mb-2">
                    {job.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                      {job.category}
                    </Badge>
                    {job.projects && (
                      <Badge variant="outline" className="text-white/70 border-white/20">
                        {job.projects.title}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.description && (
                <p className="text-white/80 text-sm line-clamp-3">{job.description}</p>
              )}

              {job.skills_required && job.skills_required.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs text-white/60 border-white/10">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills_required.length > 3 && (
                    <Badge variant="outline" className="text-xs text-white/60 border-white/10">
                      +{job.skills_required.length - 3} más
                    </Badge>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="font-semibold text-white">
                      ${parseFloat(job.budget_amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-white/60">{job.budget_currency}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-semibold text-white">
                      {job.estimated_hours || 'N/A'}h
                    </div>
                    <div className="text-xs text-white/60">Estimado</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-white/70 pt-2 border-t border-white/10">
                <Calendar className="w-4 h-4" />
                <span>Deadline:</span>
                <span className="font-medium">
                  {format(new Date(job.deadline_date), 'dd MMM yyyy', { locale: currentLocale })}
                </span>
              </div>

              <Button
                onClick={() => handleApply(job.id)}
                disabled={applying[job.id]}
                className="w-full mt-4"
              >
                {applying[job.id] ? (
                  <>Aplicando...</>
                ) : (
                  <>
                    Aplicar al Trabajo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableJobsList;
