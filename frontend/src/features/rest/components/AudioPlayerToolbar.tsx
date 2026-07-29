import React from 'react';
import { useRestStore } from '../store/useRestStore';
import { Play, Pause, Volume2, Music } from 'lucide-react';

export const AudioPlayerToolbar: React.FC = () => {
  const { isPlaying, toggleAudio, audioVolume, setVolume } = useRestStore();

  return (
    <div className="h-16 border-t border-[#334155] bg-[#0F1524] flex items-center justify-between px-6 shrink-0 text-[#E2E8F0]">
      
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded bg-[#162032] border border-[#334155] flex items-center justify-center">
          <Music className="w-5 h-5 text-[#E2E8F0]/50" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#F4EAD5] leading-tight">Ambient Presence</h4>
          <p className="text-xs text-[#E2E8F0]/50 font-mono">TARDIS Den Environments</p>
        </div>
      </div>

      <div className="flex flex-1 max-w-md mx-8 items-center justify-center gap-6">
        <button 
          onClick={toggleAudio}
          className="w-10 h-10 rounded-full bg-[#E2E8F0] text-[#0F1524] flex items-center justify-center hover:bg-white transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
        </button>
      </div>

      <div className="flex items-center gap-3 w-48">
        <Volume2 className="w-4 h-4 text-[#E2E8F0]/50 shrink-0" />
        <div className="flex-1 h-1.5 bg-[#162032] rounded-full relative group cursor-pointer border border-[#334155]">
          <div 
            className="absolute top-0 left-0 h-full bg-[#E2E8F0] transition-all rounded-full" 
            style={{ width: `${audioVolume * 100}%` }} 
          />
          <input 
            type="range" min="0" max="1" step="0.01" 
            value={audioVolume} onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
      </div>

    </div>
  );
};
