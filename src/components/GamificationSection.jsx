import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Compass, CheckCircle2, Rocket, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const GamificationSection = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();

  const badges = [
    { icon: <Compass className="w-8 h-8" />, label: t('home.gamificationBadge1') },
    { icon: <CheckCircle2 className="w-8 h-8" />, label: t('home.gamificationBadge2') },
    { icon: <Rocket className="w-8 h-8" />, label: t('home.gamificationBadge3') },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <section id="gamification" className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t('home.gamificationTitle')}
          </h2>
          <p className="text-lg text-foreground/70">
            {t('home.gamificationSubtitle')}
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center items-center gap-8 sm:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-accent/80 to-orange-400/80 text-accent-foreground shadow-lg transform transition-transform duration-300 hover:scale-110">
                {badge.icon}
              </div>
              <p className="font-semibold text-foreground">{badge.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Button asChild size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 px-10 py-7 text-lg font-bold">
            <Link to={isLoggedIn ? "/portal" : "/login"}>
              {t('home.gamificationButton')}
              <ArrowRight className="w-5 h-5 ml-3" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GamificationSection;