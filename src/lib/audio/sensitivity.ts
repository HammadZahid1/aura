import { clamp } from '../utilities/cn';

/** Map a 0..1 normalized analysis value through a user-controlled sensitivity curve. */
export function applySensitivity(value: number, sensitivity: number): number {
  const safeValue = clamp(value, 0, 1);
  const safeSensitivity = clamp(sensitivity, 0.25, 3);
  return clamp(Math.pow(safeValue, 1 / safeSensitivity) * safeSensitivity, 0, 1);
}
