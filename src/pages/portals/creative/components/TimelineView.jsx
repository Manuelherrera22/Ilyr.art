import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays, isPast, isToday, isTomorrow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

const TimelineView = ({ jobs }) => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;

  // Ordenar trabajos por deadline
  const sortedJobs = [...jobs].sort((a, b) => {
    if (!a.deadline_date) return 1;
    if (!b.deadline_date) return -1;
    return new Date(a.deadline_date) - new Date(b.deadline_date);
  });

  const getDeadlineInfo = (deadline) => {
    if (!deadline) return null;
    const days = differenceInDays(new Date(deadline), new Date());
    const isOverdue = isPast(new Date(deadline)) && !isToday(new Date(deadline));
    
    let urgency = 'normal';
    let color = 'text-white/60';
    let bgColor = 'bg-white/5';
    let borderColor = 'border-white/10';
    
    if (isOverdue) {
      urgency = 'overdue';
      color = 'text-red-400';
      bgColor = 'bg-red-500/10';
      borderColor = 'border-red-500/30';
    } else if (isToday(new Date(deadline))) {
      urgency = 'today';
      color = 'text-red-400';
      bgColor = 'bg-red-500/10';
      borderColor = 'border-red-500/30';
    } else if (isTomorrow(new Date(deadline))) {
      urgency = 'tomorrow';
      color = 'text-orange-400';
      bgColor = 'bg-orange-500/10';
      borderColor = 'border-orange-500/30';
    } else if (days < 7) {
      urgency = 'urgent';
      color = 'text-orange-400';
      bgColor = 'bg-orange-500/10';
      borderColor = 'border-orange-500/30';
    } else if (days < 14) {
      urgency = 'soon';
      color = 'text-yellow-400';
      bgColor = 'bg-yellow-500/10';
      borderColor = 'border-yellow-500/30';
    } else {
      color = 'text-green-400';
      bgColor = 'bg-green-500/10';
      borderColor = 'border-green-500/30';
    }

    return {
      days,
      isOverdue,
      urgency,
      color,
      bgColor,
      borderColor,
      label: isOverdue 
        ? `Vencido hace ${Math.abs(days)} ${Math.abs(days) === 1 ? 'día' : 'días'}`
        : isToday(new Date(deadline))
        ? 'Hoy'
        : isTomorrow(new Date(deadline))
        ? 'Mañana'
        : days < 7
        ? `${days} días restantes`
        : `${days} días restantes`
    };
  };

  if (sortedJobs.length === 0) {
    return (
      <Card className="bg-card/40 border-border/40 text-center p-8">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-white/50" />
        <CardTitle className="text-white mb-2">No hay trabajos con deadlines</CardTitle>
        <p className="text-white/70 text-sm">Los trabajos con fechas límite aparecerán aquí</p>
      </Card>
    );
  }

  return (
    <Card className="bg-card/40 border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="w-5 h-5 text-primary" />
          Timeline de Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedJobs.map((job, index) => {
            const deadlineInfo = getDeadlineInfo(job.deadline_date);
            
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Línea conectora */}
                {index < sortedJobs.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-white/10" />
                )}
                
                <div className="flex gap-4">
                  {/* Indicador de fecha */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full ${deadlineInfo?.bgColor || 'bg-white/5'} ${deadlineInfo?.borderColor || 'border-white/10'} border-2 flex items-center justify-center z-10 relative`}>
                      {deadlineInfo?.isOverdue ? (
                        <AlertCircle className={`w-6 h-6 ${deadlineInfo.color}`} />
                      ) : deadlineInfo?.urgency === 'today' || deadlineInfo?.urgency === 'tomorrow' ? (
                        <Zap className={`w-6 h-6 ${deadlineInfo.color}`} />
                      ) : (
                        <Calendar className={`w-6 h-6 ${deadlineInfo.color || 'text-white/60'}`} />
                      )}
                    </div>
                  </div>

                  {/* Contenido del trabajo */}
                  <div className="flex-1 pb-6">
                    <div className={`p-4 rounded-lg border ${deadlineInfo?.borderColor || 'border-white/10'} ${deadlineInfo?.bgColor || 'bg-white/5'} transition-all hover:scale-[1.02]`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{job.title}</h4>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-white/60">
                              {format(new Date(job.deadline_date), 'dd MMM yyyy', { locale: currentLocale })}
                            </span>
                            {deadlineInfo && (
                              <Badge className={`${deadlineInfo.bgColor} ${deadlineInfo.color} border-current/30`}>
                                {deadlineInfo.label}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {job.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1 text-white/70">
                          <DollarSign className="w-4 h-4" />
                          <span>${parseFloat(job.budget_amount).toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/70">
                          <Clock className="w-4 h-4" />
                          <span>{job.estimated_hours || 'N/A'}h</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/70">
                          <CheckCircle className="w-4 h-4" />
                          <span className="capitalize">{job.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineView;
