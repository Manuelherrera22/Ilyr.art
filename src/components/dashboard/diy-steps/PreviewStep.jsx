import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Download, Save, Share2, Repeat, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PreviewError from '@/components/dashboard/PreviewError';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const PreviewStep = ({
  previewData,
  onBack,
  onGenerateSuggested,
  onContactSupport,
  onRequestMoreOptions,
  onDownloadImage,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    toast({
      title: '🚧 ¡Función en desarrollo!',
      description: 'Próximamente podrás guardar esto en tu Gestor de Ideas.',
    });
  };

  const handleShare = () => {
    toast({
      title: '🚧 ¡Función en desarrollo!',
      description: 'Próximamente podrás compartir tu creación en redes sociales.',
    });
  };

  const handleGoToManager = () => {
    navigate('/dashboard/activity');
  };

  if (!previewData) {
    return (
      <div className="text-white/60 flex items-center justify-center gap-2 h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-xl">Generando previsualización...</span>
      </div>
    );
  }

  if (!previewData.imagen_generada) {
    return (
      <PreviewError
        onRetry={onBack}
        onGenerateSuggested={onGenerateSuggested}
        onContactSupport={onContactSupport}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">¡Tu escena ha sido creada con éxito!</h2>
        <p className="text-white/60 mt-2 max-w-2xl mx-auto">
          La inteligencia artificial combinó tus elementos en una composición cinematográfica y única. Explora el resultado, descárgalo o guárdalo en tu Gestor de Ideas para futuras ediciones.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="aspect-video bg-black/20 rounded-xl overflow-hidden border border-white/10 shadow-lg flex items-center justify-center">
          <img src={previewData.imagen_generada} alt="Previsualización generada por IA" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="text-center mt-6 space-y-4">
        <p className="font-semibold text-white">¿Qué puedes hacer ahora?</p>
        <div className="flex justify-center flex-wrap gap-4">
          <Button onClick={onDownloadImage}><Download className="mr-2 h-4 w-4" /> Descargar imagen</Button>
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Guardar en tu proyecto</Button>
          <Button onClick={onRequestMoreOptions} variant="secondary"><RefreshCw className="mr-2 h-4 w-4" /> Generar una nueva versión</Button>
          <Button onClick={handleShare} variant="secondary"><Share2 className="mr-2 h-4 w-4" /> Compartir en redes</Button>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto mt-6">
        <Button variant="ghost" onClick={onBack}>
          <Repeat className="mr-2 h-4 w-4" />
          Probar otra combinación
        </Button>
        <Button variant="ghost" onClick={handleGoToManager}>
          <BookOpen className="mr-2 h-4 w-4" />
          Volver al Gestor de Ideas
        </Button>
      </div>
    </motion.div>
  );
};

export default PreviewStep;