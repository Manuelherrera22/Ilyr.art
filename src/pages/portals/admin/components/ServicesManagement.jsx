import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getAllServicePackages, createServicePackage, updateServicePackage, deleteServicePackage } from '@/services/api/admin';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Package, Plus, Edit, Trash2, DollarSign, Search, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const ServicesManagement = () => {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    from_price: '',
    deliverables: [],
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getAllServicePackages().catch(() => []);
      // Datos mock para testing
      if (!data || data.length === 0) {
        setPackages([
          {
            id: '1',
            name: 'Paquete Básico',
            description: 'Servicios básicos de diseño y visualización',
            from_price: 5000,
            deliverables: ['Diseño conceptual', '3 renders', 'Revisión'],
          },
          {
            id: '2',
            name: 'Paquete Premium',
            description: 'Producción completa con CGI y post-producción',
            from_price: 15000,
            deliverables: ['Pre-producción', 'CGI completo', 'Post-producción', 'Entrega final'],
          },
          {
            id: '3',
            name: 'Paquete Enterprise',
            description: 'Solución completa para grandes proyectos',
            from_price: 50000,
            deliverables: ['Estrategia', 'Producción', 'Distribución', 'Soporte'],
          },
        ]);
      } else {
        setPackages(data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      // Datos mock en caso de error
      setPackages([
        {
          id: '1',
          name: 'Paquete Básico',
          description: 'Servicios básicos',
          from_price: 5000,
          deliverables: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pkg = null) => {
    setEditingPackage(pkg);
    if (pkg) {
      setFormData({
        name: pkg.name,
        description: pkg.description || '',
        from_price: pkg.from_price?.toString() || '',
        deliverables: pkg.deliverables || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        from_price: '',
        deliverables: [],
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingPackage) {
        await updateServicePackage(editingPackage.id, {
          ...formData,
          from_price: formData.from_price ? parseFloat(formData.from_price) : null,
        });
        toast({
          title: '✅ Paquete actualizado',
          description: 'El paquete se ha actualizado correctamente',
        });
      } else {
        await createServicePackage({
          ...formData,
          from_price: formData.from_price ? parseFloat(formData.from_price) : null,
        });
        toast({
          title: '✅ Paquete creado',
          description: 'El paquete se ha creado correctamente',
        });
      }
      setDialogOpen(false);
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo guardar el paquete',
      });
    }
  };

  const handleDelete = async (packageId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
      return;
    }

    try {
      await deleteServicePackage(packageId);
      toast({
        title: '✅ Paquete eliminado',
        description: 'El paquete se ha eliminado correctamente',
      });
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo eliminar el paquete',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredPackages = packages.filter(pkg =>
    pkg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Package className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                Paquetes de Servicio
              </h2>
              <p className="text-white/60 mt-1 text-sm">Gestiona los paquetes y servicios ofrecidos</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog(null)}
                className="bg-primary/20 border-primary/50 text-primary hover:bg-primary/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Paquete
              </Button>
            </DialogTrigger>
          <DialogContent className="bg-background border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? 'Editar Paquete' : 'Nuevo Paquete de Servicio'}
              </DialogTitle>
              <DialogDescription>
                {editingPackage ? 'Actualiza la información del paquete' : 'Crea un nuevo paquete de servicio'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Paquete</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Paquete Básico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe los servicios incluidos..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from_price">Precio Desde</Label>
                <Input
                  id="from_price"
                  type="number"
                  value={formData.from_price}
                  onChange={(e) => setFormData({ ...formData, from_price: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingPackage ? 'Actualizar' : 'Crear'} Paquete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Total Paquetes</p>
                <p className="text-2xl font-bold text-white">{packages.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Precio Promedio</p>
                <p className="text-2xl font-bold text-white">
                  ${packages.length > 0 
                    ? (packages.reduce((sum, p) => sum + (parseFloat(p.from_price) || 0), 0) / packages.length / 1000).toFixed(0) + 'k'
                    : '0'
                  }
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Total Entregables</p>
                <p className="text-2xl font-bold text-white">
                  {packages.reduce((sum, p) => sum + (p.deliverables?.length || 0), 0)}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input
            placeholder="Buscar paquetes por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-primary/50"
          />
        </div>
      </motion.div>

      {/* Lista de paquetes */}
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
          {filteredPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
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
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <motion.div
                        className="p-2 rounded-lg bg-primary/20 border border-primary/30"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Package className="w-5 h-5 text-primary" />
                      </motion.div>
                      <CardTitle className="text-lg text-white truncate">{pkg.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pkg.description && (
                    <CardDescription className="text-white/70">{pkg.description}</CardDescription>
                  )}
                  {pkg.from_price && (
                    <div className="flex items-center gap-2 text-lg font-semibold text-white">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span>Desde ${parseFloat(pkg.from_price).toLocaleString()}</span>
                    </div>
                  )}
                  {pkg.deliverables && pkg.deliverables.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">Entregables:</p>
                      <div className="flex flex-wrap gap-2">
                        {pkg.deliverables.map((deliverable, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-white/20 text-white/70">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                      onClick={() => handleOpenDialog(pkg)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pkg.id)}
                      className="text-destructive hover:text-destructive border-red-500/30 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredPackages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-white/60">No se encontraron paquetes</p>
        </motion.div>
      )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-foreground/70" />
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pkg.description && (
                <CardDescription>{pkg.description}</CardDescription>
              )}
              {pkg.from_price && (
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <DollarSign className="w-5 h-5" />
                  <span>Desde ${parseFloat(pkg.from_price).toLocaleString()}</span>
                </div>
              )}
              {pkg.deliverables && pkg.deliverables.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Entregables:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.deliverables.map((deliverable, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenDialog(pkg)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(pkg.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </motion.div>
  );
};

export default ServicesManagement;

