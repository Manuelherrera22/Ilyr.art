-- Script SQL para crear usuario administrador de Ilyrart
-- 
-- Este script crea un usuario administrador que puede acceder a todos los dashboards:
-- - Dashboard de Clientes (/client)
-- - Dashboard de Productores (/producer)
-- - Dashboard de Creadores (/creative)
-- - Dashboard de Administradores (/admin)
-- 
-- IMPORTANTE: Este script debe ejecutarse usando el Service Role Key
-- en el SQL Editor de Supabase o mediante la API de administración.
--
-- Uso:
--   1. Copia este script
--   2. Ve al SQL Editor de Supabase
--   3. Ejecuta el script
--   4. Cambia la contraseña después del primer login

-- Configuración del usuario administrador
DO $$
DECLARE
  admin_email TEXT := 'admin@ilyrart.com';
  admin_password TEXT := 'Ilyrart2024!Admin'; -- Cambiar después del primer login
  admin_name TEXT := 'Ilyrart Administrador';
  admin_user_id UUID;
  existing_user_id UUID;
BEGIN
  -- Verificar si el usuario ya existe
  SELECT id INTO existing_user_id
  FROM auth.users
  WHERE email = admin_email;

  IF existing_user_id IS NOT NULL THEN
    RAISE NOTICE 'Usuario ya existe. Actualizando perfil...';
    
    -- Verificar si tiene perfil
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = existing_user_id) THEN
      -- Actualizar perfil a admin si no lo es
      UPDATE public.profiles
      SET 
        profile_type = 'admin',
        full_name = admin_name
      WHERE id = existing_user_id;
      
      RAISE NOTICE 'Perfil actualizado a administrador';
    ELSE
      -- Crear perfil si no existe
      INSERT INTO public.profiles (id, full_name, profile_type)
      VALUES (existing_user_id, admin_name, 'admin');
      
      RAISE NOTICE 'Perfil de administrador creado';
    END IF;
    
    RAISE NOTICE 'Usuario administrador configurado correctamente';
    RAISE NOTICE 'Email: %', admin_email;
    RAISE NOTICE 'Contraseña: %', admin_password;
    RAISE NOTICE 'IMPORTANTE: Cambia la contraseña después del primer login';
    
  ELSE
    -- Crear nuevo usuario usando la función de Supabase
    -- NOTA: Para crear usuarios desde SQL, necesitas usar la función auth.users
    -- o crear el usuario mediante la API de administración
    
    RAISE NOTICE 'Para crear un nuevo usuario, usa el script Node.js:';
    RAISE NOTICE 'npm run create-admin';
    RAISE NOTICE '';
    RAISE NOTICE 'O crea el usuario manualmente en Supabase Dashboard:';
    RAISE NOTICE '1. Ve a Authentication > Users';
    RAISE NOTICE '2. Crea un nuevo usuario con email: %', admin_email;
    RAISE NOTICE '3. Luego ejecuta este script nuevamente para crear el perfil';
    
  END IF;
END $$;

-- Si el usuario ya fue creado manualmente, solo crear/actualizar el perfil
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

-- Verificar que el usuario administrador existe
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.profile_type,
  CASE 
    WHEN p.profile_type = 'admin' THEN '✅ Usuario administrador configurado correctamente'
    ELSE '⚠️ El usuario existe pero no es administrador'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@ilyrart.com';
