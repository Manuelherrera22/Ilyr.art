import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Scale, Copyright, Building, Globe, Award, FileCheck } from 'lucide-react';

const LegalNoticePage = () => {
  const sections = [
    {
      title: "1. Información Corporativa",
      icon: Building,
      content: [
        "Razón Social: ILYR.AI Holding Creativo",
        "Plataforma: ILYR.art - Visualización Creativa con IA",
        "Domicilio: Colombia (información detallada disponible bajo solicitud)",
        "Actividad: Desarrollo de tecnología creativa y servicios de visualización digital"
      ]
    },
    {
      title: "2. Propiedad Intelectual de ILYR.art",
      icon: Copyright,
      content: [
        "Marca registrada: ILYR.art y ILYR.AI son marcas protegidas",
        "Software y algoritmos: propiedad exclusiva de ILYR.AI Holding",
        "Diseño y experiencia de usuario: protegidos por derechos de autor",
        "Base de datos y metodologías: consideradas secreto comercial"
      ]
    },
    {
      title: "3. Contenido Generado por IA",
      icon: Award,
      content: [
        "Licencia de uso: otorgada al usuario para contenido generado específicamente",
        "Derechos compartidos: cuando hay colaboración humana significativa",
        "Material de referencia: imágenes base, configuraciones, prompts de entrada",
        "Entregable final: contenido procesado, editado y exportado para uso comercial"
      ]
    },
    {
      title: "4. Limitaciones y Exclusiones",
      icon: Scale,
      content: [
        "Uso responsable: el usuario debe verificar la originalidad del contenido final",
        "Derechos de terceros: ILYR.art no se responsabiliza por infracciones no detectadas",
        "Contenido prohibido: material ilegal, ofensivo o que viole derechos existentes",
        "Garantías: limitadas a la funcionalidad técnica de la plataforma"
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
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Aviso Legal</h1>
            <p className="text-lg text-muted-foreground">
              Información legal y de propiedad intelectual
            </p>
          </div>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Marco Legal de ILYR.art</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Este aviso legal establece los términos bajo los cuales ILYR.art, operada por ILYR.AI Holding Creativo, 
                pone a disposición su plataforma de visualización creativa con inteligencia artificial. La información 
                contenida en este sitio web está sujeta a la legislación colombiana e internacional aplicable.
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
                <Globe className="mr-3 h-6 w-6 text-primary" />
                Cumplimiento Internacional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                ILYR.art opera bajo estrictos estándares internacionales de protección de datos y propiedad intelectual:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Protección de Datos</h4>
                  <ul className="text-sm space-y-1">
                    <li>• GDPR (Unión Europea)</li>
                    <li>• Ley Habeas Data (Colombia)</li>
                    <li>• ISO/IEC 27001 (Seguridad)</li>
                  </ul>
                </div>
                <div className="bg-card/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Propiedad Intelectual</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Convenio de Berna</li>
                    <li>• Tratado OMPI</li>
                    <li>• Legislación nacional aplicable</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <FileCheck className="mr-3 h-6 w-6 text-primary" />
                Certificaciones y Buenas Prácticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Nuestro compromiso con la excelencia se refleja en nuestras certificaciones y adherencia a mejores prácticas:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Implementación de controles de seguridad ISO/IEC 27001</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Cifrado de extremo a extremo para datos sensibles</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Auditorías regulares de seguridad y cumplimiento</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Políticas de retención de datos transparentes</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Contacto Legal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Para consultas legales, reclamaciones de propiedad intelectual o solicitudes de cumplimiento normativo:
              </p>
              <div className="bg-card/50 p-4 rounded-lg">
                <p className="text-foreground/90"><strong>Departamento Legal:</strong> legal@ilyr.art</p>
                <p className="text-foreground/90"><strong>Reclamaciones IP:</strong> ip-claims@ilyr.art</p>
                <p className="text-foreground/90"><strong>Cumplimiento:</strong> compliance@ilyr.art</p>
                <p className="text-foreground/90"><strong>Tiempo de respuesta:</strong> 5-10 días hábiles</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Este aviso legal puede ser actualizado periódicamente. La versión más reciente estará siempre 
                disponible en esta página.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalNoticePage;