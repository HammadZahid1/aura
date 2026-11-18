import { FFT_SIZE, MAX_DECIBELS, MIN_DECIBELS, SMOOTHING_TIME_CONSTANT } from './audioConfig';

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
  private frequencyBuffer: Uint8Array = new Uint8Array(0);
  private timeBuffer: Uint8Array = new Uint8Array(0);

  /** Bind the persistent media element. Calling with the same element is a no-op. */
  attach(element: HTMLAudioElement): void {
    if (this.element === element) return;
    this.detach();
    this.element = element;
  }

  /** Create (or resume) the audio graph. Must be triggered by a user interaction. */
  async activate(): Promise<boolean> {
    if (!this.element) return false;

    if (!this.context) {
      const AudioContextCtor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return false;

      try {
        const context = new AudioContextCtor();
        const source = context.createMediaElementSource(this.element);
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

  /**
   * Fill and return the shared time-domain buffer. Values around 128 represent silence.
   */
  readWaveform(): Uint8Array {
    if (!this.analyser) return this.timeBuffer;
    this.analyser.getByteTimeDomainData(this.timeBuffer);
    return this.timeBuffer;
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
    this.frequencyBuffer = new Uint8Array(0);
    this.timeBuffer = new Uint8Array(0);
    this.element = null;

    if (context && context.state !== 'closed') {
      void context.close().catch(() => undefined);
    }
  }
}
