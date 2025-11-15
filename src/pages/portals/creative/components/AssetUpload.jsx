import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { uploadProjectAsset } from '@/services/api/assets';
import { Upload, X, File, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AssetUpload = ({ projectId, onUploadSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [assetType, setAssetType] = useState('draft');
  const [isFinal, setIsFinal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validar tamaño (max 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Archivo muy grande',
          description: 'El archivo no puede ser mayor a 100MB',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Selecciona un archivo',
        description: 'Debes seleccionar un archivo para subir',
      });
      return;
    }

    setUploading(true);
    try {
      await uploadProjectAsset(projectId, user.id, file, {
        type: assetType,
        notes,
        is_final: isFinal,
      });

      toast({
        title: '✅ Asset subido exitosamente',
        description: 'El archivo se ha subido correctamente',
      });

      // Limpiar formulario
      setFile(null);
      setNotes('');
      setAssetType('draft');
      setIsFinal(false);
      
      // Resetear input de archivo
      const fileInput = document.getElementById('asset-file');
      if (fileInput) fileInput.value = '';

      // Notificar al componente padre
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Error uploading asset:', error);
      toast({
        variant: 'destructive',
        title: 'Error al subir',
        description: error.message || 'No se pudo subir el archivo',
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="bg-card/40 border-border/40">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Subir Asset</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="asset-file">Archivo</Label>
          <div className="flex items-center gap-4">
            <Input
              id="asset-file"
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
              className="flex-1"
            />
            {file && (
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <File className="w-4 h-4" />
                <span>{file.name}</span>
                <span className="text-foreground/50">({formatFileSize(file.size)})</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="asset-type">Tipo</Label>
          <select
            id="asset-type"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            disabled={uploading}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
          >
            <option value="draft">Borrador</option>
            <option value="review">En revisión</option>
            <option value="final">Final</option>
            <option value="reference">Referencia</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="asset-notes">Notas (opcional)</Label>
          <Textarea
            id="asset-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={uploading}
            placeholder="Agrega notas sobre esta versión..."
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is-final"
            checked={isFinal}
            onChange={(e) => setIsFinal(e.target.checked)}
            disabled={uploading}
            className="w-4 h-4"
          />
          <Label htmlFor="is-final" className="cursor-pointer">
            Marcar como versión final
          </Label>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Subir Asset
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssetUpload;

