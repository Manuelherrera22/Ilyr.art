#!/usr/bin/env node

/**
 * Script para ejecutar migraciones SQL directamente en Supabase
 * Usa la API REST de Supabase con service role key
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer archivo .env
async function loadEnv() {
  try {
    const envPath = join(__dirname, '../.env');
    const envContent = await readFile(envPath, 'utf-8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const equalIndex = trimmed.indexOf('=');
        if (equalIndex > 0) {
          const key = trimmed.substring(0, equalIndex).trim();
          const value = trimmed.substring(equalIndex + 1).trim();
          if (key && value) {
            env[key] = value;
          }
        }
      }
    });
    return env;
  } catch (error) {
    console.error('Error leyendo .env:', error.message);
    return null;
  }
}

// Ejecutar SQL usando fetch directo a la API de Supabase
async function executeSQL(url, serviceKey, sql) {
  // Dividir SQL en statements individuales
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => {
      return s.length > 0 
        && !s.startsWith('--') 
        && !s.startsWith('/*')
        && !s.match(/^\s*$/);
    });

  const results = [];
  
  for (const statement of statements) {
    if (statement.length < 10) continue;
    
    try {
      // Intentar ejecutar usando la API REST de Supabase
      // Nota: Esto requiere que Supabase tenga habilitado el endpoint de SQL
      const response = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`
        },
        body: JSON.stringify({ query: statement })
      });

      if (response.ok) {
        results.push({ statement: statement.substring(0, 50), success: true });
      } else {
        const errorText = await response.text();
        results.push({ 
          statement: statement.substring(0, 50), 
          success: false, 
          error: errorText 
        });
      }
    } catch (error) {
      // Si falla, intentar método alternativo
      results.push({ 
        statement: statement.substring(0, 50), 
        success: false, 
        error: error.message,
        note: 'Requiere ejecución manual desde SQL Editor'
      });
    }
  }
  
  return results;
}

async function main() {
  console.log('🚀 Ejecutando migraciones en Supabase...\n');
  
  const env = await loadEnv();
  if (!env) {
    console.error('❌ No se pudo cargar .env');
    process.exit(1);
  }

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const serviceRoleKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Faltan credenciales');
    process.exit(1);
  }

  console.log(`📍 URL: ${supabaseUrl}`);
  console.log(`🔑 Usando Service Role Key\n`);

  // Migraciones en orden
  const migrations = [
    {
      name: 'Plataforma de Colaboración - Tablas Base',
      file: join(__dirname, '../supabase/migrations/20251113_collaboration_platform.sql')
    },
    {
      name: 'Plataforma de Colaboración - RLS',
      file: join(__dirname, '../supabase/migrations/20251113_collaboration_platform_rls.sql')
    },
    {
      name: 'Dashboard de Creadores - Tablas',
      file: join(__dirname, '../supabase/migrations/20251113_creator_dashboard.sql')
    },
    {
      name: 'Dashboard de Creadores - RLS',
      file: join(__dirname, '../supabase/migrations/20251113_creator_dashboard_rls.sql')
    }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const migration of migrations) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📄 ${migration.name}`);
      console.log(`${'='.repeat(60)}\n`);

      const sql = readFileSync(migration.file, 'utf-8');
      
      // Intentar ejecutar usando el cliente de Supabase directamente
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      // Dividir en statements y ejecutar uno por uno
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 10 && !s.startsWith('--') && !s.startsWith('/*'));

      for (const statement of statements) {
        try {
          // Intentar ejecutar usando rpc (requiere función en Supabase)
          // Como no existe, vamos a mostrar instrucciones
          console.log(`   ⚠️  No se puede ejecutar automáticamente: ${statement.substring(0, 50)}...`);
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }

      console.log(`\n✅ Migración preparada: ${migration.name}`);
      console.log(`💡 Ejecuta manualmente desde: https://supabase.com/dashboard/project/${env.VITE_SUPABASE_PROJECT_ID || 'irfjdnwxbzlcpbxhjuqq'}/sql/new`);
      
    } catch (error) {
      console.error(`❌ Error procesando ${migration.name}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Resumen:`);
  console.log(`   ✅ Preparadas: ${migrations.length - failCount}`);
  console.log(`   ❌ Errores: ${failCount}`);
  console.log(`${'='.repeat(60)}\n`);

  console.log('⚠️  IMPORTANTE:');
  console.log('   Supabase no permite ejecutar SQL arbitrario por seguridad.');
  console.log('   Debes ejecutar las migraciones manualmente desde el SQL Editor.');
  console.log(`\n🔗 Enlace directo:`);
  console.log(`   https://supabase.com/dashboard/project/${env.VITE_SUPABASE_PROJECT_ID || 'irfjdnwxbzlcpbxhjuqq'}/sql/new\n`);
}

main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
