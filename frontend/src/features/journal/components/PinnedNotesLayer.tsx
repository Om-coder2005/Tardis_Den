import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '../../../store';
import { useJournalStore } from '../store/useJournalStore';
import { useJournalEntries, useCreateJournalEntry, useUpdateJournalEntry, useDeleteJournalEntry } from '../services/journal.service';
import { StickyNote, Trash2, X, Maximize2, Palette } from 'lucide-react';

const PASTEL_COLORS = [
  { name: 'Warm Cream', color: '#FBE4D8', text: '#190019', accent: '#854F6C' },
  { name: 'Mint Green', color: '#C5E1A5', text: '#1B3B1A', accent: '#388E3C' },
  { name: 'Pastel Yellow', color: '#FADFA1', text: '#3E2723', accent: '#F57F17' },
  { name: 'Sky Cyan', color: '#E2F1E7', text: '#0A3A40', accent: '#00838F' },
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
  const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[0].color);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        title: newTitle.trim() || 'Sticky Note',
        content: newContent.trim(),
        type: 'pinned',
        linkedModule: focusedObjectId || undefined,
        isDraft: false,
        x: Math.min(window.innerWidth - 300, Math.max(40, Math.random() * (window.innerWidth - 360))),
        y: Math.min(window.innerHeight - 300, Math.max(80, Math.random() * (window.innerHeight - 360))),
        color: selectedColor
      });
    }
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleDragEnd = (noteId: string, info: any) => {
    const note = pinnedNotes.find(n => n.id === noteId);
    if (!note) return;
    const newX = (note.x || 100) + info.offset.x;
    const newY = (note.y || 100) + info.offset.y;
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
          {pinnedNotes.map((note) => {
            const colorTheme = PASTEL_COLORS.find(c => c.color === note.color) || PASTEL_COLORS[0];
            return (
              <motion.div
                key={note.id}
                drag
                dragMomentum={false}
                onDragEnd={(_event, info) => handleDragEnd(note.id, info)}
                onContextMenu={(e) => handleContextMenu(e, note.id)}
                onDoubleClick={() => {
                  setFocusedObjectId('journal');
                  setSelectedEntryId(note.id);
                }}
                initial={{ x: note.x || 120, y: note.y || 120, opacity: 0, scale: 0.8 }}
                animate={{ x: note.x || 120, y: note.y || 120, opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute pointer-events-auto w-64 rounded-xl shadow-2xl overflow-hidden cursor-move hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-black/10 group"
                style={{ backgroundColor: note.color || PASTEL_COLORS[0].color }}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none mix-blend-multiply rounded-xl" />
                
                <div className="relative z-10 p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-widest font-[var(--font-journal-mono)]"
                      style={{ color: colorTheme.accent }}
                    >
                      {note.linkedModule ? `Ref: ${note.linkedModule}` : 'Sticky Note'}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntry(note.id);
                      }}
                      className="text-black/40 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                      title="Delete Sticky Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 
                    className="font-[var(--font-journal-heading)] font-bold text-lg mb-1 leading-tight line-clamp-1"
                    style={{ color: colorTheme.text }}
                  >
                    {note.title || 'Sticky Note'}
                  </h3>

                  <p 
                    className="font-[var(--font-journal-handwriting)] text-base leading-snug line-clamp-5 opacity-90"
                    style={{ color: colorTheme.text }}
                  >
                    {note.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[150] w-52 bg-[#190019]/90 backdrop-blur-md rounded-xl shadow-2xl border border-[#854F6C] p-2 flex flex-col font-[var(--font-journal-body)]"
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
              className="flex items-center gap-2 px-3 py-2 hover:bg-[#522B5B] text-[#FBE4D8] rounded-lg transition-colors text-xs font-bold"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Convert to Full Entry
            </button>

            <div className="flex gap-2 px-3 py-2 items-center">
              <Palette className="w-3.5 h-3.5 text-[#DFB6B2]" />
              {PASTEL_COLORS.map(c => (
                <button
                  key={c.color}
                  onClick={() => {
                    updateEntry({ id: contextMenu.noteId, data: { color: c.color } });
                    setContextMenu(null);
                  }}
                  className="w-4 h-4 rounded-full border border-black/20 transition-transform hover:scale-125 shadow-sm"
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                />
              ))}
            </div>

            <div className="h-px w-full bg-[#854F6C]/30 my-1" />

            <button 
              onClick={() => {
                deleteEntry(contextMenu.noteId);
                setContextMenu(null);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors text-xs font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Sticky Note
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Add Sticky Note Button in Room */}
      <button
        onClick={() => setIsCreating(true)}
        className="fixed bottom-6 left-6 z-[110] flex items-center gap-2 bg-[#190019]/80 hover:bg-[#522B5B] text-[#DFB6B2] border border-[#854F6C] px-4 py-2.5 rounded-full font-bold transition-all shadow-xl hover:scale-105 backdrop-blur-md text-xs"
        title="Pin a Sticky Note in 3D Space"
      >
        <StickyNote className="w-4 h-4 text-[#DFB6B2]" />
        <span>+ Sticky Note</span>
      </button>

      {/* Room Sticky Creation Popup */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            style={{ backgroundColor: selectedColor }}
            className="fixed bottom-20 left-6 w-80 rounded-2xl shadow-2xl overflow-hidden z-[120] border border-black/10 text-[#190019]"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none mix-blend-multiply" />

            <form onSubmit={handleSaveNew} className="relative z-10 p-5 space-y-3">
              <div className="flex justify-between items-center pb-1">
                <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest font-[var(--font-journal-mono)]">
                  New Sticky Note {focusedObjectId ? `· ${focusedObjectId}` : ''}
                </span>
                <button type="button" onClick={() => setIsCreating(false)} className="text-black/50 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white/70 border border-black/10 rounded-xl p-2.5 text-sm font-bold outline-none shadow-inner"
              />

              <textarea
                ref={textareaRef}
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write a quick thought to float in room..."
                className="w-full bg-white/70 border border-black/10 rounded-xl p-2.5 text-xs font-[var(--font-journal-handwriting)] text-base outline-none shadow-inner resize-none"
              />

              <div className="flex justify-between items-center pt-1">
                <div className="flex gap-1.5">
                  {PASTEL_COLORS.map(c => (
                    <button
                      type="button"
                      key={c.color}
                      onClick={() => setSelectedColor(c.color)}
                      className={`w-5 h-5 rounded-full border border-black/20 transition-all ${selectedColor === c.color ? 'scale-125 border-black shadow' : 'opacity-70'}`}
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                </div>

                <button 
                  type="submit"
                  className="bg-[#190019] hover:bg-[#522B5B] text-[#DFB6B2] px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow"
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
