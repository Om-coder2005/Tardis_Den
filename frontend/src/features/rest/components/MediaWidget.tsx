import React from 'react';
import { useDreamStore, AUDIO_TRACKS } from '../store/useDreamStore';
import { Play, Pause, SkipForward, SkipBack, Disc3, Volume2 } from 'lucide-react';

export const MediaWidget: React.FC = () => {
  const { 
    isPlaying, toggleAudio, audioVolume, setVolume, 
    currentTrackId, playNextTrack, playPreviousTrack, selectTrack
  } = useDreamStore();

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] shadow-2xl rounded-2xl flex flex-col w-full max-w-sm overflow-hidden font-mono text-[#F8FAFC]">
      
      {/* Vinyl/Disc Header */}
      <div className="p-6 bg-[#0B0F19] flex flex-col items-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#4CC9F0] rounded-full opacity-10 blur-3xl" />
        
        <div className="relative w-24 h-24 mb-5">
          <div className="absolute inset-0 rounded-full border border-[#334155] opacity-50" />
          <div className={`w-full h-full rounded-full bg-[#1E293B] border-4 border-[#0F172A] shadow-inner flex items-center justify-center transition-transform duration-1000 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <Disc3 className="w-10 h-10 text-[#C5A059] opacity-80" />
          </div>
        </div>

        <select
          value={currentTrackId}
          onChange={(event) => { void selectTrack(event.target.value); }}
          className="w-full bg-transparent px-2 text-center text-sm font-bold text-[#F8FAFC] outline-none appearance-none cursor-pointer tracking-wider truncate"
          title="Select Track"
        >
          {AUDIO_TRACKS.map((track) => (
            <option key={track.id} value={track.id} className="bg-[#0F172A] text-left">
              {track.name}
            </option>
          ))}
        </select>
        <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-2 font-sans">
          Now Playing
        </p>
      </div>

      {/* Controls & Volume */}
      <div className="p-6 flex flex-col gap-5">
        
        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => { void playPreviousTrack(); }} 
            className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={() => { void toggleAudio(); }} 
            className="w-12 h-12 rounded-full bg-[#C5A059] hover:bg-[#B48F48] text-[#0F172A] flex items-center justify-center transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-105"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          
          <button 
            onClick={() => { void playNextTrack(); }} 
            className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            title="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-[#94A3B8]" />
          <div className="flex-1 h-1 bg-[#1E293B] rounded-full relative group cursor-pointer">
            <div 
              className="absolute top-0 left-0 h-full bg-[#C5A059] rounded-full transition-all group-hover:bg-[#E2C78E]" 
              style={{ width: `${audioVolume * 100}%` }} 
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${audioVolume * 100}% - 5px)` }}
            />
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={audioVolume} onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Volume"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
