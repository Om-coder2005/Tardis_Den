import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, Palette, PenTool, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useRoomStore } from '../../../store';
import { useCreateJournalEntry, useDeleteJournalEntry, useJournalEntries, useUpdateJournalEntry } from '../services/journal.service';
import { useJournalStore } from '../store/useJournalStore';

const COLORS = ['#FBE4D8', '#DFB6B2', '#854F6C', '#522B5B'];

export const PinnedNotesLayer: React.FC = () => {
  const { focusedObjectId } = useRoomStore();
  const { setSelectedEntryId } = useJournalStore();
  
  const { data: pinnedNotes = [] } = useJournalEntries({ type: 'pinned' });
  const { mutate: createEntry } = useCreateJournalEntry();
  const { mutate: updateEntry } = useUpdateJournalEntry();
  const { mutate: deleteEntry } = useDeleteJournalEntry();

  const [isCreating, setIsCreating] = useState(false);
  const [newContent, setNewContent] = useState('');
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

  const handleSaveNew = () => {
    if (newContent.trim()) {
      createEntry({
        title: 'Quick Note',
        content: newContent.trim(),
        type: 'pinned',
        linkedModule: focusedObjectId || undefined,
        isDraft: false,
        x: window.innerWidth - 350,
        y: window.innerHeight - 350,
        color: COLORS[0]
      });
    }
    setIsCreating(false);
    setNewContent('');
  };

  const handleDragEnd = (noteId: string, info: any) => {
    const note = pinnedNotes.find(n => n.id === noteId);
    if (!note) return;
    const newX = (note.x || 0) + info.offset.x;
    const newY = (note.y || 0) + info.offset.y;
    updateEntry({ id: noteId, data: { x: newX, y: newY } });
  };

  const handleContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    setContextMenu({ noteId, x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        <AnimatePresence>
          {pinnedNotes.map((note) => (
            <motion.div
              key={note.id}
              drag
              dragMomentum={false}
              onDragEnd={(_event, info) => handleDragEnd(note.id, info)}
              onContextMenu={(e) => handleContextMenu(e, note.id)}
              initial={{ x: note.x || 100, y: note.y || 100, opacity: 0, scale: 0.8 }}
              animate={{ x: note.x || 100, y: note.y || 100, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute pointer-events-auto w-64 rounded-lg shadow-2xl overflow-hidden cursor-move hover:shadow-xl hover:-translate-y-1 transition-shadow duration-300 border"
              style={{ 
                backgroundColor: note.color || COLORS[0],
                borderColor: note.color === COLORS[3] ? '#854F6C' : '#DFB6B2'
              }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none mix-blend-multiply" />
              
              <div className="relative z-10 p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest font-[var(--font-journal-mono)] ${note.color === COLORS[3] || note.color === COLORS[2] ? 'text-[#FBE4D8]/80' : 'text-[#854F6C]'}`}>
                    {note.linkedModule ? `Ref: ${note.linkedModule}` : 'Quick Note'}
                  </span>
                </div>
                <h3 className={`font-[var(--font-journal-heading)] font-bold text-lg mb-1 leading-tight line-clamp-1 ${note.color === COLORS[3] || note.color === COLORS[2] ? 'text-white' : 'text-[#190019]'}`}>
                  {note.title}
                </h3>
                <p className={`font-[var(--font-journal-handwriting)] text-base leading-snug line-clamp-6 ${note.color === COLORS[3] || note.color === COLORS[2] ? 'text-[#FBE4D8]' : 'text-[#522B5B]'}`}>
                  {note.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[150] w-48 bg-[#190019]/90 backdrop-blur-md rounded-lg shadow-2xl border border-[#854F6C] p-2 flex flex-col font-[var(--font-journal-body)]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                updateEntry({ id: contextMenu.noteId, data: { type: 'journal' } }, {
                  onSuccess: () => {
                    setSelectedEntryId(contextMenu.noteId);
                    setContextMenu(null);
                  }
                });
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[#522B5B] text-[#FBE4D8] rounded transition-colors text-sm"
            >
              <Maximize2 className="w-4 h-4" /> Convert to Entry
            </button>
            <div className="flex gap-2 px-3 py-2 items-center">
              <Palette className="w-4 h-4 text-[#FBE4D8]" />
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    updateEntry({ id: contextMenu.noteId, data: { color } });
                    setContextMenu(null);
                  }}
                  className="w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="h-px w-full bg-[#854F6C]/30 my-1" />
            <button 
              onClick={() => {
                deleteEntry(contextMenu.noteId);
                setContextMenu(null);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-red-900/50 text-red-300 rounded transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" /> Delete Note
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsCreating(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#522B5B] hover:bg-[#854F6C] text-[#FBE4D8] rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-[110]"
        title="Quick Pin Note"
      >
        <PenTool className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-80 bg-[#FBE4D8] rounded-lg shadow-2xl overflow-hidden z-[110] border border-[#DFB6B2]"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none mix-blend-multiply" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center bg-[#DFB6B2]/40 px-3 py-2 border-b border-[#854F6C]/20">
                <span className="text-[10px] font-bold text-[#854F6C] uppercase tracking-widest font-[var(--font-journal-mono)]">
                  Pinned Note {focusedObjectId ? `· ${focusedObjectId}` : ''}
                </span>
                <button onClick={() => setIsCreating(false)} className="text-[#854F6C] hover:text-[#522B5B]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <textarea
                ref={textareaRef}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSaveNew();
                  }
                  if (e.key === 'Escape') setIsCreating(false);
                }}
                placeholder="Jot down a quick thought... (Cmd+Enter to save)"
                className="w-full h-40 bg-transparent resize-none outline-none p-4 text-sm font-[var(--font-journal-handwriting)] text-[#190019] placeholder-[#854F6C]/40 leading-relaxed"
                style={{ fontSize: '1.25rem' }}
              />

              <div className="flex justify-end items-center px-4 py-3 bg-[#FBE4D8]">
                <button 
                  onClick={handleSaveNew}
                  className="bg-[#522B5B] hover:bg-[#854F6C] text-[#FBE4D8] px-4 py-1.5 rounded text-xs font-bold transition-colors"
                >
                  Pin Note
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
