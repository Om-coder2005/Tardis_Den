import React, { useState } from 'react';
import { useDreamStore } from '../store/useDreamStore';
import { useDynamicMusicQuery } from '../services/restAreaServices';
import type { DynamicMusicTrack } from '../services/restAreaServices';
import { Play, Pause, Disc3, Volume2, Music, Search } from 'lucide-react';
import { engine } from '../store/AudioEngine';

export const MediaWidget: React.FC = () => {
  const { audioVolume, setVolume } = useDreamStore();
  const [selectedGenre, setSelectedGenre] = useState('chillout');
  const [searchTag, setSearchTag] = useState('');
  const [activeTrack, setActiveTrack] = useState<DynamicMusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: musicTracks = [], isLoading } = useDynamicMusicQuery(searchTag || selectedGenre);

  const handlePlayTrack = async (track: DynamicMusicTrack) => {
    if (activeTrack?.id === track.id && isPlaying) {
      engine.pauseTrack();
      setIsPlaying(false);
      return;
    }

    setActiveTrack(track);
    engine.setGlobalVolume(audioVolume);
    const started = await engine.playTrack(track.audio);
    setIsPlaying(started);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    engine.setGlobalVolume(vol);
  };

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] shadow-2xl rounded-2xl flex flex-col w-full overflow-hidden font-mono text-[#F8FAFC]">
      
      {/* Vinyl Header / Playing Track Banner */}
      <div className="p-6 bg-[#0B0F19] flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#4CC9F0] rounded-full opacity-10 blur-3xl" />
        
        <div className="relative w-24 h-24 mb-4">
          <div className={`w-full h-full rounded-full bg-[#1E293B] border-4 border-[#0F172A] shadow-inner flex items-center justify-center transition-transform duration-1000 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            {activeTrack?.image ? (
              <img src={activeTrack.image} alt={activeTrack.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <Disc3 className="w-10 h-10 text-[#C5A059] opacity-80" />
            )}
          </div>
        </div>

        <h4 className="text-sm font-bold text-[#F8FAFC] truncate max-w-[200px] text-center">
          {activeTrack ? activeTrack.name : 'Select Stream Track'}
        </h4>
        <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-1">
          {activeTrack ? activeTrack.artist : 'Royalty-Free Music Stream'}
        </p>

        {/* Play Pause Trigger */}
        {activeTrack && (
          <button
            onClick={() => handlePlayTrack(activeTrack)}
            className="mt-4 px-4 py-1.5 rounded-full bg-[#C5A059] text-[#0F172A] text-xs font-bold flex items-center gap-2 hover:bg-[#E2C78E] transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
        )}
      </div>

      {/* Genre Filter & Search Bar */}
      <div className="p-4 border-y border-[#1E293B] bg-[#0F172A]/50 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-[#94A3B8] w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search genre or vibe (e.g. ambient, jazz)..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full bg-[#1E293B] border border-[#334155] rounded-lg py-1.5 pl-8 pr-3 text-xs text-[#F8FAFC] outline-none focus:border-[#4CC9F0]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[10px]">
          {['chillout', 'ambient', 'lofi', 'classical', 'piano', 'space'].map((genre) => (
            <button
              key={genre}
              onClick={() => { setSearchTag(''); setSelectedGenre(genre); }}
              className={`px-2.5 py-1 rounded-md uppercase font-bold transition-all shrink-0 ${
                selectedGenre === genre && !searchTag ? 'bg-[#4CC9F0] text-[#0F172A]' : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic API Music Track List */}
      <div className="max-h-48 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        {isLoading ? (
          <div className="text-center py-6 text-xs text-[#94A3B8]">STREAMING MUSIC CATALOG...</div>
        ) : (
          musicTracks.map((track) => {
            const isThisPlaying = activeTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                onClick={() => handlePlayTrack(track)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  isThisPlaying 
                    ? 'bg-[#C5A059]/20 border-[#C5A059] text-white' 
                    : 'bg-[#1E293B]/40 border-transparent hover:bg-[#1E293B] text-[#94A3B8] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Music className={`w-3.5 h-3.5 shrink-0 ${isThisPlaying ? 'text-[#C5A059] animate-pulse' : 'text-[#94A3B8]'}`} />
                  <div className="truncate">
                    <p className="font-bold truncate text-[#F8FAFC]">{track.name}</p>
                    <p className="text-[10px] text-[#94A3B8] truncate">{track.artist}</p>
                  </div>
                </div>
                {isThisPlaying ? <Pause className="w-3.5 h-3.5 text-[#C5A059]" /> : <Play className="w-3.5 h-3.5 opacity-50" />}
              </div>
            );
          })
        )}
      </div>

      {/* Volume Slider */}
      <div className="p-4 border-t border-[#1E293B] flex items-center gap-3 bg-[#0B0F19]">
        <Volume2 className="w-4 h-4 text-[#94A3B8]" />
        <input 
          type="range" min="0" max="1" step="0.01" 
          value={audioVolume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-[#1E293B] accent-[#C5A059] rounded-full cursor-pointer"
          title="Volume"
        />
      </div>
    </div>
  );
};
