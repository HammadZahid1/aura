import { describe, expect, it } from 'vitest';
import { isInteractiveTarget } from '../keyboard';

describe('isInteractiveTarget', () => {
  it('recognises form controls and links', () => {
    ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].forEach((tagName) => {
      expect(isInteractiveTarget(document.createElement(tagName))).toBe(true);
    });
  });

  it('ignores regular content and null targets', () => {
    expect(isInteractiveTarget(document.createElement('div'))).toBe(false);
    expect(isInteractiveTarget(null)).toBe(false);
  });

  it('treats editable content as interactive', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'isContentEditable', { value: true });
    expect(isInteractiveTarget(element)).toBe(true);
  });
});
