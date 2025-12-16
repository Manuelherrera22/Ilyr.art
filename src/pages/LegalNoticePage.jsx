import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Scale, Copyright, Building, Globe, Award, FileCheck, Mail, CheckCircle2 } from 'lucide-react';

const LegalNoticePage = () => {
  const sections = [
    {
      title: "1. Información Corporativa",
      icon: Building,
      content: [
        "Razón Social: ILYR.AI Holding Creativo",
        "Plataforma: ILYR.art - Visualización Creativa con IA",
        "Domicilio: Colombia (información detallada disponible bajo solicitud a legal@ilyr.art)",
        "Actividad: Desarrollo de tecnología creativa y servicios de visualización digital",
        "Registro: Información de registro comercial disponible mediante solicitud formal",
        "Representante Legal: Información disponible mediante solicitud a legal@ilyr.art"
      ]
    },
    {
      title: "2. Propiedad Intelectual de ILYR.art",
      icon: Copyright,
      content: [
        "Marca registrada: ILYR.art y ILYR.AI son marcas protegidas internacionalmente",
        "Software y algoritmos: propiedad exclusiva de ILYR.AI Holding, protegidos por derechos de autor y secretos comerciales",
        "Diseño y experiencia de usuario: protegidos por derechos de autor y diseño industrial",
        "Base de datos y metodologías: consideradas secreto comercial y protegidas legalmente",
        "Contenido de la plataforma: textos, imágenes, logos y elementos gráficos son propiedad de ILYR.AI",
        "Licencias: cualquier uso no autorizado constituye violación de derechos de propiedad intelectual"
      ]
    },
    {
      title: "3. Contenido Generado por IA",
      icon: Award,
      content: [
        "Licencia de uso: otorgada al usuario para contenido generado específicamente por su cuenta",
        "Derechos compartidos: cuando hay colaboración humana significativa, los derechos se comparten",
        "Material de referencia: imágenes base, configuraciones, prompts de entrada no constituyen entregable final",
        "Entregable final: contenido procesado, editado y exportado para uso comercial pertenece al usuario",
        "Uso comercial: el usuario puede usar el contenido generado para fines comerciales sin restricciones adicionales",
        "Atribución: no se requiere atribución a ILYR.art para contenido generado, aunque es apreciada"
      ]
    },
    {
      title: "4. Limitaciones y Exclusiones",
      icon: Scale,
      content: [
        "Uso responsable: el usuario debe verificar la originalidad y adecuación del contenido final para su propósito",
        "Derechos de terceros: ILYR.art no se responsabiliza por infracciones de derechos de terceros no detectadas automáticamente",
        "Contenido prohibido: material ilegal, ofensivo, difamatorio o que viole derechos existentes está estrictamente prohibido",
        "Garantías: limitadas a la funcionalidad técnica de la plataforma, no garantizamos resultados comerciales específicos",
        "Indemnización: el usuario indemniza a ILYR.art por cualquier reclamación derivada del uso del contenido generado",
        "Exclusión de daños: no nos responsabilizamos por daños indirectos, lucro cesante o consecuenciales"
      ]
    },
    {
      title: "5. Jurisdicción y Ley Aplicable",
      icon: Globe,
      content: [
        "Ley aplicable: legislación colombiana, con reconocimiento de tratados y convenios internacionales",
        "Jurisdicción: tribunales de Colombia para disputas, con posibilidad de arbitraje según acuerdo",
        "Resolución de disputas: preferencia por resolución amistosa, luego arbitraje, finalmente jurisdicción ordinaria",
        "Tratados internacionales: respetamos convenios de propiedad intelectual (Convenio de Berna, OMPI)",
        "Protección de datos: cumplimiento con GDPR, CCPA, LGPD y Ley Habeas Data según corresponda",
        "Exportación: servicios pueden estar sujetos a regulaciones de exportación de tecnología"
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
              <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">Aviso Legal</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Información legal y de propiedad intelectual
            </p>
          </div>

          <Card className="glass-card mb-6 sm:mb-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">Marco Legal de ILYR.art</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Este aviso legal establece los términos bajo los cuales ILYR.art, operada por ILYR.AI Holding Creativo, 
                pone a disposición su plataforma de visualización creativa con inteligencia artificial. La información 
                contenida en este sitio web está sujeta a la legislación colombiana e internacional aplicable.
              </p>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Este documento forma parte integral de nuestros Términos y Condiciones y Política de Privacidad.
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
                <Globe className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Cumplimiento Internacional
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                ILYR.art opera bajo estrictos estándares internacionales de protección de datos y propiedad intelectual:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="bg-card/50 p-4 sm:p-5 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Protección de Datos</h4>
                  <ul className="text-xs sm:text-sm space-y-1.5 sm:space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span>GDPR (Unión Europea)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span>CCPA (California, EE.UU.)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span>LGPD (Brasil)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span>Ley Habeas Data (Colombia)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span>ISO/IEC 27001 (Seguridad)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card/50 p-4 sm:p-5 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Propiedad Intelectual</h4>
                  <ul className="text-xs sm:text-sm space-y-1.5 sm:space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span>Convenio de Berna</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span>Tratado OMPI</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span>Acuerdos TRIPS</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span>Legislación nacional aplicable</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent mt-0.5 mr-2 flex-shrink-0" />
                      <span>Protección de marcas y patentes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mt-6 sm:mt-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center">
                <FileCheck className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Certificaciones y Buenas Prácticas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Nuestro compromiso con la excelencia se refleja en nuestras certificaciones y adherencia a mejores prácticas:
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Implementación de controles de seguridad ISO/IEC 27001</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Cifrado de extremo a extremo para datos sensibles (TLS 1.3, AES-256)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Auditorías regulares de seguridad y cumplimiento (anuales y bajo demanda)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Políticas de retención de datos transparentes y documentadas</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Programa de gestión de incidentes y respuesta a brechas de seguridad</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 sm:mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground/90">Capacitación regular del personal en seguridad de la información</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card mt-6 sm:mt-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl flex items-center">
                <Mail className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Contacto Legal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Para consultas legales, reclamaciones de propiedad intelectual o solicitudes de cumplimiento normativo:
              </p>
              <div className="bg-card/50 p-4 sm:p-5 rounded-lg space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base text-foreground/90"><strong>Departamento Legal:</strong> legal@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Reclamaciones IP:</strong> ip-claims@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Cumplimiento:</strong> compliance@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Notificaciones Legales:</strong> notices@ilyr.art</p>
                <p className="text-sm sm:text-base text-foreground/90"><strong>Tiempo de respuesta:</strong> 5-10 días hábiles</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Este aviso legal puede ser actualizado periódicamente. La versión más reciente estará siempre 
                disponible en esta página. Se recomienda revisar periódicamente para estar informado de cualquier cambio.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalNoticePage;
