import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ImageUploadPreview = ({ onFileChange, title, description, initialPreviewUrl }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialPreviewUrl || null);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (initialPreviewUrl && !file) {
      setPreview(initialPreviewUrl);
    }
  }, [initialPreviewUrl, file]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError(null);
    if (fileRejections.length > 0) {
      const firstError = fileRejections[0].errors[0];
      let errorMessage = 'Error al subir el archivo.';
      if (firstError.code === 'file-too-large') {
        errorMessage = 'El archivo es demasiado grande (máx 5MB).';
      } else if (firstError.code === 'file-invalid-type') {
        errorMessage = 'Formato de archivo no soportado (JPG, PNG, WEBP).';
      }
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error de Carga',
        description: errorMessage,
      });
      onFileChange(null);
      return;
    }

    if (acceptedFiles.length > 0) {
      const acceptedFile = acceptedFiles[0];
      setFile(acceptedFile);
      onFileChange(acceptedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(acceptedFile);
    }
  }, [onFileChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setError(null);
    onFileChange(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`relative w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-primary/50'}
        ${error ? 'border-destructive' : ''}
        ${preview ? 'p-0 border-solid' : 'h-48 flex flex-col items-center justify-center'}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-full aspect-video">
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
          <button
            onClick={removeFile}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors z-10"
            aria-label="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      ) : (
        <div className="text-center text-white/60">
          <UploadCloud className="mx-auto h-12 w-12 mb-2" />
          <h3 className="text-lg font-semibold text-white/80">{title}</h3>
          <p className="text-sm">{description}</p>
          {isDragActive ? (
            <p className="mt-2 text-primary font-bold">Suelta la imagen aquí</p>
          ) : (
            <p className="mt-2 text-sm">Arrastra y suelta, o haz clic para seleccionar</p>
          )}
          <p className="text-xs text-white/40 mt-1">Mín. 512x512px (ideal 1024x1024px). Formatos: JPG, PNG, WEBP.</p>
          {error && (
            <div className="mt-2 text-destructive flex items-center justify-center text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadPreview;