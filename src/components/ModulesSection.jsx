import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Scan, Clapperboard, UserCheck, Package, TrendingUp, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const ModulesSection = () => {
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();

  const modules = [
    { icon: Scan, name: "ILYR.Preview™", description: t('home.modules.module1_desc'), color: "primary" },
    { icon: Clapperboard, name: "ILYR.Studio™", description: t('home.modules.module2_desc'), color: "secondary" },
    { icon: UserCheck, name: "ILYR.Match™", description: t('home.modules.module3_desc'), color: "accent" },
    { icon: Package, name: "ILYR.Pack™", description: t('home.modules.module4_desc'), color: "purple-500" },
    { icon: TrendingUp, name: "ILYR.Trends™", description: t('home.modules.module5_desc'), color: "teal-500" },
    { icon: LayoutDashboard, name: "ILYR.Desk™", description: t('home.modules.module6_desc'), color: "red-500" },
  ];

  return (
    <section 
      id="modules" 
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-background via-card/30 to-background section-intro-glow"
      aria-labelledby="modules-title"
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
            id="modules-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6 px-2" 
            dangerouslySetInnerHTML={{ __html: t('home.modules.title') }}
          />
          <p className="text-base sm:text-lg md:text-xl text-secondary-type max-w-3xl mx-auto px-4">
            {t('home.modules.description')}
          </p>
          <div className="section-divider mt-6 sm:mt-7 md:mt-8" aria-hidden="true"></div>
        </motion.header>

        <motion.ul 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 list-none"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          role="list"
          aria-label="Módulos de servicio ILYR.art"
        >
          {modules.map((module, index) => (
            <motion.li 
              key={index} 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              role="listitem"
              aria-label={`Módulo ${module.name}`}
            >
              <Card className="glass-card rounded-xl sm:rounded-2xl overflow-hidden h-full border-t-2 border-border/20 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
                <CardHeader className="p-4 sm:p-6 md:p-8">
                  <div 
                    className={`p-3 sm:p-3.5 md:p-4 bg-gradient-to-br from-${module.color} to-${module.color}/70 rounded-lg sm:rounded-xl shadow-lg shadow-${module.color}/30 inline-block mb-3 sm:mb-3.5 md:mb-4`}
                    role="img"
                    aria-label={`Icono de ${module.name}`}
                  >
                    <module.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle className={`text-foreground text-xl sm:text-2xl md:text-3xl tracking-tight`}>
                    {module.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8 pt-0">
                  <CardDescription className="text-secondary-type mb-4 text-sm sm:text-base">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 md:mt-20 lg:mt-28"
        >
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 futuristic-border">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 px-2" dangerouslySetInnerHTML={{ __html: t('home.modules.ctaTitle') }}>
            </h3>
            <p className="text-secondary-type text-base sm:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              {t('home.modules.ctaDescription')}
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-accent to-orange-500 text-accent-foreground futuristic-button pulse-glow px-6 sm:px-8 md:px-10 py-4 sm:py-4.5 md:py-5 text-base sm:text-lg w-full sm:w-auto">
              <Link to={isLoggedIn ? "/portal" : "/login"} className="flex items-center justify-center">
                {isLoggedIn ? <>
                  {t('home.modules.ctaButtonDashboard')}
                </> : <>
                  <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> {t('home.modules.ctaButtonLogin')}
                </>}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModulesSection;