import React, { useState } from 'react';
import { CONSTELLATIONS_CATALOG } from '../data/constellations.data';
import type { ConstellationData } from '../data/constellations.data';
import { AladinSkyMap } from './AladinSkyMap';
import { Star, Compass, BookOpen } from 'lucide-react';

export const ConstellationsViewer: React.FC = () => {
  const [selectedConstellation, setSelectedConstellation] = useState<ConstellationData>(CONSTELLATIONS_CATALOG[0]);
  const [activeTab, setActiveTab] = useState<'stars' | 'history'>('stars');

  return (
    <div className="flex-1 overflow-hidden bg-gradient-to-br from-[#0A1128] via-[#02040A] to-black flex flex-col md:flex-row relative font-[var(--font-tele-sans)] text-white">
      
      {/* Constellation Selector List Sidebar */}
      <div className="w-full md:w-80 shrink-0 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col h-full z-10">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 text-[#4CC9F0] mb-2">
            <Compass className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-[var(--font-tele-mono)] tracking-[0.2em] uppercase font-bold">Stellar Cartography</span>
          </div>
          <h2 className="text-2xl font-bold font-[var(--font-tele-serif)]">Constellations</h2>
          <p className="text-xs text-[#F4F4F9]/50 mt-1">Select a star pattern to calibrate sky alignment.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {CONSTELLATIONS_CATALOG.map((c) => {
            const isSelected = selectedConstellation.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedConstellation(c)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#4CC9F0]/20 to-transparent border-[#4CC9F0] shadow-[0_0_20px_rgba(76,201,240,0.15)]' 
                    : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{c.symbol}</span>
                    <h4 className="font-bold font-[var(--font-tele-serif)] text-base">{c.name}</h4>
                  </div>
                  <span className="text-xs text-[#F4F4F9]/40 block mt-0.5">{c.latinName}</span>
                </div>
                <span className="text-[10px] font-[var(--font-tele-mono)] text-[#4CC9F0] bg-white/5 px-2 py-1 rounded border border-white/10">
                  {c.season}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Aladin Viewport Overlay & Metadata Panel */}
      <div className="flex-1 flex flex-col lg:flex-row h-full relative overflow-hidden bg-black">
        
        {/* Real-time Interactive Sky Atlas centered on selected Constellation */}
        <div className="flex-1 h-full p-4 relative">
          <div className="absolute top-8 left-8 z-20 bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs font-[var(--font-tele-mono)] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#4CC9F0] animate-ping" />
            <span>Targeting RA {selectedConstellation.ra} | Dec {selectedConstellation.dec}</span>
          </div>

          <AladinSkyMap 
            target={`${selectedConstellation.name}`} 
            fov={selectedConstellation.fov} 
            survey="P/DSS2/color" 
          />
        </div>

        {/* Constellation Deep-Dive Inspector */}
        <div className="w-full lg:w-96 shrink-0 border-l border-white/10 bg-[#0A1128]/95 backdrop-blur-2xl p-6 flex flex-col h-full overflow-y-auto shadow-2xl">
          <div className="mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{selectedConstellation.symbol}</span>
              <div>
                <h3 className="text-2xl font-bold font-[var(--font-tele-serif)]">{selectedConstellation.name}</h3>
                <span className="text-xs text-[#4CC9F0] font-[var(--font-tele-mono)]">{selectedConstellation.latinName}</span>
              </div>
            </div>
            <p className="text-xs text-[#F4F4F9]/70 leading-relaxed mt-3 font-light">
              {selectedConstellation.description}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('stars')}
              className={`flex-1 py-2 rounded-md font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'stars' ? 'bg-[#4CC9F0]/20 text-[#4CC9F0] border border-[#4CC9F0]/40' : 'text-[#F4F4F9]/50 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              Major Stars ({selectedConstellation.majorStars.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-md font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'history' ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40' : 'text-[#F4F4F9]/50 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Lore & History
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'stars' ? (
            <div className="space-y-3 font-[var(--font-tele-mono)] text-xs">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[10px] text-[#F4F4F9]/40 block uppercase tracking-widest mb-1">Brightest Star</span>
                <span className="text-[#C5A059] font-bold text-sm">{selectedConstellation.brightestStar}</span>
              </div>

              {selectedConstellation.majorStars.map((star) => (
                <div key={star.name} className="p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/20 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm">{star.name}</span>
                    <span className="text-[10px] text-[#4CC9F0] bg-[#4CC9F0]/10 px-2 py-0.5 rounded">Mag {star.mag}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#F4F4F9]/50">
                    <span>{star.designation}</span>
                    <span>{star.distLy} ly away</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-xs leading-relaxed text-[#F4F4F9]/80 italic">
              "{selectedConstellation.history}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
