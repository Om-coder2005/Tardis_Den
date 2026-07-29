import React, { useState } from 'react';
import { useDreamStore } from '../store/useDreamStore';
import { Maximize2, Minus, X, Loader2, RefreshCcw } from 'lucide-react';

export const NasaWindow: React.FC = () => {
  const { dailyQuote, isLoadingContent, activeWindows, closeWindow, refreshDailyContent } = useDreamStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!activeWindows.includes('nasa')) return null;

  return (
    <div className={`bg-[#DFB6B2] border-2 border-[#190019] shadow-[6px_6px_0px_#190019] flex flex-col w-full font-['Space_Mono',monospace] ${isExpanded ? 'max-w-3xl' : 'max-w-2xl'} ${isMinimized ? 'max-h-10' : 'max-h-[min(560px,68vh)]'}`}>
      
      {/* Window Title Bar */}
      <div className="bg-[#190019] text-[#FBE4D8] px-3 py-1 flex items-center justify-between">
        <span className="font-bold text-xs tracking-wide">C:\System\nasa_apod.exe</span>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized((value) => !value)} className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300" aria-label={isMinimized ? 'Restore APOD window' : 'Minimize APOD window'}>
            <Minus className="w-3 h-3 text-[#190019]" />
          </button>
          <button onClick={() => setIsExpanded((value) => !value)} className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300" aria-label={isExpanded ? 'Restore APOD window size' : 'Expand APOD window'}>
            <Maximize2 className="w-2 h-2 text-[#190019]" />
          </button>
          <button 
            onClick={() => closeWindow('nasa')}
            className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300"
          >
            <X className="w-3 h-3 text-[#190019]" />
          </button>
        </div>
      </div>

      {!isMinimized && <div className="p-3 bg-[#FBE4D8] border-b-2 border-[#190019] flex items-center gap-3">
        <div className="flex-1 h-8 bg-white border-2 border-[#190019] flex items-center px-2">
          <span className="truncate text-xs text-[#190019]">NASA / Astronomy Picture of the Day</span>
        </div>
        <button onClick={() => { void refreshDailyContent(); }} disabled={isLoadingContent} className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[#190019] bg-[#DFB6B2] text-[#190019] hover:bg-[#854F6C] hover:text-[#FBE4D8] disabled:opacity-50" aria-label="Refresh NASA content">
          <RefreshCcw className={`h-4 w-4 ${isLoadingContent ? 'animate-spin' : ''}`} />
        </button>
      </div>}

      {!isMinimized && <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#FBE4D8]">
        {isLoadingContent ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#190019]" />
            <p className="text-xs font-bold text-[#190019]">Connecting to Deep Space Network...</p>
          </div>
        ) : dailyQuote ? (
          <div className="space-y-6">
            <div className="border-2 border-[#190019] p-3 bg-white shadow-[2px_2px_0px_#190019]">
              <div className="flex items-center justify-between gap-3 border-b border-[#DFB6B2] pb-2">
                <span className="bg-[#190019] px-2 py-1 text-xs font-bold text-[#FBE4D8]">NASA APOD</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#854F6C]">Daily transmission</span>
              </div>
              <div className="flex justify-center gap-2 pb-2">
                <span className="px-2 py-1 text-xs border border-[#190019] bg-[#DFB6B2] font-bold">@space</span>
                <span className="px-2 py-1 text-xs border border-[#190019] bg-[#DFB6B2] font-bold">@stars</span>
                <span className="px-2 py-1 text-xs border border-[#190019] bg-[#DFB6B2] font-bold">@science</span>
              </div>
            </div>

            {dailyQuote.url && (
              <div className="w-full border-2 border-[#190019] bg-[#190019] shadow-[4px_4px_0px_#190019]">
                <img src={dailyQuote.url} alt={dailyQuote.title} className="max-h-64 w-full object-cover" />
              </div>
            )}
            
            <h3 className="text-2xl font-bold text-[#2B124C] pt-4">{dailyQuote.title}</h3>
            <p className="text-sm leading-relaxed text-[#190019] bg-white border-2 border-[#190019] p-4 shadow-[2px_2px_0px_#190019]">
              {dailyQuote.explanation}
            </p>
            <div className="text-xs font-bold text-[#854F6C] text-right uppercase">
              {dailyQuote.date}
            </div>
          </div>
        ) : (
          <p className="text-sm italic text-[#190019]">No data available.</p>
        )}
      </div>}
    </div>
  );
};
