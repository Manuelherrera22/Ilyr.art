import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { updateFeedbackStatus } from '@/services/api/creatorFeedback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const FeedbackSection = ({ jobId, feedback, onFeedbackUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  const [updating, setUpdating] = useState({});

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'normal':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'low':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4" />;
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'normal':
        return <Info className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'acknowledged':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'open':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getFeedbackTypeLabel = (type) => {
    const labels = {
      'technical': 'Técnico',
      'creative': 'Creativo',
      'general': 'General',
      'revision': 'Revisión',
    };
    return labels[type] || type;
  };

  const handleUpdateStatus = async (feedbackId, newStatus) => {
    if (!user) return;

    setUpdating({ ...updating, [feedbackId]: true });
    try {
      await updateFeedbackStatus(feedbackId, user.id, newStatus);
      toast({
        title: 'Estado actualizado',
        description: `El feedback ha sido marcado como ${newStatus}`,
        className: 'bg-green-500 text-white',
      });
      if (onFeedbackUpdate) {
        onFeedbackUpdate();
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el estado',
      });
    } finally {
      setUpdating({ ...updating, [feedbackId]: false });
    }
  };

  if (feedback.length === 0) {
    return (
      <Card className="bg-card/40 border-border/40 text-center p-8">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-white/50" />
        <p className="text-white/70">No hay retroalimentación aún</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Retroalimentación</h2>
        <Badge variant="outline" className="text-white/70 border-white/20">
          {feedback.length} {feedback.length === 1 ? 'mensaje' : 'mensajes'}
        </Badge>
      </div>

      {feedback.map((item) => (
        <Card key={item.id} className="bg-card/40 border-border/40">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg text-white">
                    {item.title || 'Sin título'}
                  </CardTitle>
                  <Badge className={getPriorityColor(item.priority)}>
                    {getPriorityIcon(item.priority)}
                    <span className="ml-1">{item.priority}</span>
                  </Badge>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status === 'open' ? 'Abierto' : 
                     item.status === 'acknowledged' ? 'Reconocido' :
                     item.status === 'resolved' ? 'Resuelto' : item.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {getFeedbackTypeLabel(item.feedback_type)}
                  </span>
                  {item.profiles && (
                    <span>De: {item.profiles.full_name}</span>
                  )}
                  <span>
                    {format(new Date(item.created_at), 'dd MMM yyyy HH:mm', { locale: currentLocale })}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/80 whitespace-pre-wrap">{item.message}</p>

            {item.status === 'open' && (
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(item.id, 'acknowledged')}
                  disabled={updating[item.id]}
                  className="text-white/80 border-white/20 hover:bg-white/10"
                >
                  {updating[item.id] ? 'Actualizando...' : 'Marcar como Reconocido'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(item.id, 'resolved')}
                  disabled={updating[item.id]}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Resuelto
                </Button>
              </div>
            )}

            {item.status === 'acknowledged' && (
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(item.id, 'resolved')}
                  disabled={updating[item.id]}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Resuelto
                </Button>
              </div>
            )}

            {item.status === 'resolved' && item.resolved_at && (
              <div className="flex items-center gap-2 text-sm text-green-400 pt-2 border-t border-white/10">
                <CheckCircle className="w-4 h-4" />
                <span>
                  Resuelto el {format(new Date(item.resolved_at), 'dd MMM yyyy HH:mm', { locale: currentLocale })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackSection;
