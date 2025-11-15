import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CreativeTasksList from './components/CreativeTasksList';
import CreativeProjectDetail from './components/CreativeProjectDetail';
import NotificationsBell from '@/components/NotificationsBell';

const CreativePortal = () => (
  <div className="min-h-screen bg-[#05070D] text-white">
    <div className="border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">ILYR Creative Workspace</p>
          <h1 className="text-2xl font-semibold text-white">Tus misiones y entregables</h1>
        </div>
        <div className="flex gap-3 items-center">
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to=".">Mis tareas</Link>
          </Button>
          <NotificationsBell />
        </div>
      </div>
    </div>
    <main className="mx-auto min-h-[calc(100vh-120px)] w-full max-w-6xl px-6 py-10">
      <Routes>
        <Route index element={<CreativeTasksList />} />
        <Route path="projects/:projectId" element={<CreativeProjectDetail />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </main>
  </div>
);

export default CreativePortal;

