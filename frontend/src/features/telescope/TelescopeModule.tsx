import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../store';
import { useTelescopeStore } from './store/useTelescopeStore';
import { useApodQuery } from './services/spaceTelemetry.service';
import { AIToggleButton } from '../ai/AIToggleButton';
import { ObservatorySidebar } from './components/ObservatorySidebar';
import { ObservationBrowser } from './components/ObservationBrowser';
import { ObservationViewer } from './components/ObservationViewer';
import { AladinSkyMap } from './components/AladinSkyMap';
import { NearEarthTracker } from './components/NearEarthTracker';
import { ConstellationsViewer } from './components/ConstellationsViewer';
import { TelescopeLensOverlay } from './components/TelescopeLensOverlay';
import { X, Sparkles } from 'lucide-react';

export const TelescopeModule: React.FC = () => {
  const { focusedObjectId, clearFocus } = useRoomStore();
  const { selectedObservationId, activeView } = useTelescopeStore();
  const { data: apodData } = useApodQuery();
  
  const isOpen = focusedObjectId === 'telescope';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-4 md:inset-8 lg:inset-12 z-50 bg-[#0A1128] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-[#3A0CA3]/40 flex overflow-hidden font-[var(--font-tele-sans)] text-[#F4F4F9]"
        >
          <AIToggleButton 
            context={{ 
              module: 'Telescope', 
              data: { activeView, apod: apodData } 
            }} 
          />

          {/* 3-Pane Layout */}
          <ObservatorySidebar />
          
          <div className="flex-1 relative flex flex-col overflow-hidden bg-black">
            
            {/* Top NASA APOD Ticker Banner */}
            {apodData && apodData.media_type === 'image' && (
              <div className="bg-gradient-to-r from-[#3A0CA3]/60 via-[#0A1128] to-black px-6 py-2 border-b border-white/5 flex items-center justify-between z-10 shrink-0 text-xs font-[var(--font-tele-mono)]">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="flex items-center gap-1.5 text-[#C5A059] font-bold uppercase tracking-wider shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                    NASA APOD:
                  </span>
                  <span className="text-white truncate font-medium">{apodData.title}</span>
                </div>
                <span className="text-[#4CC9F0]/80 shrink-0 ml-4">{apodData.date}</span>
              </div>
            )}

            {/* Active View Router */}
            <div className="flex-1 relative flex overflow-hidden">
              {/* Animated Telescope HUD & Vignette Optics */}
              <TelescopeLensOverlay />

              {activeView === 'catalog' && <ObservationBrowser />}
              
              {activeView === 'constellations' && <ConstellationsViewer />}

              {activeView === 'aladin' && (
                <div className="w-full h-full p-6 flex flex-col bg-[#02040A]">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold font-[var(--font-tele-serif)] text-white">CDS Aladin Sky Atlas</h3>
                    <p className="text-xs text-[#F4F4F9]/50">Interactive sky survey visualization powered by Centre de Données astronomiques de Strasbourg.</p>
                  </div>
                  <div className="flex-1 w-full relative">
                    <AladinSkyMap target="M31" fov={5} survey="P/DSS2/color" />
                  </div>
                </div>
              )}

              {activeView === 'neows' && <NearEarthTracker />}
              
              {/* Detailed Observation Modal Overlay */}
              <AnimatePresence>
                {selectedObservationId && <ObservationViewer />}
              </AnimatePresence>
            </div>
          </div>

          {/* Close Button Overlay */}
          <button 
            onClick={clearFocus}
            className="absolute top-4 right-6 z-[60] w-10 h-10 rounded-full bg-[#0A1128]/90 border border-[#4CC9F0]/30 flex items-center justify-center text-[#4CC9F0] hover:bg-[#3A0CA3] hover:text-white transition-all shadow-lg"
            title="Close Telescope Observatory"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
