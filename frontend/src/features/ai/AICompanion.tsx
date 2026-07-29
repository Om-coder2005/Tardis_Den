import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Trash2 } from 'lucide-react';
import { useAIStore } from './useAIStore';
import MDEditor from '@uiw/react-md-editor';

export const AICompanion: React.FC = () => {
  const { isOpen, closePanel, messages, addMessage, updateMessage, context, clearHistory } = useAIStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const prompt = input.trim();
    setInput('');
    addMessage({ role: 'user', content: prompt });
    
    setIsLoading(true);
    const responseId = addMessage({ role: 'model', content: '', isStreaming: true });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: fetch doesn't use axios interceptors, so we must include credentials manually
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt,
          context,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let aiResponseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                aiResponseText += data.text;
                updateMessage(responseId, aiResponseText, true);
              } else if (data.error) {
                aiResponseText += `\n\n**Error:** ${data.error}`;
                updateMessage(responseId, aiResponseText, false);
              }
            } catch (err) {
              console.error('Failed to parse SSE data', dataStr);
            }
          }
        }
      }
      
      updateMessage(responseId, aiResponseText, false);
    } catch (error) {
      console.error('Chat error:', error);
      updateMessage(responseId, 'Sorry, I encountered an error communicating with my neural matrix.', false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-[400px] retro-panel rounded-l-none border-t-0 border-r-0 border-b-0 flex flex-col z-50 shadow-[-10px_0_0_0_rgba(0,0,0,1)]"
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
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={closePanel}
                className="w-8 h-8 flex items-center justify-center rounded-none border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-colors text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
              messages.map((msg) => (
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
                      <div className="prose prose-sm max-w-none prose-headings:text-black prose-p:text-black prose-a:text-retro-blue font-sans">
                        <MDEditor.Markdown source={msg.content} style={{ backgroundColor: 'transparent', color: 'black', fontFamily: 'inherit', fontSize: '0.875rem' }} />
                        {msg.isStreaming && (
                          <span className="inline-block w-2 h-4 ml-1 bg-black animate-pulse align-middle" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t-2 border-black bg-white">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "Tardis is thinking..." : "Ask something..."}
                disabled={isLoading}
                className="w-full bg-white border-2 border-black retro-shadow pl-4 pr-12 py-3 text-sm text-black placeholder-black/50 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none disabled:opacity-50 transition-all font-bold"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 w-10 h-10 flex items-center justify-center bg-black text-white border-2 border-black disabled:opacity-50 hover:bg-white hover:text-black transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
