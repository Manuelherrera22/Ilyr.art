import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FileText, ClipboardCheck, ShieldCheck, MessageSquare, Download, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTranslation } from 'react-i18next';

const DashboardSection = () => {
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();

  const workflowSteps = [
    { step: "1", icon: FileText, title: t('home.dashboard.step1'), color: "primary" },
    { step: "2", icon: ClipboardCheck, title: t('home.dashboard.step2'), color: "secondary" },
    { step: "3", icon: ShieldCheck, title: t('home.dashboard.step3'), color: "accent" },
    { step: "4", icon: MessageSquare, title: t('home.dashboard.step4'), color: "purple-500" },
    { step: "5", icon: Download, title: t('home.dashboard.step5'), color: "teal-500" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } }
  };

  return (
    <section 
      id="dashboard" 
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-background via-card/20 to-background section-intro-glow"
      aria-labelledby="dashboard-title"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <h2 
            id="dashboard-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6 px-2" 
            dangerouslySetInnerHTML={{ __html: t('home.dashboard.title') }}
          />
          <p className="text-base sm:text-lg md:text-xl text-secondary-type max-w-4xl mx-auto px-4">
            {t('home.dashboard.description')}
          </p>
          <div className="section-divider mt-6 sm:mt-7 md:mt-8" aria-hidden="true"></div>
        </motion.header>

        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <ol 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-14 lg:mb-16 list-none"
            role="list"
            aria-label="Flujo de trabajo del portal de cliente"
          >
            {workflowSteps.map((step, index) => (
              <motion.li 
                key={index} 
                variants={stepVariants} 
                className="relative group"
                role="listitem"
                aria-label={`Paso ${index + 1}: ${step.title}`}
              >
                <Card className="glass-card rounded-xl sm:rounded-2xl overflow-hidden shadow-lg h-full border-t-2 border-border/20 text-center focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
                  <CardHeader className="p-4 sm:p-5 md:p-6">
                    <div 
                      className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-${step.color} to-${step.color}/70 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-${step.color}/30 mx-auto mb-3 sm:mb-4`}
                      role="img"
                      aria-label={`Icono del paso ${index + 1}`}
                    >
                      <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-foreground text-base sm:text-lg leading-tight">
                      <span className="sr-only">Paso {index + 1}: </span>
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </motion.li>
            ))}
          </ol>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 futuristic-border shadow-2xl shadow-primary/10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 px-2" dangerouslySetInnerHTML={{ __html: t('home.dashboard.ctaTitle') }} />
              <p className="text-secondary-type text-base sm:text-lg mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4">
                {t('home.dashboard.ctaDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4" role="group" aria-label="Acciones del portal de cliente">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-primary-foreground px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-bold futuristic-button pulse-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 w-full sm:w-auto"
                  aria-label={isLoggedIn ? "Ir al portal de cliente" : "Iniciar sesión para acceder al portal"}
                >
                  <Link to={isLoggedIn ? "/portal" : "/login"} className="flex items-center justify-center">
                    <LogIn className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" /> 
                    <span>{t('home.dashboard.ctaButtonAccess')}</span> 
                    <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  </Link>
                </Button>
                {!isLoggedIn && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="border-accent/50 text-accent hover:bg-accent/10 hover:border-accent px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 w-full sm:w-auto"
                    aria-label="Registrarse para solicitar acceso"
                  >
                    <Link to="/register" className="flex items-center justify-center">
                      <UserPlus className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" /> 
                      <span>{t('home.dashboard.ctaButtonCreate')}</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardSection;