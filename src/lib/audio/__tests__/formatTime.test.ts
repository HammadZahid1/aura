import { describe, expect, it } from 'vitest';
import { formatBytes, formatTime } from '../formatTime';

describe('formatTime', () => {
  it('formats seconds as minutes and seconds', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(599)).toBe('9:59');
  });

  it('includes hours only when needed', () => {
    expect(formatTime(3600)).toBe('1:00:00');
    expect(formatTime(3661)).toBe('1:01:01');
  });

  it('falls back to zero for invalid values', () => {
    expect(formatTime(-4)).toBe('0:00');
    expect(formatTime(Number.NaN)).toBe('0:00');
    expect(formatTime(Number.POSITIVE_INFINITY)).toBe('0:00');
  });
});

describe('formatBytes', () => {
  it('formats byte counts with binary units', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(2 * 1024 * 1024)).toBe('2.0 MB');
  });

  it('rejects invalid sizes', () => {
    expect(formatBytes(-1)).toBe('0 B');
    expect(formatBytes(Number.NaN)).toBe('0 B');
  });
});
