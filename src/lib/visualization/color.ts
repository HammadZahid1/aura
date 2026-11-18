/** Convert a #rrggbb colour to a CSS rgba() string without allocating arrays per frame. */
export function rgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const full = value.length === 3
    ? value.split('').map((char) => char + char).join('')
    : value;
  const red = Number.parseInt(full.slice(0, 2), 16);
  const green = Number.parseInt(full.slice(2, 4), 16);
  const blue = Number.parseInt(full.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

/** Blend two hex colours. `amount` of 0 returns `from`, 1 returns `to`. */
export function mix(from: string, to: string, amount: number): string {
  const a = from.replace('#', '');
  const b = to.replace('#', '');
  const channel = (offset: number) => {
    const start = Number.parseInt(a.slice(offset, offset + 2), 16);
    const end = Number.parseInt(b.slice(offset, offset + 2), 16);
    return Math.round(start + (end - start) * amount).toString(16).padStart(2, '0');
  };
  return `#${channel(0)}${channel(2)}${channel(4)}`;
}
