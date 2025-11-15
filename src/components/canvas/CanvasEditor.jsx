import React from 'react';
import { useDrop } from 'react-dnd';
import CanvasElement from './CanvasElement';
import { Video } from 'lucide-react';

const CanvasEditor = ({ elements, updateElement, addElement, selectedElement, onSelectElement }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item, monitor) => {
      const dropTarget = document.getElementById('canvas-editor');
      if (!dropTarget) return;

      const offset = monitor.getClientOffset();
      const canvasBounds = dropTarget.getBoundingClientRect();
      const x = offset.x - canvasBounds.left;
      const y = offset.y - canvasBounds.top;
      
      addElement(item.type, { ...item.defaultData, x, y });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  return (
    <div
      id="canvas-editor"
      ref={drop}
      className="flex-1 bg-black/50 rounded-lg relative overflow-hidden border-2 border-dashed"
      style={{
        borderColor: isActive ? '#FF3CAC' : 'transparent',
        transition: 'border-color 0.3s',
      }}
      onClick={() => onSelectElement(null)}
    >
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="text-center text-white/20 px-4">
            <Video className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4" />
            <p className="text-lg sm:text-xl md:text-2xl font-semibold">Tu video se previsualizará aquí</p>
            <p className="text-sm sm:text-base md:text-lg">Arrastra elementos para empezar a diseñar</p>
        </div>
      </div>

      {elements.map((el) => (
        <CanvasElement
          key={el.id}
          element={el}
          onUpdate={updateElement}
          onSelect={onSelectElement}
          isSelected={selectedElement === el.id}
        />
      ))}
    </div>
  );
};

export default CanvasEditor;