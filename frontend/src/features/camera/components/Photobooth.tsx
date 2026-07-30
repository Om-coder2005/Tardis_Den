import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { useGalleryStore } from '../store/useGalleryStore';
import { useCapturePhoto } from '../services/gallery.service';
import { Camera, Clock, Sparkles, GalleryVertical, CircleDot, Sliders } from 'lucide-react';

export type CameraFilter = 'normal' | 'vintage' | 'cyberpunk' | 'noir' | 'cosmic';

const FILTERS: { id: CameraFilter; name: string; css: string }[] = [
  { id: 'normal', name: 'Raw', css: 'none' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(0.55) contrast(1.15) saturate(1.2) hue-rotate(-10deg)' },
  { id: 'cyberpunk', name: 'Cyberpunk', css: 'contrast(1.3) hue-rotate(180deg) saturate(1.8) brightness(1.05)' },
  { id: 'noir', name: 'Noir', css: 'grayscale(1) contrast(1.45) brightness(0.95)' },
  { id: 'cosmic', name: 'Cosmic', css: 'saturate(2.0) contrast(1.2) hue-rotate(90deg) brightness(1.1)' },
];

export const Photobooth: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const { setViewMode, selectedAlbumId, setSelectedAlbumId, setShowFavoritesOnly } = useGalleryStore();
  const { mutate: capturePhoto } = useCapturePhoto();
  
  const [activeFilter, setActiveFilter] = useState<CameraFilter>('normal');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [developingPhoto, setDevelopingPhoto] = useState<string | null>(null);
  const [devProgress, setDevProgress] = useState(0);

  const applyFilterToCanvas = (rawImageSrc: string, filterCss: string): Promise<string> => {
    return new Promise((resolve) => {
      if (filterCss === 'none') return resolve(rawImageSrc);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(rawImageSrc);

        ctx.filter = filterCss;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = rawImageSrc;
    });
  };

  const triggerCapture = useCallback(async () => {
    if (webcamRef.current) {
      const rawImageSrc = webcamRef.current.getScreenshot();
      if (rawImageSrc) {
        setFlash(true);
        setTimeout(() => setFlash(false), 200);

        const currentFilterCss = FILTERS.find(f => f.id === activeFilter)?.css || 'none';
        const filteredImageSrc = await applyFilterToCanvas(rawImageSrc, currentFilterCss);

        // Start developing animation
        setDevelopingPhoto(filteredImageSrc);
        setDevProgress(0);

        const startTime = Date.now();
        const duration = 2200; // 2.2s chemical development

        const devInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1, elapsed / duration);
          setDevProgress(progress);

          if (progress >= 1) {
            clearInterval(devInterval);
            capturePhoto({ imageBase64: filteredImageSrc, albumId: selectedAlbumId }, {
              onSuccess: () => {
                setSelectedAlbumId(null);
                setShowFavoritesOnly(false);
                setDevelopingPhoto(null);
                setViewMode('gallery');
              }
            });
          }
        }, 50);
      }
    }
  }, [webcamRef, activeFilter, capturePhoto, selectedAlbumId, setSelectedAlbumId, setShowFavoritesOnly, setViewMode]);

  const startCountdown = (seconds: number) => {
    if (countdown !== null || developingPhoto) return;
    let time = seconds;
    setCountdown(time);
    
    const interval = setInterval(() => {
      time -= 1;
      setCountdown(time);
      if (time === 0) {
        clearInterval(interval);
        triggerCapture();
        setTimeout(() => setCountdown(null), 1000);
      }
    }, 1000);
  };

  const activeCss = FILTERS.find(f => f.id === activeFilter)?.css || 'none';

  return (
    <div className="flex-1 flex flex-col bg-[#120c12] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#5d3550_0%,#1a1118_44%,#09070b_100%)]" />
      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(245,232,215,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(245,232,215,0.08)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-5 z-20 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-none">
          <p className="text-[#d9b892] text-[11px] uppercase tracking-[0.45em] mb-2">Memory Darkroom</p>
          <h2 className="text-white/90 font-serif text-2xl uppercase tracking-[0.28em] drop-shadow-md">TARDIS Photobooth</h2>
        </div>
        <button 
          onClick={() => setViewMode('gallery')}
          className="pointer-events-auto px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium transition-colors flex items-center gap-2 border border-white/10"
        >
          <GalleryVertical className="w-4 h-4" />
          View Gallery
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center px-4 pt-20 pb-36">
        <div className="absolute inset-x-4 top-20 bottom-36 rounded-[2rem] border border-white/10 bg-black/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_40px_120px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />
        </div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.85}
          videoConstraints={{ facingMode: "user" }}
          onUserMedia={() => setCameraReady(true)}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
          style={{ filter: activeCss }}
        />

        <div className="absolute inset-x-10 bottom-40 z-10">
          <div className="max-w-md mx-auto rounded-[1.75rem] border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3 text-white/85 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#f4d8a5]" />
                <span className="text-xs uppercase tracking-[0.35em]">{activeFilter} Filter</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <CircleDot className={`w-3 h-3 ${cameraReady ? 'text-emerald-400' : 'text-amber-300'}`} />
                {cameraReady ? 'Camera ready' : 'Warming up'}
              </div>
            </div>
          </div>
        </div>

        {/* Countdown Overlay */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-9xl font-bold text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        {/* Flash Effect */}
        {flash && (
          <div className="absolute inset-0 bg-white z-50 animate-ping opacity-75" />
        )}

        {/* Polaroid Development Animation Overlay */}
        <AnimatePresence>
          {developingPhoto && (
            <motion.div 
              initial={{ opacity: 0, y: 120, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 180 }}
              className="absolute z-50 bg-[#f9f2e8] p-4 pb-14 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.9)] border-2 border-[#d9c6ad] w-72 flex flex-col items-center pointer-events-none"
            >
              <div className="relative w-full aspect-[4/5] bg-[#efe6d8] overflow-hidden rounded-[1.2rem] border border-[#e4d4be]">
                <img 
                  src={developingPhoto} 
                  alt="Developing memory"
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{
                    filter: `brightness(${0.1 + devProgress * 0.9}) contrast(${0.5 + devProgress * 0.5}) sepia(${Math.max(0, 0.6 - devProgress * 0.6)})`
                  }}
                />
                {/* Chemical fog curtain */}
                <div 
                  className="absolute inset-0 bg-[#f4eadc] transition-opacity duration-100"
                  style={{ opacity: Math.max(0, 1 - devProgress * 1.2) }}
                />
              </div>
              <p className="text-center font-handwriting text-2xl text-[#443126] mt-4 animate-pulse">
                Developing Memory... {Math.round(devProgress * 100)}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full px-6 max-w-3xl">
        <div className="mx-auto rounded-[2rem] border border-white/10 bg-black/45 backdrop-blur-2xl px-6 py-3.5 shadow-[0_20px_80px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar max-w-full">
            <Sliders className="w-4 h-4 text-[#f4d8a5] mr-1 shrink-0" />
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  activeFilter === f.id
                    ? 'bg-[#f4d8a5] text-[#190019] shadow-[0_2px_10px_rgba(244,216,165,0.4)] font-bold'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => startCountdown(3)}
              disabled={!!developingPhoto}
              className="w-11 h-11 bg-white/5 hover:bg-white/10 disabled:opacity-40 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
              title="3s Timer"
            >
              <Clock className="w-4 h-4" />
            </button>
            
            <button 
              onClick={triggerCapture}
              disabled={!cameraReady || !!developingPhoto}
              className="w-14 h-14 bg-white/15 hover:bg-white/25 disabled:opacity-40 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center text-white transition-all hover:scale-105 shadow-lg"
              title="Take Photo"
            >
              <Camera className="w-6 h-6 drop-shadow-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
