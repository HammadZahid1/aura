import { describe, expect, it } from 'vitest';
import { describeAudioType, getExtension, MAX_FILE_SIZE, validateAudioFile } from '../fileValidation';
import type { FileLike } from '../../../types';

const file = (overrides: Partial<FileLike> = {}): FileLike => ({
  name: 'track.mp3',
  type: 'audio/mpeg',
  size: 1024,
  ...overrides,
});

describe('getExtension', () => {
  it('returns a lowercase extension or an empty string', () => {
    expect(getExtension('Track.MP3')).toBe('mp3');
    expect(getExtension('no-extension')).toBe('');
    expect(getExtension('a.b.wav')).toBe('wav');
  });
});

describe('describeAudioType', () => {
  it('prefers the filename extension', () => {
    expect(describeAudioType('song.flac', 'audio/flac')).toBe('FLAC');
  });

  it('falls back to MIME type then a generic label', () => {
    expect(describeAudioType('song', 'audio/ogg')).toBe('OGG');
    expect(describeAudioType('song', '')).toBe('AUDIO');
  });
});

describe('validateAudioFile', () => {
  it('accepts common audio files', () => {
    expect(validateAudioFile(file()).valid).toBe(true);
    expect(validateAudioFile(file({ name: 'mix.WAV', type: 'audio/wav' })).valid).toBe(true);
    expect(validateAudioFile(file({ name: 'track.m4a', type: '' })).valid).toBe(true);
  });

  it('accepts valid extensions with an empty MIME type', () => {
    expect(validateAudioFile(file({ type: '' })).valid).toBe(true);
  });

  it('rejects missing names and empty files', () => {
    expect(validateAudioFile(file({ name: '   ' })).valid).toBe(false);
    expect(validateAudioFile(file({ size: 0 })).valid).toBe(false);
  });

  it('rejects files above the size limit', () => {
    expect(validateAudioFile(file({ size: MAX_FILE_SIZE + 1 })).valid).toBe(false);
  });

  it('rejects unsupported extensions and misleading MIME types', () => {
    expect(validateAudioFile(file({ name: 'notes.txt', type: 'text/plain' })).valid).toBe(false);
    expect(validateAudioFile(file({ name: 'track.mp3', type: 'text/plain' })).valid).toBe(false);
  });
});
