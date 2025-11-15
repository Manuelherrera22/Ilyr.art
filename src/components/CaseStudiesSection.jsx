import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Quote, Star, Zap, ArrowRightCircle, Image as ImageIcon, Layers } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CaseStudiesSection = () => {
  const { toast } = useToast();

  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Esta funcionalidad aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
      duration: 3000,
      className: 'bg-card text-card-foreground border-primary futuristic-border',
    });
  };

  const caseStudies = [
    {
      imgPlaceholder: "https://images.unsplash.com/photo-1551028877-060895831a9d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Abstract Blue/Purple
      altText: "Visualización IA de un perfume de lujo llamado Nova en un entorno cósmico",
      title: "Perfume de Lujo 'Nova'",
      description: "Transformamos un concepto de fragancia en una campaña visual cinematográfica que evoca misterio y sofisticación cósmica, con partículas de polvo estelar y nebulosas.",
      testimonial: "ILYR.art no solo visualizó mi producto, lo elevó a una obra de arte intergaláctica. Las ventas se triplicaron.",
      author: "Elara Vance",
      role: "CEO, Nova Fragrances",
      rating: 5,
      themeColor: "primary",
      tags: ["Lujo", "CGI", "Cosmética"]
    },
    {
      imgPlaceholder: "https://images.unsplash.com/photo-1523206422432-c9141c952f8d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Magenta/Pink abstract
      altText: "Animación de calzado deportivo Quantum Leap con IA mostrando estelas de energía",
      title: "Calzado Deportivo 'Quantum Leap'",
      description: "Convertimos una imagen estática de zapatillas en una animación dinámica que irradia velocidad y energía futurista, con estelas de luz y efectos de partículas.",
      testimonial: "La IA capturó la esencia de 'Quantum Leap' de una forma que ni imaginábamos. ¡Absolutamente impactante y viral!",
      author: "Jax Ryder",
      role: "CMO, Apex Athletics",
      rating: 5,
      themeColor: "secondary",
      tags: ["Deporte", "Animación", "Producto"]
    },
    {
      imgPlaceholder: "https://images.unsplash.com/photo-1606127280247-95588ada79d0?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Orange/Coral abstract
      altText: "Resultado de IA para empaque de alimento orgánico BioSynth con elementos naturales y tecnológicos",
      title: "Alimento Orgánico 'BioSynth'",
      description: "Creamos una visualización que fusiona lo natural con un toque moderno y limpio, resaltando pureza, tecnología alimentaria y vanguardia sostenible.",
      testimonial: "Logramos comunicar la frescura y la innovación de BioSynth de una manera elegante y atractiva. ¡Un éxito rotundo!",
      author: "Dr. Aris Thorne",
      role: "Fundador, BioSynth Foods",
      rating: 5,
      themeColor: "accent",
      tags: ["Alimentación", "Packaging", "Sostenibilidad"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, rotateY: -15, filter: 'blur(5px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateY: 0, 
      filter: 'blur(0px)',
      transition: { type: "spring", stiffness: 45, damping: 12 } 
    }
  };

  return (
    <section id="case-studies" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-background via-card/30 to-background section-intro-glow">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6 animate-text-focus-in px-2">
            Proyectos que <span className="gradient-text">Transformamos Juntos</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-secondary-type max-w-3xl mx-auto px-4">
            Descubre cómo colaboramos con marcas y creadores para materializar visiones cinematográficas. IA + talento humano especializado en cada producción.
          </p>
          <div className="section-divider mt-6 sm:mt-7 md:mt-8"></div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group perspective-container"
            >
              <Card className={`glass-card rounded-2xl overflow-hidden shadow-2xl shadow-${study.themeColor}/10 h-full flex flex-col border-t-2 border-${study.themeColor}/50 perspective-element focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2`}>
                <div className={`relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden`} role="img" aria-label={study.altText}>
                  <img
                    src={study.imgPlaceholder} 
                    alt={study.altText} 
                    className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500 ease-in-out opacity-80 group-hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="400"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent`} aria-hidden="true"></div>
                  <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 bg-${study.themeColor}/80 backdrop-blur-sm text-background px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold shadow-lg`} aria-label="Potenciado por IA">
                    POTENCIADO POR IA
                  </div>
                   <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4 flex flex-wrap gap-1.5 sm:gap-2" role="list" aria-label="Etiquetas del proyecto">
                    {study.tags.map(tag => (
                       <span key={tag} className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-background/70 backdrop-blur-sm text-${study.themeColor} border border-${study.themeColor}/30`} role="listitem">{tag}</span>
                    ))}
                  </div>
                </div>

                <CardHeader className="p-4 sm:p-6 md:p-8 pb-0">
                   <CardTitle className={`text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 group-hover:text-${study.themeColor} transition-colors`}>
                    {study.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 md:p-8 flex-grow flex flex-col">
                  <p className="text-secondary-type text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6 leading-relaxed flex-grow">
                    {study.description}
                  </p>

                  <div className={`bg-card/50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-${study.themeColor}/20 shadow-inner shadow-${study.themeColor}/5 mt-auto`}>
                    <Quote className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-${study.themeColor} mb-3 sm:mb-3.5 md:mb-4 -ml-1`} />
                    <p className="text-foreground/90 text-xs sm:text-sm italic mb-4 sm:mb-4.5 md:mb-5 leading-relaxed">
                      "{study.testimonial}"
                    </p>
                    <div className="flex items-center justify-between pt-3 sm:pt-3.5 md:pt-4 border-t border-border/30">
                      <div>
                        <p className={`font-semibold text-foreground text-sm`}>{study.author}</p>
                        <p className={`text-muted-foreground text-xs`}>{study.role}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(study.rating)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 text-yellow-400 fill-yellow-400`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-28"
        >
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 text-foreground futuristic-border shadow-2xl shadow-primary/10">
            <Layers className="w-16 h-16 text-accent mx-auto mb-8" />
            <h3 className="text-4xl font-bold mb-6">
              ¿Listo para <span className="gradient-text">Co-crear</span> tu Próximo Proyecto?
            </h3>
            <p className="text-secondary-type text-lg mb-10 max-w-2xl mx-auto">
              Únete a las marcas que están transformando su impacto visual. Nuestro equipo experto y la IA trabajan juntos para materializar tu visión.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-accent to-orange-500 hover:shadow-accent/40 text-accent-foreground px-12 py-5 rounded-xl font-semibold text-xl transition-all futuristic-button pulse-glow shadow-xl shadow-accent/30 flex items-center mx-auto group"
            >
              <Link to="/portal">
                Iniciar mi Brief <ArrowRightCircle className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;