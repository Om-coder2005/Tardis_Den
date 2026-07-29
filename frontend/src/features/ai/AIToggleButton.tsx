import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAIStore } from './useAIStore';
import type { AIContext } from './useAIStore';

interface Props {
  context: AIContext;
  className?: string;
}

export const AIToggleButton: React.FC<Props> = ({ context, className = '' }) => {
  const { isOpen, openPanel } = useAIStore();

  if (isOpen) return null;

  return (
    <button
      onClick={() => openPanel(context)}
      className={`fixed bottom-8 right-8 z-40 flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all group animate-bounce-slow ${className}`}
    >
      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      <span className="font-medium pr-1">Ask AI</span>
    </button>
  );
};
