import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Trash2, Square, ShieldCheck } from 'lucide-react';
import { useAIStore } from './useAIStore';
import { useAIChat } from './hooks/useAIChat';
import { useAIContext } from './hooks/useAIContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { SafeMarkdown } from './SafeMarkdown';
import { SuggestedActions } from './components/SuggestedActions';
import { MessageActions } from './components/MessageActions';

export const AICompanion: React.FC = () => {
  const { messages, clearHistory } = useAIStore();
  const { isOpen, closePanel, context } = useAIContext();
  const { sendMessage, isLoading, abortRequest } = useAIChat();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus management & Escape key to close panel
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closePanel();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, closePanel]);

  // Clean up request on unmount
  useEffect(() => {
    return () => {
      abortRequest();
    };
  }, [abortRequest]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const prompt = input.trim();
    setInput('');
    sendMessage(prompt);
  };

  const handleActionSelect = (actionPrompt: string) => {
    sendMessage(actionPrompt);
  };

  const handleRegenerate = (index: number) => {
    // Find the last user message before this index
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        sendMessage(messages[i].content);
        break;
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ErrorBoundary fallback={
          <div className="absolute right-0 top-0 bottom-0 w-[400px] retro-panel rounded-l-none border-t-0 border-r-0 border-b-0 flex flex-col items-center justify-center p-6 text-center z-50 bg-white">
            <X className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-black mb-2">AI Panel Crashed</h3>
            <p className="text-sm text-black/70 mb-4">The AI Companion encountered a fatal error. Other systems remain operational.</p>
            <button 
              onClick={closePanel}
              className="px-4 py-2 bg-black text-white text-sm font-bold border-2 border-black hover:bg-white hover:text-black transition-colors retro-shadow"
            >
              Close Panel
            </button>
          </div>
        }>
          <motion.div
            role="dialog"
            aria-label="Tardis AI Observatory Companion"
            aria-live="polite"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-[400px] retro-panel rounded-l-none border-t-0 border-r-0 border-b-0 flex flex-col z-50 shadow-[-10px_0_0_0_rgba(0,0,0,1)] bg-white"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b-2 border-black bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center retro-shadow">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h2 className="font-bold text-black tracking-tight">Tardis AI</h2>
                  <p className="text-xs text-black/70 font-medium">
                    {context ? `Context: ${context.module}` : 'Observatory Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearHistory}
                  className="w-8 h-8 flex items-center justify-center rounded-none border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-colors text-black"
                  title="Clear History"
                  aria-label="Clear Conversation History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={closePanel}
                  className="w-8 h-8 flex items-center justify-center rounded-none border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-colors text-black"
                  aria-label="Close AI Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contextual Action Pills */}
            <div className="border-b border-black bg-retro-cream px-3 py-1">
              <SuggestedActions 
                module={context?.module || 'room'} 
                onSelectAction={handleActionSelect} 
                disabled={isLoading}
              />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-retro-cream">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-8 text-black opacity-80">
                  <Sparkles className="w-12 h-12 mb-4" />
                  <p className="text-sm font-bold">I am Tardis.</p>
                  <p className="text-sm">Ask me to explain a celestial object, summarize a book, or help with your journal.</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] px-4 py-3 ${
                        msg.role === 'user' 
                          ? 'bg-black text-white font-bold retro-shadow' 
                          : 'bg-white text-black retro-border retro-shadow'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <>
                          <SafeMarkdown source={msg.content} isStreaming={msg.isStreaming} />
                          <MessageActions 
                            content={msg.content} 
                            isStreaming={msg.isStreaming} 
                            onRegenerate={() => handleRegenerate(index)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Footer Controls */}
            <div className="p-4 border-t-2 border-black bg-white flex flex-col gap-2">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLoading ? "Tardis is thinking..." : "Ask something..."}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-black retro-shadow pl-4 pr-12 py-3 text-sm text-black placeholder-black/50 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none disabled:opacity-50 transition-all font-bold"
                  aria-label="Ask AI input field"
                />
                {isLoading ? (
                  <button
                    type="button"
                    onClick={abortRequest}
                    className="absolute right-2 w-10 h-10 flex items-center justify-center bg-red-600 text-white border-2 border-black hover:bg-red-700 transition-colors"
                    title="Stop Generating"
                    aria-label="Stop Generating Response"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2 w-10 h-10 flex items-center justify-center bg-black text-white border-2 border-black disabled:opacity-50 hover:bg-white hover:text-black transition-colors"
                    aria-label="Send Message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </form>

              <div className="flex items-center justify-between px-1 text-[10px] text-black/60 font-medium">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-700" />
                  <span>Session-only history • Privacy protected</span>
                </div>
                <span>ESC to close</span>
              </div>
            </div>
          </motion.div>
        </ErrorBoundary>
      )}
    </AnimatePresence>
  );
};
