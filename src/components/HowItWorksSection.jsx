import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Radar, ClipboardCheck, Users, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HowItWorksSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Lightbulb className="w-10 h-10" />,
      title: t('home.step1Title'),
      description: t('home.step1Description'),
    },
    {
      icon: <Radar className="w-10 h-10" />,
      title: t('home.step2Title'),
      description: t('home.step2Description'),
    },
    {
      icon: <ClipboardCheck className="w-10 h-10" />,
      title: t('home.step3Title'),
      description: t('home.step3Description'),
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: t('home.step4Title'),
      description: t('home.step4Description'),
    },
    {
      icon: <Rocket className="w-10 h-10" />,
      title: t('home.step5Title'),
      description: t('home.step5Description'),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section 
      id="how-it-works" 
      className="py-20 sm:py-32 bg-background"
      aria-labelledby="how-it-works-title"
    >
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 
            id="how-it-works-title"
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
          >
            {t('home.howItWorksTitle')}
          </h2>
          <p className="text-lg text-foreground/70">
            {t('home.howItWorksSubtitle')}
          </p>
        </motion.header>

        <motion.ol
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 list-none"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          role="list"
          aria-label="Proceso de trabajo en 5 pasos"
        >
          {steps.map((step, index) => (
            <motion.li 
              key={index} 
              variants={itemVariants}
              role="listitem"
              aria-label={`Paso ${index + 1}: ${step.title}`}
            >
              <Card className="h-full text-center bg-card/50 border-primary/10 hover:border-primary/30 hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-2 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
                <CardHeader>
                  <div 
                    className="mx-auto w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg"
                    role="img"
                    aria-label={`Icono del paso ${index + 1}`}
                  >
                    {step.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    <span className="sr-only">Paso {index + 1}: </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">{step.description}</p>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
};

export default HowItWorksSection;