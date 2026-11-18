import type { FileLike, FileValidationResult } from '../../types';

/** Extensions the browser may be able to decode. Support is ultimately decided by the browser. */
export const SUPPORTED_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'opus', 'webm'] as const;

export const MAX_FILE_SIZE = 250 * 1024 * 1024;

const EXTENSION_SET: ReadonlySet<string> = new Set(SUPPORTED_EXTENSIONS);

export function getExtension(name: string): string {
  const lastDot = name.lastIndexOf('.');
  return lastDot === -1 ? '' : name.slice(lastDot + 1).toLowerCase();
}

/** Short, human-readable format label for the metadata panel. */
export function describeAudioType(name: string, type: string): string {
  const extension = getExtension(name);
  if (extension) return extension.toUpperCase();
  if (type.startsWith('audio/')) return type.slice(6).toUpperCase();
  return 'AUDIO';
}

/**
 * Validate an audio file before it is handed to the browser's media element.
 * Deliberately permissive: some browsers report empty MIME types for valid files.
 */
export function validateAudioFile(file: FileLike): FileValidationResult {
  if (!file.name || file.name.trim() === '') {
    return { valid: false, error: 'This file has no name.' };
  }

  if (file.size <= 0) {
    return { valid: false, error: 'This file is empty.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Files larger than 250 MB are not supported in the studio.' };
  }

  const extension = getExtension(file.name);
  const hasAudioMime = file.type.startsWith('audio/');
  const hasContainerMime = file.type === 'video/mp4' || file.type === 'application/ogg';

  if (!EXTENSION_SET.has(extension) && !hasAudioMime) {
    return {
      valid: false,
      error: `Unsupported file type "${extension || 'unknown'}". Try MP3, WAV, OGG, M4A, AAC or FLAC.`,
    };
  }

  if (file.type && !hasAudioMime && !hasContainerMime && EXTENSION_SET.has(extension)) {
    return { valid: false, error: 'This file does not appear to be playable audio.' };
  }

  return { valid: true };
}
