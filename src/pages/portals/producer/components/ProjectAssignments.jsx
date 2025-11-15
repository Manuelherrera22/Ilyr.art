import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getProjectAssignments, createAssignment, removeAssignment } from '@/services/api/assignments';
import { getCreativeUsers } from '@/services/api/users';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Users, UserPlus, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ProjectAssignments = ({ projectId, projectTitle }) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [creativeUsers, setCreativeUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('creative');
  const [selectedStage, setSelectedStage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assignmentsData, usersData] = await Promise.all([
          getProjectAssignments(projectId),
          getCreativeUsers(),
        ]);
        setAssignments(assignmentsData);
        setCreativeUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'No se pudieron cargar las asignaciones',
        });
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId, toast]);

  const handleAssign = async () => {
    if (!selectedUserId) {
      toast({
        variant: 'destructive',
        title: 'Selecciona un usuario',
        description: 'Debes seleccionar un creativo para asignar',
      });
      return;
    }

    setAssigning(true);
    try {
      const newAssignment = await createAssignment(
        projectId,
        selectedUserId,
        selectedRole,
        selectedStage || null
      );
      
      setAssignments([...assignments, newAssignment]);
      setDialogOpen(false);
      setSelectedUserId('');
      setSelectedRole('creative');
      setSelectedStage('');

      toast({
        title: '✅ Asignación creada',
        description: 'El creativo ha sido asignado al proyecto',
      });
    } catch (error) {
      console.error('Error assigning user:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear la asignación',
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (assignmentId, userName) => {
    if (!confirm(`¿Estás seguro de que quieres remover a ${userName} de este proyecto?`)) {
      return;
    }

    try {
      await removeAssignment(assignmentId);
      setAssignments(assignments.filter(a => a.id !== assignmentId));
      
      toast({
        title: '✅ Asignación removida',
        description: 'El usuario ha sido removido del proyecto',
      });
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo remover la asignación',
      });
    }
  };

  // Filtrar usuarios ya asignados
  const assignedUserIds = assignments
    .filter(a => a.status === 'active')
    .map(a => a.user_id);
  
  const availableUsers = creativeUsers.filter(u => !assignedUserIds.includes(u.id));

  if (loading) {
    return <LoadingSpinner />;
  }

  const activeAssignments = assignments.filter(a => a.status === 'active');

  return (
    <Card className="bg-card/40 border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Asignaciones del Equipo
            </CardTitle>
            <CardDescription className="mt-2">
              Gestiona quién trabaja en este proyecto
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Asignar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-border">
              <DialogHeader>
                <DialogTitle>Asignar Creativo al Proyecto</DialogTitle>
                <DialogDescription>
                  Selecciona un creativo para asignarlo a "{projectTitle}"
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="user-select">Creativo</Label>
                  {availableUsers.length === 0 ? (
                    <p className="text-sm text-foreground/70">
                      No hay creativos disponibles. Todos ya están asignados o no hay creativos en el sistema.
                    </p>
                  ) : (
                    <select
                      id="user-select"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    >
                      <option value="">Selecciona un creativo...</option>
                      {availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.full_name || user.id}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role-select">Rol</Label>
                  <select
                    id="role-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  >
                    <option value="creative">Creativo</option>
                    <option value="vfx">VFX Artist</option>
                    <option value="cgi">CGI Artist</option>
                    <option value="post">Post-Producción</option>
                    <option value="motion">Motion Graphics</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage-input">Etapa (opcional)</Label>
                  <Input
                    id="stage-input"
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    placeholder="Ej: Pre-producción, Producción, Post"
                  />
                </div>

                <Button
                  onClick={handleAssign}
                  disabled={!selectedUserId || assigning}
                  className="w-full"
                >
                  {assigning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Asignando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Asignar
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {activeAssignments.length === 0 ? (
          <div className="text-center py-8 text-foreground/70">
            <Users className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
            <p>No hay asignaciones activas</p>
            <p className="text-sm mt-2">Asigna creativos para comenzar a trabajar en este proyecto</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/40"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-foreground">
                      {assignment.profiles?.full_name || 'Usuario sin nombre'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {assignment.role}
                      </Badge>
                      {assignment.stage && (
                        <Badge variant="secondary" className="text-xs">
                          {assignment.stage}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(assignment.id, assignment.profiles?.full_name || 'Usuario')}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectAssignments;

