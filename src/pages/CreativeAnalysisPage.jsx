import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, BrainCircuit, CheckCircle, AlertTriangle, XCircle, ArrowRight, ArrowLeft, Users, Video, Sparkles } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';

const CreativeAnalysisPage = () => {
  const [file, setFile] = useState(null);
  const [analysisState, setAnalysisState] = useState('upload');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setAnalysisState('analyzing');
      
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => setAnalysisState('results'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    multiple: false,
  });

  const handleOptionSelect = (option) => {
    switch (option) {
      case 'diy':
        toast({
          title: "Laboratorio de IA interno",
          description: "Este módulo estará disponible como sandbox guiado dentro del portal creativo.",
        });
        break;
      case 'professional':
        navigate('/client/brief/new');
        break;
      case 'explore':
        toast({
          title: "Próximamente",
          description: "El explorador de estilos IA estará disponible pronto.",
        });
        break;
    }
  };

  const renderUploadSection = () => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white text-center text-2xl">
          🧠 Asistente de Análisis Creativo IA
        </CardTitle>
        <p className="text-white/70 text-center">
          ¿Tienes una idea en mente? Muéstranos lo que te inspira.
        </p>
      </CardHeader>
      <CardContent>
        <div {...getRootProps()} className={`w-full h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}>
          <input {...getInputProps()} />
          <Upload className="w-16 h-16 mx-auto text-white/40 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Subir Video de Referencia</h3>
          <p className="text-white/60 text-center max-w-md">
            Sube un video de referencia (puede ser un reel, TikTok, animación o pieza comercial)
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <h4 className="text-white font-semibold">⚙️ ¿Qué evaluamos por ti?</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
            <div>🎨 Estilo visual predominante (minimal, luxury, urbano, tech, etc.)</div>
            <div>📽️ Tipo de edición (velocidad, planos, transiciones)</div>
            <div>🧩 Elementos técnicos (cámara física, líquidos, 3D, partículas)</div>
            <div>🔁 Recursos requeridos (automatizable vs intervención humana)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAnalyzing = () => (
    <Card className="glass-card text-center p-8">
      <BrainCircuit className="w-16 h-16 mx-auto text-primary mb-4 animate-pulse" />
      <h3 className="text-2xl font-bold text-white mb-4">Analizando tu video...</h3>
      <p className="text-white/70 mb-6">
        Nuestra IA está evaluando estilo, técnica, efectos y complejidad
      </p>
      <Progress value={analysisProgress} className="w-full max-w-md mx-auto" />
      <p className="text-white/50 mt-2">{analysisProgress}% completado</p>
    </Card>
  );

  const renderResults = () => (
    <Card className="glass-card text-center p-8">
      <Sparkles className="w-16 h-16 mx-auto text-primary mb-4" />
      <h3 className="text-2xl font-bold text-white mb-4">Análisis Completado</h3>
      
      <div className="bg-white/5 p-6 rounded-lg border border-white/10 mb-8 text-left">
        <h4 className="text-white font-bold mb-2">✅ Resultado del análisis:</h4>
        <p className="text-white/80 mb-4">
          🎯 Tu referencia se puede lograr en un <span className="text-green-400 font-bold">70%</span> con nuestras herramientas IA.
        </p>
        <p className="text-white/70">
          Los elementos más complejos (como el movimiento de cámara realista y los reflejos en líquido) requieren intervención profesional.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-white font-semibold mb-4">¿Cómo deseas continuar?</h4>
        
        <div className="grid gap-4">
          <Button 
            onClick={() => handleOptionSelect('diy')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white p-6 h-auto"
          >
            <div className="text-left">
              <div className="font-bold">Crear yo mismo con IA</div>
              <div className="text-sm opacity-80">Usar las herramientas automatizadas disponibles</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => handleOptionSelect('professional')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white p-6 h-auto"
          >
            <div className="text-left">
              <div className="font-bold">Encargar a los expertos de ILYR.art</div>
              <div className="text-sm opacity-80">Obtener el resultado completo con nuestro equipo</div>
            </div>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => handleOptionSelect('explore')}
            className="border-white/20 text-white hover:bg-white/10 p-6 h-auto"
          >
            <div className="text-left">
              <div className="font-bold">Explorar estilos similares generables por IA</div>
              <div className="text-sm opacity-80">Ver alternativas que se pueden automatizar</div>
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0B0D12]">
      <Header />
      <main className="pt-[calc(4rem+1.5rem)] px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center flex-1"
            >
              <h1 className="text-4xl font-bold text-white mb-2">Análisis Creativo IA</h1>
              <p className="text-lg text-white/70">Descubre si tu idea es viable con IA o necesita intervención profesional</p>
            </motion.div>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={analysisState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {analysisState === 'upload' && renderUploadSection()}
              {analysisState === 'analyzing' && renderAnalyzing()}
              {analysisState === 'results' && renderResults()}
            </motion.div>
          </AnimatePresence>

          {analysisState === 'results' && (
            <div className="text-center mt-8">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setAnalysisState('upload');
                  setFile(null);
                  setAnalysisProgress(0);
                }}
                className="text-white/70 hover:text-white"
              >
                Analizar otro video
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreativeAnalysisPage;