# Crear Usuario Administrador de Ilyrart

Este documento explica cómo crear un usuario administrador que puede acceder a todos los dashboards de la plataforma.

## Permisos del Administrador

El usuario administrador tiene acceso completo a:
- ✅ Dashboard de Clientes (`/client`)
- ✅ Dashboard de Productores (`/producer`)
- ✅ Dashboard de Creadores (`/creative`)
- ✅ Dashboard de Administradores (`/admin`)

## Método 1: Script Node.js (Recomendado)

### Requisitos
- Node.js instalado
- Variables de entorno configuradas en `.env`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_SERVICE_ROLE_KEY`

### Pasos

1. **Asegúrate de tener las variables de entorno configuradas:**
   ```bash
   # En tu archivo .env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```

2. **Ejecuta el script:**
   ```bash
   npm run create-admin
   ```

3. **El script creará automáticamente:**
   - Usuario en `auth.users` con email `admin@ilyrart.com`
   - Perfil en `profiles` con `profile_type = 'admin'`

4. **Credenciales por defecto:**
   - **Email:** `admin@ilyrart.com`
   - **Contraseña:** `Ilyrart2024!Admin`
   
   ⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login.

## Método 2: SQL Script (Alternativo)

Si prefieres usar SQL directamente:

1. **Ve al SQL Editor de Supabase:**
   - Abre tu proyecto en Supabase Dashboard
   - Ve a SQL Editor
   - Crea una nueva query

2. **Ejecuta el script SQL:**
   - Abre el archivo `scripts/create-admin-user.sql`
   - Copia y pega el contenido en el SQL Editor
   - Ejecuta el script

3. **Si el usuario no existe:**
   - Crea el usuario manualmente en Authentication > Users
   - Email: `admin@ilyrart.com`
   - Contraseña: `Ilyrart2024!Admin`
   - Luego ejecuta el script SQL nuevamente

## Método 3: Creación Manual

### Paso 1: Crear Usuario en Supabase

1. Ve a **Authentication > Users** en Supabase Dashboard
2. Haz clic en **Add User** o **Invite User**
3. Completa:
   - **Email:** `admin@ilyrart.com`
   - **Password:** `Ilyrart2024!Admin`
   - **Auto Confirm User:** ✅ (marca esta opción)

### Paso 2: Crear Perfil Administrador

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Insertar o actualizar perfil de administrador
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

### Paso 3: Verificar

Ejecuta este SQL para verificar:

```sql
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.profile_type,
  CASE 
    WHEN p.profile_type = 'admin' THEN '✅ Usuario administrador configurado'
    ELSE '⚠️ El usuario no es administrador'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@ilyrart.com';
```

## Personalizar Credenciales

Si quieres usar credenciales diferentes, edita el archivo `scripts/create-admin-user.js`:

```javascript
const ADMIN_CONFIG = {
  email: 'tu-email@ilyrart.com',
  password: 'TuContraseñaSegura123!',
  fullName: 'Tu Nombre',
  profileType: 'admin'
};
```

## Solución de Problemas

### Error: "Service Role Key no encontrada"
- Verifica que `VITE_SUPABASE_SERVICE_ROLE_KEY` esté en tu archivo `.env`
- La Service Role Key se encuentra en: Supabase Dashboard > Settings > API > service_role key

### Error: "Usuario ya existe"
- El script actualizará automáticamente el perfil a administrador
- Si el usuario existe pero no tiene perfil, se creará uno

### Error: "No se puede crear usuario"
- Verifica que tengas permisos de administrador en Supabase
- Asegúrate de usar la Service Role Key correcta
- Verifica que el email no esté en uso por otro proyecto

## Seguridad

⚠️ **IMPORTANTE:**
- Cambia la contraseña por defecto después del primer login
- No compartas las credenciales del administrador
- Usa contraseñas seguras en producción
- Considera usar autenticación de dos factores (2FA)

## Acceso a Dashboards

Una vez creado el usuario administrador, puedes acceder a:

- **Dashboard Cliente:** `http://tu-dominio.com/client`
- **Dashboard Productor:** `http://tu-dominio.com/producer`
- **Dashboard Creador:** `http://tu-dominio.com/creative`
- **Dashboard Admin:** `http://tu-dominio.com/admin`

El sistema redirigirá automáticamente según tu rol, pero como administrador puedes acceder a cualquiera de ellos.
