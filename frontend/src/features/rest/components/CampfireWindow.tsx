import { Check, ChevronLeft, ChevronRight, Copy, Flame, Maximize2, Minus, PenTool, Shuffle, X } from 'lucide-react';
import React, { useState } from 'react';
import { useRoomStore } from '../../../store';
import { useCreateJournalEntry } from '../../journal/services/journal.service';
import { useJournalStore } from '../../journal/store/useJournalStore';
import { CAMPFIRE_CARDS, useDreamStore } from '../store/useDreamStore';
import { useMindfulnessQuoteQuery } from '../services/restAreaServices';

export const CampfireWindow: React.FC = () => {
  const { activeWindows, closeWindow } = useDreamStore();
  const { data: quoteData } = useMindfulnessQuoteQuery();
  const { setFocusedObjectId } = useRoomStore();
  const { setSelectedEntryId } = useJournalStore();
  const { mutate: createJournalEntry, isPending: isCreating } = useCreateJournalEntry();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  if (!activeWindows.includes('campfire')) return null;

  const filteredCards = selectedCategory === 'all' 
    ? CAMPFIRE_CARDS 
    : CAMPFIRE_CARDS.filter(card => card.category === selectedCategory);

  const safeIndex = currentIndex % filteredCards.length;
  const currentCard = filteredCards[safeIndex] || CAMPFIRE_CARDS[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setCurrentIndex(randomIndex);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentCard.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnswerInJournal = () => {
    const promptTitle = `Campfire Thought: ${currentCard.title}`;
    const initialContent = `> **Campfire Question:** ${currentCard.question}\n\n*Reflections & Thoughts:*\n\n`;

    createJournalEntry(
      {
        title: promptTitle,
        content: initialContent,
        type: 'journal',
        tags: ['campfire-reflections', currentCard.category],
      },
      {
        onSuccess: (newEntry) => {
          setSelectedEntryId(newEntry.id);
          setFocusedObjectId('journal');
        },
      }
    );
  };

  return (
    <div
      className={`bg-[#DFB6B2] border-2 border-[#190019] shadow-[6px_6px_0px_#190019] flex flex-col w-full font-['Space_Mono',monospace] transition-all duration-200 ${
        isExpanded ? 'max-w-3xl' : 'max-w-2xl'
      } ${isMinimized ? 'max-h-10' : 'max-h-[min(580px,72vh)]'}`}
    >
      {/* Window Title Bar */}
      <div className="bg-[#190019] text-[#FBE4D8] px-3 py-1.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#DFB6B2] animate-pulse" />
          <span className="font-bold text-xs tracking-wide">C:\System\campfire_conversations.exe</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized((val) => !val)}
            className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300"
            aria-label={isMinimized ? 'Restore Campfire Window' : 'Minimize Campfire Window'}
          >
            <Minus className="w-3 h-3 text-[#190019]" />
          </button>
          <button
            onClick={() => setIsExpanded((val) => !val)}
            className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300"
            aria-label={isExpanded ? 'Standard Size' : 'Expand Window'}
          >
            <Maximize2 className="w-2 h-2 text-[#190019]" />
          </button>
          <button
            onClick={() => closeWindow('campfire')}
            className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300"
            aria-label="Close Window"
          >
            <X className="w-3 h-3 text-[#190019]" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-3 bg-[#FBE4D8] border-b-2 border-[#190019] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All Cards' },
              { id: 'tonight', label: "Tonight's Thought" },
              { id: 'astronomy', label: 'Stargazer' },
              { id: 'quiet', label: 'Quiet Observation' },
              { id: 'memory', label: 'Memory' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 text-[11px] font-bold border border-[#190019] transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#190019] text-[#FBE4D8]'
                    : 'bg-[#DFB6B2] text-[#190019] hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-[#854F6C] text-[#FBE4D8] border border-[#190019] hover:bg-[#2B124C] transition-colors shadow-[2px_2px_0px_#190019] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Draw Card</span>
          </button>
        </div>
      )}

      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-[#FBE4D8] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Card Frame */}
            <div className="relative border-2 border-[#190019] bg-white p-6 md:p-8 shadow-[4px_4px_0px_#190019] rounded-sm flex flex-col justify-between min-h-[220px]">
              <div className="flex items-center justify-between border-b border-[#DFB6B2] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#854F6C] rounded-full inline-block animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#854F6C]">
                    {currentCard.categoryLabel}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#190019]/60 font-mono">
                  Card {safeIndex + 1} of {filteredCards.length}
                </span>
              </div>

              <div className="my-2 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#854F6C]">
                  {currentCard.title}
                </h3>
                <p className="font-['Playfair_Display',serif] text-xl md:text-2xl font-semibold leading-relaxed text-[#190019]">
                  "{currentCard.question}"
                </p>

                {quoteData && quoteData.quote && (
                  <div className="mt-4 p-3 bg-[#DFB6B2]/30 border border-[#854F6C]/40 rounded text-xs italic text-[#2B124C]">
                    <span className="font-bold uppercase not-italic text-[9px] block text-[#854F6C] font-mono mb-1">Daily Mindfulness Quote</span>
                    "{quoteData.quote}"{quoteData.author ? ` — ` : ''}{quoteData.author && <span className="font-bold not-italic">{quoteData.author}</span>}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#DFB6B2]/60 flex items-center justify-between text-xs text-[#190019]/70 italic">
                <span>{currentCard.subtext || 'AI-free reflective question • Warm conversation card'}</span>
                <button
                  onClick={handleCopyPrompt}
                  className="not-italic flex items-center gap-1 text-[11px] font-bold text-[#854F6C] hover:text-[#190019] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Controls & Action Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-[#190019]">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 border-2 border-[#190019] bg-[#DFB6B2] text-[#190019] hover:bg-[#854F6C] hover:text-[#FBE4D8] transition-colors shadow-[2px_2px_0px_#190019]"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 border-2 border-[#190019] bg-[#DFB6B2] text-[#190019] hover:bg-[#854F6C] hover:text-[#FBE4D8] transition-colors shadow-[2px_2px_0px_#190019]"
                aria-label="Next card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#190019] ml-2">
                Card {safeIndex + 1}/{filteredCards.length}
              </span>
            </div>

            <button
              onClick={handleAnswerInJournal}
              disabled={isCreating}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-2.5 bg-[#190019] text-[#FBE4D8] font-bold text-xs border-2 border-[#190019] hover:bg-[#2B124C] hover:border-[#854F6C] transition-all shadow-[3px_3px_0px_#854F6C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
            >
              <PenTool className="w-4 h-4 text-[#DFB6B2]" />
              <span>{isCreating ? 'Opening Journal...' : 'Answer in Journal'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
