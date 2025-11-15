import { supabase } from '@/lib/customSupabaseClient';

export const previsualizarIdea = async (ideaPayload, session) => {
  console.log('🚀 Iniciando previsualizarIdea (híbrido)');
  if (!session || !session.user) {
    console.error('❌ No hay sesión de usuario en previsualizarIdea');
    throw new Error('No se pudo obtener la sesión de usuario. Por favor, inicia sesión de nuevo.');
  }
  console.log('✅ Sesión de usuario encontrada.');

  if (!ideaPayload.estilo || !ideaPayload.estilo.trim()) {
    throw new Error('El estilo visual no puede estar vacío.');
  }

  try {
    let producto_url = ideaPayload.productImagePreviewUrl || null;
    let ambiente_url = ideaPayload.backgroundImagePreviewUrl || null;

    if (ideaPayload.productImage) {
      const productImageFile = ideaPayload.productImage;
      const productPath = `${session.user.id}/${Date.now()}_${productImageFile.name}`;
      
      const { error: productUploadError } = await supabase.storage
        .from('idea-images')
        .upload(productPath, productImageFile);

      if (productUploadError) {
        console.error('❌ Error al subir imagen de producto:', productUploadError);
        throw new Error('No se pudo subir la imagen del producto.');
      }

      const { data: productUrlData } = supabase.storage
        .from('idea-images')
        .getPublicUrl(productPath);
      
      if (!productUrlData || !productUrlData.publicUrl) {
        console.error('❌ Error: no se pudo obtener la publicUrl de la imagen de producto.');
        throw new Error('No se pudo obtener la URL pública para la imagen del producto.');
      }
      producto_url = productUrlData.publicUrl;
      console.log(`✅ Imagen de producto subida: ${producto_url}`);
    }

    if (ideaPayload.backgroundImage) {
        const backgroundImageFile = ideaPayload.backgroundImage;
        const backgroundPath = `${session.user.id}/${Date.now()}_${backgroundImageFile.name}`;
        
        const { error: backgroundUploadError } = await supabase.storage
          .from('idea-images')
          .upload(backgroundPath, backgroundImageFile);
  
        if (backgroundUploadError) {
          console.error('❌ Error al subir imagen de fondo:', backgroundUploadError);
          throw new Error('No se pudo subir la imagen de fondo.');
        }
  
        const { data: backgroundUrlData } = supabase.storage
          .from('idea-images')
          .getPublicUrl(backgroundPath);
        
        if (!backgroundUrlData || !backgroundUrlData.publicUrl) {
            console.error('❌ Error: no se pudo obtener la publicUrl de la imagen de fondo.');
            throw new Error('No se pudo obtener la URL pública para la imagen de fondo.');
        }
        ambiente_url = backgroundUrlData.publicUrl;
        console.log(`✅ Imagen de ambiente subida: ${ambiente_url}`);
    }

    const payload = {
      imagen_1: producto_url,
      imagen_2: ambiente_url,
      extension_prompt: ideaPayload.sceneDescription.trim(),
      estilo: ideaPayload.estilo.trim(),
    };

    console.log('📦 Payload listo para enviar a la Edge Function (híbrida):', payload);

    const { data, error: functionError } = await supabase.functions.invoke('refinar-prompt-con-imagenes-hibrido-ts-ts', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: payload,
    });

    if (functionError) {
      console.error('❌ Error al invocar la Edge Function (híbrida):', functionError);
      const errorMsg = 'Hubo un problema al generar la imagen. Verifica tus imágenes y vuelve a intentar.';
      try {
        const errorJson = await functionError.context.json();
        throw new Error(errorJson.error || errorMsg);
      } catch (e) {
        throw new Error(errorMsg);
      }
    }
    
    console.log('✅ Respuesta recibida de la Edge Function (híbrida):', data);

    if (!data || (data.imagen_generada && data.imagen_generada.status !== 'success')) {
      console.error('📉 La función respondió con un error o estado fallido.', data);
      throw new Error(data.error || 'Hubo un problema al generar la imagen. La IA no pudo procesar la solicitud.');
    }

    const imageUrl = data.imagen_generada?.image_url;

    if (!imageUrl) {
      console.error('❓ La respuesta no contiene una URL de imagen válida.', data);
      throw new Error('La respuesta del servidor no incluyó la URL de la imagen generada.');
    }
    
    const frontendData = {
      ...data,
      imagen_generada: imageUrl,
    };

    console.log('🎉 Previsualización híbrida exitosa, retornando datos adaptados para el frontend:', frontendData);
    return frontendData;

  } catch (err) {
    console.error('🔥 Error catastrófico en previsualizarIdea (híbrido):', err);
    throw err;
  }
};

export const refinarPromptConImagenes = async (refinePayload, session) => {
  console.log('🚀 Iniciando refinarPromptConImagenes');
  if (!session || !session.user) {
    console.error('❌ No hay sesión de usuario');
    throw new Error('Debes iniciar sesión para refinar el prompt.');
  }

  const { productImage, backgroundImage, sceneDescription } = refinePayload;

  if (!productImage || !backgroundImage || !sceneDescription.trim()) {
    throw new Error('Se requieren dos imágenes y una descripción para refinar.');
  }

  try {
    const uploadImage = async (imageFile, storagePath) => {
      const { error: uploadError } = await supabase.storage
        .from('idea-images')
        .upload(storagePath, imageFile, { upsert: true });

      if (uploadError) {
        console.error(`❌ Error al subir imagen a ${storagePath}:`, uploadError);
        throw new Error('No se pudo subir una de las imágenes.');
      }

      const { data: urlData } = supabase.storage
        .from('idea-images')
        .getPublicUrl(storagePath);
      
      if (!urlData || !urlData.publicUrl) {
        console.error(`❌ Error: no se pudo obtener la publicUrl para ${storagePath}`);
        throw new Error('No se pudo obtener la URL pública para una de las imágenes.');
      }
      
      return urlData.publicUrl;
    };

    const productPath = `${session.user.id}/refine_${Date.now()}_${productImage.name}`;
    const backgroundPath = `${session.user.id}/refine_${Date.now()}_${backgroundImage.name}`;

    const [image_1, image_2] = await Promise.all([
      uploadImage(productImage, productPath),
      uploadImage(backgroundImage, backgroundPath),
    ]);

    console.log(`✅ Imágenes subidas:`, { image_1, image_2 });

    const payload = {
      prompt: sceneDescription.trim(),
      image_1,
      image_2,
    };

    console.log('📦 Payload listo para enviar a la Edge Function refinar_prompt_con_imagenes-ts:', payload);

    const { data, error: functionError } = await supabase.functions.invoke('refinar_prompt_con_imagenes-ts', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: payload,
    });

    if (functionError) {
      console.error('❌ Error al invocar la Edge Function:', functionError);
      if (functionError.context && typeof functionError.context.json === 'function') {
        const errorDetails = await functionError.context.json().catch(() => null);
        if (errorDetails && errorDetails.error) {
          throw new Error(errorDetails.error);
        }
      }
      throw new Error(functionError.message || 'Error al conectar con el servicio de refinamiento.');
    }
    
    console.log('✅ Respuesta recibida de la Edge Function:', data);

    if (data && data.prompt) {
      console.log('🎉 Prompt refinado exitosamente:', data.prompt);
      return data.prompt;
    }
    
    if (data && data.error) {
      console.error('📉 La función respondió con un error:', data.error);
      throw new Error(data.error);
    }

    throw new Error('Respuesta inválida del servicio de refinamiento.');

  } catch (err) {
    console.error('🔥 Error catastrófico en refinarPromptConImagenes:', err);
    throw err;
  }
};


export const deleteIdea = async (ideaId, session) => {
  if (!session) {
    throw new Error("No se pudo obtener la sesión de usuario para la eliminación.");
  }

  const { data, error: deleteError } = await supabase.functions.invoke('delete-idea', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: { idea_id: ideaId },
  });

  if (deleteError) {
    let errorMessage = 'No se pudo eliminar la idea.';
    if (deleteError.context && typeof deleteError.context.json === 'function') {
      try {
        const errorDetails = await deleteError.context.json();
        errorMessage = errorDetails.message || errorMessage;
      } catch (e) {
        errorMessage = deleteError.message;
      }
    } else {
      errorMessage = deleteError.message;
    }
    throw new Error(errorMessage);
  }
  
  if (!data.success) {
    throw new Error(data.message || 'La eliminación falló en el servidor.');
  }
};

export const loadIdea = async (ideaId, session) => {
  console.log(`🚀 Iniciando loadIdea para ideaId: ${ideaId}`);
  if (!session) {
    console.error('❌ No hay sesión de usuario en loadIdea');
    throw new Error('Debes iniciar sesión para cargar una idea.');
  }
  console.log('✅ Sesión de usuario encontrada en loadIdea.');

  try {
    const { data, error } = await supabase.functions.invoke(`ver-idea-generada-ts?ideaId=${ideaId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('❌ Error al invocar la Edge Function (ver-idea-generada-ts):', error);
      throw error;
    }

    console.log('✅ Respuesta recibida de la Edge Function (ver-idea-generada-ts):', data);

    if (!data.success || !data.idea) {
      console.error('📉 La función respondió con success: false o sin datos de la idea.', data);
      throw new Error(data.message || 'No se pudo encontrar la idea especificada.');
    }

    console.log('🎉 Idea cargada exitosamente:', data.idea);
    return data.idea;
  
  } catch(err) {
    console.error('🔥 Error catastrófico en loadIdea:', err);
    throw err;
  }
};

export const listarIdeas = async (session) => {
  if (!session) {
    throw new Error("Debes iniciar sesión para ver tus ideas.");
  }

  const { data, error } = await supabase.functions.invoke('listar-ideas-ts', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    throw new Error(error.message || "Error al obtener las ideas.");
  }

  if (!data.success) {
    throw new Error(data.message || "No se pudieron cargar las ideas.");
  }

  return data.ideas;
};

export const editarIdea = async (ideaId, updates, session) => {
  if (!session) {
    throw new Error("Debes iniciar sesión para editar una idea.");
  }

  const { data, error } = await supabase.functions.invoke('editar-idea-ts', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: { ideaId, ...updates },
  });

  if (error) {
    throw new Error(error.message || "Error al actualizar la idea.");
  }

  if (!data.success) {
    throw new Error(data.message || "No se pudo actualizar la idea.");
  }

  return data.idea;
};