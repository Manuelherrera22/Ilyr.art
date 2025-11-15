import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Cookie, Settings, BarChart, Shield, Globe, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CookiePolicyPage = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    personalization: false
  });
  const { toast } = useToast();

  const handlePreferenceChange = (type) => {
    if (type === 'essential') return;
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    toast({
      title: "✅ Preferencias guardadas",
      description: "Tus preferencias de cookies han sido actualizadas correctamente.",
      className: 'bg-green-500 text-white',
    });
  };

  const cookieTypes = [
    {
      title: "Cookies Esenciales",
      icon: Shield,
      type: "essential",
      required: true,
      description: "Necesarias para el funcionamiento básico de la plataforma",
      examples: [
        "Autenticación de usuario y gestión de sesiones",
        "Preferencias de idioma y configuración básica",
        "Seguridad y prevención de ataques CSRF",
        "Funcionalidad del carrito de compras y formularios"
      ]
    },
    {
      title: "Cookies de Análisis",
      icon: BarChart,
      type: "analytics",
      required: false,
      description: "Nos ayudan a entender cómo los usuarios interactúan con la plataforma",
      examples: [
        "Estadísticas de uso y navegación",
        "Análisis de rendimiento de funcionalidades",
        "Identificación de errores y problemas técnicos",
        "Métricas de tiempo de carga y optimización"
      ]
    },
    {
      title: "Cookies de Marketing",
      icon: Globe,
      type: "marketing",
      required: false,
      description: "Utilizadas para mostrar contenido relevante y personalizado",
      examples: [
        "Seguimiento de campañas publicitarias",
        "Personalización de contenido promocional",
        "Análisis de efectividad de marketing",
        "Retargeting y remarketing"
      ]
    },
    {
      title: "Cookies de Personalización",
      icon: Settings,
      type: "personalization",
      required: false,
      description: "Mejoran la experiencia del usuario recordando preferencias",
      examples: [
        "Configuraciones de interfaz personalizadas",
        "Historial de proyectos y preferencias creativas",
        "Recomendaciones basadas en uso anterior",
        "Configuración de notificaciones"
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
              <Cookie className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Política de Cookies</h1>
            <p className="text-lg text-muted-foreground">
              Gestiona tus preferencias de cookies y privacidad
            </p>
          </div>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">¿Qué son las Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas ILYR.art. 
                Nos ayudan a mejorar tu experiencia, recordar tus preferencias y proporcionar funcionalidades personalizadas.
              </p>
              <p className="text-foreground/90">
                Utilizamos diferentes tipos de cookies según su propósito y duración. Puedes gestionar tus preferencias 
                en cualquier momento desde esta página.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Gestión de Preferencias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cookieTypes.map((cookieType, index) => (
                  <motion.div
                    key={cookieType.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border border-border/50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <cookieType.icon className="mr-3 h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">{cookieType.title}</h3>
                        {cookieType.required && (
                          <span className="ml-2 px-2 py-1 bg-accent/20 text-accent text-xs rounded">
                            Requeridas
                          </span>
                        )}
                      </div>
                      <Button
                        variant={cookiePreferences[cookieType.type] ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange(cookieType.type)}
                        disabled={cookieType.required}
                        className={cookiePreferences[cookieType.type] ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {cookiePreferences[cookieType.type] ? (
                          <>
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Activado
                          </>
                        ) : (
                          "Desactivado"
                        )}
                      </Button>
                    </div>
                    <p className="text-foreground/80 mb-3">{cookieType.description}</p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Ejemplos de uso:</strong>
                      <ul className="mt-1 space-y-1">
                        {cookieType.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex} className="flex items-start">
                            <div className="w-1 h-1 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex gap-4">
                <Button onClick={savePreferences} className="bg-primary hover:bg-primary/90">
                  Guardar Preferencias
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCookiePreferences({
                    essential: true,
                    analytics: false,
                    marketing: false,
                    personalization: false
                  })}
                >
                  Rechazar Todas (Excepto Esenciales)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Cookies de Terceros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                ILYR.art utiliza servicios de terceros que pueden establecer sus propias cookies:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Servicios de Infraestructura</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Supabase (autenticación y base de datos)</li>
                    <li>• Servicios de CDN para optimización</li>
                    <li>• Proveedores de seguridad web</li>
                  </ul>
                </div>
                <div className="bg-card/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Herramientas de Análisis</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Análisis de rendimiento web</li>
                    <li>• Monitoreo de errores</li>
                    <li>• Métricas de uso de IA</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Control y Eliminación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">
                Tienes control total sobre las cookies en tu navegador:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Configurar preferencias desde esta página</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Eliminar cookies desde la configuración de tu navegador</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Usar modo incógnito para sesiones sin cookies persistentes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-foreground/90">Contactar a privacy@ilyr.art para asistencia adicional</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad de la plataforma.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;