import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FileText, CalendarDays, Sparkles, MoveRight, ChevronDown, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleRestrictedClick = () => {
    if (!user) {
      toast({
        title: '🔒 Acceso requerido',
        description: 'Inicia sesión para compartir tu brief o solicita invitación a nuestro estudio.',
        duration: 4000,
        className: 'bg-card text-card-foreground border-accent futuristic-border',
      });
    }
  };

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient bg-pattern"
      aria-label="Sección principal de bienvenida"
    >
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" aria-hidden="true"></div>
      <div className="relative z-10 container mx-auto px-4 text-center perspective-container">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground mb-8"
            dangerouslySetInnerHTML={{ __html: t('home.heroTitle') }}
            aria-label="ILYR.art - Co-creamos junto a nuestro estudio experto"
          />
          <motion.p 
            className="text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto"
            aria-label={t('home.heroSubtitle')}
          >
            {t('home.heroSubtitle')}
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16"
            role="group"
            aria-label="Acciones principales"
          >
            <Button 
              asChild 
              size="lg" 
              onClick={handleRestrictedClick} 
              className="bg-gradient-to-r from-accent to-orange-400 text-accent-foreground px-10 py-7 text-lg font-bold pulse-glow"
              aria-label={user ? "Ir al portal de cliente" : "Iniciar sesión para crear tu brief"}
            >
              <Link to={user ? "/portal" : "/login"}>
                {user ? <FileText className="w-6 h-6 mr-3" aria-hidden="true" /> : <Lock className="w-6 h-6 mr-3" aria-hidden="true" />}
                <span>{t('home.heroExploreButton')}</span>
                <MoveRight className="w-5 h-5 ml-3" aria-hidden="true" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              onClick={handleRestrictedClick} 
              className="border-primary/50 text-primary hover:bg-primary/10 px-10 py-7 text-lg font-bold"
              aria-label={user ? "Crear nuevo brief de proyecto" : "Registrarse para agendar llamada exploratoria"}
            >
              <Link to={user ? "/client/brief/new" : "/register"}>
                {user ? <CalendarDays className="w-6 h-6 mr-3" aria-hidden="true" /> : <Lock className="w-6 h-6 mr-3" aria-hidden="true" />}
                <span>{user ? "Nuevo Brief" : t('home.heroUploadButton')}</span>
              </Link>
            </Button>
          </motion.div>
          <motion.div 
            className="flex items-center justify-center space-x-3 text-muted-foreground"
            role="note"
            aria-label="Información adicional"
          >
            <Sparkles className="w-5 h-5 text-secondary" aria-hidden="true" />
            <span>{t('home.heroSubtext')}</span>
            <Sparkles className="w-5 h-5 text-secondary" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
      <motion.button 
        onClick={scrollToHowItWorks} 
        className="absolute bottom-8 z-20 p-3 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded-full" 
        whileHover={{ scale: 2 }} 
        whileTap={{ scale: 1.8 }}
        aria-label="Desplazarse a la sección Cómo Funciona"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToHowItWorks();
          }
        }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown className="w-8 h-8 text-accent/70" aria-hidden="true" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;