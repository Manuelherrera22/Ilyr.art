# Configuración de Supabase Storage

Para que el sistema de subida de assets funcione, necesitas crear un bucket en Supabase Storage:

## Pasos para configurar Storage

1. Ve al dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Storage** en el menú lateral
4. Haz clic en **New bucket**
5. Crea un bucket llamado `project-assets`
6. Configura las políticas de acceso:

### Políticas RLS para el bucket `project-assets`

```sql
-- Permitir lectura a usuarios autenticados asignados al proyecto
CREATE POLICY "Users can view assets from assigned projects"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-assets' AND
  auth.role() = 'authenticated' AND
  (
    -- Usuario asignado al proyecto
    EXISTS (
      SELECT 1 FROM public.project_assignments pa
      WHERE pa.project_id::text = (storage.foldername(name))[1]
      AND pa.user_id = auth.uid()
      AND pa.status = 'active'
    )
    OR
    -- Cliente del proyecto
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.profiles pr ON pr.client_account_id = p.client_account_id
      WHERE p.id::text = (storage.foldername(name))[1]
      AND pr.id = auth.uid()
    )
    OR
    -- Productor o Admin
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND profile_type IN ('producer', 'admin')
    )
  )
);

-- Permitir subida a usuarios asignados al proyecto
CREATE POLICY "Assigned users can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-assets' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.project_assignments pa
    WHERE pa.project_id::text = (storage.foldername(name))[1]
    AND pa.user_id = auth.uid()
    AND pa.status = 'active'
  )
);

-- Permitir eliminación a usuarios asignados o productores
CREATE POLICY "Assigned users and producers can delete assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-assets' AND
  auth.role() = 'authenticated' AND
  (
    EXISTS (
      SELECT 1 FROM public.project_assignments pa
      WHERE pa.project_id::text = (storage.foldername(name))[1]
      AND pa.user_id = auth.uid()
      AND pa.status = 'active'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND profile_type IN ('producer', 'admin')
    )
  )
);
```

## Notas

- El bucket debe ser público o tener políticas RLS configuradas
- Los archivos se organizan por proyecto: `project-assets/{project_id}/{filename}`
- El tamaño máximo de archivo recomendado es 100MB (configurable en el código)

