/** Decorative hero composition. Replaced with a canvas-rendered idle scene in the next milestone. */
export function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-orbit hero-orbit-outer" />
      <div className="hero-orbit hero-orbit-mid" />
      <div className="hero-orbit hero-orbit-inner" />
      <div className="hero-core" />
    </div>
  );
}
