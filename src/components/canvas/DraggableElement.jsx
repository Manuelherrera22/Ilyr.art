import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableElement = ({ type, text, icon: Icon, defaultData }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { type, defaultData },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="p-2 glass-card rounded-lg flex items-center space-x-2 cursor-grab active:cursor-grabbing mb-2"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-sm text-white">{text}</span>
    </div>
  );
};

export default DraggableElement;