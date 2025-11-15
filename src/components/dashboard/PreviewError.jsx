import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw, Wand2, MessageSquare, AlertTriangle } from 'lucide-react';

const PreviewError = ({ onRetry, onGenerateSuggested, onContactSupport }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center h-full"
    >
      <Card className="w-full max-w-2xl bg-black/20 border-destructive/50 text-white">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/20 rounded-full p-3 w-fit mb-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive">Previsualización no disponible</CardTitle>
          <CardDescription className="text-white/60">
            No pudimos mostrar la imagen generada a partir de tu idea. Esto suele suceder por una de las siguientes razones:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="text-sm text-white/70 list-disc list-inside space-y-1 pl-4 bg-white/5 p-4 rounded-lg">
            <li>La imagen que subiste no está en un formato compatible (se recomienda JPG o PNG).</li>
            <li>La descripción o prompt está vacía o no es suficientemente clara para que la IA genere contenido.</li>
            <li>El sistema de IA puede estar presentando un error temporal o intermitente.</li>
          </ul>

          <div className="space-y-2">
            <h4 className="font-semibold text-center text-white">✅ ¿Qué puedes hacer?</h4>
            <ul className="text-sm text-white/70 list-disc list-inside space-y-1 pl-4">
              <li>Asegúrate de haber subido una imagen en formato JPG o PNG.</li>
              <li>Verifica que tu descripción sea clara, creativa y suficientemente detallada.</li>
              <li>Intenta nuevamente o prueba con una idea diferente.</li>
              <li>Si el error persiste, puedes generar una idea sugerida automáticamente o contactar al equipo de soporte.</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-white/10">
            <Button onClick={onRetry} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar previsualización
            </Button>
            <Button onClick={onGenerateSuggested} variant="ghost">
              <Wand2 className="mr-2 h-4 w-4" />
              Generar idea sugerida
            </Button>
            <Button onClick={onContactSupport} variant="ghost">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contactar soporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PreviewError;