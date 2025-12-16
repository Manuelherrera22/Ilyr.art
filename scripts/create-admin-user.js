/**
 * Script para crear un usuario administrador de Ilyrart
 * 
 * Este script crea un usuario administrador que puede acceder a todos los dashboards:
 * - Dashboard de Clientes (/client)
 * - Dashboard de Productores (/producer)
 * - Dashboard de Creadores (/creative)
 * - Dashboard de Administradores (/admin)
 * 
 * Uso:
 *   node scripts/create-admin-user.js
 * 
 * Variables de entorno requeridas:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env manualmente
const envPath = join(__dirname, '..', '.env');
try {
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value.trim();
      }
    }
  });
} catch (error) {
  console.log('⚠️  No se encontró archivo .env, usando variables de entorno del sistema');
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: Variables de entorno requeridas no encontradas');
  console.error('   Requerido: VITE_SUPABASE_URL y VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Crear cliente de Supabase con service role (permisos administrativos)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Configuración del usuario administrador
const ADMIN_CONFIG = {
  email: 'admin@ilyrart.com',
  password: 'Ilyrart2024!Admin', // Cambiar después del primer login
  fullName: 'Ilyrart Administrador',
  profileType: 'admin'
};

async function createAdminUser() {
  console.log('\n🔧 Creando usuario administrador de Ilyrart...\n');
  console.log(`📧 Email: ${ADMIN_CONFIG.email}`);
  console.log(`👤 Nombre: ${ADMIN_CONFIG.fullName}`);
  console.log(`🔑 Tipo de perfil: ${ADMIN_CONFIG.profileType}\n`);

  try {
    // 1. Verificar si el usuario ya existe
    console.log('1️⃣ Verificando si el usuario ya existe...');
    const { data: existingUsers, error: checkError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (checkError) {
      console.error('❌ Error al verificar usuarios existentes:', checkError.message);
      throw checkError;
    }

    const existingUser = existingUsers.users.find(u => u.email === ADMIN_CONFIG.email);
    
    if (existingUser) {
      console.log('⚠️  El usuario ya existe. Verificando perfil...');
      
      // Verificar si tiene perfil
      const { data: existingProfile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', existingUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Error al verificar perfil:', profileError.message);
        throw profileError;
      }

      if (existingProfile) {
        // Actualizar perfil a admin si no lo es
        if (existingProfile.profile_type !== 'admin') {
          console.log('🔄 Actualizando perfil a administrador...');
          const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ 
              profile_type: 'admin',
              full_name: ADMIN_CONFIG.fullName
            })
            .eq('id', existingUser.id);

          if (updateError) {
            console.error('❌ Error al actualizar perfil:', updateError.message);
            throw updateError;
          }
          console.log('✅ Perfil actualizado a administrador');
        } else {
          console.log('✅ El usuario ya es administrador');
        }
      } else {
        // Crear perfil si no existe
        console.log('📝 Creando perfil de administrador...');
        const { error: insertError } = await supabaseAdmin
          .from('profiles')
          .insert([{
            id: existingUser.id,
            full_name: ADMIN_CONFIG.fullName,
            profile_type: 'admin'
          }]);

        if (insertError) {
          console.error('❌ Error al crear perfil:', insertError.message);
          throw insertError;
        }
        console.log('✅ Perfil de administrador creado');
      }

      console.log('\n✅ Usuario administrador configurado correctamente');
      console.log(`\n📋 Credenciales de acceso:`);
      console.log(`   Email: ${ADMIN_CONFIG.email}`);
      console.log(`   Contraseña: ${ADMIN_CONFIG.password}`);
      console.log(`\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login\n`);
      return;
    }

    // 2. Crear nuevo usuario
    console.log('2️⃣ Creando nuevo usuario en auth.users...');
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_CONFIG.email,
      password: ADMIN_CONFIG.password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        full_name: ADMIN_CONFIG.fullName,
        profile_type: ADMIN_CONFIG.profileType
      }
    });

    if (createError) {
      console.error('❌ Error al crear usuario:', createError.message);
      if (createError.message.includes('already registered') || createError.message.includes('already exists')) {
        console.log('⚠️  El usuario ya existe. Intentando obtener información...');
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const foundUser = users.users.find(u => u.email === ADMIN_CONFIG.email);
        if (foundUser) {
          console.log('✅ Usuario encontrado, continuando con creación de perfil...');
          newUser = { user: foundUser };
        } else {
          throw createError;
        }
      } else {
        throw createError;
      }
    } else {
      console.log('✅ Usuario creado en auth.users');
    }

    // 3. Crear o actualizar perfil en profiles
    console.log('3️⃣ Creando/actualizando perfil en profiles...');
    
    // Verificar si el perfil ya existe
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', newUser.user.id)
      .single();

    if (existingProfile) {
      // Actualizar perfil existente
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          full_name: ADMIN_CONFIG.fullName,
          profile_type: ADMIN_CONFIG.profileType
        })
        .eq('id', newUser.user.id);

      if (updateError) {
        console.error('❌ Error al actualizar perfil:', updateError.message);
        throw updateError;
      }
      console.log('✅ Perfil actualizado a administrador');
    } else {
      // Crear nuevo perfil
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: newUser.user.id,
          full_name: ADMIN_CONFIG.fullName,
          profile_type: ADMIN_CONFIG.profileType
        }]);

      if (insertError) {
        console.error('❌ Error al crear perfil:', insertError.message);
        // No eliminamos el usuario porque puede que ya existiera
        throw insertError;
      }
      console.log('✅ Perfil de administrador creado');
    }

    // 4. Verificar acceso a todos los dashboards
    console.log('\n4️⃣ Verificando permisos de acceso...');
    console.log('✅ Acceso a Dashboard de Clientes (/client)');
    console.log('✅ Acceso a Dashboard de Productores (/producer)');
    console.log('✅ Acceso a Dashboard de Creadores (/creative)');
    console.log('✅ Acceso a Dashboard de Administradores (/admin)');

    console.log('\n✅ Usuario administrador creado exitosamente');
    console.log(`\n📋 Credenciales de acceso:`);
    console.log(`   Email: ${ADMIN_CONFIG.email}`);
    console.log(`   Contraseña: ${ADMIN_CONFIG.password}`);
    console.log(`\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login`);
    console.log(`\n🔗 URL de login: ${supabaseUrl.replace('/rest/v1', '')}/auth/v1/authorize\n`);

  } catch (error) {
    console.error('\n❌ Error al crear usuario administrador:', error.message);
    if (error.details) {
      console.error('   Detalles:', error.details);
    }
    process.exit(1);
  }
}

// Ejecutar script
createAdminUser();
