import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSystemMetrics } from '@/services/api/admin';
import LoadingSpinner from '@/components/LoadingSpinner';
import { TrendingUp, FolderKanban, Users, Building2, FileText, Activity } from 'lucide-react';

const SystemMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getSystemMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // Refrescar cada 60 segundos
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !metrics) {
    return <LoadingSpinner />;
  }

  const metricCards = [
    {
      title: 'Proyectos Totales',
      value: metrics.totalProjects,
      icon: FolderKanban,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Proyectos Activos',
      value: metrics.activeProjects,
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      title: 'Usuarios',
      value: metrics.totalUsers,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      title: 'Cuentas de Clientes',
      value: metrics.totalClientAccounts,
      icon: Building2,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
    {
      title: 'Briefs',
      value: metrics.totalBriefs,
      icon: FileText,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-8 h-8" />
          Métricas del Sistema
        </h2>
        <p className="text-foreground/70 mt-2">Vista general de la actividad de la plataforma</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-card/40 border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/70">
                    {metric.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SystemMetrics;

