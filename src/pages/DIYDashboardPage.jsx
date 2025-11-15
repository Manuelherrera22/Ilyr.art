import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, Upload, Eye, Video, Brush, Send } from 'lucide-react';
import { previsualizarIdea, deleteIdea, loadIdea, editarIdea } from '@/services/api/ideas';
import IdeaCreationStep from '@/components/dashboard/diy-steps/IdeaCreationStep';
import PreviewStep from '@/components/dashboard/diy-steps/PreviewStep';
import PlaceholderStep from '@/components/dashboard/diy-steps/PlaceholderStep';
import PromptPreviewModal from '@/components/dashboard/PromptPreviewModal';

const steps = [
  { name: 'Idea', icon: Upload, component: IdeaCreationStep },
  { name: 'Previsualiza', icon: Eye, component: PreviewStep },
  { name: 'Video', icon: Video, component: PlaceholderStep, description: 'Aquí se generará el video animado.' },
  { name: 'Canvas', icon: Brush, component: PlaceholderStep, description: 'Aquí personalizarás tu video con elementos gráficos.' },
  { name: 'Exporta', icon: Send, component: PlaceholderStep, description: 'Aquí exportarás tu creación final para el mundo.' },
];

const DIYDashboardPage = ({ setHeaderStep }) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState({});
  const [previewData, setPreviewData] = useState(null);
  
  const [sceneDescription, setSceneDescription] = useState('');
  const [estilo, setEstilo] = useState('realista futurista');
  const [productImage, setProductImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [productImagePreviewUrl, setProductImagePreviewUrl] = useState(null);
  const [backgroundImagePreviewUrl, setBackgroundImagePreviewUrl] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [isLoadingIdea, setIsLoadingIdea] = useState(false);

  const [isPromptPreviewOpen, setIsPromptPreviewOpen] = useState(false);

  useEffect(() => {
    const ideaId = searchParams.get('ideaId');
    if (ideaId && session) {
      handleLoadIdea(ideaId);
    }
  }, [searchParams, session]);

  useEffect(() => {
    setHeaderStep(steps[currentStep].name, currentStep + 1, steps.length);
  }, [currentStep, setHeaderStep]);

  const handleLoadIdea = async (ideaId) => {
    setIsLoadingIdea(true);
    toast({ title: 'Cargando idea...', description: 'Estamos recuperando tu creación anterior.' });
    try {
      const idea = await loadIdea(ideaId, session);
      
      setSceneDescription(idea.prompt_ia || '');
      setEstilo(idea.estilo_ia || 'realista futurista');
      setProjectData({ ideaId: idea.id });
      const productImageUrl = idea.imagen_producto || null;
      const backgroundImageUrl = idea.imagen_ambiente || null;
      setProductImagePreviewUrl(productImageUrl);
      setBackgroundImagePreviewUrl(backgroundImageUrl);
      
      toast({ title: '¡Idea cargada!', description: 'Puedes continuar editando.', className: 'bg-green-500 text-white' });
    } catch (err) {
      console.error('❌ Error capturado en handleLoadIdea en la página:', err);
      toast({ variant: 'destructive', title: 'Error al cargar la idea', description: err.message });
      setSearchParams({});
    } finally {
      setIsLoadingIdea(false);
    }
  };

  const handleProductImageChange = (file) => {
    setProductImage(file);
    if(file) {
      setProductImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setProductImagePreviewUrl(null);
    }
  };

  const handleBackgroundImageChange = (file) => {
    setBackgroundImage(file);
    if(file) {
      setBackgroundImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setBackgroundImagePreviewUrl(null);
    }
  };

  const handleAttemptNext = () => {
    if (!productImage && !productImagePreviewUrl) {
        toast({ variant: 'destructive', title: 'Imagen Principal Requerida', description: 'Por favor, sube la imagen principal para continuar.' });
        return;
    }
    if (!backgroundImage && !backgroundImagePreviewUrl) {
        toast({ variant: 'destructive', title: 'Imagen de Fondo Requerida', description: 'Por favor, sube la imagen de fondo para continuar.' });
        return;
    }

    if (!estilo.trim()) {
        toast({ variant: 'destructive', title: 'Estilo Visual Requerido', description: 'Por favor, define un estilo visual para tu escena.' });
        return;
    }

    setIsPromptPreviewOpen(true);
  };

  const handleGenerateWithPrompt = async (finalPrompt) => {
    setIsPromptPreviewOpen(false);
    setIsSubmitting(true);
    try {
      const ideaPayload = {
        sceneDescription: finalPrompt,
        estilo,
        productImage,
        backgroundImage,
        productImagePreviewUrl,
        backgroundImagePreviewUrl,
      };
      const responseData = await previsualizarIdea(ideaPayload, session);
      setPreviewData(responseData);
      setProjectData(prev => ({ ...prev, ideaId: responseData.ideaId }));
      toast({ title: '¡Previsualización lista!', description: 'Tu idea ha sido generada.', className: 'bg-green-500 text-white' });
      setCurrentStep(1);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error en la previsualización', description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      handleAttemptNext();
    } else if (currentStep === 1) {
      setIsSubmitting(true);
      try {
        await editarIdea(projectData.ideaId, { estado: 'confirmada' }, session);
        toast({ title: '¡Versión confirmada!', description: 'Preparando el editor de video...' });
        setCurrentStep(prev => prev + 1);
      } catch (err) {
        toast({ variant: 'destructive', title: 'Error al confirmar', description: 'No se pudo guardar el cambio de estado.' });
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({ title: '¡Proyecto completado!', description: 'Próximamente podrás exportar tu video.' });
      navigate('/dashboard/activity');
    }
  };

  const handleBack = async () => {
    if (currentStep === 1 && projectData.ideaId) {
      setIsDiscarding(true);
      try {
        await deleteIdea(projectData.ideaId, session);
        toast({ title: 'Idea descartada', description: 'Vuelve a generar una nueva idea.' });
        setPreviewData(null);
        setProjectData(prev => {
            const { ideaId, ...rest } = prev;
            return rest;
        });

      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } finally {
        setIsDiscarding(false);
      }
    }
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleDownloadImage = () => {
    if (!previewData?.imagen_generada) return;
    const link = document.createElement('a');
    link.href = previewData.imagen_generada;
    link.download = `preview-${projectData?.ideaId || Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Descarga iniciada' });
  };

  const showFooter = !(currentStep === 1 && previewData && !previewData.imagen_generada);
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <>
      <PromptPreviewModal
        isOpen={isPromptPreviewOpen}
        onOpenChange={setIsPromptPreviewOpen}
        initialPrompt={sceneDescription}
        onConfirm={handleGenerateWithPrompt}
      />
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-background/30 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 min-h-[400px] sm:min-h-[500px] flex flex-col relative">
          {isLoadingIdea && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
              <div className="text-white flex items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-xl">Cargando idea...</span>
              </div>
            </div>
          )}
          <div className="flex-grow">
            <CurrentStepComponent
              {...{
                sceneDescription,
                onSceneDescriptionChange: setSceneDescription,
                estilo,
                onEstiloChange: setEstilo,
                onProductImageChange: handleProductImageChange,
                onBackgroundImageChange: handleBackgroundImageChange,
                productImagePreviewUrl,
                backgroundImagePreviewUrl,
                productImage,
                backgroundImage,
                previewData,
                projectData,
                isSubmitting,
                onDownloadImage: handleDownloadImage,
                onRequestMoreOptions: () => {
                  toast({ title: 'Generando nueva versión...', description: 'Espera un momento.' });
                  handleBack().then(() => handleAttemptNext());
                },
                onGenerateSuggested: () => toast({ title: 'Función en desarrollo', description: 'Próximamente podrás generar ideas sugeridas.' }),
                onContactSupport: () => toast({ title: 'Soporte', description: 'Próximamente podrás contactar a soporte.' }),
                onBack: handleBack,
                title: steps[currentStep].name,
                description: steps[currentStep].description,
              }}
            />
          </div>
          {showFooter && (
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-6 sm:mt-8 md:mt-12 pt-4 sm:pt-5 md:pt-6 border-t border-white/10">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isSubmitting || isDiscarding} className="w-full sm:w-auto text-sm sm:text-base">
                {isDiscarding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <span className="whitespace-nowrap">{currentStep === 1 ? 'Descartar y Volver' : 'Atrás'}</span>
              </Button>
              <Button onClick={handleNext} disabled={isSubmitting || isLoadingIdea || (currentStep === 1 && !previewData?.imagen_generada)} className="bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] min-w-[140px] w-full sm:w-auto text-sm sm:text-base">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <span className="whitespace-nowrap">{isSubmitting ? 'Procesando...' : (currentStep === 0 ? 'Analizar y Continuar' : (currentStep === 1 ? 'Crear video con esta versión' : (currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente')))}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DIYDashboardPage;