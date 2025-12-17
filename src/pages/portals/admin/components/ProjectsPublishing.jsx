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
  Globe,
  Eye,
  EyeOff,
  Send,
  Calendar,
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const ProjectsPublishing = () => {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  const [projects, setProjects] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'milestone',
    status_tag: 'progress',
    visible_for_client: true,
    project_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
        },
        {
          id: '2',
          title: 'Rebranding Corporativo',
          status: 'active',
          visibility: 'client',
          client_account: { company_name: 'TechStart' },
        },
      ];

      const mockUpdates = [
        {
          id: '1',
          project_id: '1',
          project_title: 'Campaña Visual Q1 2025',
          title: 'Primera Revisión Completada',
          body: 'Hemos completado la primera fase del proyecto con excelentes resultados.',
          type: 'milestone',
          status_tag: 'completed',
          visible_for_client: true,
          author: { full_name: 'Juan Pérez' },
          created_at: new Date().toISOString(),
          files: [{ name: 'review_v1.pdf', type: 'pdf' }],
        },
        {
          id: '2',
          project_id: '1',
          project_title: 'Campaña Visual Q1 2025',
          title: 'Avance de Producción',
          body: 'El equipo está trabajando en la producción de los assets finales.',
          type: 'update',
          status_tag: 'progress',
          visible_for_client: true,
          author: { full_name: 'María García' },
          created_at: new Date(Date.now() - 3600000).toISOString(),
          files: [],
        },
        {
          id: '3',
          project_id: '2',
          project_title: 'Rebranding Corporativo',
          title: 'Propuesta de Concepto',
          body: 'Presentamos la propuesta inicial de concepto para tu revisión.',
          type: 'proposal',
          status_tag: 'pending',
          visible_for_client: true,
          author: { full_name: 'Carlos López' },
          created_at: new Date(Date.now() - 7200000).toISOString(),
          files: [{ name: 'concept_proposal.pdf', type: 'pdf' }, { name: 'mockup.jpg', type: 'image' }],
        },
      ];

      setProjects(mockProjects);
      setUpdates(mockUpdates);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los datos',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (update = null) => {
    setEditingUpdate(update);
    if (update) {
      setFormData({
        title: update.title,
        body: update.body,
        type: update.type,
        status_tag: update.status_tag,
        visible_for_client: update.visible_for_client,
        project_id: update.project_id,
      });
    } else {
      setFormData({
        title: '',
        body: '',
        type: 'milestone',
        status_tag: 'progress',
        visible_for_client: true,
        project_id: projects[0]?.id || '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Aquí iría la llamada a la API
      toast({
        title: '✅ Actualización publicada',
        description: editingUpdate ? 'La actualización se ha actualizado correctamente' : 'La actualización se ha publicado correctamente',
      });
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving update:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo publicar la actualización',
      });
    }
  };

  const handleToggleVisibility = async (projectId, currentVisibility) => {
    try {
      // Aquí iría la llamada a la API
      toast({
        title: '✅ Visibilidad actualizada',
        description: `El proyecto ahora es ${currentVisibility === 'public' ? 'privado' : 'público'}`,
      });
      fetchData();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar la visibilidad',
      });
    }
  };

  const getTypeBadge = (type) => {
    const types = {
      milestone: { label: 'Hito', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400', icon: CheckCircle2 },
      update: { label: 'Actualización', color: 'bg-green-500/20 border-green-500/30 text-green-400', icon: TrendingUp },
      proposal: { label: 'Propuesta', color: 'bg-purple-500/20 border-purple-500/30 text-purple-400', icon: FileText },
      delivery: { label: 'Entrega', color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400', icon: Send },
    };
    const config = types[type] || types.update;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const statuses = {
      completed: { label: 'Completado', color: 'bg-green-500/20 border-green-500/30 text-green-400', icon: CheckCircle2 },
      progress: { label: 'En Progreso', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400', icon: Clock },
      pending: { label: 'Pendiente', color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400', icon: AlertCircle },
    };
    const config = statuses[status] || statuses.progress;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.project_title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || update.status_tag === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: updates.length,
    published: updates.filter(u => u.visible_for_client).length,
    milestones: updates.filter(u => u.type === 'milestone').length,
    pending: updates.filter(u => u.status_tag === 'pending').length,
  };

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
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                Publicación de Proyectos
              </h2>
              <p className="text-white/60 mt-1 text-sm">Gestiona actualizaciones y visibilidad de proyectos</p>
            </div>
          </div>
          <Button
            onClick={() => handleOpenDialog(null)}
            className="bg-primary/20 border-primary/50 text-primary hover:bg-primary/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Actualización
          </Button>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Publicadas</p>
                <p className="text-2xl font-bold text-white">{stats.published}</p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Hitos</p>
                <p className="text-2xl font-bold text-white">{stats.milestones}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Pendientes</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="updates" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="updates" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Actualizaciones
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Visibilidad de Proyectos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="updates" className="space-y-6">
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
                placeholder="Buscar actualizaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-primary/50"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['all', 'completed', 'progress', 'pending'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={`
                    whitespace-nowrap
                    ${filterStatus === status
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

          {/* Lista de actualizaciones */}
          <motion.div
            className="space-y-4"
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
              {filteredUpdates.map((update) => (
                <motion.div
                  key={update.id}
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
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <Card className="relative overflow-hidden bg-gradient-to-br from-white/5 via-white/5 to-transparent border-white/10 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {getTypeBadge(update.type)}
                            {getStatusBadge(update.status_tag)}
                            {update.visible_for_client ? (
                              <Badge className="bg-green-500/20 border-green-500/30 text-green-400 flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                Visible
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-500/20 border-gray-500/30 text-gray-400 flex items-center gap-1">
                                <EyeOff className="w-3 h-3" />
                                Interno
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl text-white mb-1">{update.title}</CardTitle>
                          <CardDescription className="text-white/60">
                            {update.project_title}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white/50 hover:text-white"
                            onClick={() => handleOpenDialog(update)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-white/80">{update.body}</p>
                      
                      {update.files && update.files.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {update.files.map((file, idx) => {
                            const FileIcon = file.type === 'image' ? Image : file.type === 'video' ? Video : FileText;
                            return (
                              <Badge key={idx} variant="outline" className="border-white/20 text-white/70 flex items-center gap-1">
                                <FileIcon className="w-3 h-3" />
                                {file.name}
                              </Badge>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          <span>{update.author?.full_name || 'Sistema'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(update.created_at), 'dd MMM yyyy, HH:mm', { locale: currentLocale })}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredUpdates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <p className="text-white/60">No se encontraron actualizaciones</p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
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
            {projects.map((project) => (
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
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg text-white truncate mb-2">{project.title}</CardTitle>
                        <CardDescription className="text-white/60">
                          {project.client_account?.company_name}
                        </CardDescription>
                      </div>
                      {project.visibility === 'public' ? (
                        <Badge className="bg-green-500/20 border-green-500/30 text-green-400 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Público
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500/20 border-blue-500/30 text-blue-400 flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          Cliente
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                      onClick={() => handleToggleVisibility(project.id, project.visibility)}
                    >
                      {project.visibility === 'public' ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hacer Privado
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4 mr-2" />
                          Hacer Público
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Dialog para crear/editar actualización */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-background border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUpdate ? 'Editar Actualización' : 'Nueva Actualización'}
            </DialogTitle>
            <DialogDescription>
              {editingUpdate ? 'Actualiza la información de la actualización' : 'Crea una nueva actualización para publicar'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project_id">Proyecto</Label>
              <select
                id="project_id"
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
              >
                <option value="">Seleccionar proyecto...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Primera Revisión Completada"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Contenido</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Describe la actualización..."
                rows={6}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="milestone">Hito</option>
                  <option value="update">Actualización</option>
                  <option value="proposal">Propuesta</option>
                  <option value="delivery">Entrega</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status_tag">Estado</Label>
                <select
                  id="status_tag"
                  value={formData.status_tag}
                  onChange={(e) => setFormData({ ...formData, status_tag: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="completed">Completado</option>
                  <option value="progress">En Progreso</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="visible_for_client"
                checked={formData.visible_for_client}
                onChange={(e) => setFormData({ ...formData, visible_for_client: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="visible_for_client" className="cursor-pointer">
                Visible para el cliente
              </Label>
            </div>
            <Button onClick={handleSubmit} className="w-full">
              {editingUpdate ? 'Actualizar' : 'Publicar'} Actualización
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProjectsPublishing;
