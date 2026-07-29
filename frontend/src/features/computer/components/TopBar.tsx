import React, { useState, useEffect } from 'react';
import { CloudMoon, Command, MapPinned, Search, Settings, Volume2, VolumeX, Wifi } from 'lucide-react';
import { useDesktopStore } from '../store/useDesktopStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useEnvironmentStore } from '../../room/store/useEnvironmentStore';
import { useSearchStore } from '../../search/store/useSearchStore';

export const TopBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { openApp } = useDesktopStore();
  const { isMuted, toggleMute } = useSettingsStore();
  const { weather, timeOfDay } = useEnvironmentStore();
  const toggleSearch = useSearchStore(state => state.toggleSearch);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pointer-events-auto z-50 mx-4 mt-4 rounded-xl border-2 border-[#190019] bg-[#DFB6B2] px-5 py-2 text-[#190019] shadow-[4px_4px_0px_#190019]">
      <div className="grid min-h-10 grid-cols-[auto_1fr_auto] items-center gap-4 text-xs font-bold font-['Space_Mono',monospace]">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span className="rounded-md border border-[#190019] bg-[#190019] px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-[#FBE4D8] shadow-[2px_2px_0px_#854F6C]">
            Tardis
          </span>
          <span className="hidden text-[#2B124C] md:inline font-bold">Observatory OS</span>
        </div>

        <button
          onClick={toggleSearch}
          className="hidden w-full max-w-[340px] items-center justify-between justify-self-center rounded-lg border-2 border-[#190019] bg-white px-3.5 py-1.5 text-[#190019] transition hover:bg-[#FBE4D8] md:flex shadow-[2px_2px_0px_#190019]"
        >
          <span className="flex items-center gap-2 text-xs">
            <Search className="h-3.5 w-3.5 text-[#854F6C]" />
            <span>Search observatory...</span>
          </span>
          <span className="flex items-center gap-1 rounded border border-[#190019] bg-[#DFB6B2] px-1.5 py-0.5 text-[10px] uppercase font-bold">
            <Command className="h-3 w-3" />
            K
          </span>
        </button>

        <div className="flex items-center justify-end gap-3 text-[#190019] whitespace-nowrap">
          <div className="hidden items-center gap-1.5 rounded-lg border border-[#190019] bg-[#FBE4D8] px-2.5 py-1 md:flex text-xs">
            <MapPinned className="h-3.5 w-3.5 text-[#854F6C]" />
            <span>Pune Obs.</span>
          </div>
          <div className="hidden items-center gap-1.5 rounded-lg border border-[#190019] bg-[#FBE4D8] px-2.5 py-1 xl:flex text-xs capitalize">
            <CloudMoon className="h-3.5 w-3.5 text-[#854F6C]" />
            <span>{weather} · {timeOfDay}</span>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Wifi className="w-3.5 h-3.5 text-[#190019]" />
            <button
              onClick={toggleMute}
              className="rounded p-1 border border-[#190019] bg-[#FBE4D8] hover:bg-white transition text-[#190019]"
              title={isMuted ? 'Unmute system audio' : 'Mute system audio'}
              aria-label={isMuted ? 'Unmute system audio' : 'Mute system audio'}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-red-600" /> : <Volume2 className="h-3.5 w-3.5 text-[#190019]" />}
            </button>
          </div>

          <button
            onClick={() => openApp('settings', 'System Settings')}
            className="rounded-lg border-2 border-[#190019] bg-[#FBE4D8] p-1.5 transition hover:bg-white text-[#190019] shadow-[2px_2px_0px_#190019] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Open Settings"
          >
            <Settings className="w-4 h-4 text-[#190019]" />
          </button>

          <div className="rounded-lg border border-[#190019] bg-[#190019] px-3 py-1 text-right text-[#FBE4D8]">
            <div className="font-bold text-xs">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-[#DFB6B2]">
              {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
