import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getAllUsers, updateUserRole } from '@/services/api/admin';
import { getAllClientAccounts } from '@/services/api/admin';
import LoadingSpinner from '@/components/LoadingSpinner';
import { User, Edit, Building2, Search, Users as UsersIcon, Shield, Briefcase, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const UsersManagement = () => {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  const [users, setUsers] = useState([]);
  const [clientAccounts, setClientAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    profile_type: 'client',
    client_account_id: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, accountsData] = await Promise.all([
        getAllUsers().catch(() => []),
        getAllClientAccounts().catch(() => []),
      ]);
      // Datos mock para testing si no hay datos
      if (!usersData || usersData.length === 0) {
        setUsers([
          {
            id: '1',
            full_name: 'Administrador Ilyrart',
            profile_type: 'admin',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            full_name: 'Juan Pérez',
            profile_type: 'client',
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            full_name: 'María García',
            profile_type: 'creative',
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        setUsers(usersData);
      }
      setClientAccounts(accountsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Datos mock en caso de error
      setUsers([
        {
          id: '1',
          full_name: 'Administrador Ilyrart',
          profile_type: 'admin',
          created_at: new Date().toISOString(),
        },
      ]);
      setClientAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user) => {
    setEditingUser(user);
    setFormData({
      profile_type: user.profile_type || 'client',
      client_account_id: user.client_account_id || null,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      await updateUserRole(editingUser.id, formData.profile_type, formData.client_account_id);
      toast({
        title: '✅ Usuario actualizado',
        description: 'El rol del usuario se ha actualizado correctamente',
      });
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el usuario',
      });
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'producer':
        return 'default';
      case 'creative':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'producer':
        return Briefcase;
      case 'creative':
        return Sparkles;
      default:
        return User;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400';
      case 'producer':
        return 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400';
      case 'creative':
        return 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400';
      default:
        return 'from-gray-500/20 to-gray-600/10 border-gray-500/30 text-gray-400';
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.profile_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleCounts = users.reduce((acc, user) => {
    acc[user.profile_type] = (acc[user.profile_type] || 0) + 1;
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
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
            <UsersIcon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white flex items-center gap-3">
              Usuarios del Sistema
            </h2>
            <p className="text-white/60 mt-1 text-sm">Gestiona roles y permisos de usuarios</p>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {Object.entries(roleCounts).map(([role, count]) => {
          const RoleIcon = getRoleIcon(role);
          const colors = getRoleColor(role).split(' ');
          return (
            <Card key={role} className={`bg-gradient-to-br ${colors[0]} ${colors[1]} border ${colors[2]} backdrop-blur-sm`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{role}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                  </div>
                  <RoleIcon className={`w-8 h-8 ${colors[3]}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
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
            placeholder="Buscar usuarios por nombre o rol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-primary/50"
          />
        </div>
      </motion.div>

      {/* Lista de usuarios */}
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
          {filteredUsers.map((user, index) => {
            const RoleIcon = getRoleIcon(user.profile_type);
            const colors = getRoleColor(user.profile_type).split(' ');
            return (
              <motion.div
                key={user.id}
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
                <Card className={`
                  relative overflow-hidden
                  bg-gradient-to-br ${colors[0]} ${colors[1]}
                  border ${colors[2]}
                  backdrop-blur-sm
                  hover:shadow-2xl hover:shadow-${colors[2].split('/')[0]}/20
                  transition-all duration-300
                  group
                `}>
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <motion.div
                          className={`p-2 rounded-lg bg-${colors[2].split('/')[0]}/20 border ${colors[2]}`}
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <RoleIcon className={`w-5 h-5 ${colors[3]}`} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg text-white truncate">
                            {user.full_name || 'Usuario sin nombre'}
                          </CardTitle>
                          <CardDescription className="text-xs font-mono mt-1 text-white/50">
                            {user.id.slice(0, 8)}...
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getRoleBadgeVariant(user.profile_type)} className="ml-2">
                        {user.profile_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.client_accounts && (
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Building2 className="w-4 h-4" />
                        <span className="truncate">{user.client_accounts.company_name}</span>
                      </div>
                    )}
                    <div className="text-xs text-white/50">
                      Registrado: {format(new Date(user.created_at), 'dd MMM yyyy', { locale: currentLocale })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Rol
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <User className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-white/60">No se encontraron usuarios</p>
        </motion.div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Editar Rol de Usuario</DialogTitle>
            <DialogDescription>
              Cambia el rol y la cuenta asociada del usuario
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile_type">Rol</Label>
              <select
                id="profile_type"
                value={formData.profile_type}
                onChange={(e) => setFormData({ ...formData, profile_type: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
              >
                <option value="client">Cliente</option>
                <option value="producer">Productor</option>
                <option value="creative">Creativo</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            {formData.profile_type === 'client' && (
              <div className="space-y-2">
                <Label htmlFor="client_account_id">Cuenta de Cliente</Label>
                <select
                  id="client_account_id"
                  value={formData.client_account_id || ''}
                  onChange={(e) => setFormData({ ...formData, client_account_id: e.target.value || null })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="">Sin cuenta asignada</option>
                  {clientAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.company_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button onClick={handleSubmit} className="w-full">
              Actualizar Usuario
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;

