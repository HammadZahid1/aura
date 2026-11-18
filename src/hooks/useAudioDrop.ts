import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';

function hasFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer.types).includes('Files');
}

/** Studio-wide file drop handling. Keeps the browser from navigating away on an accidental drop. */
export function useAudioDrop(onFile: (file: File) => void) {
  const [isDragging, setDragging] = useState(false);
  const depth = useRef(0);

  useEffect(() => {
    const prevent = (event: globalThis.DragEvent) => {
      if (event.dataTransfer?.types && Array.from(event.dataTransfer.types).includes('Files')) {
        event.preventDefault();
      }
    };
    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', prevent);
    return () => {
      window.removeEventListener('dragover', prevent);
      window.removeEventListener('drop', prevent);
    };
  }, []);

  return {
    isDragging,
    dropHandlers: {
      onDragEnter: (event: DragEvent) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        depth.current += 1;
        setDragging(true);
      },
      onDragOver: (event: DragEvent) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
      },
      onDragLeave: (event: DragEvent) => {
        if (!hasFiles(event)) return;
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setDragging(false);
      },
      onDrop: (event: DragEvent) => {
        event.preventDefault();
        depth.current = 0;
        setDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) onFile(file);
      },
    },
  };
}
