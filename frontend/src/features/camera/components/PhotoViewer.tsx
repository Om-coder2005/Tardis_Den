import React, { useState, useEffect } from 'react';
import { useGalleryStore } from '../store/useGalleryStore';
import { useAlbums, useCreateAlbum, usePhotos, useUpdatePhoto, useDeletePhoto, resolvePhotoUrl } from '../services/gallery.service';
import { ArrowLeft, Star, Trash2, Edit2, Folder, ExternalLink, ImageOff, Plus } from 'lucide-react';

export const PhotoViewer: React.FC = () => {
  const { selectedPhotoId, setSelectedPhotoId, searchQuery, selectedAlbumId, showFavoritesOnly } = useGalleryStore();
  
  // We fetch all photos to allow prev/next navigation, or just find the current one
  const { data: photos = [] } = usePhotos({ albumId: selectedAlbumId, search: searchQuery, isFavorite: showFavoritesOnly ? true : undefined });
  const { data: albums = [] } = useAlbums();
  const { mutateAsync: createAlbum } = useCreateAlbum();
  const { mutate: updatePhoto } = useUpdatePhoto();
  const { mutate: deletePhoto } = useDeletePhoto();

  const photo = photos.find(p => p.id === selectedPhotoId);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const [archiveNote, setArchiveNote] = useState('');
  const [imageBroken, setImageBroken] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    if (photo) {
      setTitle(photo.title || '');
      setArchiveNote(photo.archiveNote || '');
      setImageBroken(false);
    }
  }, [photo]);

  if (!photo) return null;

  const handleSaveTitle = () => {
    updatePhoto({ id: photo.id, data: { title } });
    setIsEditingTitle(false);
  };

  const handleSaveArchiveNote = () => {
    updatePhoto({ id: photo.id, data: { archiveNote } });
  };

  const handleToggleFavorite = () => {
    updatePhoto({ id: photo.id, data: { isFavorite: !photo.isFavorite } });
  };

  const handleDelete = () => {
    if (confirm('Delete this memory permanently?')) {
      deletePhoto(photo.id);
      setSelectedPhotoId(null);
    }
  };

  const handleAlbumChange = (albumId: string) => {
    updatePhoto({ id: photo.id, data: { albumId: albumId || null } });
  };

  const handleCreateGroup = async () => {
    const trimmedName = newGroupName.trim();
    if (!trimmedName) return;

    const album = await createAlbum(trimmedName);
    updatePhoto({ id: photo.id, data: { albumId: album.id } });
    setNewGroupName('');
    setIsCreatingGroup(false);
  };

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top,#3a2431_0%,#1a1420_42%,#0c0b12_100%)] flex flex-col relative h-full">
      {/* Topbar */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#160f17]/55 backdrop-blur-md absolute top-0 left-0 right-0 z-20">
        <button 
          onClick={() => setSelectedPhotoId(null)}
          className="flex items-center gap-2 text-[#dbc8b1] hover:text-[#fff3df] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Gallery</span>
        </button>
        
        <div className="flex items-center gap-4">
          <button onClick={handleToggleFavorite} className={`p-2 rounded-full hover:bg-white/10 transition-colors ${photo.isFavorite ? 'text-[#f3c56a]' : 'text-[#dbc8b1]'}`}>
            <Star className={`w-5 h-5 ${photo.isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button onClick={handleDelete} className="p-2 rounded-full text-[#dbc8b1] hover:text-[#f08b92] hover:bg-white/10 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 flex items-center justify-center p-5 bg-black/35 pt-24 overflow-y-auto">
        <div className="bg-[#f8f1e7] p-5 pb-5 max-w-[50rem] w-full shadow-[0_30px_90px_rgba(10,7,14,0.4)] relative rounded-[2rem] border border-[#d7c2a8]">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_17rem] gap-5">
            <div>
              <div className="w-full aspect-[3/4] max-h-[26rem] bg-[#efe6d8] overflow-hidden mb-4 border border-[#ddccb7] rounded-[1.4rem] relative">
                {!imageBroken ? (
                  <img
                    src={resolvePhotoUrl(photo.url)}
                    alt={photo.title || 'Memory'}
                    className="w-full h-full object-contain"
                    onError={() => setImageBroken(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8f775e] bg-[#f6efe6]">
                    <ImageOff className="w-10 h-10 mb-3" />
                    <p className="text-sm uppercase tracking-[0.3em]">Image unavailable</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center">
                {isEditingTitle ? (
                  <div className="flex items-center gap-3 w-full max-w-md">
                    <input 
                      autoFocus
                      type="text" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
                      className="flex-1 font-handwriting text-3xl text-center border-b border-[#c8b39a] outline-none text-[#4a3425] bg-transparent px-2"
                    />
                    <button onClick={handleSaveTitle} className="text-xs font-bold uppercase tracking-widest text-[#895d35]">Save</button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-3 cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                    <h3 className="font-handwriting text-3xl text-[#4a3425] text-center">{photo.title || 'Add a title...'}</h3>
                    <Edit2 className="w-4 h-4 text-[#bca78d] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>
            </div>

            <aside className="bg-[#f4eadc] border border-[#ddccb7] rounded-[1.4rem] p-3 flex flex-col gap-3 shadow-inner self-start">
              <div className="flex items-center gap-2 text-[#7f6449] uppercase tracking-[0.28em] text-[11px] font-bold">
                <Folder className="w-4 h-4" />
                Group
              </div>

              <select
                value={photo.albumId || ''}
                onChange={(event) => handleAlbumChange(event.target.value)}
                className="w-full bg-white border border-[#d7c2a8] rounded-xl px-3 py-2 text-sm text-[#5c4631] outline-none"
              >
                <option value="">Unsorted</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.name}
                  </option>
                ))}
              </select>

              <div className="rounded-2xl border border-[#ddccb7] bg-[#fffaf2] p-3">
                <p className="text-sm text-[#5c4631] leading-6">
                  {photo.album?.name ? `Filed under ${photo.album.name}.` : 'This memory is currently unsorted.'}
                </p>
              </div>

              <div className="rounded-2xl border border-[#ddccb7] bg-[#fffaf2] p-3">
                {isCreatingGroup ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={newGroupName}
                      onChange={(event) => setNewGroupName(event.target.value)}
                      onKeyDown={(event) => event.key === 'Enter' && handleCreateGroup()}
                      placeholder="New group name"
                      className="flex-1 rounded-xl border border-[#d7c2a8] bg-white px-3 py-2 text-sm text-[#5c4631] outline-none"
                    />
                    <button
                      onClick={handleCreateGroup}
                      className="rounded-xl bg-[#1f2432] px-3 py-2 text-sm text-[#f8ebd9] hover:bg-[#2a3040] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreatingGroup(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8b39a] px-3 py-2 text-sm text-[#7f6449] hover:bg-[#f6efe6] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New group
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-[#ddccb7] bg-[#fffaf2] p-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#9c8468] mb-2">Archive Note</p>
                <textarea
                  value={archiveNote}
                  onChange={(event) => setArchiveNote(event.target.value)}
                  onBlur={handleSaveArchiveNote}
                  placeholder="Write a note for this memory..."
                  className="w-full min-h-[6rem] resize-none rounded-xl border border-[#d7c2a8] bg-white px-3 py-2 text-sm leading-6 text-[#5c4631] outline-none"
                />
              </div>

              <div className="rounded-2xl border border-[#ddccb7] bg-[#fffaf2] p-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#9c8468] mb-1">Captured</p>
                  <p className="text-sm text-[#5c4631]">{new Date(photo.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#8d4a55] hover:text-[#b53f53]"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              <button
                onClick={handleToggleFavorite}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border transition-colors ${photo.isFavorite ? 'bg-[#f3d7db] text-[#7a3943] border-[#e2b7bf]' : 'bg-white text-[#5c4631] border-[#d7c2a8] hover:bg-[#f8f1e7]'}`}
              >
                <Star className={`w-4 h-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
                {photo.isFavorite ? 'Favorited' : 'Mark Favorite'}
              </button>

              <a
                href={resolvePhotoUrl(photo.url)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-[#1f2432] text-[#f8ebd9] hover:bg-[#2a3040] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open image
              </a>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
