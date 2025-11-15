import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Building2, UserCheck, Zap, Clock, Target, Users, Palette, Rocket, Brain, Lightbulb, BarChart3, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AgenciesFreelancersSection = () => {
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Funcionalidad en desarrollo",
      description: `Estamos perfeccionando esta área. ¡Gracias por tu interés en ${feature}! 🚀`,
      duration: 4000,
      className: 'bg-card text-card-foreground border-primary futuristic-border',
    });
  };

  const agencyFeatures = [
    { icon: Clock, title: "Preproducción Ultra-Rápida", description: "Visualiza conceptos complejos en minutos, no días. IA que acelera la creatividad." },
    { icon: BarChart3, title: "Impacto Exponencial en Clientes", description: "Presenta ideas con visualizaciones profesionales que impresionan, convencen y cierran tratos." },
    { icon: Brain, title: "Innovación Constante", description: "Diferénciate con propuestas visuales de vanguardia. Adopta la IA como tu socio estratégico." },
    { icon: Briefcase, title: "Flujos de Trabajo Optimizados", description: "Reduce iteraciones y agiliza aprobaciones con una claridad visual sin precedentes. Más eficiencia, más proyectos." }
  ];

  const freelancerFeatures = [
    { icon: Palette, title: "Libertad Creativa Sin Límites", description: "Concéntrate en tu visión artística. La IA se encarga de la complejidad técnica y la ejecución." },
    { icon: Rocket, title: "Presentaciones de Alto Impacto", description: "Crea visuales que rivalizan con grandes estudios, sin la necesidad de infraestructura costosa." },
    { icon: Users, title: "Escalabilidad y Colaboración", description: "Accede a nuestro equipo y red para llevar tus ideas a producciones finales de primer nivel y mayor alcance." },
    { icon: Lightbulb, title: "Enfoque en tu Genialidad Única", description: "Deja que la IA potencie tus fortalezas. Automatiza lo repetitivo, magnifica tu talento distintivo." }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { type: "spring", stiffness: 45, damping: 15 }
    }
  };
  
  const featureItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
    })
  };


  return (
    <section id="professionals" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-background via-card/30 to-background section-intro-glow">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6 animate-text-focus-in px-2">
            Para <span className="gradient-text">Profesionales</span> Creativos
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-secondary-type max-w-3xl mx-auto px-4">
            Agencias y Freelancers: ILYR.art es su socio estratégico IA para potenciar arte, negocio y flujos de trabajo.
          </p>
          <div className="section-divider mt-6 sm:mt-7 md:mt-8"></div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={cardVariants} className="perspective-container">
            <Card className="h-full glass-card rounded-xl sm:rounded-2xl text-primary-foreground border-t-2 border-primary/60 shadow-2xl shadow-primary/15 perspective-element">
              <CardHeader className="text-center p-6 sm:p-8 md:p-10 pb-5 sm:pb-6 md:pb-8">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 4 }}
                  className="w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 bg-gradient-to-br from-primary to-primary/70 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-7 md:mb-8 border border-primary-foreground/20 shadow-xl shadow-primary/25">
                  <Building2 className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-primary-foreground" />
                </motion.div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 tracking-tight text-primary-foreground px-2" style={{ textShadow: '0 0 8px hsl(var(--primary-foreground)/0.5)' }}>
                  AGENCIAS
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm sm:text-base md:text-lg max-w-md mx-auto px-2">
                  "Revoluciona tu preproducción visual. Entrega impacto, reduce tiempos y gana más clientes con IA."
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 p-4 sm:p-6 md:p-8 pt-2 sm:pt-3 md:pt-4">
                {agencyFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={featureItemVariants}
                    className="flex items-start space-x-3 sm:space-x-4 md:space-x-5 p-3 sm:p-3.5 md:p-4 bg-background/10 rounded-lg border border-primary-foreground/15 hover:bg-background/20 transition-colors"
                  >
                    <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <feature.icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7 text-background" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-foreground text-base sm:text-lg mb-1" style={{ textShadow: '0 0 5px hsl(var(--primary-foreground)/0.4)' }}>{feature.title}</h4>
                      <p className="text-primary-foreground/70 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
                <div className="pt-4 sm:pt-6 md:pt-8">
                  <Button 
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-accent to-orange-500 hover:shadow-accent/40 text-accent-foreground font-bold py-4 sm:py-4.5 md:py-5 text-sm sm:text-base md:text-lg futuristic-button pulse-glow shadow-xl shadow-accent/30"
                  >
                    <Link to={isLoggedIn ? "/portal" : "/register"} className="flex items-center justify-center">
                      {isLoggedIn ? "Ir al Portal" : "Solicitar Acceso para Agencias"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} className="perspective-container">
            <Card className="h-full glass-card rounded-xl sm:rounded-2xl text-primary-foreground border-t-2 border-secondary/60 shadow-2xl shadow-secondary/15 perspective-element">
              <CardHeader className="text-center p-6 sm:p-8 md:p-10 pb-5 sm:pb-6 md:pb-8">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -4 }}
                  className="w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-7 md:mb-8 border border-primary-foreground/20 shadow-xl shadow-secondary/25">
                  <UserCheck className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-primary-foreground" />
                </motion.div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 tracking-tight text-primary-foreground px-2" style={{ textShadow: '0 0 8px hsl(var(--primary-foreground)/0.5)' }}>
                  FREELANCERS
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm sm:text-base md:text-lg max-w-md mx-auto px-2">
                  "Crea, presenta y produce con IA de vanguardia. Menos software, más ideas brillantes y proyectos exitosos."
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 p-4 sm:p-6 md:p-8 pt-2 sm:pt-3 md:pt-4">
                {freelancerFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={featureItemVariants}
                    className="flex items-start space-x-3 sm:space-x-4 md:space-x-5 p-3 sm:p-3.5 md:p-4 bg-background/10 rounded-lg border border-primary-foreground/15 hover:bg-background/20 transition-colors"
                  >
                    <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <feature.icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7 text-background" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-foreground text-base sm:text-lg mb-1" style={{ textShadow: '0 0 5px hsl(var(--primary-foreground)/0.4)' }}>{feature.title}</h4>
                      <p className="text-primary-foreground/70 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
                <div className="pt-4 sm:pt-6 md:pt-8">
                  <Button 
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-accent to-orange-500 hover:shadow-accent/40 text-accent-foreground font-bold py-4 sm:py-4.5 md:py-5 text-sm sm:text-base md:text-lg futuristic-button pulse-glow shadow-xl shadow-accent/30"
                  >
                    <Link to={isLoggedIn ? "/portal" : "/register"} className="flex items-center justify-center">
                      {isLoggedIn ? "Ir al Portal" : "Únete como Creativo"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 md:mt-20 lg:mt-28"
        >
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-foreground futuristic-border shadow-2xl shadow-primary/10">
            <Zap className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-accent mx-auto mb-6 sm:mb-7 md:mb-8" />
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 px-2">
              ¿Listo para <span className="gradient-text">Colaborar</span> con Nuestro Estudio?
            </h3>
            <p className="text-secondary-type text-base sm:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              Únete a agencias y freelancers que están transformando su impacto visual. Nuestro equipo experto y la IA trabajan juntos para materializar tus visiones más ambiciosas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 justify-center px-4">
              <Button 
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-blue-500 hover:shadow-primary/40 text-primary-foreground px-6 sm:px-8 md:px-10 py-4 sm:py-4.5 md:py-5 text-base sm:text-lg futuristic-button pulse-glow shadow-xl shadow-primary/30 w-full sm:w-auto"
              >
                <Link to={isLoggedIn ? "/client/brief/new" : "/portal"} className="flex items-center justify-center">
                  {isLoggedIn ? "Crear Nuevo Brief" : "Solicitar Demo Personalizada"}
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-accent/60 text-accent hover:bg-accent/10 hover:text-accent hover:border-accent/80 px-6 sm:px-8 md:px-10 py-4 sm:py-4.5 md:py-5 text-base sm:text-lg futuristic-button futuristic-border shadow-lg hover:shadow-accent/20 w-full sm:w-auto"
              >
                <Link to={isLoggedIn ? "/client" : "/register"} className="flex items-center justify-center">
                  {isLoggedIn ? "Ver Mis Proyectos" : "Hablar con un Experto"}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AgenciesFreelancersSection;