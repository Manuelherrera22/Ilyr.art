import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, CheckCircle2, ClipboardList, MessageSquare } from 'lucide-react';
import { updateBriefStatus } from '@/services/api/projects';
import { useToast } from '@/components/ui/use-toast';
import ProjectAssignments from './ProjectAssignments';

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
    <p className="mt-2 text-sm text-white/90 whitespace-pre-line">{value || '—'}</p>
  </div>
);

const BriefDetail = ({ brief, onClose, onRefresh }) => {
  const { toast } = useToast();

  const handleStatusChange = async (status) => {
    const { error } = await updateBriefStatus(brief.id, status);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'No se pudo actualizar el brief',
        description: error.message,
      });
      return;
    }

    toast({
      title: status === 'in_review' ? 'Brief marcado como en revisión' : 'Brief aceptado',
      description: 'El cliente será notificado del cambio de estado.',
      className: 'bg-green-500 text-white',
    });
    onRefresh?.();
    onClose?.();
  };

  return (
    <Card className="border border-white/10 bg-[#121420]/80 h-full">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-white">
              {brief.project?.title || 'Proyecto sin título'}
            </CardTitle>
            <p className="mt-2 text-sm text-white/60">
              ID brief: <span className="font-mono text-white/80">{brief.id}</span>
            </p>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
            {brief.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 py-6">
        <div className="grid gap-4">
          <DetailItem label="Objetivo" value={brief.objective} />
          <DetailItem label="Audiencia" value={brief.audience} />
          <DetailItem label="Mensajes clave" value={brief.key_messages} />
          <DetailItem label="Rango de inversión" value={brief.budget_range} />
          <DetailItem label="Deadline" value={brief.deadline_date} />
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Próximos pasos sugeridos</p>
          <div className="space-y-3 text-sm text-white/75">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              Validar viabilidad IA y complejidad técnica.
            </div>
            <div className="flex items-center gap-3">
              <ClipboardList className="h-4 w-4 text-blue-400" />
              Estimar horas de squad y costos asociados.
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-orange-300" />
              Agendar discovery con el cliente si es necesario.
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {brief.project?.id && (
          <>
            <ProjectAssignments
              projectId={brief.project.id}
              projectTitle={brief.project.title || 'Proyecto sin título'}
            />
            <Separator className="bg-white/10" />
          </>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Calendar className="h-4 w-4 text-white/60" />
          <span className="text-sm text-white/60">
            Recibido el {new Date(brief.created_at).toLocaleDateString('es-ES')}
          </span>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" className="text-white/70 hover:text-white" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            variant="outline"
            className="border-accent/40 text-accent hover:bg-accent/10"
            onClick={() => handleStatusChange('in_review')}
          >
            Marcar en revisión
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleStatusChange('approved')}>
            Aprobar brief
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BriefDetail;

