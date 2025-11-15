import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getCreativeAssignments } from '@/services/api/assignments';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Calendar, Clock, FileText, ArrowRight, Frown } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const CreativeTasksList = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCreativeAssignments(user.id);
        setAssignments(data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
        <Frown className="w-12 h-12 mx-auto mb-4" />
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card className="bg-card/40 border-border/40 text-center p-8">
        <CardTitle className="text-2xl font-semibold text-foreground mb-4">
          No tienes tareas asignadas
        </CardTitle>
        <CardDescription className="text-foreground/80">
          Cuando un productor te asigne a un proyecto, aparecerá aquí.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mis Tareas</h2>
        <p className="text-foreground/70">Proyectos en los que estás trabajando</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {assignments.map((assignment) => {
          const project = assignment.projects;
          const brief = project?.project_briefs?.[0];
          const nextMilestone = project?.project_milestones
            ?.filter(m => m.status === 'pending')
            .sort((a, b) => new Date(a.due_at) - new Date(b.due_at))[0];

          return (
            <Card key={assignment.id} className="bg-card/40 border-border/40 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-foreground mb-2">
                      {project?.title || 'Proyecto sin título'}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant={project?.status === 'production' ? 'default' : 'secondary'}>
                        {project?.status || 'draft'}
                      </Badge>
                      <Badge variant="outline">{assignment.role}</Badge>
                      {assignment.stage && (
                        <Badge variant="outline">{assignment.stage}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {brief?.objective && (
                  <div className="text-foreground/80">
                    <p className="text-sm line-clamp-2">{brief.objective}</p>
                  </div>
                )}

                {nextMilestone && (
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Clock className="w-4 h-4" />
                    <span>Próximo hito:</span>
                    <span className="font-medium">{nextMilestone.name}</span>
                    {nextMilestone.due_at && (
                      <span className="text-foreground/50">
                        ({format(new Date(nextMilestone.due_at), 'dd MMM', { locale: currentLocale })})
                      </span>
                    )}
                  </div>
                )}

                {brief?.deadline_date && (
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline:</span>
                    <span className="font-medium">
                      {format(new Date(brief.deadline_date), 'dd MMM yyyy', { locale: currentLocale })}
                    </span>
                  </div>
                )}

                <Button asChild className="w-full mt-4">
                  <Link to={`/creative/projects/${project?.id}`}>
                    Ver proyecto <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CreativeTasksList;

