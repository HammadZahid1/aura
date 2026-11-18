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
  private output: GainNode | null = null;
  private element: HTMLAudioElement | null = null;

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
        const output = context.createGain();
        source.connect(output);
        output.connect(context.destination);

        this.context = context;
        this.source = source;
        this.output = output;
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

  /** Disconnect everything and close the context. Used on unmount or element replacement. */
  detach(): void {
    try {
      this.source?.disconnect();
      this.output?.disconnect();
    } catch {
      // Nodes may already be disconnected; nothing to do.
    }

    const context = this.context;
    this.source = null;
    this.output = null;
    this.context = null;
    this.element = null;

    if (context && context.state !== 'closed') {
      void context.close().catch(() => undefined);
    }
  }
}
