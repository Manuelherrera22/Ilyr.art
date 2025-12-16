import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Shield, Lock, Database, Users, Globe, FileText, Building2, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: "1. Información que Recopilamos",
      icon: Database,
      content: [
        "Datos de registro: nombre completo, dirección de correo electrónico, tipo de perfil (cliente, productor, creativo, administrador)",
        "Datos de uso: interacciones con la plataforma, contenido generado, preferencias de usuario, historial de proyectos",
        "Datos técnicos: dirección IP, tipo de navegador, sistema operativo, cookies y tecnologías similares, logs de acceso",
        "Contenido creativo: imágenes subidas, proyectos generados, configuraciones de IA, briefs de clientes",
        "Datos de comunicación: mensajes, comentarios, notificaciones y comunicaciones dentro de la plataforma",
        "Datos de facturación: información necesaria para procesamiento de pagos (procesada por terceros seguros)"
      ]
    },
    {
      title: "2. Base Legal para el Procesamiento",
      icon: FileText,
      content: [
        "Consentimiento informado: para el procesamiento de datos personales y uso de servicios de IA",
        "Ejecución contractual: para proporcionar servicios de visualización y producción creativa",
        "Interés legítimo: para mejorar nuestros servicios y desarrollar nuevas funcionalidades",
        "Cumplimiento legal: para cumplir con obligaciones regulatorias aplicables (GDPR, CCPA, LGPD, Ley Habeas Data)",
        "Protección de intereses vitales: en casos excepcionales de seguridad"
      ]
    },
    {
      title: "3. Uso de Datos",
      icon: Users,
      content: [
        "Prestación de servicios: generación de contenido visual, gestión de proyectos, comunicación entre equipos",
        "Mejora de servicios: análisis de uso, desarrollo de nuevas funcionalidades de IA, optimización de algoritmos",
        "Comunicación: notificaciones de servicio, actualizaciones de proyectos, soporte técnico, marketing (con consentimiento)",
        "Seguridad: prevención de fraude, protección de la plataforma y usuarios, detección de actividades sospechosas",
        "Cumplimiento normativo: auditorías, reportes regulatorios, respuesta a solicitudes legales"
      ]
    },
    {
      title: "4. Compartir Información",
      icon: Globe,
      content: [
        "Proveedores de servicios: Supabase (base de datos y autenticación), servicios de IA para generación de contenido, servicios de almacenamiento en la nube",
        "Colaboradores: cuando el usuario autoriza explícitamente compartir proyectos con miembros del equipo",
        "Cumplimiento legal: cuando sea requerido por autoridades competentes, órdenes judiciales o procesos legales",
        "Transferencias internacionales: datos pueden ser procesados fuera de su jurisdicción con salvaguardas adecuadas",
        "No vendemos ni alquilamos datos personales a terceros para marketing sin consentimiento explícito"
      ]
    },
    {
      title: "5. Retención y Eliminación",
      icon: Lock,
      content: [
        "Datos de cuenta: conservados mientras la cuenta esté activa y hasta 2 años después de la inactividad",
        "Proyectos y contenido: conservados según las preferencias del usuario o hasta solicitud de eliminación",
        "Datos de uso: conservados por un máximo de 24 meses para análisis y mejora de servicios",
        "Datos de facturación: conservados según requisitos legales (típicamente 7 años para fines fiscales)",
        "Derecho de eliminación: los usuarios pueden solicitar la eliminación completa de sus datos (derecho al olvido)"
      ]
    },
    {
      title: "6. Derechos del Usuario (GDPR, CCPA, LGPD)",
      icon: Shield,
      content: [
        "Acceso: solicitar una copia de sus datos personales en formato estructurado y legible",
        "Rectificación: corregir datos inexactos o incompletos directamente desde el perfil o mediante solicitud",
        "Eliminación: solicitar la eliminación de sus datos personales (derecho al olvido)",
        "Portabilidad: recibir sus datos en formato estructurado y comúnmente usado para transferir a otro proveedor",
        "Oposición: oponerse al procesamiento de sus datos para fines de marketing o intereses legítimos",
        "Limitación: solicitar la limitación del procesamiento cuando se disputa la exactitud de los datos",
        "Revocación de consentimiento: retirar el consentimiento en cualquier momento sin afectar procesamiento previo",
        "No discriminación (CCPA): no ser discriminado por ejercer sus derechos de privacidad"
      ]
    },
    {
      title: "7. Protección de Menores",
      icon: AlertCircle,
      content: [
        "Edad mínima: nuestros servicios están dirigidos a usuarios mayores de 18 años",
        "Consentimiento parental: usuarios menores de 18 años requieren autorización de padres o tutores",
        "Datos de menores: procesamos datos de menores solo con consentimiento parental verificable",
        "Derechos de menores: padres o tutores pueden ejercer derechos en nombre de menores",
        "Eliminación: podemos eliminar cuentas de menores si se determina que no tienen autorización apropiada"
      ]
    },
    {
      title: "8. Transferencias Internacionales",
      icon: Globe,
      content: [
        "Ubicación de servidores: datos pueden ser almacenados y procesados en servidores fuera de su país de residencia",
        "Salvaguardas: utilizamos Cláusulas Contractuales Tipo (SCC) y otras garantías apropiadas",
        "Países con adecuación: priorizamos países con decisiones de adecuación de la UE cuando es posible",
        "Transparencia: informamos sobre transferencias internacionales en esta política",
        "Derechos: sus derechos de privacidad se mantienen independientemente de dónde se procesen sus datos"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <Link to="/" className="inline-block mb-6 sm:mb-8">
          <Button variant="ghost" className="text-foreground hover:bg-accent/10 hover:text-accent text-sm sm:text-base">
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
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-primary/30">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">Política de Privacidad</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <Card className="glass-card mb-6 sm:mb-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">Compromiso con la Privacidad</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                En ILYR.art, parte del holding creativo ILYR.AI, nos comprometemos a proteger y respetar su privacidad. 
                Esta política explica cómo recopilamos, usamos y protegemos su información personal de acuerdo con el 
                Reglamento General de Protección de Datos (GDPR), la Ley de Privacidad del Consumidor de California (CCPA), 
                la Ley General de Protección de Datos de Brasil (LGPD), la Ley Habeas Data de Colombia y estándares internacionales 
                de seguridad de la información ISO/IEC 27001.
              </p>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política. Si no está de acuerdo, 
                por favor no utilice nuestros servicios.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4 sm:space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center text-lg sm:text-xl gap-2">
                      <div className="flex items-center">
                        <section.icon className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                        <span>{section.title}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <ul className="space-y-2 sm:space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full mt-2 sm:mt-2.5 mr-2 sm:mr-3 flex-shrink-0"></div>
                          <span className="text-sm sm:text-base text-foreground/90 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="glass-card mt-6 sm:mt-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center">
                <Lock className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Seguridad y Cifrado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales:
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Cifrado de datos en tránsito (TLS 1.3) y en reposo (AES-256)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Autenticación multifactor y gestión segura de sesiones</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Auditorías regulares de seguridad y monitoreo continuo</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Cumplimiento con estándares ISO/IEC 27001 y SOC 2 Type II</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Copias de seguridad regulares y planes de recuperación ante desastres</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card mt-6 sm:mt-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center">
                <Building2 className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Información del Responsable
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="bg-card/50 p-4 sm:p-5 rounded-lg space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base text-foreground/90"><strong>Responsable del Tratamiento:</strong> ILYR.AI Holding Creativo</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Plataforma:</strong> ILYR.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Email de Privacidad:</strong> privacy@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Email Legal:</strong> legal@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>DPO (Data Protection Officer):</strong> dpo@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Tiempo de respuesta:</strong> Máximo 30 días calendario (GDPR) / 45 días (CCPA)</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Para usuarios de California (CCPA): No vendemos información personal. Para ejercer sus derechos, contacte a privacy@ilyr.art.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card mt-6 sm:mt-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center">
                <Mail className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Contacto y Ejercicio de Derechos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Para ejercer sus derechos de protección de datos o realizar consultas sobre esta política, puede contactarnos:
              </p>
              <div className="bg-card/50 p-4 sm:p-5 rounded-lg space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base text-foreground/90"><strong>Email General:</strong> privacy@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Email DPO:</strong> dpo@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Formulario de Solicitud:</strong> Disponible en su panel de usuario</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Tiempo de respuesta:</strong> Máximo 30 días (GDPR) / 45 días (CCPA)</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Autoridad Supervisora (UE):</strong> Puede presentar una reclamación ante su autoridad local de protección de datos</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Nos reservamos el derecho de actualizar esta política. Los cambios significativos serán notificados 
                con al menos 30 días de anticipación por email y mediante aviso en la plataforma.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
