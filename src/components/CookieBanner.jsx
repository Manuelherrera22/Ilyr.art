import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Cookie, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Siempre activas
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Verificar si el usuario ya ha aceptado/rechazado cookies
    const cookieConsent = localStorage.getItem('ilyr-art-cookie-consent');
    if (!cookieConsent) {
      // Esperar un poco antes de mostrar el banner para mejor UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Cargar preferencias guardadas
      try {
        const savedPreferences = JSON.parse(cookieConsent);
        setCookiePreferences(savedPreferences);
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('ilyr-art-cookie-consent', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setCookiePreferences(onlyNecessary);
    localStorage.setItem('ilyr-art-cookie-consent', JSON.stringify(onlyNecessary));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('ilyr-art-cookie-consent', JSON.stringify(cookiePreferences));
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleTogglePreference = (type) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            onClick={() => !showSettings && setIsVisible(false)}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[100] bg-gradient-to-r from-[#0B0D12] via-[#0B0D12] to-[#0B0D12] border-t-2 border-primary/50 shadow-2xl"
          >
            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
              {!showSettings ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 flex items-start gap-2 sm:gap-3 md:gap-4 min-w-0">
                    <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                      <Cookie className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2">
                        Utilizamos cookies
                      </h3>
                      <p className="text-[11px] sm:text-xs md:text-sm text-white/70 leading-relaxed">
                        Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido. 
                        Al hacer clic en "Aceptar todas", aceptas nuestro uso de cookies.{' '}
                        <Link 
                          to="/cookie-policy" 
                          className="text-primary hover:text-primary/80 underline underline-offset-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Más información
                        </Link>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 md:gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettings(true)}
                      className="w-full sm:w-auto text-[11px] sm:text-xs md:text-sm border-white/20 text-white hover:bg-white/10 py-2 sm:py-2.5"
                    >
                      <Settings className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1 sm:mr-1.5 md:mr-2" />
                      <span className="whitespace-nowrap">Personalizar</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRejectAll}
                      className="w-full sm:w-auto text-[11px] sm:text-xs md:text-sm border-white/20 text-white hover:bg-white/10 py-2 sm:py-2.5"
                    >
                      <span className="whitespace-nowrap">Rechazar</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAcceptAll}
                      className="w-full sm:w-auto text-[11px] sm:text-xs md:text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 py-2 sm:py-2.5"
                    >
                      <span className="whitespace-nowrap">Aceptar todas</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                      <span className="truncate">Preferencias de cookies</span>
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSettings(false)}
                      className="text-white/70 hover:text-white hover:bg-white/10 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {/* Necessary Cookies - Always On */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4 p-2.5 sm:p-3 md:p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white mb-1">
                          Cookies necesarias
                        </h4>
                        <p className="text-[10px] sm:text-xs md:text-sm text-white/60 leading-relaxed">
                          Estas cookies son esenciales para el funcionamiento del sitio web y no se pueden desactivar.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full bg-primary cursor-not-allowed opacity-50">
                          <span className="inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 translate-x-4 sm:translate-x-6 transform rounded-full bg-white transition" />
                        </div>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4 p-2.5 sm:p-3 md:p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white mb-1">
                          Cookies de análisis
                        </h4>
                        <p className="text-[10px] sm:text-xs md:text-sm text-white/60 leading-relaxed">
                          Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web recopilando información de forma anónima.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTogglePreference('analytics')}
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-[#0B0D12] ${
                            cookiePreferences.analytics ? 'bg-primary' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              cookiePreferences.analytics ? 'translate-x-4 sm:translate-x-6' : 'translate-x-0.5 sm:translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4 p-2.5 sm:p-3 md:p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white mb-1">
                          Cookies de marketing
                        </h4>
                        <p className="text-[10px] sm:text-xs md:text-sm text-white/60 leading-relaxed">
                          Se utilizan para hacer un seguimiento de los visitantes a través de diferentes sitios web con la intención de mostrar anuncios relevantes.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTogglePreference('marketing')}
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-[#0B0D12] ${
                            cookiePreferences.marketing ? 'bg-primary' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              cookiePreferences.marketing ? 'translate-x-4 sm:translate-x-6' : 'translate-x-0.5 sm:translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2 md:gap-3 pt-2 sm:pt-3 border-t border-white/10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="w-full sm:w-auto text-[11px] sm:text-xs md:text-sm border-white/20 text-white hover:bg-white/10 py-2 sm:py-2.5"
                    >
                      <span className="whitespace-nowrap">Cancelar</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSavePreferences}
                      className="w-full sm:w-auto text-[11px] sm:text-xs md:text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 py-2 sm:py-2.5"
                    >
                      <span className="whitespace-nowrap">Guardar preferencias</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;

