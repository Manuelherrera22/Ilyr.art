import { createClient } from '@supabase/supabase-js';

// Obtener credenciales de variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://irfjdnwxbzlcpbxhjuqq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZmpkbnd4YnpsY3BieGhqdXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzQzNDIsImV4cCI6MjA2NjYxMDM0Mn0.39TnJQhdJNMZ5ysWWaX-WWRN4owfwXpl1NJYvxU2ZKQ';

// Cliente de Supabase para uso público (anon key)
// Configuración con timeouts para evitar bloqueos
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-client-info': 'ilyrart-web'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Cliente de Supabase para operaciones administrativas (service role key)
// Solo usar en el servidor o para operaciones que requieren permisos elevados
export const supabaseAdmin = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;