import React, { useEffect } from 'react';
import { useEnvironmentStore } from '../store/useEnvironmentStore';

export const EnvironmentLayer: React.FC = () => {
  const { timeOfDay, autoMode, setTimeOfDay } = useEnvironmentStore();

  // Auto-mode clock logic
  useEffect(() => {
    if (!autoMode) return;
    
    const checkTime = () => {
      const hour = new Date().getHours();
      let newTime: 'morning' | 'afternoon' | 'sunset' | 'night' = 'afternoon';
      
      if (hour >= 5 && hour < 10) newTime = 'morning';
      else if (hour >= 10 && hour < 17) newTime = 'afternoon';
      else if (hour >= 17 && hour < 20) newTime = 'sunset';
      else newTime = 'night';
      
      if (timeOfDay !== newTime) {
        setTimeOfDay(newTime);
      }
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [autoMode, timeOfDay, setTimeOfDay]);

  // Subtle lighting overlays for room atmosphere without hiding the starfield
  const getOverlayStyle = () => {
    switch (timeOfDay) {
      case 'morning':
        return { backgroundColor: 'rgba(255, 220, 180, 0.08)', mixBlendMode: 'overlay' as const };
      case 'afternoon':
        return { backgroundColor: 'rgba(255, 255, 255, 0)', mixBlendMode: 'normal' as const };
      case 'sunset':
        return { backgroundColor: 'rgba(235, 100, 40, 0.15)', mixBlendMode: 'multiply' as const };
      case 'night':
        return { backgroundColor: 'rgba(10, 15, 30, 0.25)', mixBlendMode: 'multiply' as const };
      default:
        return {};
    }
  };

  return (
    <>
      {/* Time of Day Color Grading Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-[3000ms] ease-in-out z-10"
        style={getOverlayStyle()}
      />
    </>
  );
};
