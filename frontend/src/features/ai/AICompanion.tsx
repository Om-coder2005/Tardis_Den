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
        <>
          {/* Backdrop for mobile screen dimensions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[9990] sm:hidden"
          />

          <ErrorBoundary fallback={
            <div className="fixed right-0 top-0 bottom-0 h-full w-full sm:w-[400px] md:w-[440px] max-w-full bg-[#0F172A] border-l border-[#1E293B] flex flex-col items-center justify-center p-6 text-center z-[9999] text-white">
              <X className="w-12 h-12 text-rose-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">AI Subsystem Recovered</h3>
              <p className="text-sm text-[#94A3B8] mb-4">The AI Companion encountered a rendering error. Other modules remain safe.</p>
              <button 
                onClick={closePanel}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
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
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 h-full w-full sm:w-[400px] md:w-[440px] max-w-full bg-[#0B0F19] border-l border-[#1E293B] flex flex-col z-[9999] shadow-[-20px_0_60px_rgba(0,0,0,0.6)] text-[#F8FAFC]"
            >
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-5 border-b border-[#1E293B] bg-[#0F172A]/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#F8FAFC] text-sm tracking-wide">Tardis AI</h2>
                    <p className="text-xs text-[#94A3B8] font-medium">
                      {context ? `Context: ${context.module}` : 'Observatory Companion'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={clearHistory}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                    title="Clear History"
                    aria-label="Clear Conversation History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={closePanel}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                    aria-label="Close AI Panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contextual Action Pills */}
              <div className="border-b border-[#1E293B] bg-[#0B0F19] px-3 py-1">
                <SuggestedActions 
                  module={context?.module || 'room'} 
                  onSelectAction={handleActionSelect} 
                  disabled={isLoading}
                />
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0F19] scrollbar-thin scrollbar-thumb-[#1E293B]">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6 text-[#94A3B8]">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <p className="text-base font-bold text-[#F8FAFC] mb-1">I am Tardis.</p>
                    <p className="text-xs text-[#94A3B8] leading-relaxed max-w-[280px]">
                      Ask me to explain celestial bodies, summarize books, or assist with your journal entries.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[88%] px-4 py-3 ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white font-medium rounded-2xl rounded-tr-xs shadow-md' 
                            : 'bg-[#162032] text-[#F1F5F9] border border-[#334155] rounded-2xl rounded-tl-xs shadow-md'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
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
              <div className="p-4 border-t border-[#1E293B] bg-[#0F172A]/90 backdrop-blur-md flex flex-col gap-2">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLoading ? "Tardis is thinking..." : "Ask something..."}
                    disabled={isLoading}
                    className="w-full bg-[#162032] border border-[#334155] rounded-xl pl-4 pr-12 py-3 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-all font-medium"
                    aria-label="Ask AI input field"
                  />
                  {isLoading ? (
                    <button
                      type="button"
                      onClick={abortRequest}
                      className="absolute right-2 w-9 h-9 flex items-center justify-center bg-rose-600/90 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                      title="Stop Generating"
                      aria-label="Stop Generating Response"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="absolute right-2 w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-lg disabled:opacity-40 hover:bg-blue-500 transition-colors shadow-sm"
                      aria-label="Send Message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </form>

                <div className="flex items-center justify-between px-1 text-[11px] text-[#64748B] font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Session-only history • Privacy protected</span>
                  </div>
                  <span>ESC to close</span>
                </div>
              </div>
            </motion.div>
          </ErrorBoundary>
        </>
      )}
    </AnimatePresence>
  );
};
