import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getAllUsers, updateUserRole } from '@/services/api/admin';
import { getAllClientAccounts } from '@/services/api/admin';
import LoadingSpinner from '@/components/LoadingSpinner';
import { User, Edit, Building2 } from 'lucide-react';
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
        getAllUsers(),
        getAllClientAccounts(),
      ]);
      setUsers(usersData);
      setClientAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudieron cargar los datos',
      });
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Usuarios del Sistema</h2>
        <p className="text-foreground/70 mt-2">Gestiona roles y permisos de usuarios</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="bg-card/40 border-border/40">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-foreground/70" />
                  <div>
                    <CardTitle className="text-lg">
                      {user.full_name || 'Usuario sin nombre'}
                    </CardTitle>
                    <CardDescription className="text-xs font-mono mt-1">
                      {user.id.slice(0, 8)}...
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={getRoleBadgeVariant(user.profile_type)}>
                  {user.profile_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.client_accounts && (
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <Building2 className="w-4 h-4" />
                  <span>{user.client_accounts.company_name}</span>
                </div>
              )}
              <div className="text-xs text-foreground/50">
                Registrado: {format(new Date(user.created_at), 'dd MMM yyyy', { locale: currentLocale })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleOpenDialog(user)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Rol
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

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

