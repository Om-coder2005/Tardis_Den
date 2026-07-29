import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRoomStore } from '../../store';
import { OBJECT_REGISTRY } from './ObjectRegistry';
import { InteractiveObject } from './components/InteractiveObject';
import { InteractionPanel } from './components/InteractionPanel';
const BookshelfModule = React.lazy(() => import('../bookshelf/BookshelfModule').then(m => ({ default: m.BookshelfModule })));
const TelescopeModule = React.lazy(() => import('../telescope/TelescopeModule').then(m => ({ default: m.TelescopeModule })));
const JournalModule = React.lazy(() => import('../journal/JournalModule').then(m => ({ default: m.JournalModule })));
const CameraModule = React.lazy(() => import('../camera/CameraModule').then(m => ({ default: m.CameraModule })));
const ComputerModule = React.lazy(() => import('../computer/ComputerModule').then(m => ({ default: m.ComputerModule })));
const AICompanion = React.lazy(() => import('../ai/AICompanion').then(m => ({ default: m.AICompanion })));
const PinnedNotesLayer = React.lazy(() => import('../journal/components/PinnedNotesLayer').then(m => ({ default: m.PinnedNotesLayer })));
const RestAreaModule = React.lazy(() => import('../rest/components/RestAreaModule').then(m => ({ default: m.RestAreaModule })));
import { EnvironmentLayer } from './components/EnvironmentLayer';
import { ParticleSystem } from './components/ParticleSystem';
// @ts-ignore
import roomPngBackground from '../../assets/images/room.png';

export const RoomScene: React.FC = () => {
  const { focusedObjectId } = useRoomStore();

  const activeObject = useMemo(
    () => OBJECT_REGISTRY.find(obj => obj.id === focusedObjectId),
    [focusedObjectId]
  );

  let scale = 1;
  let x = '0%';
  let y = '0%';

  if (activeObject) {
    scale = activeObject.focusScale;
    x = `${50 - activeObject.focusX}%`;
    y = `${50 - activeObject.focusY}%`;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center">
      
      {/* Deep Space Background Layer (Nebula, Moon, Shooting Stars) */}
      <EnvironmentLayer />
      <ParticleSystem />

      {/* 
        This is the inner wrapper that preserves aspect ratio 
        and houses the room image and interactive objects.
      */}
      <motion.div
        className="relative w-full h-full z-10"
        style={{
          maxWidth: '1920px',
          maxHeight: '1080px',
          aspectRatio: '16/9'
        }}
        initial={false}
        animate={{ scale, x, y }}
        transition={{ type: "spring", damping: 30, stiffness: 100, mass: 1.5 }}
      >
        <img 
          src={roomPngBackground} 
          alt="TARDIS Den Room Background" 
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none z-0"
        />

        {/* The Interaction Layer */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative w-full h-full" style={{ aspectRatio: '16/9' }}>
            {OBJECT_REGISTRY.map((obj) => (
              <InteractiveObject 
                key={obj.id} 
                objectData={obj} 
                isDisabled={!!focusedObjectId && focusedObjectId !== obj.id} 
              />
            ))}
          </div>
        </div>

        {/* Dimmer overlay when an object is focused */}
        <motion.div
          className="absolute inset-0 bg-black/40 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: focusedObjectId ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      <InteractionPanel />
      {/* Interactive Modules with Suspense for Lazy Loading */}
      <React.Suspense fallback={null}>
        <BookshelfModule />
        <TelescopeModule />
        <JournalModule />
        <CameraModule />
        <ComputerModule />
        <RestAreaModule />
        <AICompanion />
        <PinnedNotesLayer />
      </React.Suspense>
    </div>
  );
};
