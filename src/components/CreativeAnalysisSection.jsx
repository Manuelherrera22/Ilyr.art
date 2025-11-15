import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BrainCircuit, UploadCloud, MoveRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CreativeAnalysisSection = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section id="creative-analysis" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-4 sm:mb-5 md:mb-6">
            <div className="p-3 sm:p-3.5 md:p-4 bg-primary/10 rounded-full border-2 border-primary/20">
              <BrainCircuit className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-primary" />
            </div>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 sm:mb-5 md:mb-6 px-2">
            {t('home.creativeAnalysis.title')}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-foreground/70 mb-6 sm:mb-8 md:mb-10 px-4">
            {t('home.creativeAnalysis.description')}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 lg:py-7 text-base sm:text-lg font-bold pulse-glow-secondary w-full sm:w-auto">
              <Link to="/analisis-creativo" className="flex items-center justify-center">
                <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                {t('home.creativeAnalysis.button')}
                <MoveRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CreativeAnalysisSection;