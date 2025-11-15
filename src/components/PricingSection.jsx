import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Check, X, Star, Zap, Cpu, Infinity as InfinityIcon, ShieldCheck, ArrowRight, TrendingUp, Users2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const PricingSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  const handleFeatureClick = (planName) => {
    toast({
      title: t('home.pricing.toast.designTitle'),
      description: t('home.pricing.toast.designDesc', { plan: planName }),
      duration: 4000,
      className: 'bg-card text-card-foreground border-primary futuristic-border',
    });
  };

  const plansData = t('home.pricing.plans', { returnObjects: true });
  const plansConfig = [
    {
      price: "Desde $400",
      period: "USD por proyecto",
      themeColor: "gray",
      icon: Cpu,
      borderColor: "border-gray-500/50",
      gradient: "from-gray-600 to-gray-700",
      buttonGradient: "from-gray-600 to-gray-700",
      features: t('home.pricing.features.explorer', { returnObjects: true }),
      featureValues: t('home.pricing.featureValues.explorer', { returnObjects: true })
    },
    {
      price: "Desde $1,200",
      period: "USD por proyecto",
      popular: true,
      themeColor: "accent",
      icon: Zap,
      borderColor: "border-accent/70",
      gradient: "from-accent to-orange-500",
      buttonGradient: "from-accent to-orange-500",
      features: t('home.pricing.features.creator', { returnObjects: true }),
      featureValues: t('home.pricing.featureValues.creator', { returnObjects: true })
    },
    {
      price: "Desde $2,500",
      period: "USD por proyecto",
      themeColor: "secondary",
      icon: Star,
      borderColor: "border-secondary/70",
      gradient: "from-secondary to-pink-500",
      buttonGradient: "from-secondary to-pink-500",
      features: t('home.pricing.features.studio', { returnObjects: true }),
      featureValues: t('home.pricing.featureValues.studio', { returnObjects: true })
    },
    {
      price: "A Medida",
      period: "",
      themeColor: "primary",
      icon: ShieldCheck,
      borderColor: "border-primary/70",
      gradient: "from-primary to-blue-500",
      buttonGradient: "from-primary to-blue-500",
      features: t('home.pricing.features.enterprise', { returnObjects: true }),
      featureValues: t('home.pricing.featureValues.enterprise', { returnObjects: true })
    }
  ];

  const plans = plansData.map((plan, index) => ({
    ...plan,
    ...plansConfig[index]
  }));
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = (popular) => ({
    hidden: { opacity: 0, y: 50, scale: popular ? 0.98 : 0.95, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: popular ? 1.03 : 1,
      filter: 'blur(0px)',
      transition: { type: "spring", stiffness: 40, damping: 12 }
    }
  });

  const getThemeClasses = (plan) => {
    const themeMap = {
      gray: {
        text: "text-gray-400",
        bg: "bg-gray-600",
        border: "border-gray-500/50",
        ring: "ring-gray-500/80",
        shadow: "shadow-gray-500/30"
      },
      accent: {
        text: "text-accent",
        bg: "bg-accent",
        border: "border-accent/70",
        ring: "ring-accent/80",
        shadow: "shadow-accent/30"
      },
      secondary: {
        text: "text-secondary",
        bg: "bg-secondary",
        border: "border-secondary/70",
        ring: "ring-secondary/80",
        shadow: "shadow-secondary/30"
      },
      primary: {
        text: "text-primary",
        bg: "bg-primary",
        border: "border-primary/70",
        ring: "ring-primary/80",
        shadow: "shadow-primary/30"
      }
    };
    return themeMap[plan.themeColor] || themeMap.accent;
  };

  return (
    <section 
      id="pricing" 
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-background via-card/30 to-background section-intro-glow"
      aria-labelledby="pricing-title"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <h2 
            id="pricing-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6 animate-text-focus-in px-2" 
            dangerouslySetInnerHTML={{ __html: t('home.pricing.title') }}
          />
          <p className="text-base sm:text-lg md:text-xl text-secondary-type max-w-3xl mx-auto px-4">
            {t('home.pricing.description')}
          </p>
          <div className="section-divider mt-6 sm:mt-7 md:mt-8" aria-hidden="true"></div>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          role="list"
          aria-label="Planes de precios disponibles"
        >
          {plans.map((plan, index) => {
            const themeClasses = getThemeClasses(plan);
            const isComingSoon = plan.price === t('home.pricing.comingSoon');
            const isCustom = plan.price === "Custom";
            
            return (
              <motion.li
                key={index}
                variants={cardVariants(plan.popular)}
                className={`relative flex ${plan.popular ? 'z-10 lg:scale-105' : ''} group perspective-container list-none`}
                role="listitem"
                aria-label={`Plan ${plan.name}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 md:-top-5 left-1/2 transform -translate-x-1/2 z-20" aria-label="Plan más popular">
                    <div className={`bg-gradient-to-r ${plan.gradient} text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center shadow-lg tracking-wider`}>
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2 fill-current" aria-hidden="true" />
                      {t('home.pricing.mostPopular')}
                    </div>
                  </div>
                )}
              
                <Card className={`glass-card rounded-2xl flex flex-col h-full w-full ${plan.popular ? `ring-2 ${themeClasses.ring} shadow-2xl ${themeClasses.shadow}` : 'shadow-xl shadow-primary/15'} ${plan.borderColor} border-t-4 perspective-element focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2`}>
                  <CardHeader className="text-center p-4 sm:p-6 md:p-8 pb-4 sm:pb-5 md:pb-6">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: plan.popular ? 3 : -3 }}
                      className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br ${plan.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      role="img"
                      aria-label={`Icono del plan ${plan.name}`}
                      style={{ minHeight: '64px' }}
                    >
                      <plan.icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" aria-hidden="true" style={{ height: '32px', width: '32px' }} />
                    </motion.div>
                    <CardTitle className="text-2xl sm:text-2xl md:text-3xl font-bold text-foreground group-hover:opacity-90 transition-colors duration-300 mb-3">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-secondary-type mb-4 sm:mb-5 min-h-[3rem] text-xs sm:text-sm px-2 leading-relaxed">
                      {plan.description}
                    </CardDescription>
                    <div className="text-center my-5 sm:my-6 min-h-[60px] sm:min-h-[70px] flex flex-col items-center justify-center">
                      {isComingSoon ? (
                        <span className={`text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${plan.gradient}`}>
                          {plan.price}
                        </span>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className={`text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.gradient} leading-tight`}>
                            {isCustom ? t('home.pricing.customSolution') : plan.price}
                          </span>
                          {plan.period && (
                            <span className="text-muted-foreground text-xs sm:text-sm leading-tight">{plan.period}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                
                  <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 flex-grow flex flex-col justify-between">
                    <ul className="space-y-3 sm:space-y-3.5 md:space-y-4 min-h-[240px] sm:min-h-[260px] md:min-h-[280px] pb-2 sm:pb-3 md:pb-4" role="list" aria-label={`Características del plan ${plan.name}`}>
                      {plan.features.map((feature, featureIndex) => {
                        const value = plan.featureValues[featureIndex];
                        const included = value !== false;
                        const isInfinity = value === "Ilimitadas" || value === "infinitas";
                        const displayValue = isInfinity ? (
                          <span className={`ml-1.5 font-semibold ${themeClasses.text}`}>Ilimitadas</span>
                        ) : (typeof value === 'boolean' ? null : value);

                        return (
                          <li key={featureIndex} className="flex items-start text-xs sm:text-sm min-h-[24px] sm:min-h-[28px] leading-relaxed" role="listitem">
                            {included ? (
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2.5 sm:mr-3 flex-shrink-0 mt-0.5" aria-label="Incluido" />
                            ) : (
                              <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400/60 mr-2.5 sm:mr-3 flex-shrink-0 mt-0.5" aria-label="No incluido" />
                            )}
                            <div className="flex-1 flex items-start flex-wrap gap-1">
                              <span className={`text-foreground/80 ${!included && 'opacity-50 line-through'}`}>
                                {feature}
                                {displayValue && typeof displayValue !== 'object' && !isInfinity && ': '}
                              </span>
                              {displayValue && typeof displayValue === 'object' ? (
                                displayValue
                              ) : displayValue && !isInfinity && (
                                <span className={`font-medium ${included ? themeClasses.text : 'text-foreground/50'}`}>
                                  {displayValue}
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  
                    <div className="pt-4 sm:pt-6 md:pt-8 border-t border-border/20 mt-auto">
                      <Button 
                        onClick={() => {
                          if (plan.name === "Starter" || plan.name === "Enterprise") {
                            // Para Starter y Enterprise, redirigir al brief o contacto
                            if (plan.name === "Starter") {
                              window.location.href = isLoggedIn ? "/client/brief/new" : "/register";
                            } else {
                              // Enterprise: contactar ventas
                              window.location.href = "mailto:sales@ilyr.art?subject=Solicitud Enterprise";
                            }
                          } else {
                            handleFeatureClick(plan.name);
                          }
                        }}
                        size="lg"
                        className={`w-full bg-gradient-to-r ${plan.buttonGradient} hover:opacity-90 text-white py-3 sm:py-3.5 md:py-4 font-bold text-sm sm:text-base md:text-lg futuristic-button pulse-glow shadow-xl group-hover:brightness-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2`}
                        aria-label={`${plan.buttonText} para el plan ${plan.name}`}
                      >
                        <span className="whitespace-nowrap">{plan.buttonText}</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1 inline-block flex-shrink-0" aria-hidden="true" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.li>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 md:mt-20 lg:mt-28"
        >
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-foreground futuristic-border shadow-2xl shadow-primary/10">
            <div className="flex justify-center items-center space-x-2 sm:space-x-3 md:space-x-4 mb-6 sm:mb-7 md:mb-8" role="img" aria-label="Iconos de características">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent" aria-hidden="true" />
              <Users2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-secondary" aria-hidden="true" />
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 px-2" dangerouslySetInnerHTML={{ __html: t('home.pricing.ctaTitle') }} />
            <p className="text-secondary-type text-base sm:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              {t('home.pricing.ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 justify-center px-4" role="group" aria-label="Acciones de contacto">
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-accent/70 text-accent hover:bg-accent/10 hover:text-accent hover:border-accent px-6 sm:px-8 md:px-10 py-4 sm:py-4.5 md:py-5 text-base sm:text-lg futuristic-button futuristic-border shadow-lg hover:shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 w-full sm:w-auto"
                aria-label="Comparar planes detalladamente"
              >
                <Link to={isLoggedIn ? "/client" : "/portal"}>
                  {isLoggedIn ? "Ver Mis Proyectos" : t('home.pricing.ctaButtonCompare')}
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-blue-500 hover:shadow-primary/40 text-primary-foreground px-6 sm:px-8 md:px-10 py-4 sm:py-4.5 md:py-5 text-base sm:text-lg futuristic-button pulse-glow shadow-xl shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 w-full sm:w-auto"
                aria-label="Hablar con un especialista"
              >
                <Link to={isLoggedIn ? "/client/brief/new" : "/register"}>
                  {isLoggedIn ? "Crear Brief" : t('home.pricing.ctaButtonContact')}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
