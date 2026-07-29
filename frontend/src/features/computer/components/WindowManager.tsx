import React, { useRef } from 'react';
import { useDesktopStore } from '../store/useDesktopStore';
import { Window } from './Window';
import { SettingsApp } from '../apps/SettingsApp';
import { ExplorationApp } from '../apps/ExplorationApp';
import { DataArchiveApp } from '../apps/DataArchiveApp';

export const WindowManager: React.FC = () => {
  const { windows } = useDesktopStore();
  const constraintsRef = useRef<HTMLDivElement>(null);

  // App Registry: Maps appId to its component
  const renderApp = (appId: string) => {
    switch (appId) {
      case 'settings': return <SettingsApp />;
      case 'exploration': return <ExplorationApp />;
      case 'archive': return <DataArchiveApp />;
      default: return <div className="p-4 text-slate-500">App not found</div>;
    }
  };

  return (
    <div ref={constraintsRef} className="absolute inset-0 overflow-hidden">
      {Object.values(windows).map(win => (
        <Window 
          key={win.id} 
          window={win} 
          constraintsRef={constraintsRef as React.RefObject<HTMLDivElement>}
        >
          {renderApp(win.appId)}
        </Window>
      ))}
    </div>
  );
};
