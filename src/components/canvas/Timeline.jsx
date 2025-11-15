import React from 'react';
import { Film } from 'lucide-react';

const Timeline = ({ elements }) => {
  return (
    <div className="h-40 bg-[#0B0D12]/80 backdrop-blur-xl border-t border-white/10 rounded-lg p-4 flex flex-col">
      <h3 className="text-white font-semibold mb-2">Línea de Tiempo</h3>
      <div className="flex-1 bg-black/20 rounded-md overflow-y-auto custom-scrollbar p-2 space-y-2">
        {elements.length === 0 ? (
          <div className="text-white/40 text-sm text-center h-full flex flex-col items-center justify-center">
            <Film className="w-8 h-8 mb-2" />
            <p>Las capas de tu video aparecerán aquí.</p>
          </div>
        ) : (
          elements.map((el, index) => (
            <div key={el.id} className="h-8 bg-gradient-to-r from-primary/70 to-secondary/70 rounded-md flex items-center px-2 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <span className="text-white text-sm font-medium truncate">
                Capa {index + 1}: {el.type} - {el.content || `ID ${el.id}`}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Timeline;