import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-background z-[100]" 
    : "flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-2xl shadow-primary/40"
      >
        <Sparkles className="w-12 h-12 text-background/80" />
      </motion.div>
      <p className="mt-6 text-lg font-medium text-foreground tracking-widest animate-pulse">CARGANDO...</p>
    </div>
  );
};

export default LoadingSpinner;