import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClientBriefForm from './components/ClientBriefForm';
import ProjectsOverview from './components/ProjectsOverview';
import ClientProjectDetail from './components/ClientProjectDetail';
import NotificationsBell from '@/components/NotificationsBell';

const ClientHome = () => (
  <div className="space-y-6">
    <Card className="bg-card/40 border-border/40">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground">
          Próximos pasos de tu partnership
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-foreground/80">
        <p>
          Aquí verás tus proyectos activos, próximos hitos y mensajes del equipo ILYR. Mientras construimos
          las funcionalidades operativas, puedes iniciar un brief inteligente para activar el equipo.
        </p>
        <Button asChild className="bg-gradient-to-r from-accent to-orange-500 text-accent-foreground">
          <Link to="brief/new">Crear brief</Link>
        </Button>
      </CardContent>
    </Card>
    <Card className="bg-card/20 border-border/30">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          ¿Qué podrás hacer aquí?
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-foreground/70">
        <div>
          <h3 className="font-semibold text-foreground">1. Gestionar proyectos</h3>
          <p>Resumen de estatus, responsables y próximos pasos para cada producción.</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">2. Seguir entregables</h3>
          <p>Versiones, descargas finales y aprobaciones centralizadas.</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">3. Colaborar con el estudio</h3>
          <p>Mensajería estructurada, comentarios y agenda de sesiones.</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ProjectsPlaceholder = () => (
  <Card className="border border-white/10 bg-[#10121A]/80 backdrop-blur">
    <CardHeader>
      <CardTitle className="text-2xl font-semibold text-white">Tus proyectos</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-white/70">
      <p>
        Estamos conectando la base de datos colaborativa para mostrar tus proyectos activos, estado de hitos y entregables.
        Después de enviar tu brief, aparecerá aquí un timeline con la propuesta del productor y la evolución del proyecto.
      </p>
    </CardContent>
  </Card>
);

const ClientPortalLayout = ({ children }) => (
  <div className="min-h-screen bg-[#05070D] text-white">
    <div className="border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">ILYR Client Portal</p>
          <h1 className="text-2xl font-semibold text-white">Laboratorio de experiencias visuales</h1>
        </div>
        <div className="flex gap-3 items-center">
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to=".">Resumen</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="brief/new">Nuevo brief</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="projects">Proyectos</Link>
          </Button>
          <NotificationsBell />
        </div>
      </div>
    </div>
    <main className="mx-auto min-h-[calc(100vh-120px)] w-full max-w-6xl px-6 py-10">
      {children}
    </main>
  </div>
);

const ClientPortal = () => {
  return (
    <ClientPortalLayout>
      <Routes>
        <Route index element={<ClientHome />} />
        <Route path="brief/new" element={<ClientBriefForm />} />
        <Route path="projects" element={<ProjectsOverview />} />
        <Route path="projects/:projectId" element={<ClientProjectDetail />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </ClientPortalLayout>
  );
};

export default ClientPortal;

