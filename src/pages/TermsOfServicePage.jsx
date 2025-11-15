import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, FileText, Users, Briefcase, Palette, Shield, AlertTriangle, Scale } from 'lucide-react';

const TermsOfServicePage = () => {
  const sections = [
    {
      title: "1. Definiciones y Alcance",
      icon: FileText,
      content: [
        "ILYR.art: plataforma de visualización creativa con inteligencia artificial",
        "Usuario: cualquier persona que accede y utiliza nuestros servicios",
        "Contenido Generado: material visual creado mediante nuestras herramientas de IA",
        "Servicios: incluye previsualizador IA, editor visual, producción profesional y exportador"
      ]
    },
    {
      title: "2. Condiciones por Tipo de Usuario",
      icon: Users,
      content: [
        "Freelancers: acceso completo a herramientas creativas, portafolio y gestión de clientes",
        "Agencias: funcionalidades multi-proyecto, gestión de equipos y producción escalable",
        "Marcas: acceso simplificado enfocado en visualización de productos y encargos directos",
        "Todos los usuarios deben ser mayores de 18 años o contar con autorización parental"
      ]
    },
    {
      title: "3. Uso de Inteligencia Artificial",
      icon: Palette,
      content: [
        "El contenido generado por IA es único pero puede basarse en patrones de entrenamiento",
        "No garantizamos resultados específicos, la IA es una herramienta de asistencia creativa",
        "El usuario mantiene responsabilidad sobre el uso final del contenido generado",
        "Prohibido generar contenido ilegal, ofensivo o que infrinja derechos de terceros"
      ]
    },
    {
      title: "4. Propiedad Intelectual",
      icon: Scale,
      content: [
        "El usuario retiene derechos sobre el contenido original que sube a la plataforma",
        "ILYR.art otorga licencia de uso sobre el contenido generado por IA al usuario",
        "Material de referencia: imágenes base y configuraciones no constituyen entregable final",
        "Entregable final: contenido procesado y exportado listo para uso comercial"
      ]
    },
    {
      title: "5. Limitaciones de Responsabilidad",
      icon: AlertTriangle,
      content: [
        "ILYR.art no se responsabiliza por el uso comercial específico del contenido generado",
        "Los resultados visuales son aproximaciones y pueden requerir ajustes adicionales",
        "No garantizamos disponibilidad del servicio 24/7, pueden ocurrir mantenimientos",
        "El usuario es responsable de verificar derechos de uso en contenido de terceros"
      ]
    },
    {
      title: "6. Gestión de Proyectos y Cancelaciones",
      icon: Briefcase,
      content: [
        "Proyectos de producción profesional: cancelación hasta 24h antes del inicio",
        "Reembolsos: aplicables según política específica de cada tipo de servicio",
        "Modificaciones: permitidas durante fase de desarrollo, pueden generar costos adicionales",
        "Entrega: plazos estimados, pueden variar según complejidad del proyecto"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" className="text-foreground hover:bg-accent/10 hover:text-accent">
            <Home className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Términos y Condiciones de Uso</h1>
            <p className="text-lg text-muted-foreground">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Acuerdo de Servicios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Estos términos y condiciones regulan el uso de ILYR.art, una plataforma de visualización creativa 
                con inteligencia artificial operada por ILYR.AI Holding Creativo. Al acceder y utilizar nuestros 
                servicios, usted acepta estar sujeto a estos términos.
              </p>
              <p className="text-foreground/90">
                Nuestros servicios están diseñados para profesionales creativos, agencias y marcas que buscan 
                soluciones innovadoras de visualización y producción de contenido.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <section.icon className="mr-3 h-6 w-6 text-primary" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Shield className="mr-3 h-6 w-6 text-primary" />
                Cumplimiento y Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                ILYR.art opera bajo estrictos estándares de seguridad y cumplimiento normativo:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Cumplimiento con GDPR para usuarios europeos</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Adherencia a Ley Habeas Data para Colombia y LatAm</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Implementación de medidas ISO/IEC 27001</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Auditorías regulares de seguridad digital</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Modificaciones y Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos 
                serán notificados con al menos 30 días de anticipación.
              </p>
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-foreground/90"><strong>Contacto Legal:</strong> legal@ilyr.art</p>
                <p className="text-foreground/90"><strong>Soporte Técnico:</strong> support@ilyr.art</p>
                <p className="text-foreground/90"><strong>Jurisdicción:</strong> Colombia, con aplicación de normativa internacional</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Al continuar utilizando nuestros servicios después de cualquier modificación, usted acepta 
                los términos actualizados.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;