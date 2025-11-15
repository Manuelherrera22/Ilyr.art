import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Frown, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-background via-red-500/10 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.2 }}
      >
        <Frown className="w-32 h-32 text-accent mx-auto mb-8" />
      </motion.div>
      <motion.h1 
        className="text-8xl md:text-9xl font-black text-foreground mb-4"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        404
      </motion.h1>
      <motion.h2 
        className="text-2xl md:text-4xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        Página No Encontrada
      </motion.h2>
      <motion.p 
        className="text-lg text-muted-foreground max-w-md mx-auto mb-10"
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
      >
        <Link to="/">
          <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-primary-foreground futuristic-button pulse-glow">
            <Home className="mr-3 h-5 w-5" />
            Volver al Inicio
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;