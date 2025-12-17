import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getAllClientAccounts, createClientAccount, updateClientAccount } from '@/services/api/admin';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Building2, Plus, Edit, Users, Mail, Search, TrendingUp } from 'lucide-react';
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

const AccountsManagement = () => {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    company_name: '',
    contact_email: '',
    status: 'active',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAllClientAccounts().catch(() => []);
      // Datos mock para testing
      if (!data || data.length === 0) {
        setAccounts([
          {
            id: '1',
            company_name: 'Acme Corp',
            contact_email: 'contacto@acme.com',
            status: 'active',
            created_at: new Date().toISOString(),
            profiles: [{ id: '1' }, { id: '2' }],
          },
          {
            id: '2',
            company_name: 'TechStart',
            contact_email: 'hello@techstart.com',
            status: 'active',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            profiles: [{ id: '3' }],
          },
        ]);
      } else {
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      // Datos mock en caso de error
      setAccounts([
        {
          id: '1',
          company_name: 'Acme Corp',
          contact_email: 'contacto@acme.com',
          status: 'active',
          created_at: new Date().toISOString(),
          profiles: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (account = null) => {
    setEditingAccount(account);
    if (account) {
      setFormData({
        company_name: account.company_name,
        contact_email: account.contact_email,
        status: account.status,
      });
    } else {
      setFormData({
        company_name: '',
        contact_email: '',
        status: 'active',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingAccount) {
        await updateClientAccount(editingAccount.id, formData);
        toast({
          title: '✅ Cuenta actualizada',
          description: 'La cuenta se ha actualizado correctamente',
        });
      } else {
        await createClientAccount(formData);
        toast({
          title: '✅ Cuenta creada',
          description: 'La cuenta se ha creado correctamente',
        });
      }
      setDialogOpen(false);
      fetchAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo guardar la cuenta',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredAccounts = accounts.filter(account =>
    account.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.contact_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = accounts.reduce((acc, account) => {
    acc[account.status] = (acc[account.status] || 0) + 1;
    return acc;
  }, {});

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
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                Cuentas de Clientes
              </h2>
              <p className="text-white/60 mt-1 text-sm">Gestiona las cuentas corporativas y sus usuarios</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog(null)}
                className="bg-primary/20 border-primary/50 text-primary hover:bg-primary/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cuenta
              </Button>
            </DialogTrigger>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? 'Editar Cuenta' : 'Nueva Cuenta de Cliente'}
              </DialogTitle>
              <DialogDescription>
                {editingAccount ? 'Actualiza la información de la cuenta' : 'Crea una nueva cuenta corporativa'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Nombre de la Empresa</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Ej: Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email de Contacto</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="contacto@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                  <option value="suspended">Suspendida</option>
                </select>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingAccount ? 'Actualizar' : 'Crear'} Cuenta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {Object.entries(statusCounts).map(([status, count]) => {
          const statusConfig = {
            active: { color: 'from-green-500/20 to-green-600/10 border-green-500/30', label: 'Activas' },
            inactive: { color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30', label: 'Inactivas' },
            suspended: { color: 'from-red-500/20 to-red-600/10 border-red-500/30', label: 'Suspendidas' },
          };
          const config = statusConfig[status] || statusConfig.active;
          return (
            <Card key={status} className={`bg-gradient-to-br ${config.color} backdrop-blur-sm`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{config.label}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-white/40" />
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
                <p className="text-2xl font-bold text-white">{accounts.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
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
            placeholder="Buscar cuentas por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-primary/50"
          />
        </div>
      </motion.div>

      {/* Lista de cuentas */}
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
          {filteredAccounts.map((account) => (
            <motion.div
              key={account.id}
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
                        <Building2 className="w-5 h-5 text-primary" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg text-white truncate">{account.company_name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1 text-white/50">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{account.contact_email}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={account.status === 'active' ? 'default' : account.status === 'suspended' ? 'destructive' : 'secondary'}>
                      {account.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Users className="w-4 h-4" />
                    <span>{account.profiles?.length || 0} usuario(s)</span>
                  </div>
                  <div className="text-xs text-white/50">
                    Creada: {format(new Date(account.created_at), 'dd MMM yyyy', { locale: currentLocale })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => handleOpenDialog(account)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredAccounts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Building2 className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-white/60">No se encontraron cuentas</p>
        </motion.div>
      )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-foreground/70" />
                  <div>
                    <CardTitle className="text-lg">{account.company_name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {account.contact_email}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                  {account.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Users className="w-4 h-4" />
                <span>{account.profiles?.length || 0} usuario(s)</span>
              </div>
              <div className="text-xs text-foreground/50">
                Creada: {format(new Date(account.created_at), 'dd MMM yyyy', { locale: currentLocale })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleOpenDialog(account)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

    </motion.div>
  );
};

export default AccountsManagement;

