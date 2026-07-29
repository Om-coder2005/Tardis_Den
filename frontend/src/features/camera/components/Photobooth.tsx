import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useGalleryStore } from '../store/useGalleryStore';
import { useCapturePhoto } from '../services/gallery.service';
import { Camera, Clock, Sparkles, GalleryVertical, CircleDot } from 'lucide-react';

export const Photobooth: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const { setViewMode, selectedAlbumId, setSelectedAlbumId, setShowFavoritesOnly } = useGalleryStore();
  const { mutate: capturePhoto } = useCapturePhoto();
  
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const triggerCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
        
        capturePhoto({ imageBase64: imageSrc, albumId: selectedAlbumId }, {
          onSuccess: () => {
            setSelectedAlbumId(null);
            setShowFavoritesOnly(false);
            setViewMode('gallery');
          }
        });
      }
    }
  }, [capturePhoto, selectedAlbumId, setSelectedAlbumId, setShowFavoritesOnly, setViewMode]);

  const startCountdown = (seconds: number) => {
    if (countdown !== null) return;
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
      <div className="flex-1 relative flex items-center justify-center px-4 pt-20 pb-28">
        <div className="absolute inset-x-4 top-20 bottom-28 rounded-[2rem] border border-white/10 bg-black/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_40px_120px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />
        </div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.82}
          videoConstraints={{ facingMode: "user" }}
          onUserMedia={() => setCameraReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-10 bottom-36 z-10">
          <div className="max-w-md mx-auto rounded-[1.75rem] border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3 text-white/85 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#f4d8a5]" />
                <span className="text-xs uppercase tracking-[0.35em]">Film Preview</span>
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
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full px-6">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-black/45 backdrop-blur-2xl px-5 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => startCountdown(3)}
              className="w-14 h-14 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
              title="3s Timer"
            >
              <Clock className="w-5 h-5" />
            </button>
            
            <button 
              onClick={triggerCapture}
              disabled={!cameraReady}
              className="w-20 h-20 bg-white/15 hover:bg-white/25 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md border-4 border-white rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
            >
              <Camera className="w-8 h-8 drop-shadow-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
