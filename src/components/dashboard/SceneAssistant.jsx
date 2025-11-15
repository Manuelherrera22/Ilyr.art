import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { refinarPromptConImagenes } from '@/services/api/ideas';

const SceneAssistant = ({
  description,
  onDescriptionChange,
  disabled,
  productImage,
  backgroundImage,
}) => {
  const [isRefining, setIsRefining] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const canRefine = productImage && backgroundImage && description.trim() !== '';

  const handleRefine = async () => {
    if (!canRefine) {
      toast({
        variant: 'destructive',
        title: 'Faltan datos',
        description: 'Debes subir dos imágenes y añadir una descripción para poder usar el asistente.',
      });
      return;
    }

    setIsRefining(true);
    try {
      const refinePayload = {
        productImage,
        backgroundImage,
        sceneDescription: description,
      };
      const refinedPrompt = await refinarPromptConImagenes(refinePayload, session);
      onDescriptionChange(refinedPrompt);
      toast({
        title: '¡Prompt Refinado!',
        description: 'Hemos mejorado tu idea con la magia de la IA.',
        className: 'bg-green-500 text-white',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error al Refinar',
        description: err.message || 'No se pudo conectar con el asistente de IA.',
      });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="text-primary hover:text-primary hover:bg-primary/10 mt-2"
      onClick={handleRefine}
      disabled={disabled || isRefining || !canRefine}
    >
      {isRefining ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      {isRefining ? 'Refinando...' : 'Refinar con Asistente IA'}
    </Button>
  );
};

export default SceneAssistant;