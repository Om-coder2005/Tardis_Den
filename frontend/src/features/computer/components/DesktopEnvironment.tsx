import React, { useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useExplorationStore } from '../store/useExplorationStore';
import { useRoomStore } from '../../../store';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { WindowManager } from './WindowManager';

export const DesktopEnvironment: React.FC = () => {
  const { currentWallpaper, highContrast, largeFonts, performanceMode } = useSettingsStore();
  const runMigration = useExplorationStore(state => state.runMigration);

  useEffect(() => {
    runMigration({
      settings: useSettingsStore.getState(),
      room: useRoomStore.getState()
    });
  }, [runMigration]);

  return (
    <div className={`relative flex-1 flex flex-col overflow-hidden bg-black ${largeFonts ? 'text-[115%]' : ''} ${highContrast ? 'contrast-125' : ''}`}>
      
      {/* Desktop Wallpaper */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: performanceMode === 'performance' ? 'none' : `url(${currentWallpaper})` }}
      />
      <div className={`absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(25,0,25,0.68),rgba(43,18,76,0.72)_34%,rgba(25,0,25,0.88))] ${performanceMode === 'performance' ? 'opacity-95' : ''}`} />
      {performanceMode !== 'performance' && (
        <div className="absolute inset-0 z-0 opacity-[0.1] [background-image:linear-gradient(rgba(251,228,216,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(251,228,216,0.12)_1px,transparent_1px)] [background-size:46px_46px]" />
      )}

      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <TopBar />
        
        <div className="flex-1 relative pointer-events-auto overflow-hidden">
          <WindowManager />
        </div>
        
        <Dock />
      </div>
    </div>
  );
};
