import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, FileText, Users, Briefcase, Palette, Shield, AlertTriangle, Scale, CreditCard, Ban, CheckCircle2 } from 'lucide-react';

const TermsOfServicePage = () => {
  const sections = [
    {
      title: "1. Definiciones y Alcance",
      icon: FileText,
      content: [
        "ILYR.art: plataforma de visualización creativa con inteligencia artificial operada por ILYR.AI Holding Creativo",
        "Usuario: cualquier persona que accede y utiliza nuestros servicios (cliente, productor, creativo, administrador)",
        "Contenido Generado: material visual creado mediante nuestras herramientas de IA",
        "Servicios: incluye previsualizador IA, editor visual, producción profesional, gestión de proyectos y exportador",
        "Cuenta: perfil de usuario con acceso a funcionalidades según tipo de rol asignado"
      ]
    },
    {
      title: "2. Condiciones por Tipo de Usuario",
      icon: Users,
      content: [
        "Clientes: acceso a portal de cliente, creación de briefs, seguimiento de proyectos, comunicación con equipos",
        "Productores: gestión de briefs, asignación de creativos, supervisión de proyectos, coordinación de entregas",
        "Creativos: acceso a tareas asignadas, subida de assets, colaboración en proyectos, comunicación con clientes",
        "Administradores: acceso completo al sistema, gestión de usuarios, métricas, configuración de servicios",
        "Todos los usuarios deben ser mayores de 18 años o contar con autorización parental verificable"
      ]
    },
    {
      title: "3. Uso de Inteligencia Artificial",
      icon: Palette,
      content: [
        "El contenido generado por IA es único pero puede basarse en patrones de entrenamiento de modelos públicos y privados",
        "No garantizamos resultados específicos, la IA es una herramienta de asistencia creativa que requiere supervisión humana",
        "El usuario mantiene responsabilidad sobre el uso final del contenido generado y debe verificar su adecuación",
        "Prohibido generar contenido ilegal, ofensivo, que infrinja derechos de terceros o viole términos de servicio",
        "Reservamos el derecho de revisar y moderar contenido generado para cumplir con estándares de la comunidad"
      ]
    },
    {
      title: "4. Propiedad Intelectual",
      icon: Scale,
      content: [
        "El usuario retiene todos los derechos sobre el contenido original que sube a la plataforma",
        "ILYR.art otorga licencia de uso no exclusiva sobre el contenido generado por IA al usuario que lo creó",
        "Material de referencia: imágenes base, configuraciones, prompts de entrada no constituyen entregable final",
        "Entregable final: contenido procesado, editado y exportado listo para uso comercial pertenece al usuario",
        "La plataforma, software, algoritmos y metodologías son propiedad exclusiva de ILYR.AI Holding Creativo"
      ]
    },
    {
      title: "5. Limitaciones de Responsabilidad",
      icon: AlertTriangle,
      content: [
        "ILYR.art no se responsabiliza por el uso comercial específico del contenido generado por el usuario",
        "Los resultados visuales son aproximaciones y pueden requerir ajustes adicionales por parte del usuario",
        "No garantizamos disponibilidad del servicio 24/7, pueden ocurrir mantenimientos programados o de emergencia",
        "El usuario es responsable de verificar derechos de uso en contenido de terceros que suba a la plataforma",
        "No nos hacemos responsables por pérdidas indirectas, lucro cesante o daños consecuenciales",
        "Nuestra responsabilidad total está limitada al monto pagado por el usuario en los últimos 12 meses"
      ]
    },
    {
      title: "6. Gestión de Proyectos y Cancelaciones",
      icon: Briefcase,
      content: [
        "Proyectos de producción profesional: cancelación sin penalización hasta 24h antes del inicio de producción",
        "Cancelaciones tardías: pueden estar sujetas a cargos por trabajo ya realizado o recursos comprometidos",
        "Reembolsos: aplicables según política específica de cada tipo de servicio y momento de cancelación",
        "Modificaciones: permitidas durante fase de desarrollo, pueden generar costos adicionales según alcance",
        "Entrega: plazos estimados, pueden variar según complejidad del proyecto y disponibilidad de recursos",
        "Aceptación: el cliente tiene 7 días para revisar y solicitar cambios, después se considera aceptado"
      ]
    },
    {
      title: "7. Pagos y Facturación",
      icon: CreditCard,
      content: [
        "Precios: todos los precios están en USD y son por proyecto, pueden variar según complejidad y alcance",
        "Facturación: facturación al inicio del proyecto o según términos acordados en el plan de servicio",
        "Métodos de pago: aceptamos tarjetas de crédito, transferencias bancarias y otros métodos según disponibilidad",
        "Impuestos: el usuario es responsable de cualquier impuesto aplicable según su jurisdicción",
        "Reembolsos: procesados según política de cancelación, pueden tardar 5-10 días hábiles",
        "Disputas: cualquier disputa de facturación debe reportarse dentro de 30 días de la fecha de factura"
      ]
    },
    {
      title: "8. Uso Aceptable y Prohibiciones",
      icon: Ban,
      content: [
        "Prohibido: usar la plataforma para actividades ilegales, fraudulentas o que violen derechos de terceros",
        "Prohibido: intentar acceder a áreas no autorizadas, realizar ingeniería inversa o comprometer la seguridad",
        "Prohibido: generar contenido que sea difamatorio, acosador, discriminatorio o que promueva odio",
        "Prohibido: usar la plataforma para competir directamente con ILYR.art o replicar nuestros servicios",
        "Prohibido: compartir credenciales de acceso, cada usuario debe tener su propia cuenta",
        "Violaciones: pueden resultar en suspensión o terminación inmediata de la cuenta sin reembolso"
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
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">Términos y Condiciones de Uso</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <Card className="glass-card mb-6 sm:mb-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">Acuerdo de Servicios</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Estos términos y condiciones regulan el uso de ILYR.art, una plataforma de visualización creativa 
                con inteligencia artificial operada por ILYR.AI Holding Creativo. Al acceder y utilizar nuestros 
                servicios, usted acepta estar sujeto a estos términos.
              </p>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Nuestros servicios están diseñados para profesionales creativos, agencias y marcas que buscan 
                soluciones innovadoras de visualización y producción de contenido. El uso continuado de nuestros 
                servicios constituye aceptación de estos términos y cualquier modificación futura.
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
                <Shield className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Cumplimiento y Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                ILYR.art opera bajo estrictos estándares de seguridad y cumplimiento normativo:
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Cumplimiento con GDPR para usuarios europeos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Adherencia a CCPA para usuarios de California</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Cumplimiento con LGPD para usuarios de Brasil</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Adherencia a Ley Habeas Data para Colombia y LatAm</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Implementación de medidas ISO/IEC 27001 y SOC 2</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Auditorías regulares de seguridad digital</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card mt-6 sm:mt-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">Modificaciones y Contacto</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos 
                serán notificados con al menos 30 días de anticipación por email y mediante aviso prominente en la plataforma.
              </p>
              <div className="bg-card/50 p-4 sm:p-5 rounded-lg space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base text-foreground/90"><strong>Contacto Legal:</strong> legal@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Soporte Técnico:</strong> support@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Disputas:</strong> disputes@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Jurisdicción:</strong> Colombia, con aplicación de normativa internacional</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Ley Aplicable:</strong> Legislación colombiana, con reconocimiento de tratados internacionales</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Al continuar utilizando nuestros servicios después de cualquier modificación, usted acepta 
                los términos actualizados. Si no está de acuerdo con los cambios, debe discontinuar el uso 
                de nuestros servicios y puede solicitar la eliminación de su cuenta.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
