import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navLinks = [
    { name: t('header.howItWorks'), sectionId: 'how-it-works' },
    { name: t('header.aiAnalysis'), path: '/analisis-creativo' },
    { name: t('header.aiModules'), sectionId: 'modules' },
    { name: t('header.plans'), sectionId: 'pricing' },
    { name: t('header.faq'), sectionId: 'faq' },
  ];

  const scrollToSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMenuOpen(false);
    }, 100);
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = isScrolled || isMenuOpen
    ? 'bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70 backdrop-blur-md'
    : 'bg-transparent';

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { delay: 0.7, duration: 0.4, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0px 0px 15px hsl(var(--accent)/0.5)" },
    tap: { scale: 0.95 }
  };

  const renderNavLinks = (isMobile = false) => navLinks.map((link) => {
    const commonProps = {
      key: link.name,
      variant: "ghost",
      className: isMobile ? 'justify-start' : 'text-sm font-medium transition-colors duration-300 text-foreground hover:text-accent'
    };

    if (link.path) {
      return (
        <Button {...commonProps} asChild>
          <Link to={link.path} onClick={() => setIsMenuOpen(false)}>{link.name}</Link>
        </Button>
      );
    }
    return (
      <Button {...commonProps} onClick={() => scrollToSection(link.sectionId)}>
        {link.name}
      </Button>
    );
  });

  return (
    <motion.header 
      className={`fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 transition-all duration-300 rounded-[var(--radius)] ${headerClasses} shadow-[4px_4px_12px_rgba(0,0,0,0.3)]`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      role="banner"
      aria-label="Navegación principal"
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[var(--header-height)] min-h-[50px]">
          <Link 
            to="/" 
            className="flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded py-[5px]"
            aria-label="Ir a la página de inicio de ILYR.art"
          >
            <img 
              src="/logo-ilyr-art.svg" 
              alt="ILYR.art Logo" 
              className="h-8 sm:h-10 md:h-[calc(var(--header-height)-10px)] w-auto max-h-[55px]"
              loading="eager"
              width="120"
              height="55"
            />
          </Link>

          <nav 
            className="hidden md:flex items-center space-x-1"
            role="navigation"
            aria-label="Navegación principal"
          >
            {renderNavLinks()}
          </nav>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <LanguageSwitcher isScrolled={isScrolled} isMenuOpen={isMenuOpen} />
            {user ? (
              <>
                <motion.div variants={buttonVariants} initial="initial" animate="animate" whileHover="hover" whileTap="tap">
                  <Button asChild variant="outline" size="sm" className="border-primary/50 text-primary hover:text-accent hover:border-accent hover:bg-accent/10">
                    <Link to="/portal"><LayoutDashboard className="mr-2 h-4 w-4" /> {t('header.dashboard')}</Link>
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} initial="initial" animate="animate" whileHover="hover" whileTap="tap">
                  <Button onClick={handleSignOut} size="sm" className="bg-gradient-to-r from-accent to-orange-500 text-accent-foreground futuristic-button pulse-glow">
                    <LogOut className="mr-2 h-4 w-4" /> {t('header.logout')}
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div variants={buttonVariants} initial="initial" animate="animate" whileHover="hover" whileTap="tap">
                  <Button asChild variant="ghost" size="sm" className="text-foreground hover:text-accent">
                    <Link to="/login"><LogIn className="mr-2 h-4 w-4" /> {t('header.login')}</Link>
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} initial="initial" animate="animate" whileHover="hover" whileTap="tap">
                  <Button asChild size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground futuristic-button pulse-glow">
                    <Link to="/register"><UserPlus className="mr-2 h-4 w-4" /> {t('header.createAccount')}</Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-foreground hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background h-9 w-9"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          exit={{ opacity: 0, height: 0 }} 
          className="md:hidden bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70 backdrop-blur-md rounded-b-[var(--radius)]"
          id="mobile-menu"
          role="navigation"
          aria-label="Menú de navegación móvil"
        >
          <nav className="flex flex-col space-y-3 px-4 py-6">
            {renderNavLinks(true)}
            <div className="pt-4 border-t border-border/20 space-y-2">
              <LanguageSwitcher isScrolled={isScrolled} isMenuOpen={isMenuOpen} />
              {user ? (
                 <>
                  <Button asChild className="w-full justify-start"><Link to="/portal"><LayoutDashboard className="mr-2 h-4 w-4" /> {t('header.dashboard')}</Link></Button>
                  <Button onClick={handleSignOut} variant="destructive" className="w-full justify-start"><LogOut className="mr-2 h-4 w-4" /> {t('header.logout')}</Button>
                 </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full justify-start"><Link to="/login"><LogIn className="mr-2 h-4 w-4" /> {t('header.login')}</Link></Button>
                  <Button asChild className="w-full justify-start"><Link to="/register"><UserPlus className="mr-2 h-4 w-4" /> {t('header.createAccount')}</Link></Button>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;