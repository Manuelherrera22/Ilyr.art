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
      className="py-28 bg-gradient-to-b from-background via-card/20 to-background section-intro-glow"
      aria-labelledby="dashboard-title"
    >
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 
            id="dashboard-title"
            className="text-5xl md:text-6xl font-bold text-foreground mb-6" 
            dangerouslySetInnerHTML={{ __html: t('home.dashboard.title') }}
          />
          <p className="text-xl text-secondary-type max-w-4xl mx-auto">
            {t('home.dashboard.description')}
          </p>
          <div className="section-divider mt-8" aria-hidden="true"></div>
        </motion.header>

        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <ol 
            className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16 list-none"
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
                <Card className="glass-card rounded-2xl overflow-hidden shadow-lg h-full border-t-2 border-border/20 text-center focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
                  <CardHeader className="p-6">
                    <div 
                      className={`w-16 h-16 bg-gradient-to-br from-${step.color} to-${step.color}/70 rounded-xl flex items-center justify-center shadow-lg shadow-${step.color}/30 mx-auto mb-4`}
                      role="img"
                      aria-label={`Icono del paso ${index + 1}`}
                    >
                      <step.icon className="w-8 h-8 text-white" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-foreground text-lg leading-tight">
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
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 futuristic-border shadow-2xl shadow-primary/10">
              <h3 className="text-4xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: t('home.dashboard.ctaTitle') }} />
              <p className="text-secondary-type text-lg mb-10 max-w-3xl mx-auto">
                {t('home.dashboard.ctaDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" role="group" aria-label="Acciones del portal de cliente">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-primary-foreground px-12 py-6 text-xl font-bold futuristic-button pulse-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  aria-label={isLoggedIn ? "Ir al portal de cliente" : "Iniciar sesión para acceder al portal"}
                >
                  <Link to={isLoggedIn ? "/portal" : "/login"}>
                    <LogIn className="mr-3 h-6 w-6" aria-hidden="true" /> 
                    <span>{t('home.dashboard.ctaButtonAccess')}</span> 
                    <ArrowRight className="ml-3 h-6 w-6" aria-hidden="true" />
                  </Link>
                </Button>
                {!isLoggedIn && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="border-accent/50 text-accent hover:bg-accent/10 hover:border-accent px-12 py-6 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                    aria-label="Registrarse para solicitar acceso"
                  >
                    <Link to="/register">
                      <UserPlus className="mr-3 h-6 w-6" aria-hidden="true" /> 
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