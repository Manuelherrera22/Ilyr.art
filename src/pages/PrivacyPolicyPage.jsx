import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Shield, Lock, Database, Users, Globe, FileText } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: "1. Información que Recopilamos",
      icon: Database,
      content: [
        "Datos de registro: nombre completo, dirección de correo electrónico, tipo de perfil (freelancer, agencia, marca)",
        "Datos de uso: interacciones con la plataforma, contenido generado, preferencias de usuario",
        "Datos técnicos: dirección IP, tipo de navegador, sistema operativo, cookies y tecnologías similares",
        "Contenido creativo: imágenes subidas, proyectos generados, configuraciones de IA"
      ]
    },
    {
      title: "2. Base Legal para el Procesamiento",
      icon: FileText,
      content: [
        "Consentimiento informado: para el procesamiento de datos personales y uso de servicios de IA",
        "Ejecución contractual: para proporcionar servicios de visualización y producción creativa",
        "Interés legítimo: para mejorar nuestros servicios y desarrollar nuevas funcionalidades",
        "Cumplimiento legal: para cumplir con obligaciones regulatorias aplicables"
      ]
    },
    {
      title: "3. Uso de Datos",
      icon: Users,
      content: [
        "Prestación de servicios: generación de contenido visual, gestión de proyectos, comunicación",
        "Mejora de servicios: análisis de uso, desarrollo de nuevas funcionalidades de IA",
        "Comunicación: notificaciones de servicio, actualizaciones de proyectos, soporte técnico",
        "Seguridad: prevención de fraude, protección de la plataforma y usuarios"
      ]
    },
    {
      title: "4. Compartir Información",
      icon: Globe,
      content: [
        "Proveedores de servicios: Supabase (base de datos), servicios de IA para generación de contenido",
        "Colaboradores: cuando el usuario autoriza explícitamente compartir proyectos",
        "Cumplimiento legal: cuando sea requerido por autoridades competentes",
        "No vendemos ni alquilamos datos personales a terceros"
      ]
    },
    {
      title: "5. Retención y Eliminación",
      icon: Lock,
      content: [
        "Datos de cuenta: conservados mientras la cuenta esté activa",
        "Proyectos y contenido: conservados según las preferencias del usuario",
        "Datos de uso: conservados por un máximo de 24 meses para análisis",
        "Derecho de eliminación: los usuarios pueden solicitar la eliminación completa de sus datos"
      ]
    },
    {
      title: "6. Derechos del Usuario",
      icon: Shield,
      content: [
        "Acceso: solicitar una copia de sus datos personales",
        "Rectificación: corregir datos inexactos o incompletos",
        "Eliminación: solicitar la eliminación de sus datos personales",
        "Portabilidad: recibir sus datos en formato estructurado",
        "Oposición: oponerse al procesamiento de sus datos",
        "Limitación: solicitar la limitación del procesamiento"
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
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Política de Privacidad</h1>
            <p className="text-lg text-muted-foreground">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Compromiso con la Privacidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                En ILYR.art, parte del holding creativo ILYR.AI, nos comprometemos a proteger y respetar su privacidad. 
                Esta política explica cómo recopilamos, usamos y protegemos su información personal de acuerdo con el 
                Reglamento General de Protección de Datos (GDPR), la Ley Habeas Data de Colombia y estándares internacionales 
                de seguridad de la información ISO/IEC 27001.
              </p>
              <p className="text-foreground/90">
                Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política.
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
              <CardTitle className="text-2xl">Seguridad y Cifrado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Cifrado de datos en tránsito y en reposo</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Autenticación multifactor y gestión segura de sesiones</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Auditorías regulares de seguridad y monitoreo continuo</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Cumplimiento con estándares ISO/IEC 27001</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Contacto y Ejercicio de Derechos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Para ejercer sus derechos de protección de datos o realizar consultas sobre esta política, puede contactarnos:
              </p>
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-foreground/90"><strong>Email:</strong> privacy@ilyr.art</p>
                <p className="text-foreground/90"><strong>Responsable de Datos:</strong> ILYR.AI Holding Creativo</p>
                <p className="text-foreground/90"><strong>Tiempo de respuesta:</strong> Máximo 30 días calendario</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Nos reservamos el derecho de actualizar esta política. Los cambios significativos serán notificados 
                con al menos 30 días de anticipación.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;