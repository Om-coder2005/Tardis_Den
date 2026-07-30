import React from 'react';
import { Sparkles, HelpCircle, BookOpen, Telescope, Edit3, Image, Monitor, Moon } from 'lucide-react';

interface SuggestedActionsProps {
  module?: string;
  onSelectAction: (promptText: string) => void;
  disabled?: boolean;
}

interface ActionPill {
  label: string;
  prompt: string;
  icon?: React.ReactNode;
}

export const SuggestedActions: React.FC<SuggestedActionsProps> = ({
  module = 'room',
  onSelectAction,
  disabled = false,
}) => {
  const getActionsForModule = (modName: string): ActionPill[] => {
    switch (modName.toLowerCase()) {
      case 'bookshelf':
        return [
          { label: 'Explain Simply', prompt: 'Explain the main concepts from this book in simple terms.', icon: <BookOpen className="w-3 h-3" /> },
          { label: 'Summarize Chapter', prompt: 'Please provide a concise chapter summary.', icon: <Sparkles className="w-3 h-3" /> },
          { label: 'Define Terms', prompt: 'What are the key terms and definitions introduced here?', icon: <HelpCircle className="w-3 h-3" /> },
        ];
      case 'telescope':
        return [
          { label: 'Explain Object', prompt: 'Explain the astrophysics and background of this celestial object.', icon: <Telescope className="w-3 h-3" /> },
          { label: 'Observation History', prompt: 'What is the astronomical discovery history of this object?', icon: <Sparkles className="w-3 h-3" /> },
          { label: 'Compare Objects', prompt: 'How does this compare to other celestial bodies of its type?', icon: <HelpCircle className="w-3 h-3" /> },
        ];
      case 'journal':
        return [
          { label: 'Improve Writing', prompt: 'Help refine and improve the writing style of this journal entry.', icon: <Edit3 className="w-3 h-3" /> },
          { label: 'Suggest Title', prompt: 'Suggest a creative and fitting title for this entry.', icon: <Sparkles className="w-3 h-3" /> },
          { label: 'Suggest Tags', prompt: 'What relevant tags would fit this journal entry?', icon: <HelpCircle className="w-3 h-3" /> },
        ];
      case 'gallery':
        return [
          { label: 'Caption Photo', prompt: 'Generate an informative caption for this astronomical photo.', icon: <Image className="w-3 h-3" /> },
          { label: 'Reflection', prompt: 'Provide a scientific reflection on this observation.', icon: <Sparkles className="w-3 h-3" /> },
        ];
      case 'desktop':
        return [
          { label: 'Explain Feature', prompt: 'How does this application feature work?', icon: <Monitor className="w-3 h-3" /> },
          { label: 'Navigation Guide', prompt: 'Where can I find tools for my observatory workflow?', icon: <HelpCircle className="w-3 h-3" /> },
        ];
      case 'dream space':
      case 'dreamspace':
        return [
          { label: 'Calm Reflection', prompt: 'Offer a serene reflection for quiet contemplation.', icon: <Moon className="w-3 h-3" /> },
          { label: 'Reading Companion', prompt: 'Suggest a quiet topic to ponder in the dream space.', icon: <Sparkles className="w-3 h-3" /> },
        ];
      default:
        return [
          { label: 'Observatory Help', prompt: 'How can you assist me in this module?', icon: <Sparkles className="w-3 h-3" /> },
          { label: 'Explain Context', prompt: 'What information do you see about my current view?', icon: <HelpCircle className="w-3 h-3" /> },
        ];
    }
  };

  const actions = getActionsForModule(module);

  return (
    <div className="flex flex-wrap gap-2 py-2 px-1">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onSelectAction(action.prompt)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-black border-2 border-black retro-shadow hover:bg-black hover:text-white disabled:opacity-50 transition-colors"
        >
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};
