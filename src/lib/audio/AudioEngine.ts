import { FFT_SIZE, MAX_DECIBELS, MIN_DECIBELS, SMOOTHING_TIME_CONSTANT } from './audioConfig';
import {
  calculateBassActivity,
  calculateMidActivity,
  calculateOverallActivity,
  calculateTrebleActivity,
} from './bands';
import type { AudioFrame } from '../../types';

/**
 * Owns the browser's audio analysis graph.
 *
 * The engine deliberately holds one AudioContext and one MediaElementAudioSourceNode
 * for the lifetime of the persistent <audio> element. Context creation happens only
 * after a user gesture, so autoplay policies are respected.
 */
export class AudioEngine {
  private context: AudioContext | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private output: GainNode | null = null;
  private element: HTMLAudioElement | null = null;
  private activation: Promise<boolean> | null = null;
  private frequencyBuffer: Uint8Array = new Uint8Array(0);
  private timeBuffer: Uint8Array = new Uint8Array(0);
  private frame: AudioFrame = {
    frequency: new Uint8Array(0),
    waveform: new Uint8Array(0),
    bands: { bass: 0, mid: 0, treble: 0, overall: 0 },
    level: 0,
    peak: 0,
    active: false,
  };

  /** Bind the persistent media element. Calling with the same element is a no-op. */
  attach(element: HTMLAudioElement): void {
    if (this.element === element) return;
    this.detach();
    this.element = element;
  }

  /** Create (or resume) the audio graph. Concurrent calls share one activation. */
  activate(): Promise<boolean> {
    if (!this.element) return Promise.resolve(false);
    if (this.activation) return this.activation;

    this.activation = this.performActivation().then((ready) => {
      this.activation = null;
      return ready;
    });
    return this.activation;
  }

  private async performActivation(): Promise<boolean> {
    if (!this.context) {
      const AudioContextCtor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return false;

      try {
        const context = new AudioContextCtor();
        const source = context.createMediaElementSource(this.element as HTMLAudioElement);
        const analyser = context.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        analyser.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT;
        analyser.minDecibels = MIN_DECIBELS;
        analyser.maxDecibels = MAX_DECIBELS;

        const output = context.createGain();
        source.connect(analyser);
        analyser.connect(output);
        output.connect(context.destination);

        this.context = context;
        this.source = source;
        this.analyser = analyser;
        this.output = output;
        this.frequencyBuffer = new Uint8Array(analyser.frequencyBinCount);
        this.timeBuffer = new Uint8Array(analyser.fftSize);
      } catch {
        return false;
      }
    }

    if (this.context.state === 'suspended') {
      try {
        await this.context.resume();
      } catch {
        return false;
      }
    }

    return this.context.state === 'running';
  }

  /** Suspend an idle context to avoid unnecessary audio-thread work. */
  async suspend(): Promise<void> {
    if (this.context?.state === 'running') {
      try {
        await this.context.suspend();
      } catch {
        // A suspended or closing context needs no further action.
      }
    }
  }

  get isReady(): boolean {
    return this.context !== null && this.context.state === 'running';
  }

  get contextState(): AudioContextState | 'uninitialised' {
    return this.context?.state ?? 'uninitialised';
  }

  get binCount(): number {
    return this.analyser?.frequencyBinCount ?? 0;
  }

  get sampleRate(): number {
    return this.context?.sampleRate ?? 44100;
  }

  /** Exposed for renderers that need stable references to the analysis buffers. */
  get buffers(): { frequency: Uint8Array; time: Uint8Array } {
    return { frequency: this.frequencyBuffer, time: this.timeBuffer };
  }

  /**
   * Fill and return the shared frequency buffer. Values are byte magnitudes in the
   * 0..255 range for each frequency bin, taken from the actual playing media element.
   */
  readFrequency(): Uint8Array {
    if (!this.analyser) return this.frequencyBuffer;
    this.analyser.getByteFrequencyData(this.frequencyBuffer);
    return this.frequencyBuffer;
  }

  /** Fill and return the shared time-domain buffer. Values around 128 represent silence. */
  readWaveform(): Uint8Array {
    if (!this.analyser) return this.timeBuffer;
    this.analyser.getByteTimeDomainData(this.timeBuffer);
    return this.timeBuffer;
  }

  /** Read one complete frame, reusing the typed arrays and band object between calls. */
  readFrame(active: boolean): AudioFrame {
    if (!active) {
      // Idle renderers use deterministic motion, so skip analyser reads entirely.
      const idleBands = this.frame.bands;
      idleBands.bass = 0;
      idleBands.mid = 0;
      idleBands.treble = 0;
      idleBands.overall = 0;
      this.frame.level = 0;
      this.frame.peak = 0;
      this.frame.active = false;
      return this.frame;
    }

    const frequency = this.readFrequency();
    const waveform = this.readWaveform();
    const sampleRate = this.sampleRate;
    const frameBands = this.frame.bands;
    frameBands.bass = calculateBassActivity(frequency, sampleRate, FFT_SIZE);
    frameBands.mid = calculateMidActivity(frequency, sampleRate, FFT_SIZE);
    frameBands.treble = calculateTrebleActivity(frequency, sampleRate, FFT_SIZE);
    frameBands.overall = calculateOverallActivity(frequency);

    const level = this.level;
    this.frame.frequency = frequency;
    this.frame.waveform = waveform;
    this.frame.level = level;
    this.frame.peak = active ? Math.max(level, this.frame.peak * 0.96) : 0;
    this.frame.active = active;
    return this.frame;
  }

  get bass(): number {
    return calculateBassActivity(this.frequencyBuffer, this.sampleRate, FFT_SIZE);
  }

  get treble(): number {
    return calculateTrebleActivity(this.frequencyBuffer, this.sampleRate, FFT_SIZE);
  }

  get mid(): number {
    return calculateMidActivity(this.frequencyBuffer, this.sampleRate, FFT_SIZE);
  }

  /** Root-mean-square level of the most recently read waveform buffer, normalised to 0..1. */
  get level(): number {
    if (this.timeBuffer.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < this.timeBuffer.length; i += 1) {
      const sample = (this.timeBuffer[i] - 128) / 128;
      sum += sample * sample;
    }
    return Math.sqrt(sum / this.timeBuffer.length);
  }

  /** Disconnect everything and close the context. Used on unmount or element replacement. */
  detach(): void {
    try {
      this.source?.disconnect();
      this.analyser?.disconnect();
      this.output?.disconnect();
    } catch {
      // Nodes may already be disconnected; nothing to do.
    }

    const context = this.context;
    this.source = null;
    this.analyser = null;
    this.output = null;
    this.context = null;
    this.activation = null;
    this.frequencyBuffer = new Uint8Array(0);
    this.timeBuffer = new Uint8Array(0);
    this.element = null;

    if (context && context.state !== 'closed') {
      void context.close().catch(() => undefined);
    }
  }
}
