import React, { useRef, useState } from 'react';
import { useGalleryStore } from '../store/useGalleryStore';
import { useAlbums, useCapturePhoto, useCreateAlbum } from '../services/gallery.service';
import { Search, Folder, Plus, Star, Camera, Image as ImageIcon, Upload } from 'lucide-react';

export const GallerySidebar: React.FC = () => {
  const { setViewMode, searchQuery, setSearchQuery, selectedAlbumId, setSelectedAlbumId, showFavoritesOnly, setShowFavoritesOnly } = useGalleryStore();
  const { data: albums = [] } = useAlbums();
  const { mutate: capturePhoto, isPending: isImporting } = useCapturePhoto();
  const { mutate: createAlbum } = useCreateAlbum();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newAlbumName, setNewAlbumName] = useState('');
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAlbumName.trim()) {
      createAlbum(newAlbumName.trim());
      setNewAlbumName('');
      setIsCreatingAlbum(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageBase64 = typeof reader.result === 'string' ? reader.result : '';
      if (imageBase64) {
        capturePhoto({ imageBase64, albumId: selectedAlbumId });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-72 bg-[#f7efe3] border-r border-[#d7c3aa] flex flex-col h-full shrink-0 shadow-[inset_-1px_0_0_rgba(111,86,61,0.16)]">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      
      {/* Header */}
      <div className="p-6 pb-4 border-b border-[#e2d4c1] bg-gradient-to-b from-[#fffaf3] to-[#f4ebdf]">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-[#1f2432] text-[#f4d8a5] flex items-center justify-center shadow-sm">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#9c8468]">Memory Archive</p>
            <h2 className="text-2xl font-serif font-bold text-[#1f2432] tracking-wide">Gallery</h2>
          </div>
        </div>

        <button
          onClick={handleImportClick}
          disabled={isImporting}
          className="w-full py-2.5 bg-[#1f2432] hover:bg-[#2a3040] disabled:opacity-70 text-[#f8ebd9] rounded-xl flex items-center justify-center gap-2 font-medium transition-colors shadow-sm mb-3"
        >
          <Upload className="w-4 h-4" />
          {isImporting ? 'Importing...' : 'Import Memory'}
        </button>

        <button
          onClick={() => setViewMode('photobooth')}
          className="w-full py-2.5 bg-[#efe3d3] hover:bg-[#e5d4be] text-[#5c4631] rounded-xl flex items-center justify-center gap-2 font-medium transition-colors shadow-sm border border-[#dcc8af] mb-6"
        >
          <Camera className="w-4 h-4" />
          Open Photobooth
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-[#a89479] w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search photos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/85 border border-[#dcc8af] rounded-xl py-2.5 pl-9 pr-4 text-sm text-[#5c4631] focus:border-[#a77b4d] focus:ring-1 focus:ring-[#a77b4d] outline-none transition-shadow"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-xs font-bold text-[#a89479] uppercase tracking-[0.32em] mb-3 px-2">Library</h3>
        
        <div className="flex flex-col gap-1 mb-8">
          <button 
            onClick={() => { setSelectedAlbumId(null); setShowFavoritesOnly(false); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${!selectedAlbumId && !showFavoritesOnly ? 'bg-[#ead8c2] text-[#5b4330]' : 'text-[#6c5a49] hover:bg-[#efe5d8]'}`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>All Photos</span>
          </button>
          
          <button 
            onClick={() => { setSelectedAlbumId(null); setShowFavoritesOnly(true); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${showFavoritesOnly ? 'bg-[#f3d7db] text-[#7a3943]' : 'text-[#6c5a49] hover:bg-[#efe5d8]'}`}
          >
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="text-xs font-bold text-[#a89479] uppercase tracking-[0.32em]">Albums</h3>
          <button onClick={() => setIsCreatingAlbum(true)} className="text-[#a89479] hover:text-[#5b4330]">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {isCreatingAlbum && (
          <form onSubmit={handleCreateAlbum} className="mb-3 px-2">
            <input 
              autoFocus
              type="text" 
              placeholder="Album name..."
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              onBlur={() => setIsCreatingAlbum(false)}
              className="w-full bg-white border border-[#d6c2a8] rounded-xl p-2 text-sm text-[#5c4631] outline-none shadow-sm"
            />
          </form>
        )}

        <div className="flex flex-col gap-1">
          {albums.map(album => (
            <button 
              key={album.id}
              onClick={() => { setSelectedAlbumId(album.id); setShowFavoritesOnly(false); }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${selectedAlbumId === album.id ? 'bg-[#ead8c2] text-[#5b4330]' : 'text-[#6c5a49] hover:bg-[#efe5d8]'}`}
            >
              <div className="flex items-center gap-3">
                <Folder className="w-4 h-4" />
                <span className="truncate max-w-[140px]">{album.name}</span>
              </div>
              <span className="text-xs text-[#a89479] group-hover:text-[#7b5b3f]">{album._count?.photos || 0}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
