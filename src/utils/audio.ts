/**
 * Minimal, Pure Web Audio API Sound Synthesizer
 * Ultra-subtle, warm, organic acoustics: zero harsh synth sweeps
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Warm, gentle singing bowl chime (low-pass filtered, soft attack, short clean fade)
   */
  public playTempleBell(volume: number = 0.18): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const fundamental = 288; // Warm grounded D4

      const master = ctx.createGain();
      master.gain.setValueAtTime(volume * 0.25, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(520, now);
      filter.Q.setValueAtTime(1.0, now);

      master.connect(filter);
      filter.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental, now);

      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.4, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.00001, now + 1.8);

      osc.connect(g);
      g.connect(master);

      osc.start(now);
      osc.stop(now + 1.9);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Gentle, soft chime
   */
  public playBlessingChime(volume: number = 0.15): void {
    this.playTempleBell(volume);
  }

  /**
   * Soft organic wooden mala bead tap (subtle low-frequency percussive tap, no sci-fi pitch sweep)
   */
  public playMalaClick(volume: number = 0.12): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume * 0.14, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Fallback
    }
  }

  /**
   * Meditative ambient drone (very subtle, soft background)
   */
  public toggleAmbientHum(enable: boolean, volume: number = 0.04): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      if (!enable) {
        if (this.ambientGain) {
          const now = ctx.currentTime;
          this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
          setTimeout(() => {
            if (this.ambientOsc1) {
              this.ambientOsc1.stop();
              this.ambientOsc1.disconnect();
              this.ambientOsc1 = null;
            }
            if (this.ambientOsc2) {
              this.ambientOsc2.stop();
              this.ambientOsc2.disconnect();
              this.ambientOsc2 = null;
            }
            this.isAmbientPlaying = false;
          }, 600);
        }
        return;
      }

      if (this.isAmbientPlaying) return;

      const now = ctx.currentTime;
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.0001, now);
      this.ambientGain.gain.linearRampToValueAtTime(volume * 0.08, now + 1.2);
      this.ambientGain.connect(ctx.destination);

      this.ambientOsc1 = ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(138.6, now);

      this.ambientOsc2 = ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(207.65, now);

      this.ambientOsc1.connect(this.ambientGain);
      this.ambientOsc2.connect(this.ambientGain);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
      this.isAmbientPlaying = true;
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEngine();
