import React, { useState, useEffect } from 'react';
import { useTelescopeStore } from '../store/useTelescopeStore';
import { Search, Star, History, Orbit } from 'lucide-react';
import { useRoomStore } from '../../../store';

const CATEGORIES = [
  'Galaxies', 'Nebulae', 'Planets', 'Deep Space', 'Supernova'
];

export const ObservatorySidebar: React.FC = () => {
  const { currentCategory, setCurrentCategory, searchQuery, setSearchQuery } = useTelescopeStore();
  const { clearFocus } = useRoomStore();
  const [timeString, setTimeString] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-72 shrink-0 h-full border-r border-white/5 bg-gradient-to-b from-[#02040A]/95 to-[#0A1128]/95 backdrop-blur-xl flex flex-col font-[var(--font-tele-sans)] text-[#F4F4F9] z-20">
      
      {/* Header / Time */}
      <div className="p-6 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3 mb-6 text-[#4CC9F0]">
          <Orbit className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
          <h2 className="text-xl font-[var(--font-tele-serif)] font-bold tracking-wide">Observatory</h2>
        </div>
        
        <div className="font-[var(--font-tele-mono)] text-xs text-[#4CC9F0]/70 mb-4 tracking-widest flex items-center justify-between">
          <span>LOCAL SYSTEM</span>
          <span>{timeString}</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-[#F4F4F9]/40 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search Cosmos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-[#4CC9F0] focus:ring-1 focus:ring-[#4CC9F0] outline-none transition-all placeholder:text-[#F4F4F9]/30 text-[#F4F4F9]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        
        {/* Navigation Sections */}
        <div className="mb-8">
          <h3 className="px-3 text-[10px] font-bold text-[#F4F4F9]/40 uppercase tracking-widest mb-3">Target Catalog</h3>
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => { setSearchQuery(''); setCurrentCategory(cat); }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-300 flex items-center gap-3 ${
                  currentCategory === cat && !searchQuery 
                    ? 'font-medium text-white bg-gradient-to-r from-[#4CC9F0]/20 to-transparent border-l-2 border-[#4CC9F0]' 
                    : 'text-[#F4F4F9]/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                {currentCategory === cat && !searchQuery ? <Orbit className="w-3.5 h-3.5 text-[#4CC9F0]" /> : <span className="w-3.5 h-3.5 rounded-full border border-white/20" />}
                {cat}
              </button>
            ))}
          </nav>
        </div>

        <div className="mb-8">
          <h3 className="px-3 text-[10px] font-bold text-[#F4F4F9]/40 uppercase tracking-widest mb-3">My Coordinates</h3>
          <nav className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#F4F4F9]/60 hover:text-white hover:bg-white/5 transition-all border-l-2 border-transparent">
              <Star className="w-3.5 h-3.5" />
              Saved Constellations
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#F4F4F9]/60 hover:text-white hover:bg-white/5 transition-all border-l-2 border-transparent">
              <History className="w-3.5 h-3.5" />
              Observation Logs
            </button>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 shrink-0 bg-black/20">
        <button 
          onClick={clearFocus}
          className="w-full py-2.5 rounded-lg text-xs font-medium text-[#F4F4F9]/50 hover:text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest"
        >
          Exit Viewport
        </button>
      </div>
    </div>
  );
};
