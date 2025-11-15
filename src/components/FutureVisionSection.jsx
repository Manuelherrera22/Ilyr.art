import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Zap, Brain, Layers, Lightbulb, TrendingUp, Target, CalendarDays, Sparkles, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const FutureVisionSection = () => {
  const roadmapItems = [
    {
      quarter: "Q4 2025",
      title: "Studio™ Hyper-Realista",
      description: "Editor 3D con IA para texturas generativas avanzadas, físicas realistas y renderizado en tiempo real. Control creativo sin precedentes.",
      icon: Wand2,
      color: "primary",
      details: [
        "Motor de renderizado neural optimizado.",
        "Biblioteca de materiales inteligentes expansiva.",
        "Integración con flujos de trabajo 3D existentes."
      ]
    },
    {
      quarter: "Q1 2026",
      title: "AI Copilot para Pitching Estratégico",
      description: "Asistente IA contextual para co-crear narrativas visuales complejas, persuasivas y alineadas con objetivos de negocio.",
      icon: Brain,
      color: "secondary",
      details: [
        "Análisis de briefs y generación de conceptos visuales.",
        "Sugerencias de estilo y composición basadas en la audiencia.",
        "Creación de storyboards dinámicos."
      ]
    },
    {
      quarter: "Q2 2026",
      title: "Plataforma Colaborativa Global",
      description: "Espacio de trabajo unificado para equipos creativos distribuidos, con co-edición en tiempo real y gestión de activos IA.",
      icon: Layers,
      color: "accent",
      details: [
        "Control de versiones inteligente para activos generados por IA.",
        "Herramientas de feedback visual contextual.",
        "Integración con ILYR.art Marketplace."
      ]
    },
    {
      quarter: "Q4 2026",
      title: "IA Generativa Autónoma Avanzada",
      description: "Sistemas IA capaces de interpretar conceptos abstractos y generar mundos visuales completos con mínima intervención humana.",
      icon: Sparkles,
      color: "primary",
      details: [
        "Modelos de IA con comprensión semántica profunda.",
        "Generación procedural de entornos 3D complejos.",
        "Personalización de estilos artísticos a niveles sin precedentes."
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 50, damping: 15 }
    }
  };

  const lineVariants = {
    hidden: { height: 0 },
    visible: { 
      height: "100%",
      transition: { duration: 1, ease: "circOut", delay: 0.5 }
    }
  };

  return (
    <section id="future" className="py-28 bg-gradient-to-b from-background via-card/10 to-background section-intro-glow overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <Rocket className="w-20 h-20 text-accent mx-auto mb-8 animate-bounce" />
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-text-focus-in">
            El <span className="gradient-text">Futuro</span> de la Creación Visual
          </h2>
          <p className="text-xl text-secondary-type max-w-3xl mx-auto">
            Nuestra hoja de ruta está diseñada para empoderarte con herramientas IA que transformarán radicalmente cómo concibes y produces arte digital.
          </p>
          <div className="section-divider mt-8"></div>
        </motion.div>

        <div className="relative">
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary/30 via-secondary/30 to-accent/30 rounded-full -ml-[3px]"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          ></motion.div>

          <motion.div 
            className="space-y-16 md:space-y-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {roadmapItems.map((item, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className={`flex flex-col md:flex-row items-center relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} my-10 md:my-0`}
              >
                <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:pl-12 lg:pl-20' : 'md:pr-12 lg:pr-20'} mb-8 md:mb-0`}>
                  <Card className={`glass-card shadow-xl shadow-${item.color}/15 border-t-2 border-${item.color}/60 rounded-xl w-full`}>
                    <CardHeader className="pb-3 pt-5 px-5 md:px-6">
                      <div className="flex justify-between items-center mb-1">
                        <CardTitle className={`text-xl md:text-2xl font-bold text-${item.color} tracking-tight`}>{item.title}</CardTitle>
                        <span className={`hidden sm:inline-block text-xs font-semibold bg-${item.color}/20 text-${item.color} px-2.5 py-1 rounded-full`}>
                          {item.quarter}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 md:px-6 pb-5">
                      <CardDescription className="text-sm text-foreground/80 leading-relaxed mb-3">
                        {item.description}
                      </CardDescription>
                       <span className={`sm:hidden text-xs font-semibold bg-${item.color}/20 text-${item.color} px-2 py-0.5 rounded-full inline-block mb-3`}>
                          {item.quarter}
                        </span>
                      {/* Optional: Details list if needed
                      <ul className="space-y-1 mt-3 text-xs text-foreground/70 list-disc list-inside">
                        {item.details.map((detail, i) => <li key={i}>{detail}</li>)}
                      </ul>
                      */}
                    </CardContent>
                  </Card>
                </div>

                <div className="absolute left-1/2 top-1/2 md:top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-${item.color} to-${item.color}/70 rounded-full flex items-center justify-center shadow-lg shadow-${item.color}/40 border-2 border-background`}
                  >
                    <item.icon className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
                  </motion.div>
                </div>
                
                {/* Empty div for spacing on the opposite side, only for md+ screens */}
                <div className="hidden md:block md:w-5/12"></div>

              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-28"
        >
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 text-foreground futuristic-border shadow-2xl shadow-primary/10">
            <TrendingUp className="w-16 h-16 text-accent mx-auto mb-8" />
            <h3 className="text-4xl font-bold mb-6">
              Innovación Continua, <span className="gradient-text">Resultados Exponenciales</span>
            </h3>
            <p className="text-secondary-type text-lg mb-10 max-w-2xl mx-auto">
              Estamos comprometidos a empujar los límites de la IA para ofrecerte herramientas que no solo inspiran, sino que también transforman tu flujo de trabajo y potencian tu éxito.
            </p>
            {/* Call to action or link to detailed roadmap could go here */}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FutureVisionSection;