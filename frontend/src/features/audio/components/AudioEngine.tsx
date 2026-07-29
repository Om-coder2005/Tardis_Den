import React, { useEffect, useRef, useState } from 'react';
import { useRoomStore } from '../../../store';
import { useSettingsStore } from '../../computer/store/useSettingsStore';
import { useEnvironmentStore } from '../../room/store/useEnvironmentStore';
import { useAudioStore } from '../store/useAudioStore';

export const AudioEngine: React.FC = () => {
  const { isMuted, interactionQueue } = useAudioStore();
  const { masterVolume, ambientVolume } = useSettingsStore();
  const { weather } = useEnvironmentStore();
  const { focusedObjectId } = useRoomStore();

  const weatherAudioRef = useRef<HTMLAudioElement>(null);
  
  const [weatherTrackUrl, setWeatherTrackUrl] = useState<string | null>(null);

  // Sync weather track mapping
  useEffect(() => {
    switch(weather) {
      case 'rain': setWeatherTrackUrl('/audio/rain.mp3'); break;
      case 'stars': 
      case 'clear': 
      case 'cloudy': 
      default: setWeatherTrackUrl(null); break;
    }
  }, [weather]);

  // Handle master & ambient volume
  useEffect(() => {
    const finalVolume = (isMuted || focusedObjectId === 'bed') ? 0 : (masterVolume * ambientVolume);
    
    if (weatherAudioRef.current) {
      weatherAudioRef.current.volume = finalVolume * 0.8; // Weather slightly quieter
      if (finalVolume > 0 && weatherTrackUrl && weatherAudioRef.current.paused) {
        weatherAudioRef.current.play().catch(e => console.log('Weather autoplay blocked until interaction', e));
      }
    }
  }, [masterVolume, ambientVolume, isMuted, weatherTrackUrl, focusedObjectId]);

  // Handle Interaction Queue
  useEffect(() => {
    if (interactionQueue.length > 0 && !isMuted) {
      const latest = interactionQueue[interactionQueue.length - 1];
      const audio = new Audio(latest.url);
      audio.volume = masterVolume;
      audio.play().catch(e => console.log('Interaction audio error', e));
    }
  }, [interactionQueue, masterVolume, isMuted]);

  // Setup click listener to unlock audio engine context
  useEffect(() => {
    const unlockAudio = () => {
      const finalVolume = (isMuted || focusedObjectId === 'bed') ? 0 : (masterVolume * ambientVolume);
      if (weatherAudioRef.current && weatherTrackUrl && weatherAudioRef.current.paused && finalVolume > 0) {
        weatherAudioRef.current.play().catch(() => {});
      }
      window.removeEventListener('click', unlockAudio);
    };
    
    window.addEventListener('click', unlockAudio);
    return () => window.removeEventListener('click', unlockAudio);
  }, [isMuted, masterVolume, ambientVolume, weatherTrackUrl, focusedObjectId]);

  return (
    <div className="hidden" aria-hidden="true">
      {/* Dynamic Weather Track */}
      {weatherTrackUrl && (
        <audio 
          ref={weatherAudioRef}
          src={weatherTrackUrl}
          loop
          autoPlay
        />
      )}
    </div>
  );
};
