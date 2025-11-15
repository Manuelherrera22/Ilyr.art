import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

import ElementsSidebar from '@/components/canvas/ElementsSidebar';
import CanvasEditor from '@/components/canvas/CanvasEditor';
import PropertiesSidebar from '@/components/canvas/PropertiesSidebar';
import Timeline from '@/components/canvas/Timeline';
import { useToast } from '@/components/ui/use-toast';

const CanvasIAProPage = ({ setHeaderStep }) => {
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (setHeaderStep) {
      setHeaderStep('Canvas IA Pro', 4, 5); 
    }
  }, [setHeaderStep]);

  useEffect(() => {
    const savedElements = localStorage.getItem('canvas-elements');
    if (savedElements) {
      setElements(JSON.parse(savedElements));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('canvas-elements', JSON.stringify(elements));
  }, [elements]);
  
  const addElement = (type, data = {}) => {
    const newElement = {
      id: Date.now(),
      type,
      x: data.x || 50,
      y: data.y || 50,
      width: data.width || 150,
      height: data.height || 50,
      rotation: data.rotation || 0,
      content: data.content || 'Texto',
      fontSize: data.fontSize || 16,
      fontWeight: data.fontWeight || 'normal',
      ...data,
    };
    setElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    
    toast({
      title: "Elemento agregado",
      description: `${type} agregado al canvas exitosamente.`
    });
  };

  const updateElement = (id, newProps) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...newProps } : el))
    );
  };
  
  const handleSelectElement = (id) => {
    setSelectedElementId(id);
  };

  const goBackToDIY = () => {
    navigate('/dashboard/diy');
  };

  const continueToExport = () => {
    if (elements.length === 0) {
      toast({
        title: "Canvas vacío",
        description: "Agrega al menos un elemento antes de continuar.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Canvas guardado",
      description: "Tu diseño ha sido guardado. Continuando al paso de exportación..."
    });
    
    setTimeout(() => {
      navigate('/dashboard/diy');
    }, 1500);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Canvas IA Pro</h1>
            <p className="text-sm sm:text-base text-white/60 mt-1">Hazlo tuyo: Personaliza tu video con precisión, estilo y asistencia inteligente.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={goBackToDIY} className="w-full sm:w-auto text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Flujo
            </Button>
            <Button 
              onClick={continueToExport}
              disabled={elements.length === 0}
              className="bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] hover:from-[#FF3CAC]/90 hover:to-[#784BA0]/90 w-full sm:w-auto text-sm sm:text-base"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar y Continuar
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-3 sm:gap-4 min-h-0">
          <ElementsSidebar />
          
          <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-h-0 overflow-hidden">
            <CanvasEditor 
              elements={elements} 
              updateElement={updateElement} 
              addElement={addElement}
              selectedElement={selectedElementId}
              onSelectElement={handleSelectElement}
            />
            <Timeline elements={elements} />
          </div>
          
          <PropertiesSidebar 
            element={selectedElement} 
            updateElement={updateElement} 
          />
        </div>

        {elements.length === 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-yellow-200 text-sm text-center">
              💡 Arrastra elementos desde la barra lateral para comenzar a diseñar tu video
            </p>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default CanvasIAProPage;