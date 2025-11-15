import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SystemMetrics from './components/SystemMetrics';
import AccountsManagement from './components/AccountsManagement';
import UsersManagement from './components/UsersManagement';
import ServicesManagement from './components/ServicesManagement';
import NotificationsBell from '@/components/NotificationsBell';

const AdminOverview = () => (
  <div className="space-y-6">
    <SystemMetrics />
  </div>
);

const AdminPortal = () => (
  <div className="min-h-screen bg-[#05070D] text-white">
    <div className="border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">ILYR Admin Console</p>
          <h1 className="text-2xl font-semibold text-white">Gobernanza y métricas</h1>
        </div>
        <div className="flex gap-3 items-center">
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to=".">Métricas</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="accounts">Cuentas</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="users">Usuarios</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="services">Servicios</Link>
          </Button>
          <NotificationsBell />
        </div>
      </div>
    </div>
    <main className="mx-auto min-h-[calc(100vh-120px)] w-full max-w-6xl px-6 py-10">
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="accounts" element={<AccountsManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </main>
  </div>
);

export default AdminPortal;

