import React from 'react';
import { Button } from '@/components/ui/button';
import { Dices } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const RandomGenerateTab = ({ imagesUploaded }) => {
    const { toast } = useToast();
    
    const handleRandomClick = () => {
        toast({
            variant: "default",
            title: "🚧 ¡Función en desarrollo!",
            description: "Esta característica aún no está implementada, ¡pero puedes solicitarla en tu próximo mensaje! 🚀",
        });
    }
  return (
    <div className="mt-6 text-center py-10">
       {!imagesUploaded && (
         <p className="text-white/60 mb-6">Sube tus imágenes para que la IA genere una idea aleatoria coherente con ellas.</p>
       )}
      <Button size="lg" onClick={handleRandomClick} disabled={!imagesUploaded}>
        <Dices className="mr-2 h-5 w-5" />
        Sorpréndeme con una idea
      </Button>
      <p className="text-xs text-white/50 mt-4">La IA combinará tus imágenes con un concepto creativo inesperado.</p>
    </div>
  );
};

export default RandomGenerateTab;