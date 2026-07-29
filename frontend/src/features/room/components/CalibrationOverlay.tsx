import React, { useState } from 'react';
import { OBJECT_REGISTRY } from '../ObjectRegistry';
import { Rnd } from 'react-rnd';

export const CalibrationOverlay: React.FC = () => {
  const [objects, setObjects] = useState(OBJECT_REGISTRY);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const updateObject = (id: string, updates: any) => {
    setObjects(prev => prev.map(obj => obj.id === id ? { ...obj, ...updates } : obj));
  };

  const logRegistry = () => {
    console.log(JSON.stringify(objects, null, 2));
    alert('Logged to console! Copy the array and paste it back to Antigravity.');
  };

  const selectedObj = objects.find(o => o.id === selectedId);

  const sortedObjects = [...objects].sort((a, b) => {
    if (a.id === selectedId) return 1;
    if (b.id === selectedId) return -1;
    return (a.zIndex || 0) - (b.zIndex || 0);
  });

  return (
    <div className="absolute inset-0 z-50 pointer-events-none" id="calibration-bounds">
      {/* Objects Layer */}
      {sortedObjects.map(obj => {
        const svgUrl = new URL(`../../../assets/room-svgs/${obj.svgFileName}`, import.meta.url).href;
        return (
          <Rnd
            key={obj.id}
            bounds="#calibration-bounds"
            default={{
              x: (obj.x / 100) * window.innerWidth,
              y: (obj.y / 100) * window.innerHeight,
              width: `${obj.width}%`,
              height: `${obj.height}%`,
            }}
            position={{
              x: (obj.x / 100) * (document.getElementById('calibration-bounds')?.clientWidth || window.innerWidth),
              y: (obj.y / 100) * (document.getElementById('calibration-bounds')?.clientHeight || window.innerHeight),
            }}
            size={{
              width: `${obj.width}%`,
              height: `${obj.height}%`,
            }}
            onDragStart={() => setSelectedId(obj.id)}
            onResizeStart={() => setSelectedId(obj.id)}
            onDragStop={(_e, d) => {
              const bounds = document.getElementById('calibration-bounds');
              if (!bounds) return;
              const rect = bounds.getBoundingClientRect();
              const newX = (d.x / rect.width) * 100;
              const newY = (d.y / rect.height) * 100;
              updateObject(obj.id, { x: newX, y: newY });
            }}
            onResizeStop={(_e, _direction, ref, _delta, position) => {
              const bounds = document.getElementById('calibration-bounds');
              if (!bounds) return;
              const rect = bounds.getBoundingClientRect();
              
              const newWidth = (ref.offsetWidth / rect.width) * 100;
              const newHeight = (ref.offsetHeight / rect.height) * 100;
              const newX = (position.x / rect.width) * 100;
              const newY = (position.y / rect.height) * 100;
              
              updateObject(obj.id, { 
                width: newWidth, 
                height: newHeight,
                x: newX,
                y: newY
              });
            }}
            className="absolute pointer-events-auto border-2 border-red-500 bg-red-500/20"
            style={{ zIndex: selectedId === obj.id ? 9999 : (obj.zIndex || 1) }}
          >
            <img src={svgUrl} className="w-full h-full object-fill pointer-events-none opacity-90" draggable={false} />
            <div className="absolute -top-6 left-0 text-white text-xs px-2 py-1 rounded bg-red-500 font-bold shadow-md">
              {obj.name}
            </div>
          </Rnd>
        );
      })}

      <div className="absolute top-4 right-4 pointer-events-auto flex flex-col items-end gap-2 z-[60]">
        <div className="bg-slate-900/95 p-4 rounded-xl shadow-2xl border border-white/10 text-white text-sm max-w-xs">
          <p className="font-bold text-brand mb-2">Drag & Resize Mode</p>
          <p className="text-slate-300">You can now drag any red box and drag its edges/corners to resize it perfectly.</p>
          
          {selectedObj && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="font-bold text-brand mb-2">{selectedObj.name}</p>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Z-INDEX</span>
                <span>{selectedObj.zIndex}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={selectedObj.zIndex}
                onChange={e => updateObject(selectedObj.id, { zIndex: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          )}
        </div>
        <button 
          onClick={logRegistry}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-105"
        >
          Save & Log to Console
        </button>
      </div>
    </div>
  );
};
