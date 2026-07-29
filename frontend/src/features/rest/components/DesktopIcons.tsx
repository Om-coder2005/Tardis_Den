import React from 'react';
import { useDreamStore } from '../store/useDreamStore';
import type { RetroWindow } from '../store/useDreamStore';
import { Globe, Users, Clock, Flame } from 'lucide-react';

export const DesktopIcons: React.FC = () => {
  const { toggleWindow, activeWindows } = useDreamStore();

  const icons: { id: RetroWindow; icon: React.ReactNode; label: string }[] = [
    { id: 'campfire', icon: <Flame className="w-8 h-8 text-[#854F6C]" />, label: 'Campfire' },
    { id: 'nasa', icon: <Globe className="w-8 h-8" />, label: 'NASA APOD' },
    { id: 'astros', icon: <Users className="w-8 h-8" />, label: 'Astros' },
    { id: 'timer', icon: <Clock className="w-8 h-8" />, label: 'Timer' },
  ];

  return (
    <div className="flex flex-col gap-6 items-center w-full font-['Space_Mono',monospace]">
      {icons.map((item) => (
        <button 
          key={item.id}
          onClick={() => toggleWindow(item.id)}
          className={`flex flex-col items-center gap-2 p-2 hover:bg-[#854F6C]/20 rounded ${
            activeWindows.includes(item.id) ? 'bg-[#854F6C]/30 outline outline-1 outline-[#854F6C] border-dotted' : ''
          }`}
        >
          <div className="text-[#190019] drop-shadow-[2px_2px_0px_#DFB6B2]">
            {item.icon}
          </div>
          <div className="bg-[#190019] text-[#FBE4D8] px-1 text-xs font-bold whitespace-nowrap border border-[#FBE4D8] text-center max-w-[80px]">
            {item.label}
          </div>
        </button>
      ))}
    </div>
  );
};
