import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  Bell
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isPast, differenceInDays } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CalendarView = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch deadlines from API
    const fetchDeadlines = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Simulated deadlines data
        setDeadlines([
          {
            id: 1,
            title: 'Entrega Animación 3D',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            type: 'deadline',
            urgency: 'high',
            jobId: '1'
          },
          {
            id: 2,
            title: 'Revisión VFX',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            type: 'review',
            urgency: 'medium',
            jobId: '2'
          },
          {
            id: 3,
            title: 'Entrega Final',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            type: 'deadline',
            urgency: 'low',
            jobId: '3'
          }
        ]);
      } catch (error) {
        console.error('Error fetching deadlines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, [user]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get deadlines for a specific date
  const getDeadlinesForDate = (date) => {
    return deadlines.filter(deadline => 
      isSameDay(new Date(deadline.date), date)
    );
  };

  // Get deadlines for selected date
  const selectedDateDeadlines = useMemo(() => {
    return getDeadlinesForDate(selectedDate);
  }, [selectedDate, deadlines]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getDaysUntilDeadline = (deadlineDate) => {
    return differenceInDays(new Date(deadlineDate), new Date());
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get upcoming deadlines (next 7 days)
  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return deadlines
      .filter(d => {
        const deadlineDate = new Date(d.date);
        return deadlineDate >= today && deadlineDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [deadlines]);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Calendario de Deadlines
          </h2>
          <p className="text-white/70">Gestiona tus fechas límite y recordatorios</p>
        </div>
        <Button onClick={goToToday} variant="outline">
          <Target className="w-4 h-4 mr-2" />
          Hoy
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Calendario Principal - Responsive */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="bg-card/40 border-border/40">
            <CardHeader className="p-3 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-white text-base sm:text-lg md:text-xl truncate">
                  {format(currentDate, 'MMMM yyyy', { locale: currentLocale })}
                </CardTitle>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={previousMonth}
                    className="border-white/20 hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextMonth}
                    className="border-white/20 hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
                  <div key={index} className="text-center text-xs sm:text-sm font-semibold text-white/60 py-1 sm:py-2">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.charAt(0)}</span>
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                {daysInMonth.map((day, index) => {
                  const dayDeadlines = getDeadlinesForDate(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentDay = isToday(day);
                  const isPastDay = isPast(day) && !isCurrentDay;
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        aspect-square p-0.5 sm:p-1 rounded-md sm:rounded-lg transition-all duration-200
                        ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''}
                        ${isSelected ? 'bg-primary/30 border-2 border-primary' : 'bg-white/5 border border-transparent'}
                        ${isCurrentDay ? 'ring-1 sm:ring-2 ring-primary/50' : ''}
                        ${isPastDay ? 'opacity-50' : 'hover:bg-white/10'}
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className={`text-xs sm:text-sm font-medium ${
                          isSelected ? 'text-white' : isCurrentDay ? 'text-primary' : 'text-white/80'
                        }`}>
                          {format(day, 'd')}
                        </span>
                        {dayDeadlines.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5 sm:mt-1">
                            {dayDeadlines.slice(0, 2).map((deadline, idx) => (
                              <div
                                key={idx}
                                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                                  deadline.urgency === 'high' ? 'bg-red-400' :
                                  deadline.urgency === 'medium' ? 'bg-orange-400' :
                                  'bg-green-400'
                                }`}
                              />
                            ))}
                            {dayDeadlines.length > 2 && (
                              <span className="text-[10px] sm:text-xs text-white/60">+{dayDeadlines.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel Lateral - Responsive */}
        <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
          {/* Deadlines del día seleccionado */}
          <Card className="bg-card/40 border-border/40">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-white text-base sm:text-lg">
                {isSameDay(selectedDate, new Date()) ? 'Hoy' : format(selectedDate, 'dd MMMM yyyy', { locale: currentLocale })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {selectedDateDeadlines.length === 0 ? (
                <p className="text-white/60 text-xs sm:text-sm text-center py-4">
                  No hay deadlines para este día
                </p>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {selectedDateDeadlines.map((deadline) => {
                    const daysUntil = getDaysUntilDeadline(deadline.date);
                    return (
                      <motion.div
                        key={deadline.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-2">
                          <h4 className="font-semibold text-white text-xs sm:text-sm flex-1 min-w-0">{deadline.title}</h4>
                          <Badge className={`${getUrgencyColor(deadline.urgency)} text-xs flex-shrink-0`}>
                            {deadline.urgency === 'high' ? 'Urgente' : deadline.urgency === 'medium' ? 'Moderado' : 'Normal'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-white/60 mb-2">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {daysUntil < 0 
                              ? `Vencido hace ${Math.abs(daysUntil)} días`
                              : daysUntil === 0 
                              ? 'Hoy'
                              : `${daysUntil} día${daysUntil !== 1 ? 's' : ''} restante${daysUntil !== 1 ? 's' : ''}`
                            }
                          </span>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full text-xs h-8 sm:h-9"
                        >
                          <Link to={`/creative/jobs/${deadline.jobId}`}>
                            Ver Trabajo
                          </Link>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Próximos deadlines */}
          <Card className="bg-card/40 border-border/40">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="truncate">Próximos 7 Días</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-white/60 text-xs sm:text-sm text-center py-4">
                  No hay deadlines próximos
                </p>
              ) : (
                <div className="space-y-1.5 sm:space-y-2">
                  {upcomingDeadlines.map((deadline) => {
                    const daysUntil = getDaysUntilDeadline(deadline.date);
                    return (
                      <div
                        key={deadline.id}
                        className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-primary/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <h4 className="font-medium text-white text-xs truncate flex-1">{deadline.title}</h4>
                          <Badge className={`${getUrgencyColor(deadline.urgency)} text-xs flex-shrink-0`}>
                            {daysUntil}d
                          </Badge>
                        </div>
                        <p className="text-xs text-white/60 truncate">
                          {format(new Date(deadline.date), 'dd MMM', { locale: currentLocale })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estadísticas rápidas */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-white/70">Deadlines este mes</span>
                  <span className="font-bold text-white text-sm sm:text-base">
                    {deadlines.filter(d => isSameMonth(new Date(d.date), currentDate)).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-white/70">Urgentes</span>
                  <span className="font-bold text-red-400 text-sm sm:text-base">
                    {deadlines.filter(d => d.urgency === 'high' && !isPast(new Date(d.date))).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-white/70">Completados</span>
                  <span className="font-bold text-green-400 text-sm sm:text-base">
                    {deadlines.filter(d => isPast(new Date(d.date))).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarView;
