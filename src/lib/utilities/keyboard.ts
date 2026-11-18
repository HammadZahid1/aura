/** True when a keyboard event originated from a control that owns its own key handling. */
export function isInteractiveTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element || typeof element.tagName !== 'string') return false;
  if (element.isContentEditable) return true;
  return /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(element.tagName);
}
