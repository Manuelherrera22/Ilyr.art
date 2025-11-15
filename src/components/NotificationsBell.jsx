import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationCount } from '@/services/api/notifications';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const NotificationsBell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Refrescar cada 30 segundos
      const interval = setInterval(() => {
        fetchUnreadCount();
        if (open) {
          fetchNotifications();
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, open]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getUserNotifications(user.id, { limit: 20 });
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
      const count = await getUnreadNotificationCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(notifications.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
      setUnreadCount(0);
      toast({
        title: 'Notificaciones marcadas como leídas',
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron marcar todas las notificaciones como leídas',
      });
    }
  };

  const getNotificationMessage = (notification) => {
    const { type, payload, projects } = notification;
    const projectTitle = projects?.title || 'el proyecto';

    switch (type) {
      case 'brief_submitted':
        return `Tu brief para "${projectTitle}" ha sido recibido`;
      case 'brief_approved':
        return `Tu brief para "${projectTitle}" ha sido aprobado`;
      case 'brief_in_review':
        return `El brief de "${projectTitle}" está en revisión`;
      case 'milestone_created':
        return `Nuevo hito creado: ${payload.milestone_name || 'Hito'} en "${projectTitle}"`;
      case 'milestone_due_soon':
        return `El hito "${payload.milestone_name || 'Hito'}" de "${projectTitle}" vence pronto`;
      case 'asset_uploaded':
        return `Nueva versión subida en "${projectTitle}"`;
      case 'asset_final':
        return `Versión final disponible para "${projectTitle}"`;
      case 'comment_added':
        return `Nuevo comentario en "${projectTitle}"`;
      case 'assignment_created':
        return `Has sido asignado a "${projectTitle}"`;
      case 'project_status_changed':
        return `El estado de "${projectTitle}" cambió a ${payload.new_status || 'nuevo estado'}`;
      default:
        return `Nueva actualización en "${projectTitle}"`;
    }
  };

  const getNotificationLink = (notification) => {
    const { type, project_id } = notification;
    
    if (!project_id) return null;

    // Determinar la ruta según el tipo de usuario (esto se puede mejorar con contexto de perfil)
    if (type === 'assignment_created') {
      return `/creative/projects/${project_id}`;
    }
    
    // Por defecto, redirigir al proyecto del cliente
    return `/client/projects/${project_id}`;
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-foreground">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-foreground/70">Cargando...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-foreground/70">
              <Bell className="h-8 w-8 mx-auto mb-2 text-foreground/30" />
              <p>No hay notificaciones</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const isUnread = !notification.read_at;
                const link = getNotificationLink(notification);
                const content = (
                  <div
                    className={`p-4 hover:bg-background/50 transition-colors cursor-pointer ${
                      isUnread ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      if (isUnread) {
                        handleMarkAsRead(notification.id);
                      }
                      if (link) {
                        setOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        isUnread ? 'bg-primary' : 'bg-transparent'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${isUnread ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>
                          {getNotificationMessage(notification)}
                        </p>
                        <p className="text-xs text-foreground/50 mt-1">
                          {format(new Date(notification.created_at), 'dd MMM yyyy HH:mm', { locale: currentLocale })}
                        </p>
                      </div>
                    </div>
                  </div>
                );

                return link ? (
                  <Link key={notification.id} to={link}>
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBell;

