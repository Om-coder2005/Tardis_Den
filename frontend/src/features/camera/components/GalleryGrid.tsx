import React, { useState } from 'react';
import { useGalleryStore } from '../store/useGalleryStore';
import { resolvePhotoUrl, usePhotos } from '../services/gallery.service';
import { CameraOff, ImageOff, Star } from 'lucide-react';
import { PhotoViewer } from './PhotoViewer';

export const GalleryGrid: React.FC = () => {
  const { searchQuery, selectedAlbumId, showFavoritesOnly, selectedPhotoId, setSelectedPhotoId } = useGalleryStore();
  const { data: photos = [], isLoading } = usePhotos({ albumId: selectedAlbumId, search: searchQuery, isFavorite: showFavoritesOnly ? true : undefined });
  const [brokenPhotoIds, setBrokenPhotoIds] = useState<Record<string, boolean>>({});

  if (selectedPhotoId) {
    return <PhotoViewer />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 relative shadow-inner bg-[radial-gradient(circle_at_top,#5b3a5f_0%,#24131f_42%,#0f1117_100%)]">
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(243,232,215,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(243,232,215,0.07)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {isLoading ? (
        <div className="relative z-10 flex items-center justify-center h-full text-[#e6d8c5] font-medium">Loading memories...</div>
      ) : photos.length === 0 ? (
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-[#e6d8c5]">
          <div className="w-16 h-16 rounded-2xl border border-[#caa96c]/40 bg-[#f2e6d6]/10 flex items-center justify-center mb-4">
            <CameraOff className="w-8 h-8 text-[#f4d8a5]" />
          </div>
          <p className="font-serif text-2xl mb-2 text-[#f7efde]">No memories in this archive yet.</p>
          <p className="text-sm text-[#d9c4ad]">Import one from your device or capture it in the Photobooth.</p>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center">
          {photos.map((photo, index) => {
            const rotation = (index % 5) * 1.6 - 3.2;
            
            return (
              <div 
                key={photo.id}
                onClick={() => setSelectedPhotoId(photo.id)}
                className="w-[13.75rem] cursor-pointer relative transition-transform duration-200 hover:-translate-y-1"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="absolute inset-0 translate-x-2 translate-y-3 rounded-[2rem] bg-black/25 blur-xl" />
                <div className="relative bg-[#f9f2e8] p-3 pb-12 rounded-[1.75rem] shadow-[0_24px_60px_rgba(12,8,18,0.35)] border border-[#d9c6ad]">
                  {photo.isFavorite && (
                    <Star className="absolute top-4 right-4 w-5 h-5 text-[#9d4f66] fill-current drop-shadow-sm z-10" />
                  )}
                  <div className="w-full aspect-[4/5] bg-[#efe6d8] overflow-hidden rounded-[1.2rem] border border-[#e4d4be] relative">
                    {!brokenPhotoIds[photo.id] ? (
                      <img
                        src={resolvePhotoUrl(photo.url)}
                        alt={photo.title || 'Memory'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={() => setBrokenPhotoIds((current) => ({ ...current, [photo.id]: true }))}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8f775e] bg-[#f6efe6]">
                        <ImageOff className="w-8 h-8 mb-2" />
                        <span className="text-xs uppercase tracking-[0.3em]">Image unavailable</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 px-2">
                    <p className="text-center font-handwriting text-2xl text-[#443126] truncate">{photo.title || 'Untitled Memory'}</p>
                    <p className="text-center text-[10px] uppercase tracking-[0.35em] text-[#a89479] mt-2">
                      {new Date(photo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
