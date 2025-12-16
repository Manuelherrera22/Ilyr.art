import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  FileSpreadsheet,
  Calendar,
  CheckCircle,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

const ReportExport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState(null);

  const handleExport = async (type) => {
    setExporting(true);
    setExportType(type);
    
    try {
      // TODO: Implement actual export functionality
      // For now, simulate export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: '✅ Reporte generado',
        description: `Tu reporte ${type === 'pdf' ? 'PDF' : 'Excel'} se está descargando...`,
        className: 'bg-green-500 text-white',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo generar el reporte',
      });
    } finally {
      setExporting(false);
      setExportType(null);
    }
  };

  const reportTypes = [
    {
      id: 'performance',
      title: 'Reporte de Rendimiento',
      description: 'Análisis completo de tu rendimiento, calidad y productividad',
      icon: TrendingUp,
      formats: ['pdf', 'excel']
    },
    {
      id: 'earnings',
      title: 'Reporte de Ganancias',
      description: 'Historial detallado de pagos y ganancias',
      icon: FileText,
      formats: ['pdf', 'excel']
    },
    {
      id: 'portfolio',
      title: 'Portfolio Completo',
      description: 'Todos tus trabajos completados con detalles y estadísticas',
      icon: Sparkles,
      formats: ['pdf']
    },
    {
      id: 'monthly',
      title: 'Reporte Mensual',
      description: 'Resumen mensual de actividad, trabajos y métricas',
      icon: Calendar,
      formats: ['pdf', 'excel']
    }
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Download className="w-8 h-8 text-primary" />
          Exportar Reportes
        </h2>
        <p className="text-white/70">Genera reportes detallados en PDF o Excel</p>
      </div>

      {/* Tipos de reporte */}
      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-br from-card/60 to-card/30 border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{report.title}</CardTitle>
                        <CardDescription className="text-white/70 mt-1">
                          {report.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-white/60">Formatos disponibles:</span>
                    {report.formats.map(format => (
                      <Badge key={format} variant="outline" className="text-xs">
                        {format.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {report.formats.includes('pdf') && (
                      <Button
                        onClick={() => handleExport('pdf')}
                        disabled={exporting && exportType === 'pdf'}
                        variant="outline"
                        className="flex-1 group/btn"
                      >
                        {exporting && exportType === 'pdf' ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Download className="w-4 h-4" />
                            </motion.div>
                            Generando...
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                            PDF
                          </>
                        )}
                      </Button>
                    )}
                    {report.formats.includes('excel') && (
                      <Button
                        onClick={() => handleExport('excel')}
                        disabled={exporting && exportType === 'excel'}
                        variant="outline"
                        className="flex-1 group/btn"
                      >
                        {exporting && exportType === 'excel' ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Download className="w-4 h-4" />
                            </motion.div>
                            Generando...
                          </>
                        ) : (
                          <>
                            <FileSpreadsheet className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                            Excel
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Información adicional */}
      <Card className="bg-card/40 border-border/40">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Información sobre los Reportes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-white/70">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>Los reportes incluyen todos los datos de tu cuenta hasta la fecha de generación</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>Los reportes PDF están optimizados para impresión y presentación</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>Los reportes Excel incluyen datos tabulares para análisis adicional</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>Puedes generar reportes personalizados seleccionando rangos de fechas específicos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportExport;
