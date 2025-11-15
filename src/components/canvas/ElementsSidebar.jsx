import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Type, Image as ImageIcon, Smile, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DraggableElement from './DraggableElement';

const ElementsSidebar = () => {
  const { toast } = useToast();

  const placeholderAction = (title) => {
    toast({ title: "Funcionalidad en desarrollo", description: `La sección de ${title} estará disponible pronto.` });
  };

  return (
    <aside className="w-72 flex-shrink-0 bg-[#0B0D12]/80 backdrop-blur-xl border-r border-white/10 rounded-lg p-4 flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4">Elementos IA</h2>
      <Tabs defaultValue="text" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text"><Type /></TabsTrigger>
          <TabsTrigger value="logos"><ImageIcon /></TabsTrigger>
          <TabsTrigger value="stickers"><Smile /></TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="flex-1 overflow-y-auto mt-4 custom-scrollbar pr-2">
            <h3 className="text-white font-semibold mb-2">Tipografía</h3>
            <DraggableElement type="text" text="Añadir Título" icon={Type} defaultData={{ content: 'Título Principal', fontSize: 48, fontWeight: 'bold', width: 300, height: 70 }} />
            <DraggableElement type="text" text="Añadir Subtítulo" icon={Type} defaultData={{ content: 'Subtítulo descriptivo', fontSize: 24, width: 350, height: 50 }} />
            <DraggableElement type="text" text="Añadir Párrafo" icon={Type} defaultData={{ content: 'Este es un párrafo de ejemplo para tu video. Puedes editarlo fácilmente.', fontSize: 16, width: 350, height: 100 }} />
             <div className="mt-4">
                <h3 className="text-white font-semibold mb-2">Texto con IA <Sparkles className="inline w-4 h-4 text-yellow-400"/></h3>
                <Button className="w-full" variant="outline" onClick={() => placeholderAction('Texto con IA')}>Generar Copy</Button>
            </div>
        </TabsContent>
        <TabsContent value="logos" className="flex-1 overflow-y-auto mt-4 custom-scrollbar pr-2">
            <h3 className="text-white font-semibold mb-2">Logos</h3>
            <p className="text-sm text-white/60 text-center p-4">La carga de logos estará disponible pronto.</p>
            <div className="mt-4">
                <h3 className="text-white font-semibold mb-2">BrandPack IA <Wand2 className="inline w-4 h-4 text-purple-400"/></h3>
                <Button className="w-full" variant="outline" onClick={() => placeholderAction('BrandPack IA')}>Aplicar estilo de marca</Button>
            </div>
        </TabsContent>
        <TabsContent value="stickers" className="flex-1 overflow-y-auto mt-4 custom-scrollbar pr-2">
            <h3 className="text-white font-semibold mb-2">Stickers Animados</h3>
            <p className="text-sm text-white/60 text-center p-4">La librería de stickers estará disponible pronto.</p>
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default ElementsSidebar;