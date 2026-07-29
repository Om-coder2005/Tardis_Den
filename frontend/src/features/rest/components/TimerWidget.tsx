import React from 'react';
import { useDreamStore } from '../store/useDreamStore';
import { Play, Square, RotateCcw, X, Minus, Maximize2 } from 'lucide-react';

export const TimerWidget: React.FC = () => {
  const { 
    timerDuration, timerRemaining, isTimerRunning, 
    setTimerDuration, toggleTimer, resetTimer,
    activeWindows, closeWindow
  } = useDreamStore();

  if (!activeWindows.includes('timer')) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = timerDuration > 0
    ? Math.max(0, Math.min(100, (timerRemaining / timerDuration) * 100))
    : 0;
  const status = timerRemaining === 0 ? 'Complete' : isTimerRunning ? 'Focusing' : 'Ready';

  return (
    <div className="bg-[#FBE4D8] border-2 border-[#190019] shadow-[6px_6px_0px_#190019] flex flex-col w-full max-w-sm font-['Space_Mono',monospace]">
      
      {/* Window Title Bar */}
      <div className="bg-[#190019] text-[#FBE4D8] px-3 py-1 flex items-center justify-between">
        <span className="font-bold text-xs tracking-wide">C:\System\pomodoro.exe</span>
        <div className="flex gap-2">
          <button className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300">
            <Minus className="w-3 h-3 text-[#190019]" />
          </button>
          <button className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300">
            <Maximize2 className="w-2 h-2 text-[#190019]" />
          </button>
          <button 
            onClick={() => closeWindow('timer')}
            className="w-4 h-4 bg-[#DFB6B2] border border-[#FBE4D8] flex items-center justify-center hover:bg-white active:bg-gray-300"
          >
            <X className="w-3 h-3 text-[#190019]" />
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#854F6C] mb-3">
          <span>Focus session</span>
          <span>{status}</span>
        </div>
        
        <div className="text-5xl font-bold text-[#2B124C] mb-4 tabular-nums">
          {formatTime(timerRemaining)}
        </div>

        <div className="w-full h-2 bg-[#DFB6B2] border border-[#190019] mb-6" aria-label={`${Math.round(progress)} percent remaining`}>
          <div className="h-full bg-[#854F6C] transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={toggleTimer}
            aria-label={isTimerRunning ? 'Pause focus timer' : timerRemaining === 0 ? 'Restart focus timer' : 'Start focus timer'}
            className="w-10 h-10 border-2 border-[#190019] bg-[#DFB6B2] shadow-[2px_2px_0px_#190019] flex items-center justify-center hover:bg-[#854F6C] hover:text-[#FBE4D8] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
          >
            {isTimerRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
          </button>
          
          <button 
            onClick={resetTimer}
            aria-label="Reset focus timer"
            className="w-10 h-10 border-2 border-[#190019] bg-[#DFB6B2] shadow-[2px_2px_0px_#190019] flex items-center justify-center hover:bg-[#854F6C] hover:text-[#FBE4D8] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex w-full border-2 border-[#190019]">
          {[15, 25, 50].map((mins, i) => (
            <button
              key={mins}
              onClick={() => setTimerDuration(mins)}
              aria-label={`Set timer for ${mins} minutes`}
              className={`flex-1 py-1 text-xs font-bold text-center ${i !== 2 ? 'border-r-2 border-[#190019]' : ''} ${
                timerDuration === mins * 60 ? 'bg-[#2B124C] text-[#FBE4D8]' : 'bg-[#DFB6B2] text-[#190019] hover:bg-[#854F6C] hover:text-[#FBE4D8]'
              } transition-colors`}
            >
              {mins}m
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
