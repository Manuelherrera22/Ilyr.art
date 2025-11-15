import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const AnnouncementBanner = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó el popup
    const hasAccepted = localStorage.getItem('ilyr-art-evolution-accepted');
    if (!hasAccepted) {
      // Pequeño delay para mejor UX
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  }, []);

  const handleAccept = () => {
    // Guardar en localStorage
    localStorage.setItem('ilyr-art-evolution-accepted', 'true');
    
    // Animación de cierre
    setIsOpen(false);
    
    // Restaurar scroll después de la animación
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 300);
  };

  // Bloquear scroll cuando el popup está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro que bloquea interacción */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleAccept}
            aria-hidden="true"
          />
          
          {/* Popup modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-title"
            aria-describedby="announcement-description"
          >
            <div 
              className="bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground rounded-[var(--radius)] p-6 sm:p-7 md:p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-primary-foreground/20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón de cerrar (opcional, pero mejor UX) */}
              <button
                onClick={handleAccept}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary rounded"
                aria-label="Cerrar popup"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Contenido */}
              <div className="text-center space-y-4 sm:space-y-5 md:space-y-6">
                <h3 
                  id="announcement-title"
                  className="font-bold text-xl sm:text-2xl md:text-3xl px-2"
                >
                  ¡ILYR.art evoluciona!
                </h3>
                
                <p 
                  id="announcement-description"
                  className="text-sm sm:text-base md:text-lg opacity-95 leading-relaxed px-2"
                >
                  Para una experiencia más profesional, hemos separado la zona pública de las herramientas creativas. ¡Inicia sesión para explorar tu dashboard!
                </p>
                
                <div className="pt-2 sm:pt-3 md:pt-4">
                  <Button
                    onClick={handleAccept}
                    className="bg-white text-black hover:bg-white/90 font-semibold px-6 sm:px-7 md:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg rounded-[var(--radius)] shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                    aria-label="Continuar"
                  >
                    CONTINUAR
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBanner;