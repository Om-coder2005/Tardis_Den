export class AudioEngine {
  private static instance: AudioEngine;
  private currentAudio: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;
  private volume: number = 0.5;

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public setGlobalVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  public async playTrack(url: string): Promise<boolean> {
    if (this.currentAudio && this.currentUrl === url) {
      if (this.currentAudio.paused) {
        this.currentAudio.volume = this.volume;
        try {
          await this.currentAudio.play();
        } catch (err) {
          console.error('Failed to resume audio:', err);
          return false;
        }
      }
      return true;
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = '';
      this.currentAudio = null;
      this.currentUrl = null;
    }

    this.currentAudio = new Audio(url);
    this.currentUrl = url;
    this.currentAudio.loop = true;
    this.currentAudio.volume = this.volume;
    
    try {
      await this.currentAudio.play();
      return true;
    } catch (err) {
      console.error('Failed to play audio:', err);
      return false;
    }
  }

  public pauseTrack(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  public resumeTrack(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.volume = this.volume;
      this.currentAudio.play().catch(console.error);
    }
  }
}

export const engine = AudioEngine.getInstance();
