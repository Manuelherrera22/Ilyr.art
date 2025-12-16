#!/usr/bin/env node

/**
 * Ejecuta migraciones SQL usando la API REST de Supabase
 * Usa el service role key para ejecutar SQL directamente
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function executeSQL(url, serviceKey, sql) {
  // Usar la API de Supabase para ejecutar SQL
  // Necesitamos usar el endpoint de PostgREST o crear una función
  // Por ahora, vamos a dividir y ejecutar statement por statement
  
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 10 && !s.startsWith('--') && !s.startsWith('/*'));

  console.log(`   Ejecutando ${statements.length} statements...`);

  // Intentar ejecutar usando fetch directo
  // Nota: Supabase no expone un endpoint directo para SQL arbitrario
  // Necesitamos usar psql o el SQL Editor
  
  // Por ahora, vamos a mostrar las instrucciones y crear un archivo SQL combinado
  return { success: false, note: 'Requiere ejecución manual' };
}

async function main() {
  console.log('🚀 Preparando migraciones para ejecución...\n');
  
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
  console.log(`🔑 Service Role Key configurada\n`);

  // Leer todas las migraciones y combinarlas
  const migrations = [
    join(__dirname, '../supabase/migrations/20251113_collaboration_platform.sql'),
    join(__dirname, '../supabase/migrations/20251113_collaboration_platform_rls.sql'),
    join(__dirname, '../supabase/migrations/20251113_creator_dashboard.sql'),
    join(__dirname, '../supabase/migrations/20251113_creator_dashboard_rls.sql')
  ];

  let combinedSQL = '-- Migraciones combinadas para ejecución\n';
  combinedSQL += '-- Generado automáticamente\n\n';

  for (const migrationFile of migrations) {
    try {
      const sql = readFileSync(migrationFile, 'utf-8');
      combinedSQL += `-- ============================================\n`;
      combinedSQL += `-- Archivo: ${migrationFile.split(/[/\\]/).pop()}\n`;
      combinedSQL += `-- ============================================\n\n`;
      combinedSQL += sql + '\n\n';
      console.log(`✅ Leída: ${migrationFile.split(/[/\\]/).pop()}`);
    } catch (error) {
      console.error(`❌ Error leyendo ${migrationFile}:`, error.message);
    }
  }

  // Guardar SQL combinado
  const outputFile = join(__dirname, '../supabase/migrations/ALL_MIGRATIONS.sql');
  const { writeFileSync } = await import('fs');
  writeFileSync(outputFile, combinedSQL, 'utf-8');
  
  console.log(`\n✅ SQL combinado guardado en: ${outputFile}`);
  console.log(`\n📋 Para ejecutar las migraciones:`);
  console.log(`   1. Abre: https://supabase.com/dashboard/project/${env.VITE_SUPABASE_PROJECT_ID || 'irfjdnwxbzlcpbxhjuqq'}/sql/new`);
  console.log(`   2. Copia y pega el contenido de: ${outputFile}`);
  console.log(`   3. Haz clic en "Run" o presiona Ctrl+Enter\n`);
  
  console.log('💡 Alternativamente, puedes usar psql:');
  console.log(`   psql "postgresql://postgres:[PASSWORD]@db.irfjdnwxbzlcpbxhjuqq.supabase.co:5432/postgres" -f ${outputFile}\n`);
}

main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
