import React from 'react';
import { useTelescopeStore } from '../store/useTelescopeStore';
import { useNasaImageSearch } from '../services/nasa.service';
import type { NasaImageItem } from '../services/nasa.service';
import { useLibraryRecords } from '../../bookshelf/services/library.service';
import { Star, Telescope, Orbit } from 'lucide-react';

export const ObservationBrowser: React.FC = () => {
  const { currentCategory, searchQuery, setSelectedObservationId } = useTelescopeStore();
  const { data: images = [], isLoading } = useNasaImageSearch(currentCategory, searchQuery);
  const { data: records = {} } = useLibraryRecords();

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0A1128] via-[#02040A] to-black relative">
      
      {/* Subtle Star Background Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-screen" />
      
      <div className="p-10 md:p-16 max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#4CC9F0] font-[var(--font-tele-mono)] text-xs tracking-[0.2em] uppercase mb-3">
            {searchQuery ? 'Target Acquisition' : 'Sector Scan'}
          </p>
          <h3 className="text-4xl md:text-5xl font-[var(--font-tele-serif)] font-bold text-white tracking-wide">
            {searchQuery ? `"${searchQuery}"` : currentCategory}
          </h3>
          <p className="text-[#F4F4F9]/50 mt-4 text-sm max-w-2xl font-[var(--font-tele-sans)]">
            {isLoading ? 'Calibrating sensors...' : `Displaying ${images.length} celestial objects currently visible in this sector.`}
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Orbit className="w-12 h-12 text-[#4CC9F0] animate-[spin_3s_linear_infinite]" />
            <span className="text-[#4CC9F0] font-[var(--font-tele-mono)] text-xs tracking-widest animate-pulse">ACQUIRING TELEMETRY...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {images.map((item: NasaImageItem, index: number) => {
              const record = records[item.nasa_id];
              const isFavorite = record?.isFavorite || false;
              const hasNotes = !!record?.notes;

              return (
                <div 
                  key={item.nasa_id}
                  onClick={() => setSelectedObservationId(item.nasa_id)}
                  className="group cursor-pointer flex flex-col relative"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Planetarium Image Card */}
                  <div className="w-full aspect-[4/3] bg-black rounded-xl overflow-hidden mb-4 relative transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(76,201,240,0.15)] ring-1 ring-white/5 group-hover:ring-[#4CC9F0]/30 transform group-hover:-translate-y-2">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
                    />
                    
                    {/* Cinematic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                    
                    {/* Status Indicators */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {hasNotes && (
                        <div className="bg-[#0A1128]/80 p-1.5 rounded-full backdrop-blur-md border border-[#4CC9F0]/30" title="Notes Logged">
                          <div className="w-2 h-2 bg-[#4CC9F0] rounded-full shadow-[0_0_10px_#4CC9F0]"></div>
                        </div>
                      )}
                      {isFavorite && (
                        <div className="bg-[#0A1128]/80 p-1.5 rounded-full backdrop-blur-md border border-[#C5A059]/30 text-[#C5A059]">
                          <Star className="w-3.5 h-3.5 fill-current shadow-[0_0_10px_#C5A059]" />
                        </div>
                      )}
                    </div>

                    {/* ID Label */}
                    <div className="absolute bottom-3 left-3 text-[10px] font-[var(--font-tele-mono)] text-[#4CC9F0] tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/5">
                      OBJ-{item.nasa_id.substring(0, 6)}
                    </div>
                  </div>
                  
                  {/* Typography */}
                  <h4 className="font-[var(--font-tele-serif)] font-bold text-lg text-white line-clamp-1 leading-snug group-hover:text-[#4CC9F0] transition-colors duration-500">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-[var(--font-tele-mono)] text-[#F4F4F9]/40 tracking-wider">
                      {item.date_created.substring(0, 4)}
                    </span>
                    {item.center && (
                      <>
                        <span className="text-[#F4F4F9]/20">•</span>
                        <span className="text-[11px] font-[var(--font-tele-mono)] text-[#F4F4F9]/40 tracking-wider">
                          {item.center}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && images.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-[#F4F4F9]/30">
            <Telescope className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-[var(--font-tele-sans)]">No celestial bodies detected in this sector.</p>
          </div>
        )}
      </div>
    </div>
  );
};
