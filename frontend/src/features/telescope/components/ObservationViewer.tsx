import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useTelescopeStore } from '../store/useTelescopeStore';
import { useNasaImageSearch } from '../services/nasa.service';
import type { NasaImageItem } from '../services/nasa.service';
import { useLibraryRecords, useUpdateLibraryRecord } from '../../bookshelf/services/library.service';
import { ArrowLeft, Star, FileText, Info } from 'lucide-react';

export const ObservationViewer: React.FC = () => {
  const { selectedObservationId, setSelectedObservationId, currentCategory, searchQuery } = useTelescopeStore();
  const { data: images = [] } = useNasaImageSearch(currentCategory, searchQuery);
  const { data: records = {} } = useLibraryRecords();
  const { mutate: updateRecord } = useUpdateLibraryRecord();

  const [showMetadata, setShowMetadata] = useState(true);
  const [localNote, setLocalNote] = useState('');

  const image = images.find((img: NasaImageItem) => img.nasa_id === selectedObservationId);
  const record = selectedObservationId ? records[selectedObservationId] : null;
  const isFavorite = record?.isFavorite || false;

  useEffect(() => {
    if (record?.notes !== undefined) {
      setLocalNote(record.notes || '');
    } else {
      setLocalNote('');
    }
  }, [selectedObservationId, record?.notes]);

  useEffect(() => {
    if (!selectedObservationId) return;
    const timer = setTimeout(() => {
      if (localNote !== record?.notes) {
        updateRecord({ contentId: selectedObservationId, data: { notes: localNote } });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [localNote, selectedObservationId, record?.notes, updateRecord]);

  if (!selectedObservationId || !image) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Cinematic ease-out
      className="absolute inset-0 bg-black z-50 flex overflow-hidden font-[var(--font-tele-sans)]"
    >
      {/* Top Toolbar overlay (Minimal Glassmorphism) */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 pointer-events-none">
        <button 
          onClick={() => setSelectedObservationId(null)}
          className="pointer-events-auto flex items-center gap-3 text-[#F4F4F9]/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-xl border border-white/10 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">Disengage</span>
        </button>

        <div className="flex gap-3 pointer-events-auto">
          <button 
            onClick={() => updateRecord({ contentId: selectedObservationId, data: { isFavorite: !isFavorite } })}
            className={`w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg ${
              isFavorite 
                ? 'bg-[#C5A059]/20 border-[#C5A059]/50 text-[#C5A059]' 
                : 'bg-white/5 border-white/10 text-[#F4F4F9]/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={() => setShowMetadata(!showMetadata)}
            className={`w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg ${
              showMetadata 
                ? 'bg-[#4CC9F0]/20 border-[#4CC9F0]/50 text-[#4CC9F0]' 
                : 'bg-white/5 border-white/10 text-[#F4F4F9]/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main High-Res Viewer */}
      <div className="flex-1 w-full h-full bg-[#02040A] cursor-move relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-screen" />
        <TransformWrapper
          initialScale={1}
          minScale={0.2}
          maxScale={12}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          zoomAnimation={{ animationType: "linear" }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src={image.high_res} 
              alt={image.title}
              className="w-full h-full object-contain pointer-events-none"
              loading="lazy"
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Museum Information Panel */}
      <AnimatePresence>
        {showMetadata && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="w-[450px] bg-gradient-to-b from-[#0A1128]/95 to-[#02040A]/95 backdrop-blur-2xl border-l border-white/10 shrink-0 flex flex-col h-full overflow-y-auto shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-20"
          >
            <div className="p-10 pb-6 border-b border-white/5">
              <div className="flex items-center gap-2 mb-4 text-[#4CC9F0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4CC9F0] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-[var(--font-tele-mono)]">Telemetry Acquired</span>
              </div>
              <h2 className="text-3xl font-[var(--font-tele-serif)] font-bold text-white mb-6 leading-tight">{image.title}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-[10px] text-[#F4F4F9]/40 uppercase tracking-widest mb-1">Date Logged</p>
                  <p className="text-sm font-[var(--font-tele-mono)] text-[#4CC9F0]">{new Date(image.date_created).toLocaleDateString()}</p>
                </div>
                {image.center && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-[10px] text-[#F4F4F9]/40 uppercase tracking-widest mb-1">Facility</p>
                    <p className="text-sm font-[var(--font-tele-mono)] text-[#4CC9F0]">{image.center}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-10 pt-6 flex-1">
              <div className="prose prose-sm prose-invert text-[#F4F4F9]/70 max-w-none mb-10 font-light leading-relaxed">
                <p>{image.description}</p>
              </div>

              {image.keywords?.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-[10px] font-bold text-[#F4F4F9]/40 uppercase tracking-widest mb-3">Classification Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {image.keywords.map((kw: string) => (
                      <span key={kw} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-xs text-[#F4F4F9]/60 hover:text-white transition-colors cursor-default">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Observation Notes */}
              <div className="mt-8 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                  <div className="flex items-center gap-2 text-[#C5A059]">
                    <FileText className="w-4 h-4" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest">Captain's Log</h3>
                  </div>
                  <span className="text-[10px] font-[var(--font-tele-mono)] text-[#F4F4F9]/40">
                    {localNote !== record?.notes ? 'SYNCING...' : 'SECURED'}
                  </span>
                </div>
                <textarea
                  value={localNote}
                  onChange={(e) => setLocalNote(e.target.value)}
                  placeholder="Record orbital mechanics, anomalous readings, or personal observations..."
                  className="w-full h-40 bg-transparent p-5 text-sm text-[#F4F4F9] placeholder:text-[#F4F4F9]/20 focus:outline-none resize-none font-[var(--font-tele-sans)]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
