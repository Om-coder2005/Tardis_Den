import React from 'react';
import { useDreamStore, AUDIO_TRACKS } from '../store/useDreamStore';
import { Play, Pause, SkipForward, SkipBack, Disc } from 'lucide-react';

export const MediaWidget: React.FC = () => {
  const { 
    isPlaying, toggleAudio, audioVolume, setVolume, 
    currentTrackId, playNextTrack, playPreviousTrack, selectTrack
  } = useDreamStore();

  const currentTrack = AUDIO_TRACKS.find(t => t.id === currentTrackId) || AUDIO_TRACKS[0];

  return (
    <div className="bg-[#DFB6B2] border-2 border-[#190019] shadow-[4px_4px_0px_#190019] flex flex-col w-full max-w-sm font-['Space_Mono',monospace]">
      
      {/* Fake UI Stats */}
      <div className="p-4 border-b-2 border-[#190019] bg-[#FBE4D8]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#DFB6B2] border-2 border-[#190019] shadow-[2px_2px_0px_#190019] rounded flex items-center justify-center mb-4">
            <Disc className={`w-8 h-8 text-[#190019] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          </div>
          <select
            value={currentTrackId}
            onChange={(event) => { void selectTrack(event.target.value); }}
            className="max-w-full bg-transparent px-2 text-center text-lg font-bold leading-tight text-[#190019] outline-none"
            aria-label="Select music track"
          >
            {AUDIO_TRACKS.map((track) => (
              <option key={track.id} value={track.id}>{track.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 text-xs font-bold">vol</span>
            <div className="flex-1 h-4 border-2 border-[#190019] bg-white relative">
              <div className="absolute top-0 left-0 h-full bg-[#854F6C]" style={{ width: `${audioVolume * 100}%` }} />
              <input 
                type="range" min="0" max="1" step="0.01" 
                value={audioVolume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 text-xs font-bold">cpu</span>
            <div className="flex-1 h-4 border-2 border-[#190019] bg-white relative">
              <div className="absolute top-0 left-0 h-full bg-[#DFB6B2] w-1/3" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 text-xs font-bold">ram</span>
            <div className="flex-1 h-4 border-2 border-[#190019] bg-white relative">
              <div className="absolute top-0 left-0 h-full bg-[#FBE4D8] w-1/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Player Controls */}
      <div className="p-4 flex items-center gap-4 bg-[#DFB6B2]">
        <div className="w-12 h-12 bg-[#2B124C] border-2 border-[#190019] shrink-0 overflow-hidden">
          {/* Fake album art */}
          <div className="w-full h-full bg-[#522B5B] flex items-center justify-center relative">
             <div className="w-2 h-10 border-l border-r border-[#190019]/20 absolute" />
             <div className="h-2 w-10 border-t border-b border-[#190019]/20 absolute" />
             <div className="w-4 h-4 bg-[#DFB6B2] rounded-full border border-[#190019] relative z-10" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate text-[#190019]">{currentTrack.name}</div>
          <div className="flex items-center gap-4 mt-2">
            <button onClick={() => { void playPreviousTrack(); }} className="hover:text-[#854F6C] transition-colors" aria-label="Previous track"><SkipBack className="w-4 h-4 fill-current" /></button>
            <button onClick={() => { void toggleAudio(); }} className="hover:text-[#854F6C] transition-colors" aria-label={isPlaying ? 'Pause track' : 'Play track'}>
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button onClick={() => { void playNextTrack(); }} className="hover:text-[#854F6C] transition-colors" aria-label="Next track"><SkipForward className="w-4 h-4 fill-current" /></button>
          </div>
        </div>
      </div>

    </div>
  );
};
