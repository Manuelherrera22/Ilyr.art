import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getAllClientAccounts, createClientAccount, updateClientAccount } from '@/services/api/admin';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Building2, Plus, Edit, Users, Mail } from 'lucide-react';
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
      const data = await getAllClientAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudieron cargar las cuentas',
      });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Cuentas de Clientes</h2>
          <p className="text-foreground/70 mt-2">Gestiona las cuentas corporativas y sus usuarios</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog(null)}>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id} className="bg-card/40 border-border/40">
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

      {accounts.length === 0 && (
        <Card className="bg-card/40 border-border/40 text-center p-8">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-foreground/50" />
          <CardDescription>No hay cuentas de clientes registradas</CardDescription>
        </Card>
      )}
    </div>
  );
};

export default AccountsManagement;

