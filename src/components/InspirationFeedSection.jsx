import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const InspirationFeedSection = () => {
  const { t } = useTranslation();

  const cardVariants = {
    offscreen: {
      y: 100,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <section id="inspiration-feed" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-background/70">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-foreground px-2">
            {t('home.inspirationFeedTitle')}
          </h2>
          <p className="text-base sm:text-lg text-foreground/70 max-w-3xl mx-auto px-4">
            {t('home.inspirationFeedSubtitle')}
          </p>
        </motion.div>

        <div className="relative h-[300px] sm:h-[350px] md:h-[400px] flex items-center justify-center overflow-visible px-4">
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ 
              scale: 1.1, 
              rotate: -6,
              zIndex: 20,
              transition: { duration: 0.3 }
            }}
            className="absolute w-48 h-60 sm:w-56 sm:h-72 md:w-64 md:h-80 bg-card rounded-xl sm:rounded-2xl shadow-2xl transform -rotate-12 -translate-x-16 sm:-translate-x-24 md:-translate-x-32 cursor-pointer group overflow-hidden hidden sm:block"
          >
            <div className="relative w-full h-full">
              <motion.img 
                alt="Abstract visual art" 
                className="w-full h-full object-cover rounded-2xl" 
                src="https://images.unsplash.com/photo-1544227520-4e6d6b702673"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                initial={false}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                initial={false}
              />
              <motion.div
                className="absolute inset-0 shadow-[0_0_40px_rgba(255,60,172,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                initial={false}
              />
            </div>
          </motion.div>
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5, delay: 0.2 }}
            whileHover={{ 
              scale: 1.15, 
              zIndex: 30,
              transition: { duration: 0.3 }
            }}
            className="absolute w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 bg-card rounded-xl sm:rounded-2xl shadow-2xl z-10 cursor-pointer group overflow-hidden"
          >
            <div className="relative w-full h-full">
              <motion.img 
                alt="Product visualization in a futuristic setting" 
                className="w-full h-full object-cover rounded-2xl" 
                src="https://images.unsplash.com/photo-1678500877233-5526d9b29c4d"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                initial={false}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                initial={false}
              />
              <motion.div
                className="absolute inset-0 shadow-[0_0_50px_rgba(255,60,172,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                initial={false}
              />
            </div>
          </motion.div>
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5, delay: 0.4 }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 6,
              zIndex: 20,
              transition: { duration: 0.3 }
            }}
            className="absolute w-48 h-60 sm:w-56 sm:h-72 md:w-64 md:h-80 bg-card rounded-xl sm:rounded-2xl shadow-2xl transform rotate-12 translate-x-16 sm:translate-x-24 md:translate-x-32 cursor-pointer group overflow-hidden hidden sm:block"
          >
            <div className="relative w-full h-full">
              <motion.img 
                alt="Cinematic character render" 
                className="w-full h-full object-cover rounded-2xl" 
                src="https://images.unsplash.com/photo-1662796653457-8721078fd863"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                initial={false}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                initial={false}
              />
              <motion.div
                className="absolute inset-0 shadow-[0_0_40px_rgba(255,60,172,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                initial={false}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mt-10 sm:mt-12 md:mt-14 lg:mt-16"
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg font-bold pulse-glow w-full sm:w-auto">
            <Link to="/portal" className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              {t('home.inspirationFeedButton')}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default InspirationFeedSection;