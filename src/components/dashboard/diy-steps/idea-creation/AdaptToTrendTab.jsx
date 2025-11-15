import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Zap, Film, Flame } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const trends = [
  {
    icon: Zap,
    title: 'Estilo Neón Futurista',
    description: 'Iluminación vibrante, paletas de colores cyberpunk y una estética de alta tecnología.',
  },
  {
    icon: Film,
    title: 'Look Cinematográfico Vintage',
    description: 'Tonos sepia, grano de película y una composición clásica para un aire nostálgico.',
  },
  {
    icon: Flame,
    title: 'Minimalismo Elegante',
    description: 'Composiciones limpias, colores neutros y un enfoque en la simplicidad y el espacio.',
  },
];

const AdaptToTrendTab = ({ imagesUploaded }) => {
    const { toast } = useToast();

    const handleTrendClick = () => {
        toast({
            variant: "default",
            title: "🚧 ¡Función en desarrollo!",
            description: "Esta característica aún no está implementada, ¡pero puedes solicitarla en tu próximo mensaje! 🚀",
        });
    }

  if (!imagesUploaded) {
    return (
      <div className="text-center text-white/60 py-10">
        <p>Por favor, sube las dos imágenes primero para poder adaptar una tendencia.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
       <p className="text-white/80 font-semibold mb-4">2. Elige una Tendencia Visual</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trends.map((trend, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary cursor-pointer transition-all h-full"
              onClick={handleTrendClick}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <trend.icon className="w-6 h-6 text-primary" />
                  <CardTitle className="text-white text-base">{trend.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/60 text-sm">{trend.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdaptToTrendTab;