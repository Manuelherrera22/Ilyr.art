import React from 'react';
import { Rnd } from 'react-rnd';

const CanvasElement = ({ element, onUpdate, onSelect, isSelected }) => {
  const { x, y, width, height, rotation, type, content, fontSize, fontWeight } = element;

  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: isSelected ? '2px solid #FF3CAC' : '1px dashed transparent',
    background: 'transparent',
    transform: `rotate(${rotation}deg)`,
    transition: 'border-color 0.2s ease-in-out',
  };

  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <span
            style={{ fontSize: `${fontSize}px`, fontWeight: fontWeight, color: 'white' }}
            className="p-2 w-full h-full"
          >
            {content}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Rnd
      style={style}
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={(e, d) => {
        onUpdate(element.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate(element.id, {
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
      minWidth={50}
      minHeight={20}
      bounds="parent"
      className="hover:border-primary/50"
    >
      {renderContent()}
    </Rnd>
  );
};

export default CanvasElement;