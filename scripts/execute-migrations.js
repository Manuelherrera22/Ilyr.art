#!/usr/bin/env node

/**
 * Script para ejecutar migraciones SQL en Supabase
 * Lee el archivo .env y ejecuta las migraciones usando la API REST de Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer archivo .env manualmente
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

async function executeSQL(supabase, sql) {
  // Supabase no tiene una API directa para ejecutar SQL arbitrario
  // Necesitamos usar la función rpc o ejecutar directamente
  // Por ahora, vamos a intentar ejecutar statement por statement
  
  // Dividir en statements individuales
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => {
      // Filtrar comentarios y líneas vacías
      return s.length > 0 
        && !s.startsWith('--') 
        && !s.startsWith('/*')
        && !s.match(/^\s*$/);
    });

  const results = [];
  
  for (const statement of statements) {
    if (statement.length < 10) continue; // Ignorar statements muy cortos
    
    try {
      // Intentar ejecutar usando rpc (requiere función en Supabase)
      // Si no funciona, mostrar el SQL para ejecutar manualmente
      console.log(`   Ejecutando: ${statement.substring(0, 50)}...`);
      
      // Nota: Supabase no permite ejecutar SQL arbitrario por seguridad
      // Necesitamos ejecutar esto manualmente o crear funciones stored
      results.push({ statement, success: false, note: 'Requiere ejecución manual' });
    } catch (error) {
      results.push({ statement, success: false, error: error.message });
    }
  }
  
  return results;
}

async function main() {
  console.log('🚀 Iniciando ejecución de migraciones...\n');
  
  // Cargar variables de entorno
  const env = await loadEnv();
  if (!env) {
    console.error('❌ No se pudo cargar el archivo .env');
    console.log('💡 Asegúrate de que el archivo .env existe en la raíz del proyecto');
    process.exit(1);
  }

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const serviceRoleKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  console.log('🔍 Variables encontradas:', Object.keys(env));
  console.log('🔍 VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('🔍 VITE_SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✅' : '❌');

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Faltan credenciales en .env');
    console.log('   Requerido: VITE_SUPABASE_URL y VITE_SUPABASE_SERVICE_ROLE_KEY');
    console.log('   Variables encontradas:', Object.keys(env));
    process.exit(1);
  }

  console.log(`📍 URL: ${supabaseUrl}`);
  console.log(`🔑 Service Role Key: ${serviceRoleKey.substring(0, 20)}...\n`);

  // Crear cliente de Supabase
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Lista de migraciones
  const migrations = [
    {
      name: '1. Plataforma de Colaboración - Tablas Base',
      file: join(__dirname, '../supabase/migrations/20251113_collaboration_platform.sql')
    },
    {
      name: '2. Plataforma de Colaboración - RLS',
      file: join(__dirname, '../supabase/migrations/20251113_collaboration_platform_rls.sql')
    },
    {
      name: '3. Dashboard de Creadores - Tablas',
      file: join(__dirname, '../supabase/migrations/20251113_creator_dashboard.sql')
    },
    {
      name: '4. Dashboard de Creadores - RLS',
      file: join(__dirname, '../supabase/migrations/20251113_creator_dashboard_rls.sql')
    }
  ];

  console.log('⚠️  IMPORTANTE: Supabase no permite ejecutar SQL arbitrario por seguridad.');
  console.log('📝 Las migraciones deben ejecutarse manualmente desde el SQL Editor.\n');
  console.log('🔗 Abre este enlace para ejecutar las migraciones:');
  console.log(`   https://supabase.com/dashboard/project/${env.VITE_SUPABASE_PROJECT_ID || 'irfjdnwxbzlcpbxhjuqq'}/sql/new\n`);
  console.log('📋 Orden de ejecución:\n');

  for (const migration of migrations) {
    try {
      const sql = readFileSync(migration.file, 'utf-8');
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📄 ${migration.name}`);
      console.log(`📁 Archivo: ${migration.file}`);
      console.log(`📏 Tamaño: ${sql.length} caracteres`);
      console.log(`${'='.repeat(60)}`);
      console.log('\n📋 SQL a ejecutar:\n');
      console.log(sql);
      console.log('\n' + '='.repeat(60) + '\n');
    } catch (error) {
      console.error(`❌ Error leyendo ${migration.name}:`, error.message);
    }
  }

  console.log('\n✅ Script completado.');
  console.log('💡 Copia y pega cada bloque SQL en el SQL Editor de Supabase en el orden indicado.');
}

main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
