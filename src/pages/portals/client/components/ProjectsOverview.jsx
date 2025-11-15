import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { listProjectsForAccount } from '@/services/api/projects';
import { useProfile } from '@/contexts/ProfileContext';
import { ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const STATUS_LABELS = {
  draft: { label: 'Draft', tone: 'bg-white/10 text-white/80' },
  intake: { label: 'Brief enviado', tone: 'bg-blue-500/20 text-blue-200' },
  in_review: { label: 'En revisión', tone: 'bg-yellow-500/20 text-yellow-200' },
  approved: { label: 'Aprobado', tone: 'bg-green-500/20 text-green-200' },
  production: { label: 'En producción', tone: 'bg-purple-500/20 text-purple-100' },
  delivered: { label: 'Entregado', tone: 'bg-emerald-500/20 text-emerald-100' },
};

const ProjectCard = ({ project }) => {
  const statusMeta = STATUS_LABELS[project.status] ?? STATUS_LABELS.draft;
  const brief = project.project_briefs?.[0];
  const createdAt = format(new Date(project.created_at), 'dd MMM yyyy', { locale: es });

  const nextDeadline =
    project.project_milestones?.find((milestone) => milestone.status !== 'completed') ||
    (brief?.deadline_date && {
      name: 'Deadline propuesto',
      due_at: brief.deadline_date,
    });

  const distributionChannels = project.metadata?.distribution_channels ?? [];

  return (
    <Card className="border border-white/10 bg-[#10121A]/80 backdrop-blur transition hover:border-accent/50">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-xl text-white">{project.title}</CardTitle>
          <p className="text-xs text-white/50 mt-1">Creado el {createdAt}</p>
        </div>
        <Badge className={statusMeta.tone}>{statusMeta.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-white/80">
        {brief ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white/90">Objetivo</p>
            <p className="text-sm leading-relaxed">{brief.objective || 'Sin definir'}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <AlertCircle className="h-4 w-4" />
            Aún no se ha completado el brief.
          </div>
        )}

        {distributionChannels.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1">Canales objetivo</p>
            <div className="flex flex-wrap gap-2">
              {distributionChannels.map((channel) => (
                <Badge key={channel} variant="secondary" className="bg-white/10 text-white/80">
                  {channel}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="bg-white/10" />

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <Calendar className="h-4 w-4" />
            {nextDeadline ? (
              <span>
                Próximo hito:{' '}
                <span className="text-white/80 font-medium">
                  {nextDeadline.name || 'Deadline'}
                </span>{' '}
                el{' '}
                {format(new Date(nextDeadline.due_at || nextDeadline.deadline_date), 'dd MMM yyyy', {
                  locale: es,
                })}
              </span>
            ) : (
              <span>No hay hitos programados</span>
            )}
          </div>
          <Button asChild size="sm" variant="ghost" className="text-accent hover:text-accent/80 hover:bg-accent/10">
            <Link to={`/client/projects/${project.id}`}>
              Ver detalle <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectsOverview = () => {
  const { clientAccountId } = useProfile();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!clientAccountId) {
        setLoading(false);
        setProjects([]);
        return;
      }
      setLoading(true);
      const { data, error } = await listProjectsForAccount(clientAccountId);
      if (error) {
        setError(error.message);
      } else {
        setProjects(data || []);
        setError(null);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [clientAccountId]);

  const sortedProjects = useMemo(
    () => projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [projects]
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border border-red-500/40 bg-red-500/10">
        <CardContent className="py-12 text-center text-red-200">
          <p className="font-semibold">No pudimos cargar tus proyectos.</p>
          <p className="mt-2 text-sm opacity-80">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (sortedProjects.length === 0) {
    return (
      <Card className="border border-white/10 bg-[#10121A]/60 text-center">
        <CardContent className="py-16 text-white/70">
          <p className="text-lg font-semibold">
            Todavía no tienes proyectos activos con el estudio.
          </p>
          <p className="mt-2 text-sm text-white/50">
            Cuando un productor apruebe tu brief, el proyecto aparecerá aquí con cada avance y entrega.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Tus proyectos</h2>
        <p className="text-sm text-white/60">
          Cada tarjeta refleja el estado actual, próximos hitos y la información estratégica que compartiste.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {sortedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsOverview;

