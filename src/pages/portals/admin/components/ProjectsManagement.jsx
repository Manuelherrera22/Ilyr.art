import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  FolderKanban,
  Search,
  Plus,
  Edit,
  Eye,
  EyeOff,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  PlayCircle,
  PauseCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProjectsManagement = () => {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    status: 'draft',
    visibility: 'client',
    description: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Datos mock para testing
      const mockProjects = [
        {
          id: '1',
          title: 'Campaña Visual Q1 2025',
          status: 'active',
          visibility: 'public',
          client_account: { company_name: 'Acme Corp' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          milestones_count: 5,
          assignments_count: 3,
          progress: 65,
        },
        {
          id: '2',
          title: 'Rebranding Corporativo',
          status: 'draft',
          visibility: 'client',
          client_account: { company_name: 'TechStart' },
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          milestones_count: 0,
          assignments_count: 0,
          progress: 0,
        },
        {
          id: '3',
          title: 'Producción CGI Cinematográfica',
          status: 'active',
          visibility: 'public',
          client_account: { company_name: 'Studio Films' },
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date().toISOString(),
          milestones_count: 8,
          assignments_count: 5,
          progress: 85,
        },
        {
          id: '4',
          title: 'Animación 3D Producto',
          status: 'completed',
          visibility: 'public',
          client_account: { company_name: 'Product Co' },
          created_at: new Date(Date.now() - 259200000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          milestones_count: 6,
          assignments_count: 4,
          progress: 100,
        },
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los proyectos',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (project = null) => {
    setEditingProject(project);
    if (project) {
      setFormData({
        title: project.title,
        status: project.status,
        visibility: project.visibility,
        description: project.description || '',
      });
    } else {
      setFormData({
        title: '',
        status: 'draft',
        visibility: 'client',
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Aquí iría la llamada a la API
      toast({
        title: '✅ Proyecto guardado',
        description: editingProject ? 'El proyecto se ha actualizado correctamente' : 'El proyecto se ha creado correctamente',
      });
      setDialogOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar el proyecto',
      });
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      // Aquí iría la llamada a la API
      toast({
        title: '✅ Estado actualizado',
        description: `El proyecto ahora está ${newStatus}`,
      });
      fetchProjects();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el estado',
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: 'Borrador', variant: 'outline', icon: Edit, color: 'text-gray-400' },
      active: { label: 'Activo', variant: 'default', icon: PlayCircle, color: 'text-blue-400' },
      paused: { label: 'Pausado', variant: 'secondary', icon: PauseCircle, color: 'text-yellow-400' },
      completed: { label: 'Completado', variant: 'default', icon: CheckCircle2, color: 'text-green-400' },
      archived: { label: 'Archivado', variant: 'outline', icon: XCircle, color: 'text-gray-500' },
    };
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  const getVisibilityBadge = (visibility) => {
    return visibility === 'public' ? (
      <Badge variant="outline" className="flex items-center gap-1 border-green-500/30 text-green-400">
        <Eye className="w-3 h-3" />
        Público
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1 border-blue-500/30 text-blue-400">
        <EyeOff className="w-3 h-3" />
        Cliente
      </Badge>
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client_account?.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return <LoadingSpinner />;
  }

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
              <FolderKanban className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                Gestión de Proyectos
              </h2>
              <p className="text-white/60 mt-1 text-sm">Gestiona, publica y haz seguimiento de proyectos</p>
            </div>
          </div>
          <Button
            onClick={() => handleOpenDialog(null)}
            className="bg-primary/20 border-primary/50 text-primary hover:bg-primary/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {Object.entries(statusCounts).map(([status, count]) => {
          const statusConfig = {
            draft: { color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30', icon: Edit },
            active: { color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30', icon: PlayCircle },
            paused: { color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30', icon: PauseCircle },
            completed: { color: 'from-green-500/20 to-green-600/10 border-green-500/30', icon: CheckCircle2 },
            archived: { color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30', icon: XCircle },
          };
          const config = statusConfig[status] || statusConfig.draft;
          const Icon = config.icon;
          return (
            <Card key={status} className={`bg-gradient-to-br ${config.color} backdrop-blur-sm`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{status}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                  </div>
                  <Icon className="w-8 h-8 text-white/40" />
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Total</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtros y búsqueda */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input
            placeholder="Buscar proyectos por título o cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {['all', 'draft', 'active', 'paused', 'completed', 'archived'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={`
                whitespace-nowrap
                ${statusFilter === status
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'border-white/20 text-white hover:bg-white/10'
                }
              `}
            >
              <Filter className="w-4 h-4 mr-1" />
              {status === 'all' ? 'Todos' : status}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Lista de proyectos */}
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
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
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
              }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/5 via-white/5 to-transparent border-white/10 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 group">
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-white truncate mb-2">
                        {project.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(project.status)}
                        {getVisibilityBadge(project.visibility)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border-border">
                        <DropdownMenuItem onClick={() => handleOpenDialog(project)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(project.id, project.status === 'active' ? 'paused' : 'active')}>
                          {project.status === 'active' ? (
                            <>
                              <PauseCircle className="w-4 h-4 mr-2" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(project.id, 'archived')}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Archivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Users className="w-4 h-4" />
                    <span>{project.client_account?.company_name || 'Sin cliente'}</span>
                  </div>
                  
                  {project.progress !== undefined && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                        <span>Progreso</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(project.created_at), 'dd MMM yyyy', { locale: currentLocale })}
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{project.milestones_count || 0} hitos</span>
                      <span>{project.assignments_count || 0} asignados</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FolderKanban className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-white/60">No se encontraron proyectos</p>
        </motion.div>
      )}

      {/* Dialog para crear/editar proyecto */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-background border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? 'Actualiza la información del proyecto' : 'Crea un nuevo proyecto en el sistema'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Proyecto</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Campaña Visual Q1 2025"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el proyecto..."
                rows={4}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="draft">Borrador</option>
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="completed">Completado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibilidad</Label>
                <select
                  id="visibility"
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="client">Solo Cliente</option>
                  <option value="public">Público</option>
                </select>
              </div>
            </div>
            <Button onClick={handleSubmit} className="w-full">
              {editingProject ? 'Actualizar' : 'Crear'} Proyecto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProjectsManagement;
