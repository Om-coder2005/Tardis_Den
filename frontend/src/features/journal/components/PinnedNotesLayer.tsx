import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../../store';
import { useJournalStore } from '../store/useJournalStore';
import { useJournalEntries, useCreateJournalEntry, useUpdateJournalEntry, useDeleteJournalEntry } from '../services/journal.service';
import { StickyNote, Trash2, X, Maximize2, Palette, Pin, Edit3, Check } from 'lucide-react';

const STICKY_PALETTES = [
  { name: 'Warm Cream', color: '#FBE4D8', text: '#2A1B28', accent: '#854F6C', pin: '#D9534F' },
  { name: 'Sage Green', color: '#D4E6B5', text: '#1E3320', accent: '#43A047', pin: '#388E3C' },
  { name: 'Cosmic Gold', color: '#FFE5A3', text: '#3E2723', accent: '#F57F17', pin: '#E65100' },
  { name: 'Nebula Purple', color: '#E8D5C4', text: '#2D1B36', accent: '#7B1FA2', pin: '#9C27B0' },
  { name: 'Cyan Dawn', color: '#D0F4DE', text: '#0A3638', accent: '#00897B', pin: '#00ACC1' },
  { name: 'Rose Quartz', color: '#FFD6E0', text: '#4A1525', accent: '#C2185B', pin: '#E91E63' }
];

export const PinnedNotesLayer: React.FC = () => {
  const { focusedObjectId, setFocusedObjectId } = useRoomStore();
  const { setSelectedEntryId } = useJournalStore();
  
  const { data: pinnedNotes = [] } = useJournalEntries({ type: 'pinned' });
  const { mutate: createEntry } = useCreateJournalEntry();
  const { mutate: updateEntry } = useUpdateJournalEntry();
  const { mutate: deleteEntry } = useDeleteJournalEntry();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(STICKY_PALETTES[0].color);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ noteId: string, x: number, y: number } | null>(null);

  useEffect(() => {
    if (isCreating && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleSaveNew = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newContent.trim() || newTitle.trim()) {
      createEntry({
        title: newTitle.trim() || 'Quick Note',
        content: newContent.trim(),
        type: 'pinned',
        linkedModule: focusedObjectId || undefined,
        isDraft: false,
        x: Math.min(window.innerWidth - 320, Math.max(40, Math.random() * (window.innerWidth - 380))),
        y: Math.min(window.innerHeight - 320, Math.max(80, Math.random() * (window.innerHeight - 380))),
        color: selectedColor
      });
    }
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleStartEdit = (note: any) => {
    setEditingId(note.id);
    setEditTitle(note.title || '');
    setEditContent(note.content || '');
  };

  const handleSaveEdit = (noteId: string) => {
    updateEntry({
      id: noteId,
      data: {
        title: editTitle.trim() || 'Untitled Note',
        content: editContent.trim()
      }
    });
    setEditingId(null);
  };

  const handleDragEnd = (noteId: string, info: any) => {
    const note = pinnedNotes.find(n => n.id === noteId);
    if (!note) return;
    const newX = (note.x || 120) + info.offset.x;
    const newY = (note.y || 120) + info.offset.y;
    updateEntry({ id: noteId, data: { x: newX, y: newY } });
  };

  const handleContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    setContextMenu({ noteId, x: e.clientX, y: e.clientY });
  };

  return (
    <>
      {/* Floating Sticky Notes Overlay Container */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        <AnimatePresence>
          {pinnedNotes.map((note, idx) => {
            const palette = STICKY_PALETTES.find(c => c.color === note.color) || STICKY_PALETTES[0];
            const isEditing = editingId === note.id;
            // Slight tilt effect based on index for aesthetic realism
            const rotationDeg = (idx % 2 === 0 ? 1 : -1) * ((idx % 3) + 1.2);

            return (
              <motion.div
                key={note.id}
                drag
                dragMomentum={true}
                dragElastic={0.05}
                dragTransition={{ power: 0.2, timeConstant: 200 }}
                whileDrag={{ scale: 1.05, rotate: 0, zIndex: 120 }}
                onDragEnd={(_event, info) => handleDragEnd(note.id, info)}
                onContextMenu={(e) => handleContextMenu(e, note.id)}
                onDoubleClick={() => {
                  if (!isEditing) handleStartEdit(note);
                }}
                initial={{ x: note.x || 120, y: note.y || 120, opacity: 0, scale: 0.8, rotate: rotationDeg }}
                animate={{ x: note.x || 120, y: note.y || 120, opacity: 1, scale: 1, rotate: rotationDeg }}
                exit={{ opacity: 0, scale: 0.8, rotate: 0 }}
                whileHover={{ rotate: 0, scale: 1.02, zIndex: 110 }}
                className="absolute pointer-events-auto w-64 rounded-2xl cursor-grab active:cursor-grabbing shadow-[0_15px_35px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.35)] border border-black/10 group overflow-visible select-noneWillChange"
                style={{ 
                  backgroundColor: note.color || STICKY_PALETTES[0].color,
                  willChange: 'transform'
                }}
              >
                {/* Visual Decorative Push-Pin Icon at Top Center */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 drop-shadow-md">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-400 to-red-700 border-2 border-white/80 flex items-center justify-center shadow-lg">
                    <Pin className="w-3.5 h-3.5 text-white transform -rotate-45" />
                  </div>
                </div>

                {/* Subtle Paper Texture & Top Light Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none rounded-2xl" />
                
                <div className="relative z-10 p-5 pt-6">
                  <div className="flex justify-between items-start mb-1.5">
                    <span 
                      className="text-[9px] font-extrabold uppercase tracking-widest font-[var(--font-journal-mono)] opacity-80"
                      style={{ color: palette.accent }}
                    >
                      {note.linkedModule ? `📍 ${note.linkedModule}` : 'Sticky Note'}
                    </span>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(note);
                            }}
                            className="p-1 rounded-md text-black/50 hover:text-black hover:bg-black/10 transition-colors"
                            title="Edit Note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEntry(note.id);
                            }}
                            className="p-1 rounded-md text-black/50 hover:text-red-700 hover:bg-black/10 transition-colors"
                            title="Delete Sticky Note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveEdit(note.id);
                          }}
                          className="p-1 rounded-md text-emerald-800 bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors font-bold text-xs"
                          title="Save Changes"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 mt-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-white/80 border border-black/20 rounded-lg p-1.5 text-sm font-bold outline-none"
                        autoFocus
                      />
                      <textarea
                        rows={3}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-white/80 border border-black/20 rounded-lg p-1.5 text-xs font-[var(--font-journal-handwriting)] text-base outline-none resize-none"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 
                        className="font-[var(--font-journal-heading)] font-extrabold text-base mb-1 leading-snug line-clamp-1"
                        style={{ color: palette.text }}
                      >
                        {note.title || 'Untitled Note'}
                      </h3>

                      <p 
                        className="font-[var(--font-journal-handwriting)] text-base leading-snug line-clamp-5 opacity-90 whitespace-pre-wrap select-text"
                        style={{ color: palette.text }}
                      >
                        {note.content || 'Click double to write...'}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Sleek Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[150] w-56 bg-[#0c0d14]/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-[#f3d26a]/30 p-2 flex flex-col font-mono text-xs"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                updateEntry({ id: contextMenu.noteId, data: { type: 'journal' } }, {
                  onSuccess: () => {
                    setFocusedObjectId('journal');
                    setSelectedEntryId(contextMenu.noteId);
                    setContextMenu(null);
                  }
                });
              }}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#f3d26a]/20 text-[#f6e8b2] rounded-xl transition-all font-bold"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#f3d26a]" /> Convert to Full Entry
            </button>

            <div className="flex gap-2 px-3 py-2.5 items-center justify-between">
              <span className="text-[10px] text-[#f6e8b2]/60 uppercase tracking-wider flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-[#f3d26a]" /> Color
              </span>
              <div className="flex gap-1">
                {STICKY_PALETTES.map(c => (
                  <button
                    key={c.color}
                    onClick={() => {
                      updateEntry({ id: contextMenu.noteId, data: { color: c.color } });
                      setContextMenu(null);
                    }}
                    className="w-4 h-4 rounded-full border border-black/40 transition-transform hover:scale-130 shadow-sm"
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-[#f3d26a]/15 my-1" />

            <button 
              onClick={() => {
                deleteEntry(contextMenu.noteId);
                setContextMenu(null);
              }}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-red-950/60 text-red-400 rounded-xl transition-all font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Note
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Add Sticky Note Button in Room */}
      <button
        onClick={() => setIsCreating(true)}
        className="fixed bottom-6 left-6 z-[110] flex items-center gap-2.5 bg-[#06070b]/90 hover:bg-[#121420] text-[#f3d26a] border border-[#f3d26a]/40 px-4 py-2.5 rounded-2xl font-mono font-extrabold transition-all shadow-[0_10px_30px_rgba(243,210,106,0.15)] hover:shadow-[0_15px_40px_rgba(243,210,106,0.25)] hover:scale-105 backdrop-blur-md text-xs tracking-wider uppercase"
        title="Pin a Sticky Note in 3D Space"
      >
        <StickyNote className="w-4 h-4 text-[#f3d26a] animate-pulse" />
        <span>+ Sticky Note</span>
      </button>

      {/* Room Sticky Creation Popup */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            style={{ backgroundColor: selectedColor }}
            className="fixed bottom-20 left-6 w-80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[120] border border-black/15 text-[#190019]"
          >
            {/* Top Pin Decoration */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
              <div className="w-5 h-5 rounded-full bg-red-600 border border-white/80 shadow flex items-center justify-center">
                <Pin className="w-2.5 h-2.5 text-white transform -rotate-45" />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none" />

            <form onSubmit={handleSaveNew} className="relative z-10 p-5 pt-7 space-y-3">
              <div className="flex justify-between items-center pb-0.5">
                <span className="text-[10px] font-extrabold text-black/60 uppercase tracking-widest font-[var(--font-journal-mono)]">
                  New Sticky Note {focusedObjectId ? `· ${focusedObjectId}` : ''}
                </span>
                <button type="button" onClick={() => setIsCreating(false)} className="text-black/50 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Note Title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white/75 border border-black/15 rounded-xl p-2.5 text-sm font-extrabold outline-none shadow-inner text-black"
              />

              <textarea
                ref={textareaRef}
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write a quick thought..."
                className="w-full bg-white/75 border border-black/15 rounded-xl p-2.5 text-xs font-[var(--font-journal-handwriting)] text-base outline-none shadow-inner resize-none text-black"
              />

              <div className="flex justify-between items-center pt-1">
                <div className="flex gap-1.5">
                  {STICKY_PALETTES.map(c => (
                    <button
                      type="button"
                      key={c.color}
                      onClick={() => setSelectedColor(c.color)}
                      className={`w-5 h-5 rounded-full border border-black/30 transition-all ${selectedColor === c.color ? 'scale-125 border-black shadow-md' : 'opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>

                <button 
                  type="submit"
                  className="bg-[#0c0d14] hover:bg-[#181a28] text-[#f3d26a] px-4 py-2 rounded-xl text-xs font-mono font-extrabold transition-all shadow-md uppercase tracking-wider"
                >
                  Pin Note
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

