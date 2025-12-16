# Guía: Crear Usuario Administrador de Ilyrart

Esta guía te ayudará a crear un usuario administrador que puede acceder a **todos los dashboards** de la plataforma.

## 📋 Permisos del Administrador

El usuario administrador tiene acceso completo a:
- ✅ Dashboard de Clientes (`/client`)
- ✅ Dashboard de Productores (`/producer`)  
- ✅ Dashboard de Creadores (`/creative`)
- ✅ Dashboard de Administradores (`/admin`)

## 🚀 Método Recomendado: Creación Manual en Supabase

### Paso 1: Crear Usuario en Supabase Dashboard

1. **Accede a tu proyecto en Supabase:**
   - Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto

2. **Ve a Authentication:**
   - En el menú lateral, haz clic en **Authentication**
   - Luego haz clic en **Users**

3. **Crear nuevo usuario:**
   - Haz clic en el botón **"Add User"** o **"Invite User"**
   - Completa el formulario:
     - **Email:** `admin@ilyrart.com`
     - **Password:** `Ilyrart2024!Admin` (o una contraseña segura de tu elección)
     - **Auto Confirm User:** ✅ **Marca esta casilla** (importante para que el usuario pueda iniciar sesión inmediatamente)
   - Haz clic en **"Create User"**

### Paso 2: Crear Perfil de Administrador

1. **Ve al SQL Editor:**
   - En el menú lateral, haz clic en **SQL Editor**
   - Haz clic en **"New Query"**

2. **Ejecuta este SQL:**

```sql
-- Crear o actualizar perfil de administrador
INSERT INTO public.profiles (id, full_name, profile_type)
SELECT 
  id,
  'Ilyrart Administrador',
  'admin'
FROM auth.users
WHERE email = 'admin@ilyrart.com'
ON CONFLICT (id) 
DO UPDATE SET
  profile_type = 'admin',
  full_name = 'Ilyrart Administrador';
```

3. **Haz clic en "Run"** para ejecutar el query

### Paso 3: Verificar que Funcionó

Ejecuta este query para verificar:

```sql
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.profile_type,
  CASE 
    WHEN p.profile_type = 'admin' THEN '✅ Usuario administrador configurado correctamente'
    ELSE '⚠️ El usuario existe pero no es administrador'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@ilyrart.com';
```

Deberías ver:
- ✅ Email: `admin@ilyrart.com`
- ✅ `profile_type`: `admin`
- ✅ Status: `✅ Usuario administrador configurado correctamente`

## 🔐 Credenciales de Acceso

Una vez creado el usuario, puedes iniciar sesión con:

- **Email:** `admin@ilyrart.com`
- **Contraseña:** `Ilyrart2024!Admin` (o la que hayas configurado)

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login por seguridad.

## 🌐 Acceso a los Dashboards

Una vez que inicies sesión, puedes acceder a cualquiera de estos dashboards:

- **Dashboard Cliente:** `http://tu-dominio.com/client`
- **Dashboard Productor:** `http://tu-dominio.com/producer`
- **Dashboard Creador:** `http://tu-dominio.com/creative`
- **Dashboard Admin:** `http://tu-dominio.com/admin`

El sistema te redirigirá automáticamente según tu rol, pero como administrador puedes acceder a cualquiera de ellos directamente.

## 🔄 Si el Usuario Ya Existe

Si el usuario `admin@ilyrart.com` ya existe pero no es administrador:

1. Ejecuta el SQL del Paso 2 para actualizar el perfil
2. O ejecuta este SQL específico para actualizar:

```sql
UPDATE public.profiles
SET 
  profile_type = 'admin',
  full_name = 'Ilyrart Administrador'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@ilyrart.com'
);
```

## 🛠️ Personalizar Credenciales

Si quieres usar un email diferente:

1. Crea el usuario con el email que prefieras
2. En el SQL, cambia `'admin@ilyrart.com'` por tu email:

```sql
INSERT INTO public.profiles (id, full_name, profile_type)
SELECT 
  id,
  'Ilyrart Administrador',
  'admin'
FROM auth.users
WHERE email = 'tu-email@ilyrart.com'  -- Cambia aquí
ON CONFLICT (id) 
DO UPDATE SET
  profile_type = 'admin',
  full_name = 'Ilyrart Administrador';
```

## ✅ Verificación Final

Para asegurarte de que todo funciona:

1. **Inicia sesión** en la aplicación con las credenciales del administrador
2. **Verifica** que puedes acceder a `/client`, `/producer`, `/creative` y `/admin`
3. **Cambia la contraseña** por seguridad

## 🆘 Solución de Problemas

### El usuario no puede iniciar sesión
- Verifica que **Auto Confirm User** esté marcado en Supabase
- Verifica que el email esté correcto
- Verifica que la contraseña sea la correcta

### El usuario no tiene acceso a los dashboards
- Verifica que el `profile_type` sea `'admin'` en la tabla `profiles`
- Ejecuta el SQL de verificación del Paso 3
- Asegúrate de que el usuario esté en la tabla `profiles`

### Error al ejecutar el SQL
- Verifica que estás usando el SQL Editor de Supabase
- Asegúrate de que la tabla `profiles` existe
- Verifica que el email del usuario existe en `auth.users`

## 📝 Notas Adicionales

- El usuario administrador puede ver y gestionar todos los recursos del sistema
- Los permisos están controlados por las políticas RLS (Row Level Security) en Supabase
- El rol `admin` tiene permisos especiales en todas las tablas según las migraciones configuradas
