import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Upload, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoAnalysisCard = () => {
  return (
    <motion.div
      className="col-span-2 row-span-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card className="h-full bg-gradient-to-r from-[#1A1F71]/80 to-[#FF3CAC]/60 border border-[#FF3CAC]/30 backdrop-blur-xl shadow-2xl hover:shadow-[#1A1F71]/30 transition-all duration-500 cursor-pointer group">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-2 flex items-center">
                  🧠 Análisis Creativo IA
                  <Sparkles className="w-6 h-6 ml-2 text-yellow-300" />
                </CardTitle>
                <p className="text-white/80 text-lg">Sube un video de referencia y descubre si puedes crearlo con IA o necesitas ayuda profesional</p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white/80 text-sm">Análisis de estilo visual</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/80 text-sm">Evaluación de complejidad</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-white/80 text-sm">Recomendación inteligente</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span className="text-white/80 text-sm">Hoja de ruta clara</span>
              </div>
            </div>
          </div>
          
          <Button 
            asChild
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 transition-all duration-300 group-hover:scale-105"
            size="lg"
          >
            <Link to="/analisis-creativo">
              <Upload className="w-5 h-5 mr-2" />
              Analizar mi Video de Referencia
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VideoAnalysisCard;