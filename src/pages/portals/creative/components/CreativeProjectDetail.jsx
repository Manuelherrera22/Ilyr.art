import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getAssignedProjectDetails } from '@/services/api/assignments';
import { getProjectAssets } from '@/services/api/assets';
import { getProjectComments, createComment } from '@/services/api/comments';
import LoadingSpinner from '@/components/LoadingSpinner';
import AssetUpload from './AssetUpload';
import { ArrowLeft, Calendar, FileText, MessageSquare, Image as ImageIcon, Download, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

const CreativeProjectDetail = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  const [project, setProject] = useState(null);
  const [assets, setAssets] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !projectId) return;

      try {
        setLoading(true);
        const projectData = await getAssignedProjectDetails(projectId, user.id);
        setProject(projectData);

        // Cargar assets y comentarios
        const [assetsData, commentsData] = await Promise.all([
          getProjectAssets(projectId),
          getProjectComments(projectId, user.id),
        ]);

        setAssets(assetsData);
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, projectId]);

  const handleAssetUploadSuccess = async () => {
    // Recargar assets después de subir
    try {
      const assetsData = await getProjectAssets(projectId);
      setAssets(assetsData);
    } catch (err) {
      console.error('Error reloading assets:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const comment = await createComment(projectId, user.id, newComment, 'client');
      setComments([...comments, comment]);
      setNewComment('');
      toast({
        title: 'Comentario publicado',
        description: 'Tu comentario se ha publicado correctamente',
      });
    } catch (err) {
      console.error('Error creating comment:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'No se pudo publicar el comentario',
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !project) {
    return (
      <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
        <p className="text-xl font-semibold">{error || 'Proyecto no encontrado'}</p>
        <Button asChild className="mt-4">
          <Link to="/creative">Volver a mis tareas</Link>
        </Button>
      </div>
    );
  }

  const brief = project.project_briefs?.[0];
  const milestones = project.project_milestones || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link to="/creative">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={project.status === 'production' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
            {project.assignment && (
              <Badge variant="outline">Rol: {project.assignment.role}</Badge>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="milestones">Hitos</TabsTrigger>
          <TabsTrigger value="comments">Comentarios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {brief && (
            <Card className="bg-card/40 border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Brief del Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {brief.objective && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Objetivo</h4>
                    <p className="text-foreground/80">{brief.objective}</p>
                  </div>
                )}
                {brief.audience && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Audiencia</h4>
                    <p className="text-foreground/80">{brief.audience}</p>
                  </div>
                )}
                {brief.key_messages && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Mensajes Clave</h4>
                    <p className="text-foreground/80">{brief.key_messages}</p>
                  </div>
                )}
                {brief.deadline_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-foreground/70" />
                    <span className="text-foreground/80">
                      Deadline: {format(new Date(brief.deadline_date), 'dd MMM yyyy', { locale: currentLocale })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <AssetUpload projectId={projectId} onUploadSuccess={handleAssetUploadSuccess} />
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Assets del Proyecto</h2>
            <Badge variant="outline">{assets.length} versión{assets.length !== 1 ? 'es' : ''}</Badge>
          </div>

          {assets.length === 0 ? (
            <Card className="bg-card/40 border-border/40 text-center p-8">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-foreground/50" />
              <CardDescription>No hay assets subidos aún</CardDescription>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => (
                <Card key={asset.id} className="bg-card/40 border-border/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Versión {asset.version}
                        {asset.is_final && (
                          <Badge variant="default" className="ml-2">Final</Badge>
                        )}
                      </CardTitle>
                      <Badge variant="outline">{asset.type}</Badge>
                    </div>
                    {asset.notes && (
                      <CardDescription className="mt-2">{asset.notes}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-foreground/70">
                        {format(new Date(asset.created_at), 'dd MMM yyyy HH:mm', { locale: currentLocale })}
                      </div>
                      {asset.profiles && (
                        <div className="text-sm text-foreground/70">
                          Por: {asset.profiles.full_name}
                        </div>
                      )}
                      <Button asChild variant="outline" className="w-full mt-4">
                        <a href={asset.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Hitos del Proyecto</h2>
          {milestones.length === 0 ? (
            <Card className="bg-card/40 border-border/40 text-center p-8">
              <Clock className="w-12 h-12 mx-auto mb-4 text-foreground/50" />
              <CardDescription>No hay hitos definidos aún</CardDescription>
            </Card>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <Card key={milestone.id} className="bg-card/40 border-border/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{milestone.name}</CardTitle>
                      <Badge
                        variant={
                          milestone.status === 'approved' ? 'default' :
                          milestone.status === 'in_progress' ? 'secondary' :
                          'outline'
                        }
                      >
                        {milestone.status}
                      </Badge>
                    </div>
                    {milestone.description && (
                      <CardDescription className="mt-2">{milestone.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {milestone.due_at && (
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Vence: {format(new Date(milestone.due_at), 'dd MMM yyyy', { locale: currentLocale })}
                        </span>
                      </div>
                    )}
                    {milestone.status === 'approved' && milestone.approved_at && (
                      <div className="flex items-center gap-2 text-sm text-green-400 mt-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>
                          Aprobado: {format(new Date(milestone.approved_at), 'dd MMM yyyy', { locale: currentLocale })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Comentarios</h2>
          
          <Card className="bg-card/40 border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Nuevo Comentario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full min-h-[100px] px-3 py-2 bg-background border border-border rounded-md text-foreground"
                disabled={submittingComment}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submittingComment}
              >
                {submittingComment ? 'Publicando...' : 'Publicar Comentario'}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <Card className="bg-card/40 border-border/40 text-center p-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-foreground/50" />
                <CardDescription>No hay comentarios aún</CardDescription>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="bg-card/40 border-border/40">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-foreground">
                            {comment.profiles?.full_name || 'Usuario'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {comment.profiles?.profile_type || 'user'}
                          </Badge>
                          <span className="text-sm text-foreground/50">
                            {format(new Date(comment.created_at), 'dd MMM yyyy HH:mm', { locale: currentLocale })}
                          </span>
                        </div>
                        <p className="text-foreground/80">{comment.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreativeProjectDetail;

