import { describe, expect, it } from 'vitest';
import { AudioEngine } from '../AudioEngine';

describe('AudioEngine', () => {
  it('starts unattached and uninitialised', () => {
    const engine = new AudioEngine();
    expect(engine.isReady).toBe(false);
    expect(engine.contextState).toBe('uninitialised');
    expect(engine.binCount).toBe(0);
  });

  it('returns a silent idle frame without an audio graph', () => {
    const engine = new AudioEngine();
    const frame = engine.readFrame(false);

    expect(frame.active).toBe(false);
    expect(frame.level).toBe(0);
    expect(frame.peak).toBe(0);
    expect(frame.bands).toEqual({ bass: 0, mid: 0, treble: 0, overall: 0 });
  });

  it('reuses the same frame object between reads', () => {
    const engine = new AudioEngine();
    expect(engine.readFrame(false)).toBe(engine.readFrame(false));
  });

  it('does not activate without a media element', async () => {
    const engine = new AudioEngine();
    await expect(engine.activate()).resolves.toBe(false);
  });
});
