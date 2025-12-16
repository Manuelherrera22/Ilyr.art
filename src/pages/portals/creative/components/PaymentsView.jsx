import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getCreatorPayments, getPaymentStats } from '@/services/api/creatorPayments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Wallet,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const PaymentsView = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [paymentsData, statsData] = await Promise.all([
          getCreatorPayments(user.id),
          getPaymentStats(user.id),
        ]);

        setPayments(paymentsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filtrar pagos
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.creator_jobs?.title?.toLowerCase().includes(query) ||
        p.transaction_id?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [payments, statusFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'completed': 'Completado',
      'processing': 'Procesando',
      'pending': 'Pendiente',
      'failed': 'Fallido',
      'cancelled': 'Cancelado',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <span className="truncate">Mis Pagos</span>
          </h2>
          <p className="text-sm sm:text-base text-white/70">Historial y estado de tus pagos</p>
        </div>

        {/* Búsqueda y filtros - Responsive */}
        <Card className="bg-card/40 border-border/40 p-3 sm:p-4">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Buscar por trabajo o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-white/10 text-white placeholder:text-white/40 text-sm"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="bg-card/40 border-border/40 w-full overflow-x-auto scrollbar-hide">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">Todos</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">Pendientes</TabsTrigger>
                <TabsTrigger value="processing" className="text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">Procesando</TabsTrigger>
                <TabsTrigger value="completed" className="text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0">Completados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Card>
      </div>

      {/* Estadísticas de pagos mejoradas - Responsive */}
      {stats && (
        <motion.div 
          className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-500/20 via-green-600/20 to-emerald-700/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-white/80 truncate pr-1 sm:pr-2">Total Ganado</CardTitle>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  className="flex-shrink-0"
                >
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-400 group-hover:text-green-300 transition-colors" />
                </motion.div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <motion.div 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent break-words"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  ${stats.totalEarned.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </motion.div>
                <p className="text-xs text-white/60 mt-1">
                  {stats.completedPayments} pagos completados
                </p>
                {stats.totalEarned > 0 && (
                  <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs text-green-400">
                    <TrendingUp className="w-3 h-3 flex-shrink-0" />
                    <span className="line-clamp-1">Ganancias acumuladas</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-yellow-500/20 via-yellow-600/20 to-amber-700/20 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 group h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-white/80 truncate pr-1 sm:pr-2">Pendientes</CardTitle>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                  className="flex-shrink-0"
                >
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                </motion.div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <motion.div 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent break-words"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  ${stats.pendingAmount.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </motion.div>
                <p className="text-xs text-white/60 mt-1">
                  {stats.pendingPayments} pagos en proceso
                </p>
                {stats.pendingAmount > 0 && (
                  <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs text-yellow-400">
                    <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                    <span className="line-clamp-1">Procesando próximamente</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/20 via-blue-600/20 to-cyan-700/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-white/80 truncate pr-1 sm:pr-2">Total Pagos</CardTitle>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  className="flex-shrink-0"
                >
                  <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </motion.div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <motion.div 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  {stats.completedPayments + stats.pendingPayments}
                </motion.div>
                <p className="text-xs text-white/60 mt-1">
                  Pagos totales recibidos
                </p>
                <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs text-blue-400">
                  <BarChart3 className="w-3 h-3 flex-shrink-0" />
                  <span className="line-clamp-1">Historial completo</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Lista de pagos mejorada */}
      <Card className="bg-card/40 border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Historial de Pagos
              </CardTitle>
              <CardDescription className="text-white/70 mt-1">
                {filteredPayments.length} {filteredPayments.length === 1 ? 'pago encontrado' : 'pagos encontrados'}
                {filteredPayments.length !== payments.length && ` de ${payments.length} totales`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {filteredPayments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12"
              >
                <DollarSign className="w-16 h-16 mx-auto mb-4 text-white/30" />
                <p className="text-white/70 text-lg mb-2">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No se encontraron pagos' 
                    : 'No hay pagos registrados aún'}
                </p>
                {(searchQuery || statusFilter !== 'all') && (
                  <p className="text-white/50 text-sm">Intenta ajustar los filtros</p>
                )}
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {filteredPayments.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-background/60 to-background/40 rounded-lg border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group"
                  >
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <motion.div 
                          className={`p-2 sm:p-3 rounded-lg ${getStatusColor(payment.status).split(' ')[0]} group-hover:scale-110 transition-transform flex-shrink-0`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {getStatusIcon(payment.status)}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                            {payment.creator_jobs?.title || 'Trabajo sin título'}
                          </h3>
                          <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                            <p className="text-xs sm:text-sm text-white/60">
                              {format(new Date(payment.created_at), 'dd MMM yyyy', { locale: currentLocale })}
                            </p>
                            {payment.payment_method && (
                              <Badge variant="outline" className="text-xs text-white/50 border-white/10">
                                {payment.payment_method}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {payment.transaction_id && (
                        <p className="text-xs text-white/50 ml-10 sm:ml-14 font-mono truncate">
                          ID: {payment.transaction_id}
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right ml-10 sm:ml-4 w-full sm:w-auto">
                      <motion.div 
                        className="text-xl sm:text-2xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent break-words"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.2, type: "spring", stiffness: 200 }}
                      >
                        ${parseFloat(payment.amount).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </motion.div>
                      <Badge className={`${getStatusColor(payment.status)} text-xs`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{getStatusLabel(payment.status)}</span>
                      </Badge>
                      {payment.paid_at && (
                        <div className="flex items-center gap-1 text-xs text-green-400 mt-2">
                          <CheckCircle className="w-3 h-3 flex-shrink-0" />
                          <span className="line-clamp-1">{format(new Date(payment.paid_at), 'dd MMM yyyy', { locale: currentLocale })}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentsView;
