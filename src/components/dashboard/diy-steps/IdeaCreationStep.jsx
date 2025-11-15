import React from 'react';
import { motion } from 'framer-motion';
import ImageUploadPreview from '@/components/dashboard/ImageUploadPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateOwnIdeaTab from './idea-creation/CreateOwnIdeaTab';
import AdaptToTrendTab from './idea-creation/AdaptToTrendTab';
import RandomGenerateTab from './idea-creation/RandomGenerateTab';

const IdeaCreationStep = ({
  sceneDescription,
  onSceneDescriptionChange,
  estilo,
  onEstiloChange,
  isSubmitting,
  onProductImageChange,
  onBackgroundImageChange,
  productImagePreviewUrl,
  backgroundImagePreviewUrl,
  productImage,
  backgroundImage,
}) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Combina tus Elementos con IA</h2>
        <p className="text-white/60 mt-2">Sube tus imágenes clave y describe cómo quieres que interactúen. La IA creará una escena coherente y cinematográfica.</p>
      </div>
      
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white/90 text-center">Imagen Principal</h3>
            <ImageUploadPreview
              onFileChange={onProductImageChange}
              title="Objeto, Logo o Personaje"
              description="Sube el elemento central de tu escena."
              initialPreviewUrl={productImagePreviewUrl}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white/90 text-center">Fondo o Contexto</h3>
            <ImageUploadPreview
              onFileChange={onBackgroundImageChange}
              title="Ambiente o Escenario"
              description="Sube la imagen que servirá de fondo."
              initialPreviewUrl={backgroundImagePreviewUrl}
            />
          </div>
        </div>
        
        <Tabs defaultValue="own-idea" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                <TabsTrigger value="own-idea" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">Crear con idea propia</TabsTrigger>
                <TabsTrigger value="trend" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">Adaptar a tendencia</TabsTrigger>
                <TabsTrigger value="random" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">Generar aleatoriamente</TabsTrigger>
            </TabsList>
            <TabsContent value="own-idea">
                <CreateOwnIdeaTab 
                    sceneDescription={sceneDescription}
                    onSceneDescriptionChange={onSceneDescriptionChange}
                    estilo={estilo}
                    onEstiloChange={onEstiloChange}
                    isSubmitting={isSubmitting}
                    productImage={productImage}
                    backgroundImage={backgroundImage}
                />
            </TabsContent>
            <TabsContent value="trend">
                <AdaptToTrendTab imagesUploaded={!!(productImage || productImagePreviewUrl) && !!(backgroundImage || backgroundImagePreviewUrl)} />
            </TabsContent>
            <TabsContent value="random">
                <RandomGenerateTab imagesUploaded={!!(productImage || productImagePreviewUrl) && !!(backgroundImage || backgroundImagePreviewUrl)} />
            </TabsContent>
        </Tabs>

      </div>
    </motion.div>
  );
};

export default IdeaCreationStep;