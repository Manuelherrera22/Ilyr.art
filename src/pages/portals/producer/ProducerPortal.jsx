import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BriefList from './components/BriefList';
import BriefDetail from './components/BriefDetail';
import NotificationsBell from '@/components/NotificationsBell';

const ProducerOverview = () => (
  <div className="space-y-6">
    <Card className="bg-card/40 border-border/40">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground">
          Panel del productor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-foreground/80">
        <p>
          Aquí centralizaremos briefs entrantes, asignaciones del equipo y seguimiento de hitos.
          Usa las secciones laterales para revisar cada flujo mientras construimos el tablero definitivo.
        </p>
      </CardContent>
    </Card>
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
      <Card className="bg-card/20 border-border/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Bandeja de briefs
          </CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/70">
          Recibirás solicitudes de clientes con validaciones IA y recomendaciones de pipeline.
        </CardContent>
      </Card>
      <Card className="bg-card/20 border-border/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Orquestación de squad
          </CardTitle>
        </CardHeader>
        <CardContent className="text-foreground/70">
          Asigna especialistas, controla carga de trabajo y coordina sesiones de revisión.
        </CardContent>
      </Card>
    </div>
  </div>
);

const BriefsBoard = () => {
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const triggerRefresh = () => setRefreshToken((prev) => prev + 1);

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-1 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Briefs pendientes</h2>
          <p className="text-xs sm:text-sm text-white/60">
            Prioriza los briefs en estado <span className="text-accent">submitted</span>. Cuando avances, se moverán al tablero de producción.
          </p>
        </div>
        <BriefList
          key={refreshToken}
          onSelectBrief={(brief) => setSelectedBrief(brief)}
        />
      </div>
      <div className="h-full">
        {selectedBrief ? (
          <BriefDetail
            brief={selectedBrief}
            onClose={() => setSelectedBrief(null)}
            onRefresh={triggerRefresh}
          />
        ) : (
          <Card className="border border-white/10 bg-[#121420]/60 h-full">
            <CardContent className="flex h-full flex-col items-center justify-center text-white/60">
              <p className="text-lg font-semibold">Selecciona un brief para ver su detalle.</p>
              <p className="mt-2 text-sm text-white/40">
                Aquí podrás cambiar el estado, agregar notas y coordinar la propuesta.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const ProducerPortal = () => (
  <div className="min-h-screen bg-[#05070D] text-white">
    <div className="border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50">ILYR Producer Workspace</p>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight">Operaciones y gestión de pipeline</h1>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full sm:w-auto">
          <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm flex-1 sm:flex-initial">
            <Link to=".">Resumen</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm flex-1 sm:flex-initial">
            <Link to="briefs">Briefs</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm flex-1 sm:flex-initial">
            <Link to="assignments">Asignaciones</Link>
          </Button>
          <div className="flex-shrink-0">
            <NotificationsBell />
          </div>
        </div>
      </div>
    </div>
    <main className="mx-auto min-h-[calc(100vh-120px)] w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8">
      <Routes>
        <Route index element={<ProducerOverview />} />
        <Route path="briefs" element={<BriefsBoard />} />
        <Route path="assignments" element={<ProducerOverview />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </main>
  </div>
);

export default ProducerPortal;

