# Ejecutar Migraciones de Base de Datos

Este documento explica cómo ejecutar las migraciones SQL para el dashboard de creadores.

## Migraciones Disponibles

1. **20251113_collaboration_platform.sql** - Tablas base de la plataforma de colaboración
2. **20251113_collaboration_platform_rls.sql** - Políticas RLS (Row Level Security)
3. **20251113_creator_dashboard.sql** - Tablas del dashboard de creadores
4. **20251113_creator_dashboard_rls.sql** - Políticas RLS para el dashboard de creadores

## Opción 1: Usando Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor**
3. Ejecuta las migraciones en este orden:
   - Primero: `20251113_collaboration_platform.sql`
   - Segundo: `20251113_collaboration_platform_rls.sql`
   - Tercero: `20251113_creator_dashboard.sql`
   - Cuarto: `20251113_creator_dashboard_rls.sql`

## Opción 2: Usando Supabase CLI

Si tienes Supabase CLI instalado:

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Iniciar sesión
supabase login

# Vincular tu proyecto
supabase link --project-ref irfjdnwxbzlcpbxhjuqq

# Aplicar migraciones
supabase db push
```

## Opción 3: Usando psql (PostgreSQL)

```bash
# Conectarte a tu base de datos Supabase
psql "postgresql://postgres:[TU_PASSWORD]@db.irfjdnwxbzlcpbxhjuqq.supabase.co:5432/postgres"

# Ejecutar las migraciones
\i supabase/migrations/20251113_collaboration_platform.sql
\i supabase/migrations/20251113_collaboration_platform_rls.sql
\i supabase/migrations/20251113_creator_dashboard.sql
\i supabase/migrations/20251113_creator_dashboard_rls.sql
```

## Verificar que las migraciones se aplicaron

Ejecuta esta consulta en el SQL Editor de Supabase:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'creator_%'
ORDER BY table_name;
```

Deberías ver estas tablas:
- creator_jobs
- creator_deliverables
- creator_quality_reviews
- creator_payments
- creator_feedback

## Notas Importantes

- ⚠️ **Nunca** ejecutes las migraciones en producción sin hacer backup primero
- Las políticas RLS deben ejecutarse después de crear las tablas
- Asegúrate de que el usuario tenga los permisos necesarios para crear tablas y políticas
