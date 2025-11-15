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
    <section id="professionals" className="py-28 bg-gradient-to-b from-background via-card/30 to-background section-intro-glow">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-text-focus-in">
            Para <span className="gradient-text">Profesionales</span> Creativos
          </h2>
          <p className="text-xl text-secondary-type max-w-3xl mx-auto">
            Agencias y Freelancers: ILYR.art es su socio estratégico IA para potenciar arte, negocio y flujos de trabajo.
          </p>
          <div className="section-divider mt-8"></div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={cardVariants} className="perspective-container">
            <Card className="h-full glass-card rounded-2xl text-primary-foreground border-t-2 border-primary/60 shadow-2xl shadow-primary/15 perspective-element">
              <CardHeader className="text-center p-10 pb-8">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 4 }}
                  className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary-foreground/20 shadow-xl shadow-primary/25">
                  <Building2 className="w-12 h-12 text-primary-foreground" />
                </motion.div>
                <CardTitle className="text-4xl font-bold mb-3 tracking-tight text-primary-foreground" style={{ textShadow: '0 0 8px hsl(var(--primary-foreground)/0.5)' }}>
                  AGENCIAS
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg max-w-md mx-auto">
                  "Revoluciona tu preproducción visual. Entrega impacto, reduce tiempos y gana más clientes con IA."
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-4">
                {agencyFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={featureItemVariants}
                    className="flex items-start space-x-5 p-4 bg-background/10 rounded-lg border border-primary-foreground/15 hover:bg-background/20 transition-colors"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <feature.icon className="w-7 h-7 text-background" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-foreground text-lg mb-1" style={{ textShadow: '0 0 5px hsl(var(--primary-foreground)/0.4)' }}>{feature.title}</h4>
                      <p className="text-primary-foreground/70 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
                <div className="pt-8">
                  <Button 
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-accent to-orange-500 hover:shadow-accent/40 text-accent-foreground font-bold py-5 text-lg futuristic-button pulse-glow shadow-xl shadow-accent/30"
                  >
                    <Link to={isLoggedIn ? "/portal" : "/register"}>
                      {isLoggedIn ? "Ir al Portal" : "Solicitar Acceso para Agencias"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} className="perspective-container">
            <Card className="h-full glass-card rounded-2xl text-primary-foreground border-t-2 border-secondary/60 shadow-2xl shadow-secondary/15 perspective-element">
              <CardHeader className="text-center p-10 pb-8">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -4 }}
                  className="w-24 h-24 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary-foreground/20 shadow-xl shadow-secondary/25">
                  <UserCheck className="w-12 h-12 text-primary-foreground" />
                </motion.div>
                <CardTitle className="text-4xl font-bold mb-3 tracking-tight text-primary-foreground" style={{ textShadow: '0 0 8px hsl(var(--primary-foreground)/0.5)' }}>
                  FREELANCERS
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg max-w-md mx-auto">
                  "Crea, presenta y produce con IA de vanguardia. Menos software, más ideas brillantes y proyectos exitosos."
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-4">
                {freelancerFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={featureItemVariants}
                    className="flex items-start space-x-5 p-4 bg-background/10 rounded-lg border border-primary-foreground/15 hover:bg-background/20 transition-colors"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <feature.icon className="w-7 h-7 text-background" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-foreground text-lg mb-1" style={{ textShadow: '0 0 5px hsl(var(--primary-foreground)/0.4)' }}>{feature.title}</h4>
                      <p className="text-primary-foreground/70 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
                <div className="pt-8">
                  <Button 
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-accent to-orange-500 hover:shadow-accent/40 text-accent-foreground font-bold py-5 text-lg futuristic-button pulse-glow shadow-xl shadow-accent/30"
                  >
                    <Link to={isLoggedIn ? "/portal" : "/register"}>
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
          className="text-center mt-28"
        >
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 text-foreground futuristic-border shadow-2xl shadow-primary/10">
            <Zap className="w-16 h-16 text-accent mx-auto mb-8" />
            <h3 className="text-4xl font-bold mb-6">
              ¿Listo para <span className="gradient-text">Colaborar</span> con Nuestro Estudio?
            </h3>
            <p className="text-secondary-type text-lg mb-10 max-w-2xl mx-auto">
              Únete a agencias y freelancers que están transformando su impacto visual. Nuestro equipo experto y la IA trabajan juntos para materializar tus visiones más ambiciosas.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-blue-500 hover:shadow-primary/40 text-primary-foreground px-10 py-5 text-lg futuristic-button pulse-glow shadow-xl shadow-primary/30"
              >
                <Link to={isLoggedIn ? "/client/brief/new" : "/portal"}>
                  {isLoggedIn ? "Crear Nuevo Brief" : "Solicitar Demo Personalizada"}
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-accent/60 text-accent hover:bg-accent/10 hover:text-accent hover:border-accent/80 px-10 py-5 text-lg futuristic-button futuristic-border shadow-lg hover:shadow-accent/20"
              >
                <Link to={isLoggedIn ? "/client" : "/register"}>
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