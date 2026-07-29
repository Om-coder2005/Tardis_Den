import React, { useState } from 'react';
import { useDreamStore } from '../store/useDreamStore';
import { Minus, Maximize2, X, Users, RefreshCcw, Loader2 } from 'lucide-react';

export const AstrosWindow: React.FC = () => {
  const { dailyFact, isLoadingContent, activeWindows, closeWindow, refreshAstronauts } = useDreamStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!activeWindows.includes('astros')) return null;

  return (
    <div className={`bg-[#DFB6B2] border-2 border-[#190019] shadow-[6px_6px_0px_#190019] flex flex-col w-full font-['Space_Mono',monospace] ${isExpanded ? 'max-w-lg' : 'max-w-sm'} ${isMinimized ? 'max-h-10' : ''}`}>
      
      {/* Window Title Bar */}
      <div className="bg-[#190019] text-[#FBE4D8] px-3 py-1 flex items-center justify-between">
        <span className="font-bold text-xs tracking-wide">C:\System\astros.exe</span>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized((value) => !value)} className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300" aria-label={isMinimized ? 'Restore astronauts window' : 'Minimize astronauts window'}>
            <Minus className="w-3 h-3 text-[#190019]" />
          </button>
          <button onClick={() => setIsExpanded((value) => !value)} className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300" aria-label={isExpanded ? 'Restore astronauts window size' : 'Expand astronauts window'}>
            <Maximize2 className="w-2 h-2 text-[#190019]" />
          </button>
          <button 
            onClick={() => closeWindow('astros')}
            className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300"
          >
            <X className="w-3 h-3 text-[#190019]" />
          </button>
        </div>
      </div>

      {!isMinimized && <div className="p-4 flex flex-col items-center bg-[#FBE4D8]">
        <div className="mb-4 flex w-full items-center justify-between border-b border-[#DFB6B2] pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#854F6C]">Live crew manifest</span>
          <button onClick={() => { void refreshAstronauts(); }} disabled={isLoadingContent} className="flex h-7 w-7 items-center justify-center border border-[#190019] bg-[#DFB6B2] text-[#190019] hover:bg-[#854F6C] hover:text-[#FBE4D8] disabled:opacity-50" aria-label="Refresh astronaut data">
            <RefreshCcw className={`h-3.5 w-3.5 ${isLoadingContent ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <Users className="w-8 h-8 text-[#190019]" />
          <div className="text-4xl font-bold tabular-nums text-[#190019]">
            {dailyFact?.number || '--'}
          </div>
        </div>
        
        <div className="text-sm font-bold text-[#190019] mb-4 text-center">
          Humans currently in space
        </div>

        {isLoadingContent && !dailyFact ? (
          <div className="flex h-32 items-center justify-center text-[#854F6C]">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : dailyFact ? (
          <div className="w-full bg-white border-2 border-[#190019] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)] p-2 h-32 overflow-y-auto custom-scrollbar">
            {dailyFact.people.map((person, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-[#DFB6B2] last:border-0 text-[#190019]">
                <span className="font-bold">{person.name}</span>
                <span className="bg-[#DFB6B2] px-1 border border-[#190019]">{person.craft}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-xs italic text-[#854F6C]">No crew manifest available.</p>}
      </div>}

    </div>
  );
};
