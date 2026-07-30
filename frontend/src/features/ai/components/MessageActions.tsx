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
    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-black/10 text-xs">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 text-black/70 hover:text-black font-medium transition-colors"
        title="Copy response"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>

      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1 text-black/70 hover:text-black font-medium transition-colors ml-2"
          title="Regenerate response"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Regenerate</span>
        </button>
      )}
    </div>
  );
};
