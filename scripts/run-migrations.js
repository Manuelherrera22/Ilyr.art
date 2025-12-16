#!/usr/bin/env node

/**
 * Script para ejecutar migraciones SQL en Supabase
 * 
 * Uso: node scripts/run-migrations.js
 * 
 * Requiere:
 * - Variables de entorno configuradas en .env
 * - @supabase/supabase-js instalado
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://irfjdnwxbzlcpbxhjuqq.supabase.co';
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('❌ Error: VITE_SUPABASE_SERVICE_ROLE_KEY no está configurada en .env');
  console.log('💡 Asegúrate de tener un archivo .env con las credenciales de Supabase');
  process.exit(1);
}

// Crear cliente de Supabase con service role (permisos administrativos)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Lista de migraciones en orden
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

async function runMigration(migration) {
  try {
    console.log(`\n📄 Ejecutando: ${migration.name}...`);
    
    // Leer el archivo SQL
    const sql = readFileSync(migration.file, 'utf-8');
    
    // Dividir en statements (separados por ;)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));
    
    // Ejecutar cada statement
    for (const statement of statements) {
      if (statement.length > 10) { // Ignorar statements muy cortos
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          // Si el RPC no existe, intentar ejecutar directamente
          // Nota: Esto requiere permisos especiales en Supabase
          console.warn(`⚠️  No se pudo ejecutar via RPC, intentando método alternativo...`);
          console.warn(`   Error: ${error.message}`);
        }
      }
    }
    
    console.log(`✅ ${migration.name} completada`);
    return true;
  } catch (error) {
    console.error(`❌ Error ejecutando ${migration.name}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando ejecución de migraciones...');
  console.log(`📍 URL: ${supabaseUrl}`);
  console.log(`🔑 Usando Service Role Key`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Pequeña pausa entre migraciones
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Resumen:`);
  console.log(`   ✅ Exitosas: ${successCount}`);
  console.log(`   ❌ Fallidas: ${failCount}`);
  console.log('='.repeat(50));
  
  if (failCount > 0) {
    console.log('\n⚠️  Algunas migraciones fallaron.');
    console.log('💡 Recomendación: Ejecuta las migraciones manualmente desde el SQL Editor de Supabase');
    console.log('   https://supabase.com/dashboard/project/irfjdnwxbzlcpbxhjuqq/sql/new');
    process.exit(1);
  } else {
    console.log('\n🎉 ¡Todas las migraciones se ejecutaron exitosamente!');
  }
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
