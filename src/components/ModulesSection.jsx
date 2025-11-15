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
      className="py-28 bg-gradient-to-b from-background via-card/30 to-background section-intro-glow"
      aria-labelledby="modules-title"
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
            id="modules-title"
            className="text-5xl md:text-6xl font-bold text-foreground mb-6" 
            dangerouslySetInnerHTML={{ __html: t('home.modules.title') }}
          />
          <p className="text-xl text-secondary-type max-w-3xl mx-auto">
            {t('home.modules.description')}
          </p>
          <div className="section-divider mt-8" aria-hidden="true"></div>
        </motion.header>

        <motion.ul 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 list-none"
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
              <Card className="glass-card rounded-2xl overflow-hidden h-full border-t-2 border-border/20 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
                <CardHeader className="p-8">
                  <div 
                    className={`p-4 bg-gradient-to-br from-${module.color} to-${module.color}/70 rounded-xl shadow-lg shadow-${module.color}/30 inline-block mb-4`}
                    role="img"
                    aria-label={`Icono de ${module.name}`}
                  >
                    <module.icon className="w-9 h-9 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle className={`text-foreground text-3xl tracking-tight`}>
                    {module.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <CardDescription className="text-secondary-type mb-4 text-base">
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
          className="text-center mt-28"
        >
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 futuristic-border">
            <h3 className="text-4xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: t('home.modules.ctaTitle') }}>
            </h3>
            <p className="text-secondary-type text-lg mb-10 max-w-2xl mx-auto">
              {t('home.modules.ctaDescription')}
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-accent to-orange-500 text-accent-foreground futuristic-button pulse-glow">
              <Link to={isLoggedIn ? "/portal" : "/login"}>
                {isLoggedIn ? <>
                  {t('home.modules.ctaButtonDashboard')}
                </> : <>
                  <LogIn className="mr-2 h-5 w-5" /> {t('home.modules.ctaButtonLogin')}
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