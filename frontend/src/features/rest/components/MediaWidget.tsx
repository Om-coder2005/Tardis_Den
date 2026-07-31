import React, { useState } from 'react';
import { useDreamStore, AUDIO_TRACKS } from '../store/useDreamStore';
import { useDynamicMusicQuery } from '../services/restAreaServices';
import type { DynamicMusicTrack } from '../services/restAreaServices';
import { Play, Pause, Disc3, Volume2, Music, Search, Radio, FileMusic, Heart } from 'lucide-react';
import { engine } from '../store/AudioEngine';

export const MediaWidget: React.FC = () => {
  const { audioVolume, setVolume } = useDreamStore();
  const [activeTab, setActiveTab] = useState<'my_music' | 'online_stream'>('my_music');
  const [selectedGenre, setSelectedGenre] = useState('chillout');
  const [searchTag, setSearchTag] = useState('');
  const [activeTrack, setActiveTrack] = useState<DynamicMusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { data: onlineTracksData = [], isLoading } = useDynamicMusicQuery(searchTag || selectedGenre);
  const onlineTracks = Array.isArray(onlineTracksData) ? onlineTracksData : [];

  const localTracks: DynamicMusicTrack[] = AUDIO_TRACKS.map((t) => ({
    id: t.id,
    name: t.name,
    artist: 'Personal Library',
    audio: t.file,
  }));

  const activeTrackList = activeTab === 'my_music' ? localTracks : onlineTracks;

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
    <div className="w-full flex flex-col font-sans bg-[#FBE4D8] border-2 border-[#190019] rounded-[24px] shadow-[5px_5px_0px_#190019] overflow-hidden text-[#190019]">
      
      {/* 1. Header Navigation Bar */}
      <div className="p-3 bg-[#DFB6B2] border-b-2 border-[#190019] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#190019] text-[#FBE4D8] flex items-center justify-center font-bold text-xs shadow-[1.5px_1.5px_0px_#854F6C]">
            ♫
          </div>
          <span className="font-bold text-xs tracking-wide text-[#190019] font-mono uppercase">Audio Player</span>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex gap-1 bg-[#190019]/10 p-0.5 rounded-lg border border-[#190019]/20 text-[10px]">
          <button
            onClick={() => setActiveTab('my_music')}
            className={`px-2 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
              activeTab === 'my_music' ? 'bg-[#190019] text-[#FBE4D8] shadow-[1px_1px_0px_#854F6C]' : 'text-[#190019] hover:bg-[#190019]/10'
            }`}
          >
            <FileMusic className="w-3 h-3" />
            <span>Files ({localTracks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('online_stream')}
            className={`px-2 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
              activeTab === 'online_stream' ? 'bg-[#854F6C] text-white shadow-[1px_1px_0px_#190019]' : 'text-[#190019] hover:bg-[#190019]/10'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Online</span>
          </button>
        </div>
      </div>

      {/* 2. Now Playing Card Container */}
      <div className="p-4 bg-white border-b-2 border-[#190019] flex flex-col items-center relative">
        {/* Album Artwork & Spinner */}
        <div className="relative w-28 h-28 my-1 rounded-2xl border-2 border-[#190019] bg-[#DFB6B2] shadow-[3px_3px_0px_#190019] overflow-hidden flex items-center justify-center">
          {activeTrack?.image ? (
            <img src={activeTrack.image} alt={activeTrack.name} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center transition-transform duration-1000 ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}>
              <Disc3 className="w-12 h-12 text-[#190019]" />
            </div>
          )}
          
          <button 
            onClick={() => setIsLiked(!isLiked)} 
            className="absolute top-2 right-2 p-1 rounded-full bg-white border border-[#190019] shadow-sm hover:scale-110 transition-transform"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#854F6C] text-[#854F6C]' : 'text-[#190019]'}`} />
          </button>
        </div>

        {/* Track Title & Artist */}
        <div className="w-full text-center mt-3">
          <h3 className="font-extrabold text-sm text-[#190019] truncate px-2 font-mono">
            {activeTrack ? activeTrack.name : 'Select a track'}
          </h3>
          <p className="text-[10px] font-bold text-[#854F6C] uppercase tracking-wider mt-0.5 truncate">
            {activeTrack ? activeTrack.artist : 'Resting Quarters'}
          </p>
        </div>

        {/* Playback Progress Indicator Bar */}
        <div className="w-full mt-3 flex items-center gap-2 px-1">
          <span className="text-[9px] font-mono font-bold text-[#190019]/60">00:00</span>
          <div className="flex-1 h-2 bg-[#DFB6B2]/50 border border-[#190019] rounded-full overflow-hidden p-0.5">
            <div className={`h-full bg-[#190019] rounded-full transition-all duration-300 ${isPlaying ? 'w-2/3' : 'w-0'}`} />
          </div>
          <span className="text-[9px] font-mono font-bold text-[#190019]/60">03:40</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            onClick={() => {
              if (!activeTrack && activeTrackList[0]) handlePlayTrack(activeTrackList[0]);
              else if (activeTrack) handlePlayTrack(activeTrack);
            }}
            className="w-11 h-11 rounded-2xl bg-[#DFB6B2] hover:bg-[#854F6C] hover:text-white border-2 border-[#190019] text-[#190019] flex items-center justify-center transition-all shadow-[2.5px_2.5px_0px_#190019] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
        </div>
      </div>

      {/* 3. Search & Category Bar (Online Mode) */}
      {activeTab === 'online_stream' && (
        <div className="p-3 bg-[#FBE4D8] border-b-2 border-[#190019] space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 text-[#190019]/60 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search genre or vibe..."
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              className="w-full bg-white border-2 border-[#190019] rounded-xl py-1 pl-8 pr-3 text-xs font-mono text-[#190019] outline-none shadow-[1.5px_1.5px_0px_#190019]"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto custom-scrollbar text-[9px]">
            {['chillout', 'ambient', 'lofi', 'classical', 'space'].map((g) => (
              <button
                key={g}
                onClick={() => { setSearchTag(''); setSelectedGenre(g); }}
                className={`px-2 py-0.5 rounded-lg border border-[#190019] font-bold uppercase transition-all whitespace-nowrap ${
                  selectedGenre === g && !searchTag ? 'bg-[#190019] text-white' : 'bg-white text-[#190019]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Track List Section */}
      <div className="p-3 bg-[#FBE4D8]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-[#854F6C]">
            {activeTab === 'my_music' ? 'Personal Playlist' : 'Online Stream Tracks'}
          </span>
          <span className="text-[9px] font-bold bg-[#190019]/10 px-1.5 py-0.5 rounded font-mono">
            {activeTrackList.length} Tracks
          </span>
        </div>

        <div className="max-h-44 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
          {activeTab === 'online_stream' && isLoading ? (
            <div className="text-center py-4 text-xs font-mono text-[#854F6C]">Connecting to music stream...</div>
          ) : activeTrackList.length === 0 ? (
            <div className="text-center py-4 text-xs font-mono text-[#190019]/60">No tracks available</div>
          ) : (
            activeTrackList.map((track) => {
              const isThisPlaying = activeTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id}
                  onClick={() => handlePlayTrack(track)}
                  className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isThisPlaying 
                      ? 'bg-[#190019] text-[#FBE4D8] border-[#190019] shadow-[2px_2px_0px_#854F6C]' 
                      : 'bg-white border-[#190019] hover:bg-[#DFB6B2]/40 text-[#190019] shadow-[2px_2px_0px_#190019]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Music className={`w-3.5 h-3.5 shrink-0 ${isThisPlaying ? 'text-[#DFB6B2] animate-pulse' : 'text-[#854F6C]'}`} />
                    <div className="truncate font-mono">
                      <p className="font-bold truncate leading-tight">{track.name}</p>
                      <p className="text-[9px] opacity-75 truncate">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isThisPlaying ? <Pause className="w-3.5 h-3.5 text-[#DFB6B2]" /> : <Play className="w-3.5 h-3.5 opacity-60" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. Speaker Volume Bar */}
      <div className="p-3 bg-[#DFB6B2] border-t-2 border-[#190019] flex items-center gap-3">
        <Volume2 className="w-4 h-4 text-[#190019] shrink-0" />
        <input 
          type="range" min="0" max="1" step="0.01" 
          value={audioVolume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-white border border-[#190019] accent-[#190019] rounded-full cursor-pointer"
          title="Speaker Volume"
        />
        <span className="text-[10px] font-bold font-mono text-[#190019] w-8 text-right">
          {Math.round(audioVolume * 100)}%
        </span>
      </div>

    </div>
  );
};
