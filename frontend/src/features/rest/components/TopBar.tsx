import React, { useState, useEffect } from 'react';
import { useRoomStore } from '../../../store';
import { Power } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { clearFocus } = useRoomStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full bg-[#DFB6B2] border-b-2 border-[#190019] px-4 py-1 flex items-center justify-between text-[#190019] font-bold text-xs md:text-sm shadow-sm select-none z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={clearFocus}
          className="flex items-center gap-2 hover:bg-[#854F6C] hover:text-[#FBE4D8] px-2 py-1 rounded transition-colors"
          title="Exit to TARDIS"
        >
          <Power className="w-4 h-4" />
          <span className="hidden md:inline">DreamSpace OS</span>
        </button>
        <div className="hidden md:block px-4 border-l-2 border-[#190019]">
          /home/tardis/resting_quarters
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span>{formatDate(time)}</span>
        <span className="font-mono bg-[#FBE4D8] border border-[#190019] px-2 py-0.5 shadow-[2px_2px_0px_#190019]">
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
};
