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
    <section id="creative-analysis" className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full border-2 border-primary/20">
              <BrainCircuit className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-foreground mb-6">
            {t('home.creativeAnalysis.title')}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-foreground/70 mb-10">
            {t('home.creativeAnalysis.description')}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-10 py-7 text-lg font-bold pulse-glow-secondary">
              <Link to="/analisis-creativo">
                <UploadCloud className="w-6 h-6 mr-3" />
                {t('home.creativeAnalysis.button')}
                <MoveRight className="w-5 h-5 ml-3" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CreativeAnalysisSection;