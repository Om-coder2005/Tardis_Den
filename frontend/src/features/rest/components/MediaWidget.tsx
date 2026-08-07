import React, { useState, useEffect, useRef } from 'react';
import { useDreamStore, AUDIO_TRACKS } from '../store/useDreamStore';
import { useDynamicMusicQuery } from '../services/restAreaServices';
import type { DynamicMusicTrack } from '../services/restAreaServices';
import { 
  Play, Pause, Disc3, Volume2, Music, Search, Radio, FileMusic, Heart, 
  Upload, Trash2, Plus, RefreshCw, Link as LinkIcon 
} from 'lucide-react';
import { engine } from '../store/AudioEngine';
import { saveLocalTrack, getAllLocalTracks, deleteLocalTrack } from '../utils/audioStorage';
import type { LocalAudioRecord } from '../utils/audioStorage';

export const MediaWidget: React.FC = () => {
  const { audioVolume, setVolume } = useDreamStore();
  const [activeTab, setActiveTab] = useState<'my_music' | 'online_stream'>('my_music');
  const [selectedGenre, setSelectedGenre] = useState('chillout');
  const [searchTag, setSearchTag] = useState('');
  const [activeTrack, setActiveTrack] = useState<DynamicMusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Local Tracks State (Loaded from IndexedDB)
  const [importedTracks, setImportedTracks] = useState<DynamicMusicTrack[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom Stream URL state
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  const [customStreamUrl, setCustomStreamUrl] = useState('');
  const [customStreamName, setCustomStreamName] = useState('');
  const [customOnlineTracks, setCustomOnlineTracks] = useState<DynamicMusicTrack[]>([]);

  // Load imported local tracks from IndexedDB on component mount
  useEffect(() => {
    async function loadSavedLocalTracks() {
      try {
        const records = await getAllLocalTracks();
        const tracks: DynamicMusicTrack[] = records.map((rec) => ({
          id: rec.id,
          name: rec.name,
          artist: rec.artist,
          audio: URL.createObjectURL(rec.blob),
          sourceType: 'local',
          isLocal: true,
        }));
        setImportedTracks(tracks);
      } catch (err) {
        console.error('Failed to load local tracks:', err);
      }
    }
    loadSavedLocalTracks();
  }, []);

  // Update time tracker callback from AudioEngine
  useEffect(() => {
    engine.setTimeUpdateCallback((curr, dur) => {
      setCurrentTime(curr);
      setDuration(dur);
    });
  }, []);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    engine.seekTo(val);
  };

  // Fetch online streams with Jamendo + Fallback
  const { data: onlineTracksData = [], isLoading: isOnlineLoading, refetch: refetchOnline } = useDynamicMusicQuery(searchTag || selectedGenre);
  const onlineCatalog = Array.isArray(onlineTracksData) ? onlineTracksData : [];
  const combinedOnlineTracks = [...customOnlineTracks, ...onlineCatalog];

  // Preset Public Library Tracks
  const presetTracks: DynamicMusicTrack[] = AUDIO_TRACKS.map((t) => ({
    id: t.id,
    name: t.name,
    artist: 'Preset Library',
    audio: t.file,
    sourceType: 'preset',
  }));

  // Combined Local Library (Imported Local + Preset files)
  const localTracks = [...importedTracks, ...presetTracks];

  const activeTrackList = activeTab === 'my_music' ? localTracks : combinedOnlineTracks;

  // Handle local file selection / import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsImporting(true);
    const newTracks: DynamicMusicTrack[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
        continue;
      }
      try {
        const record: LocalAudioRecord = await saveLocalTrack(file);
        const objectUrl = URL.createObjectURL(record.blob);
        newTracks.push({
          id: record.id,
          name: record.name,
          artist: record.artist,
          audio: objectUrl,
          sourceType: 'local',
          isLocal: true,
        });
      } catch (err) {
        console.error('Error saving local file to IndexedDB:', err);
      }
    }

    if (newTracks.length > 0) {
      setImportedTracks((prev) => [...newTracks, ...prev]);
    }
    setIsImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle deleting an imported local track
  const handleDeleteLocalTrack = async (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    try {
      await deleteLocalTrack(trackId);
      setImportedTracks((prev) => {
        const target = prev.find((t) => t.id === trackId);
        if (target && target.audio.startsWith('blob:')) {
          URL.revokeObjectURL(target.audio);
        }
        return prev.filter((t) => t.id !== trackId);
      });
      if (activeTrack?.id === trackId) {
        engine.pauseTrack();
        setIsPlaying(false);
        setActiveTrack(null);
      }
    } catch (err) {
      console.error('Failed to delete track:', err);
    }
  };

  // Handle adding custom online stream URL
  const handleAddCustomStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStreamUrl.trim()) return;

    const newStreamTrack: DynamicMusicTrack = {
      id: `custom_stream_${Date.now()}`,
      name: customStreamName.trim() || 'Custom Online Stream',
      artist: 'Custom Stream',
      audio: customStreamUrl.trim(),
      sourceType: 'custom_url',
    };

    setCustomOnlineTracks((prev) => [newStreamTrack, ...prev]);
    setCustomStreamUrl('');
    setCustomStreamName('');
    setShowCustomUrlInput(false);
    handlePlayTrack(newStreamTrack);
  };

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
            className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
              activeTab === 'my_music' ? 'bg-[#190019] text-[#FBE4D8] shadow-[1px_1px_0px_#854F6C]' : 'text-[#190019] hover:bg-[#190019]/10'
            }`}
          >
            <FileMusic className="w-3 h-3" />
            <span>Files ({localTracks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('online_stream')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
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

        {/* Track Title, Artist, & Badge */}
        <div className="w-full text-center mt-3">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            {activeTrack?.sourceType === 'local' && (
              <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#854F6C] text-white uppercase border border-[#190019]">
                Local File
              </span>
            )}
            {activeTrack?.sourceType === 'online' && (
              <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#190019] text-[#FBE4D8] uppercase">
                Online Stream
              </span>
            )}
            {activeTrack?.sourceType === 'custom_url' && (
              <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#DFB6B2] text-[#190019] uppercase border border-[#190019]">
                Custom URL
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-sm text-[#190019] truncate px-2 font-mono">
            {activeTrack ? activeTrack.name : 'Select a track'}
          </h3>
          <p className="text-[10px] font-bold text-[#854F6C] uppercase tracking-wider mt-0.5 truncate">
            {activeTrack ? activeTrack.artist : 'Resting Quarters'}
          </p>
        </div>

        {/* Playback Progress Indicator Bar */}
        <div className="w-full mt-3 flex items-center gap-2 px-1">
          <span className="text-[9px] font-mono font-bold text-[#190019]/60 w-8 text-left">{formatTime(currentTime)}</span>
          <div className="flex-1 h-2 bg-[#DFB6B2]/50 border border-[#190019] rounded-full overflow-hidden relative group">
            <div 
              className="h-full bg-[#190019] rounded-full transition-all duration-150" 
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} 
            />
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              step="0.1" 
              value={currentTime} 
              onChange={handleSeek}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Seek Position"
            />
          </div>
          <span className="text-[9px] font-mono font-bold text-[#190019]/60 w-8 text-right">
            {duration > 0 ? formatTime(duration) : 'LIVE'}
          </span>
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

      {/* 3. Toolbar / Action Bar depending on Active Tab */}
      {activeTab === 'my_music' ? (
        <div className="p-3 bg-[#FBE4D8] border-b-2 border-[#190019] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
            <Upload className="w-3.5 h-3.5 text-[#854F6C]" />
            <span>Import Local Audio</span>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac" 
            multiple 
            className="hidden" 
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="px-3 py-1 bg-[#190019] text-[#FBE4D8] rounded-xl border border-[#190019] font-bold text-xs font-mono shadow-[1.5px_1.5px_0px_#854F6C] hover:bg-[#854F6C] transition-all flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isImporting ? 'Importing...' : 'Browse Local Files'}</span>
          </button>
        </div>
      ) : (
        <div className="p-3 bg-[#FBE4D8] border-b-2 border-[#190019] space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2 text-[#190019]/60 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search online genre or vibe..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="w-full bg-white border-2 border-[#190019] rounded-xl py-1 pl-8 pr-3 text-xs font-mono text-[#190019] outline-none shadow-[1.5px_1.5px_0px_#190019]"
              />
            </div>
            
            <button
              onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
              title="Add Custom Online Stream URL"
              className="p-1.5 bg-white border-2 border-[#190019] rounded-xl text-[#190019] hover:bg-[#DFB6B2] shadow-[1.5px_1.5px_0px_#190019] transition-all"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => refetchOnline()}
              title="Refresh Online Catalog"
              className="p-1.5 bg-white border-2 border-[#190019] rounded-xl text-[#190019] hover:bg-[#DFB6B2] shadow-[1.5px_1.5px_0px_#190019] transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isOnlineLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Custom Stream URL Input Box */}
          {showCustomUrlInput && (
            <form onSubmit={handleAddCustomStream} className="p-2 bg-white border-2 border-[#190019] rounded-xl space-y-2 shadow-[2px_2px_0px_#190019]">
              <div className="text-[10px] font-bold font-mono text-[#854F6C] uppercase">Add Audio Stream / Direct MP3 URL</div>
              <input
                type="text"
                placeholder="Stream Name (e.g. My Favorite Station)"
                value={customStreamName}
                onChange={(e) => setCustomStreamName(e.target.value)}
                className="w-full bg-[#FBE4D8]/40 border border-[#190019] rounded-lg p-1 text-xs font-mono outline-none"
              />
              <input
                type="url"
                required
                placeholder="https://example.com/audio.mp3"
                value={customStreamUrl}
                onChange={(e) => setCustomStreamUrl(e.target.value)}
                className="w-full bg-[#FBE4D8]/40 border border-[#190019] rounded-lg p-1 text-xs font-mono outline-none"
              />
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowCustomUrlInput(false)}
                  className="px-2 py-0.5 text-[10px] font-bold border border-[#190019] rounded-lg bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-0.5 text-[10px] font-bold border border-[#190019] rounded-lg bg-[#190019] text-white"
                >
                  Add Stream
                </button>
              </div>
            </form>
          )}

          {/* Genre Category Pills */}
          <div className="flex gap-1 overflow-x-auto custom-scrollbar text-[9px]">
            {['chillout', 'ambient', 'lofi', 'classical', 'space', 'synthwave', 'nature'].map((g) => (
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
            {activeTab === 'my_music' ? 'Personal Library' : 'Online Stream Tracks'}
          </span>
          <span className="text-[9px] font-bold bg-[#190019]/10 px-1.5 py-0.5 rounded font-mono">
            {activeTrackList.length} Tracks
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
          {activeTab === 'online_stream' && isOnlineLoading && combinedOnlineTracks.length === 0 ? (
            <div className="text-center py-6 text-xs font-mono text-[#854F6C] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Connecting to online stream catalog...</span>
            </div>
          ) : activeTrackList.length === 0 ? (
            <div className="text-center py-6 text-xs font-mono text-[#190019]/60 border-2 border-dashed border-[#190019]/20 rounded-xl">
              {activeTab === 'my_music' ? 'No local tracks imported yet. Click "Browse Local Files" above!' : 'No online tracks found.'}
            </div>
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
                  <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                    <Music className={`w-3.5 h-3.5 shrink-0 ${isThisPlaying ? 'text-[#DFB6B2] animate-pulse' : 'text-[#854F6C]'}`} />
                    <div className="truncate font-mono">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold truncate leading-tight">{track.name}</p>
                        {track.isLocal && (
                          <span className="text-[7px] font-bold font-mono px-1 rounded bg-[#854F6C] text-white uppercase shrink-0">
                            IMPORTED
                          </span>
                        )}
                        {track.sourceType === 'custom_url' && (
                          <span className="text-[7px] font-bold font-mono px-1 rounded bg-[#190019] text-white uppercase shrink-0">
                            URL
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] opacity-75 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {track.isLocal && (
                      <button
                        onClick={(e) => handleDeleteLocalTrack(e, track.id)}
                        title="Delete imported track"
                        className="p-1 text-red-600 hover:bg-red-100 rounded border border-transparent hover:border-red-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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
