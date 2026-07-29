import React from 'react';
import { useRestStore } from '../store/useRestStore';
import { Loader2 } from 'lucide-react';

export const RestCenter: React.FC = () => {
  const { currentActivity, dailyQuote, dailyFact, isLoadingContent, dailyReflection, setDailyReflection } = useRestStore();

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-[#162032]">
      {isLoadingContent ? (
        <div className="h-full flex flex-col items-center justify-center text-[#E2E8F0]/50 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="font-mono text-sm tracking-widest uppercase">Fetching from Deep Space Network...</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          
          {currentActivity === 'quote' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-3xl font-bold mb-2 text-[#F4EAD5] font-['Playfair_Display',serif]">Thought of the Day</h2>
              <div className="h-1 w-12 bg-[#E2E8F0] mb-8" />
              
              {dailyQuote ? (
                <div className="space-y-6">
                  {dailyQuote.url && (
                    <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden border border-[#334155] shadow-lg">
                      <img src={dailyQuote.url} alt={dailyQuote.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#F4EAD5] font-['Playfair_Display',serif]">{dailyQuote.title}</h3>
                  <p className="text-[#E2E8F0]/80 leading-relaxed text-lg">{dailyQuote.explanation}</p>
                  <p className="text-sm font-mono text-[#E2E8F0]/50 pt-4 border-t border-[#334155]">
                    Source: NASA Astronomy Picture of the Day ({dailyQuote.date})
                  </p>
                </div>
              ) : (
                <p className="text-[#E2E8F0]/50 italic">No quote available right now.</p>
              )}
            </div>
          )}

          {currentActivity === 'fact' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-3xl font-bold mb-2 text-[#F4EAD5] font-['Playfair_Display',serif]">Space Facts</h2>
              <div className="h-1 w-12 bg-[#E2E8F0] mb-8" />
              
              {dailyFact ? (
                <div className="bg-[#0F1524] rounded-xl p-8 border border-[#334155] shadow-lg">
                  <div className="text-6xl font-bold text-[#F4EAD5] mb-4 font-['Playfair_Display',serif]">{dailyFact.number}</div>
                  <h3 className="text-xl font-bold text-[#E2E8F0] mb-6">Humans are currently in space</h3>
                  
                  <div className="space-y-3">
                    {dailyFact.people.map((person, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-[#334155] last:border-0">
                        <span className="font-medium text-[#F4EAD5] text-lg">{person.name}</span>
                        <span className="text-sm font-mono bg-[#162032] px-3 py-1 rounded text-[#E2E8F0]/70 border border-[#334155]">
                          {person.craft}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[#E2E8F0]/50 italic">No fact available right now.</p>
              )}
            </div>
          )}

          {currentActivity === 'reflection' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
              <h2 className="text-3xl font-bold mb-2 text-[#F4EAD5] font-['Playfair_Display',serif]">Daily Reflection</h2>
              <div className="h-1 w-12 bg-[#E2E8F0] mb-8" />
              
              <div className="flex-1 bg-[#0F1524] rounded-xl border border-[#334155] p-6 shadow-lg flex flex-col">
                <textarea
                  value={dailyReflection}
                  onChange={(e) => setDailyReflection(e.target.value)}
                  placeholder="How was your observation today? Any wandering thoughts?"
                  className="flex-1 w-full bg-transparent resize-none outline-none text-[#F4EAD5] text-lg leading-relaxed placeholder:text-[#E2E8F0]/30 font-['Inter',sans-serif]"
                />
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
