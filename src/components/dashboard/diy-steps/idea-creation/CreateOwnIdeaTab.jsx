import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import SceneAssistant from '@/components/dashboard/SceneAssistant';

const CreateOwnIdeaTab = ({
  sceneDescription,
  onSceneDescriptionChange,
  estilo,
  onEstiloChange,
  isSubmitting,
  productImage,
  backgroundImage,
}) => {
  return (
    <div className="flex flex-col space-y-6 mt-6">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="scene-style" className="text-white/80 font-semibold">
          1. Estilo Visual
        </Label>
        <Input
          id="scene-style"
          value={estilo}
          onChange={(e) => onEstiloChange(e.target.value)}
          placeholder="Ej: realista futurista, anime, pintura digital"
          className="bg-white/5 border-white/20 focus:ring-primary"
          disabled={isSubmitting}
        />
        <p className="text-xs text-white/50">Describe el estilo artístico o cinematográfico que deseas.</p>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="scene-description" className="text-white/80 font-semibold">
          2. Extensión del Prompt (Opcional)
        </Label>
        <Textarea
          id="scene-description"
          value={sceneDescription}
          onChange={(e) => onSceneDescriptionChange(e.target.value)}
          placeholder="Ej: ambientado en Tokio al atardecer, luces de neón"
          className="bg-white/5 border-white/20 focus:ring-primary flex-grow resize-none"
          rows={3}
          disabled={isSubmitting}
        />
        <SceneAssistant
          description={sceneDescription}
          onDescriptionChange={onSceneDescriptionChange}
          disabled={isSubmitting}
          productImage={productImage}
          backgroundImage={backgroundImage}
        />
        <p className="text-xs text-white/50 !mt-3">
          Añade detalles sobre el ambiente, la iluminación o acciones específicas.
        </p>
      </div>
    </div>
  );
};

export default CreateOwnIdeaTab;