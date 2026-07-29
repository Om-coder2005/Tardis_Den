import React from 'react';
import { useRestStore } from '../store/useRestStore';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

export const RestWidgets: React.FC = () => {
  const { 
    timerDuration, timerRemaining, isTimerRunning, 
    setTimerDuration, toggleTimer, resetTimer 
  } = useRestStore();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[#334155] p-6 flex flex-col gap-6 bg-[#0F1524]">
      
      {/* Focus Timer Widget */}
      <div className="bg-[#162032] border border-[#334155] rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 text-[#E2E8F0]/70 mb-4">
          <Timer className="w-4 h-4" />
          <h3 className="text-xs uppercase tracking-widest font-bold">Focus Timer</h3>
        </div>
        
        <div className="text-4xl font-mono text-center text-[#F4EAD5] mb-6 font-bold tracking-wider">
          {formatTime(timerRemaining)}
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <button 
            onClick={toggleTimer}
            className="w-12 h-12 rounded-full bg-[#E2E8F0] text-[#0F1524] flex items-center justify-center hover:bg-white transition-colors"
          >
            {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          <button 
            onClick={resetTimer}
            className="w-12 h-12 rounded-full border border-[#334155] text-[#E2E8F0] flex items-center justify-center hover:bg-[#334155] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2">
          {[15, 25, 50].map((mins) => (
            <button
              key={mins}
              onClick={() => setTimerDuration(mins)}
              className={`flex-1 py-2 rounded text-xs font-mono transition-colors border ${
                timerDuration === mins 
                  ? 'bg-[#E2E8F0] text-[#0F1524] border-[#E2E8F0]' 
                  : 'border-[#334155] text-[#E2E8F0]/70 hover:bg-[#334155]'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
