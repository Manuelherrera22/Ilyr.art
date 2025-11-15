import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ServerCrash, FileQuestion, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const UserActivityPage = ({ setHeaderStep }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = React.useState({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    setHeaderStep('Mi Actividad', 0, 0);
  }, [setHeaderStep]);

  const fetchLogs = useCallback(async (startDate, endDate) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error('User not authenticated');
      }
      supabase.functions.setAuth(sessionData.session.access_token);

      const { data, error: functionError } = await supabase.functions.invoke('get-user-access-logs', {
        body: {
          fecha_inicio: startDate ? format(startDate, 'yyyy-MM-dd') : null,
          fecha_fin: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        },
      });

      if (functionError) {
        const errorDetails = await functionError.context.json();
        throw new Error(errorDetails.message || 'Error desconocido del servidor.');
      }

      if (data.success) {
        setLogs(data.data || []);
      } else {
        throw new Error(data.message || 'Error al cargar los registros de acceso.');
      }
    } catch (err) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error de Carga',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchLogs(date.from, date.to);
  }, [fetchLogs, date]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-white">Mi Actividad</h1>
          <p className="text-white/60 mt-2">Aquí puedes ver tu historial de acceso a la plataforma.</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-[300px] justify-start text-left font-normal glass-card',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y', { locale: es })} -{' '}
                    {format(date.to, 'LLL dd, y', { locale: es })}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y', { locale: es })
                )
              ) : (
                <span>Selecciona un rango</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center h-64 flex flex-col justify-center items-center bg-red-500/10 rounded-lg">
          <ServerCrash className="h-12 w-12 text-red-400 mb-4" />
          <p className="text-xl text-red-400">Error al cargar la actividad</p>
          <p className="text-white/60">{error}</p>
          <Button onClick={() => fetchLogs(date.from, date.to)} variant="outline" className="mt-4">
            Reintentar
          </Button>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center h-64 flex flex-col justify-center items-center bg-white/5 rounded-lg">
          <FileQuestion className="h-12 w-12 text-white/40 mb-4" />
          <p className="text-xl text-white/80">No hay registros de actividad</p>
          <p className="text-white/60">No se encontraron accesos en el rango de fechas seleccionado.</p>
        </div>
      ) : (
        <motion.div
          className="grid gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {logs.map((log) => (
            <motion.div key={log.id} variants={itemVariants}>
              <Card className="glass-card">
                <CardContent className="p-4 flex justify-between items-center">
                  <p className="text-white/80">
                    Acceso detectado desde <span className="font-semibold text-white">{log.email}</span>
                  </p>
                  <p className="text-sm text-white/60">
                    {format(new Date(log.fecha_acceso), "eeee, dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default UserActivityPage;