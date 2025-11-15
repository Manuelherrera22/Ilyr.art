import { supabase } from '@/lib/customSupabaseClient';

/**
 * Sube un asset a un proyecto
 */
export const uploadProjectAsset = async (projectId, userId, file, metadata = {}) => {
  // 1. Subir el archivo a Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${projectId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `project-assets/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('project-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error(uploadError.message);
  }

  // 2. Obtener la URL pública del archivo
  const { data: { publicUrl } } = supabase.storage
    .from('project-assets')
    .getPublicUrl(filePath);

  // 3. Obtener la versión más reciente para incrementar
  const { data: latestAsset } = await supabase
    .from('project_assets')
    .select('version')
    .eq('project_id', projectId)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  const nextVersion = latestAsset ? latestAsset.version + 1 : 1;

  // 4. Crear el registro en project_assets
  const { data, error } = await supabase
    .from('project_assets')
    .insert([
      {
        project_id: projectId,
        uploaded_by: userId,
        version: nextVersion,
        type: metadata.type || 'draft',
        file_url: publicUrl,
        notes: metadata.notes || '',
        is_final: metadata.is_final || false,
        metadata: {
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          ...metadata
        }
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating asset record:', error);
    // Intentar eliminar el archivo subido si falla el registro
    await supabase.storage.from('project-assets').remove([filePath]);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Obtiene todos los assets de un proyecto
 */
export const getProjectAssets = async (projectId) => {
  const { data, error } = await supabase
    .from('project_assets')
    .select(`
      id,
      version,
      type,
      file_url,
      notes,
      is_final,
      metadata,
      created_at,
      uploaded_by,
      profiles:uploaded_by (
        full_name
      )
    `)
    .eq('project_id', projectId)
    .order('version', { ascending: false });

  if (error) {
    console.error('Error fetching project assets:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Marca un asset como final
 */
export const markAssetAsFinal = async (assetId) => {
  // Primero, desmarcar todos los assets finales del proyecto
  const { data: asset } = await supabase
    .from('project_assets')
    .select('project_id')
    .eq('id', assetId)
    .single();

  if (asset) {
    await supabase
      .from('project_assets')
      .update({ is_final: false })
      .eq('project_id', asset.project_id);
  }

  // Marcar el asset seleccionado como final
  const { data, error } = await supabase
    .from('project_assets')
    .update({ is_final: true })
    .eq('id', assetId)
    .select()
    .single();

  if (error) {
    console.error('Error marking asset as final:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Elimina un asset
 */
export const deleteAsset = async (assetId) => {
  // Obtener información del asset para eliminar el archivo
  const { data: asset, error: fetchError } = await supabase
    .from('project_assets')
    .select('file_url, metadata')
    .eq('id', assetId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  // Extraer el path del archivo de la URL
  const urlParts = asset.file_url.split('/project-assets/');
  if (urlParts.length > 1) {
    const filePath = `project-assets/${urlParts[1]}`;
    await supabase.storage.from('project-assets').remove([filePath]);
  }

  // Eliminar el registro
  const { error } = await supabase
    .from('project_assets')
    .delete()
    .eq('id', assetId);

  if (error) {
    console.error('Error deleting asset:', error);
    throw new Error(error.message);
  }

  return true;
};

