import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getAllServicePackages, createServicePackage, updateServicePackage, deleteServicePackage } from '@/services/api/admin';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Package, Plus, Edit, Trash2, DollarSign } from 'lucide-react';
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
      const data = await getAllServicePackages();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudieron cargar los paquetes',
      });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Paquetes de Servicio</h2>
          <p className="text-foreground/70 mt-2">Gestiona los paquetes y servicios ofrecidos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog(null)}>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="bg-card/40 border-border/40">
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

      {packages.length === 0 && (
        <Card className="bg-card/40 border-border/40 text-center p-8">
          <Package className="w-12 h-12 mx-auto mb-4 text-foreground/50" />
          <CardDescription>No hay paquetes de servicio registrados</CardDescription>
        </Card>
      )}
    </div>
  );
};

export default ServicesManagement;

