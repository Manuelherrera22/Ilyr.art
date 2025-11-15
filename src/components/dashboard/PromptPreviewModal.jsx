import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';

const PromptPreviewModal = ({ isOpen, onOpenChange, initialPrompt, onConfirm }) => {
  const [editedPrompt, setEditedPrompt] = useState(initialPrompt);

  useEffect(() => {
    if (isOpen) {
      setEditedPrompt(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleConfirm = () => {
    onConfirm(editedPrompt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/80 backdrop-blur-lg text-white border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            Revisa y confirma tu idea
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Este es el prompt que se usará para generar la imagen. Puedes editarlo para perfeccionar el resultado final.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            rows={8}
            className="bg-white/5 border-white/20 focus:ring-primary resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} className="bg-gradient-to-r from-[#FF3CAC] to-[#784BA0]">Confirmar y Generar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptPreviewModal;