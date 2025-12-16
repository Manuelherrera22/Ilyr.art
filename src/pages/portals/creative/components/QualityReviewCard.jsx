import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const QualityReviewCard = ({ review, expanded = false }) => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  if (!review) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'needs_revision':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'passed': 'Aprobado',
      'needs_revision': 'Requiere Revisión',
      'failed': 'Rechazado',
      'pending': 'Pendiente',
    };
    return labels[status] || status;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-card/40 border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Star className="w-5 h-5" />
            Revisión de Calidad
          </CardTitle>
          <Badge className={getStatusColor(review.status)}>
            {getStatusLabel(review.status)}
          </Badge>
        </div>
        {review.profiles && (
          <p className="text-sm text-white/70 mt-1">
            Revisado por: {review.profiles.full_name}
            {review.created_at && (
              <span className="ml-2">
                el {format(new Date(review.created_at), 'dd MMM yyyy', { locale: currentLocale })}
              </span>
            )}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Puntuación general */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/80 font-medium">Puntuación General</span>
            <span className={`text-2xl font-bold ${getScoreColor(review.overall_score)}`}>
              {review.overall_score?.toFixed(1) || 'N/A'}/100
            </span>
          </div>
          <Progress value={review.overall_score || 0} className="h-3" />
        </div>

        {/* Puntuaciones detalladas */}
        {expanded && (
          <div className="grid gap-4 md:grid-cols-3 pt-4 border-t border-white/10">
            {review.technical_score !== null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Técnica</span>
                  <span className={`font-semibold ${getScoreColor(review.technical_score)}`}>
                    {review.technical_score?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <Progress value={review.technical_score || 0} className="h-2" />
              </div>
            )}
            {review.creative_score !== null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Creativa</span>
                  <span className={`font-semibold ${getScoreColor(review.creative_score)}`}>
                    {review.creative_score?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <Progress value={review.creative_score || 0} className="h-2" />
              </div>
            )}
            {review.adherence_score !== null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Cumplimiento</span>
                  <span className={`font-semibold ${getScoreColor(review.adherence_score)}`}>
                    {review.adherence_score?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <Progress value={review.adherence_score || 0} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Checklist */}
        {expanded && review.checklist && Object.keys(review.checklist).length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <h4 className="font-semibold text-white mb-3">Checklist de Calidad</h4>
            <div className="space-y-2">
              {Object.entries(review.checklist).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  {value ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className={value ? 'text-white/80' : 'text-white/60 line-through'}>
                    {key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {review.feedback && (
          <div className="pt-4 border-t border-white/10">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Comentarios del Revisor
            </h4>
            <p className="text-white/80 text-sm whitespace-pre-wrap">{review.feedback}</p>
          </div>
        )}

        {/* Fecha de aprobación */}
        {review.status === 'passed' && review.passed_at && (
          <div className="flex items-center gap-2 text-sm text-green-400 pt-2 border-t border-white/10">
            <CheckCircle className="w-4 h-4" />
            <span>
              Aprobado el {format(new Date(review.passed_at), 'dd MMM yyyy HH:mm', { locale: currentLocale })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QualityReviewCard;
