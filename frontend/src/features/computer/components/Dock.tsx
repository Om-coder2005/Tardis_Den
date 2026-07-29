import React from 'react';
import { useDesktopStore } from '../store/useDesktopStore';
import { useRoomStore } from '../../../store';
import { Settings, Book, Telescope, BookOpen, Camera, Search } from 'lucide-react';
import { useSearchStore } from '../../search/store/useSearchStore';

const APPS = [
  { id: 'settings', title: 'Settings', icon: Settings },
  { id: 'exploration', title: 'Captain\'s Log', imageUrl: '/icons/logbook.png' },
  { id: 'archive', title: 'Data Archive', imageUrl: '/icons/cabinet.png' },
  { id: 'bookshelf', title: 'Library', icon: Book },
  { id: 'telescope', title: 'Observatory', icon: Telescope },
  { id: 'journal', title: 'Journal', icon: BookOpen },
  { id: 'camera', title: 'Gallery', icon: Camera },
  { id: 'search', title: 'Search', icon: Search },
];

export const Dock: React.FC = () => {
  const { windows, openApp } = useDesktopStore();
  const { setFocusedObjectId } = useRoomStore();
  const toggleSearch = useSearchStore(state => state.toggleSearch);

  const handleAppClick = (appId: string, title: string) => {
    if (appId === 'search') {
      toggleSearch();
    } else if (appId === 'settings' || appId === 'exploration' || appId === 'archive') {
      openApp(appId, title);
    } else {
      setFocusedObjectId(appId);
    }
  };

  return (
    <div className="pointer-events-auto absolute bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-fit -translate-x-1/2 font-['Space_Mono',monospace]">
      <div className="flex max-w-full items-center justify-start gap-2 overflow-x-auto rounded-2xl border-2 border-[#190019] bg-[#DFB6B2] px-4 py-3 shadow-[6px_6px_0px_#190019] sm:justify-center sm:gap-3">
        {APPS.map((app) => {
          const isOpen = Object.values(windows).some(w => w.appId === app.id);
          const Icon = app.icon;
          
          return (
            <div key={app.id} className="group relative flex shrink-0 flex-col items-center justify-center">
              <button
                onClick={() => handleAppClick(app.id, app.title)}
                className="relative flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#190019] bg-[#FBE4D8] transition-all hover:bg-[#854F6C] hover:text-[#FBE4D8] shadow-[2px_2px_0px_#190019] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none sm:h-13 sm:w-13 text-[#190019]"
                title={app.title}
              >
                {app.imageUrl ? (
                  <img src={app.imageUrl} alt={app.title} className="h-8 w-8 object-contain" />
                ) : (
                  Icon && <Icon className="h-6 w-6 fill-current" strokeWidth={1.8} />
                )}
                
                {isOpen && (
                  <div className="absolute -bottom-1.5 left-1/2 h-1.5 w-6 -translate-x-1/2 rounded-full bg-[#190019] border border-[#FBE4D8]" />
                )}
              </button>
              
              <div className="mt-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-[#190019] bg-[#FBE4D8] px-1.5 py-0.5 border border-[#190019] opacity-0 transition group-hover:opacity-100 shadow-[1px_1px_0px_#190019]">
                {app.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
