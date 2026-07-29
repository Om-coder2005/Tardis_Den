import React, { useState, useEffect, useMemo, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useJournalStore } from '../store/useJournalStore';
import { useJournalEntry, useUpdateJournalEntry, uploadMedia } from '../services/journal.service';
import { Clock, Star } from 'lucide-react';

export const JournalEditor: React.FC = () => {
  const { selectedEntryId, setSelectedEntryId } = useJournalStore();
  const { data: entry } = useJournalEntry(selectedEntryId);
  const { mutate: updateEntry } = useUpdateJournalEntry();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string | undefined>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.id]);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = useMemo(
    () => (id: string, updates: any) => {
      setIsSaving(true);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        updateEntry({ id, data: updates }, {
          onSuccess: () => setIsSaving(false)
        });
      }, 1500);
    },
    [updateEntry]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (selectedEntryId) debouncedSave(selectedEntryId, { title: newTitle });
  };

  const handleContentChange = (val?: string) => {
    setContent(val);
    if (selectedEntryId) debouncedSave(selectedEntryId, { content: val || '' });
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!selectedEntryId) return;

    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) return;

    const image = files.find(file => file.type.startsWith('image/'));
    if (!image) return;

    try {
      const uploadPlaceholder = `\n![Uploading ${image.name}...]()\n`;
      setContent(prev => (prev || '') + uploadPlaceholder);
      const url = await uploadMedia(image);
      const imageMarkdown = `\n![${image.name}](${url})\n`;
      const newContent = (content || '').replace(uploadPlaceholder, '') + imageMarkdown;
      
      setContent(newContent);
      debouncedSave(selectedEntryId, { content: newContent });
    } catch (error) {
      console.error('Failed to upload image:', error);
      setContent(prev => (prev || '').replace(`\n![Uploading ${image.name}...]()\n`, ''));
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  if (!selectedEntryId || !entry) return null;

  return (
    <div className="flex-1 flex bg-[#FBE4D8] relative h-full overflow-hidden text-[#190019]">
      
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 pointer-events-none mix-blend-multiply" />

      {/* Main Editor Surface */}
      <div 
        className="flex-1 flex flex-col h-full overflow-hidden relative z-10"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between px-10 py-6 shrink-0">
          <button 
            onClick={() => setSelectedEntryId(null)}
            className="text-[#854F6C] hover:text-[#522B5B] flex items-center gap-2 font-[var(--font-journal-mono)] text-xs uppercase tracking-widest transition-colors"
          >
            <span>Close Notebook</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs font-[var(--font-journal-mono)] text-[#854F6C]/70">
            <Clock className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Inking...' : 'Ink Dry'}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-10 md:px-16 lg:px-24 py-8 custom-scrollbar">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Title of Observation"
            className="w-full text-5xl font-[var(--font-journal-display)] font-bold bg-transparent text-[#190019] placeholder-[#190019]/20 outline-none mb-10 border-b-2 border-[#DFB6B2]/30 pb-4"
          />
          
          {/* We force light mode on MDEditor here to simulate paper, overriding styles in index.css */}
          <div data-color-mode="light" className="w-full journal-editor-container">
            <MDEditor
              value={content}
              onChange={handleContentChange}
              preview="edit"
              hideToolbar={false}
              visiableDragbar={false}
              className="w-full !bg-transparent !border-none !shadow-none font-[var(--font-journal-body)]"
              style={{ minHeight: '600px', backgroundColor: 'transparent' }}
            />
          </div>
        </div>
      </div>

      {/* Context Panel (Right Side) */}
      <div className="w-80 border-l-2 border-[#DFB6B2]/30 bg-[#FBE4D8]/50 backdrop-blur-sm shrink-0 flex flex-col h-full relative z-10">
        
        <div className="p-8 pb-6 border-b-2 border-[#DFB6B2]/30">
          <h3 className="text-xs font-bold text-[#854F6C] uppercase tracking-[0.2em] font-[var(--font-journal-mono)] mb-6">Metadata</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-[#522B5B]/60 uppercase tracking-widest mb-1">Date Logged</p>
              <p className="font-[var(--font-journal-mono)] text-sm text-[#190019]">{new Date(entry.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#522B5B]/60 uppercase tracking-widest mb-1">Last Modified</p>
              <p className="font-[var(--font-journal-mono)] text-sm text-[#190019]">{new Date(entry.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#522B5B]/60 uppercase tracking-widest mb-1">Word Count</p>
              <p className="font-[var(--font-journal-mono)] text-sm text-[#190019]">{content?.split(/\s+/).filter(w => w.length > 0).length || 0} words</p>
            </div>
          </div>
        </div>

        <div className="p-8 pt-6 flex-1 overflow-y-auto">
          <button 
            onClick={() => updateEntry({ id: selectedEntryId, data: { isFavorite: !entry.isFavorite } })}
            className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
              entry.isFavorite 
                ? 'bg-[#190019] text-[#DFB6B2] shadow-lg shadow-[#190019]/20' 
                : 'bg-[#DFB6B2]/30 text-[#854F6C] hover:bg-[#DFB6B2]/50'
            }`}
          >
            <Star className={`w-4 h-4 ${entry.isFavorite ? 'fill-current' : ''}`} />
            <span className="font-bold text-sm">
              {entry.isFavorite ? 'Starred Memory' : 'Star Memory'}
            </span>
          </button>

          <div className="mt-8">
            <h3 className="text-xs font-bold text-[#854F6C] uppercase tracking-[0.2em] font-[var(--font-journal-mono)] mb-4">Observation Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-[#DFB6B2]/30 rounded-lg text-xs text-[#522B5B] font-[var(--font-journal-mono)]">#field-notes</span>
              <span className="px-3 py-1.5 bg-[#DFB6B2]/30 rounded-lg text-xs text-[#522B5B] font-[var(--font-journal-mono)]">#telescope</span>
              <button className="px-3 py-1.5 border border-dashed border-[#854F6C]/40 rounded-lg text-xs text-[#854F6C] hover:bg-[#DFB6B2]/30 transition-colors">
                + Add Tag
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
