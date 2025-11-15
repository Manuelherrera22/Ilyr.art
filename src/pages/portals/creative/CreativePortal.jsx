import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CreativeTasksList from './components/CreativeTasksList';
import CreativeProjectDetail from './components/CreativeProjectDetail';
import NotificationsBell from '@/components/NotificationsBell';

const CreativePortal = () => (
  <div className="min-h-screen bg-[#05070D] text-white">
    <div className="border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50">ILYR Creative Workspace</p>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight">Tus misiones y entregables</h1>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full sm:w-auto">
          <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm flex-1 sm:flex-initial">
            <Link to=".">Mis tareas</Link>
          </Button>
          <div className="flex-shrink-0">
            <NotificationsBell />
          </div>
        </div>
      </div>
    </div>
    <main className="mx-auto min-h-[calc(100vh-120px)] w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      <Routes>
        <Route index element={<CreativeTasksList />} />
        <Route path="projects/:projectId" element={<CreativeProjectDetail />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </main>
  </div>
);

export default CreativePortal;

