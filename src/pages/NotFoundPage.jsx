import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Frown, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-background via-red-500/10 to-background p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.2 }}
      >
        <Frown className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 text-accent mx-auto mb-6 sm:mb-7 md:mb-8" />
      </motion.div>
      <motion.h1 
        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-foreground mb-3 sm:mb-4"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        404
      </motion.h1>
      <motion.h2 
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        Página No Encontrada
      </motion.h2>
      <motion.p 
        className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-8 sm:mb-9 md:mb-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        Parece que te has aventurado a un rincón desconocido del universo visual. No te preocupes, podemos guiarte de vuelta.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="w-full sm:w-auto"
      >
        <Link to="/" className="block w-full sm:w-auto">
          <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-primary-foreground futuristic-button pulse-glow w-full sm:w-auto px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg">
            <Home className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
            Volver al Inicio
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;