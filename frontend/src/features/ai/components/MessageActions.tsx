import React, { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface MessageActionsProps {
  content: string;
  onRegenerate?: () => void;
  isStreaming?: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  onRegenerate,
  isStreaming = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  if (isStreaming || !content.trim()) return null;

  return (
    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-[#334155]/60 text-xs">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] font-medium transition-colors"
        title="Copy response"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>

      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] font-medium transition-colors"
          title="Regenerate response"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Regenerate</span>
        </button>
      )}
    </div>
  );
};
