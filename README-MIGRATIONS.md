# 🗄️ Migraciones de Base de Datos - Dashboard de Creadores

Este documento explica cómo configurar y ejecutar las migraciones SQL para el dashboard de creadores.

## 📋 Prerrequisitos

1. **Archivo `.env` configurado** con las credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=https://irfjdnwxbzlcpbxhjuqq.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   VITE_SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   VITE_SUPABASE_PROJECT_ID=irfjdnwxbzlcpbxhjuqq
   ```

2. **Node.js** instalado (v18 o superior)

## 🚀 Ejecutar Migraciones

### Opción 1: Usando npm script (Recomendado)

```bash
npm run migrate
```

### Opción 2: Manualmente con Node

```bash
node scripts/run-migrations.js
```

### Opción 3: Desde Supabase Dashboard (Más Confiable)

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard/project/irfjdnwxbzlcpbxhjuqq/sql/new)
2. Abre el **SQL Editor**
3. Ejecuta las migraciones en este orden:

   **1. Tablas Base de Colaboración:**
   ```sql
   -- Copia y pega el contenido de:
   -- supabase/migrations/20251113_collaboration_platform.sql
   ```

   **2. Políticas RLS de Colaboración:**
   ```sql
   -- Copia y pega el contenido de:
   -- supabase/migrations/20251113_collaboration_platform_rls.sql
   ```

   **3. Tablas del Dashboard de Creadores:**
   ```sql
   -- Copia y pega el contenido de:
   -- supabase/migrations/20251113_creator_dashboard.sql
   ```

   **4. Políticas RLS del Dashboard:**
   ```sql
   -- Copia y pega el contenido de:
   -- supabase/migrations/20251113_creator_dashboard_rls.sql
   ```

## ✅ Verificar Migraciones

Ejecuta esta consulta en el SQL Editor para verificar que las tablas se crearon:

```sql
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND (table_name LIKE 'creator_%' 
       OR table_name LIKE 'project_%'
       OR table_name = 'client_accounts'
       OR table_name = 'service_packages')
ORDER BY table_name;
```

Deberías ver estas tablas:

### Tablas de Colaboración:
- `client_accounts`
- `projects`
- `project_briefs`
- `project_assignments`
- `project_milestones`
- `project_updates`
- `project_comments`
- `project_assets`
- `service_packages`
- `notifications`

### Tablas del Dashboard de Creadores:
- `creator_jobs` - Trabajos disponibles y asignados
- `creator_deliverables` - Entregas de trabajos
- `creator_quality_reviews` - Revisiones de calidad
- `creator_payments` - Sistema de pagos
- `creator_feedback` - Retroalimentación estructurada

## 🔒 Seguridad

- ⚠️ **NUNCA** subas el archivo `.env` a Git (ya está en `.gitignore`)
- ⚠️ **NUNCA** compartas tu `SERVICE_ROLE_KEY` públicamente
- ✅ Usa `ANON_KEY` en el frontend
- ✅ Usa `SERVICE_ROLE_KEY` solo en scripts del servidor

## 🐛 Solución de Problemas

### Error: "VITE_SUPABASE_SERVICE_ROLE_KEY no está configurada"

**Solución:** Asegúrate de que el archivo `.env` existe en la raíz del proyecto y contiene todas las variables necesarias.

### Error: "Permission denied" al ejecutar migraciones

**Solución:** 
1. Verifica que estás usando la `SERVICE_ROLE_KEY` correcta
2. Ejecuta las migraciones manualmente desde el SQL Editor de Supabase
3. Verifica que tu usuario tiene permisos de administrador en el proyecto

### Las tablas no aparecen después de ejecutar migraciones

**Solución:**
1. Verifica que no hay errores en la consola
2. Revisa los logs en Supabase Dashboard → Logs → Postgres Logs
3. Ejecuta las migraciones manualmente desde el SQL Editor

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Migraciones](https://supabase.com/docs/guides/database/migrations)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Soporte

Si tienes problemas con las migraciones:
1. Revisa los logs de Supabase
2. Verifica que todas las dependencias están instaladas
3. Asegúrate de estar usando la versión correcta de Node.js
