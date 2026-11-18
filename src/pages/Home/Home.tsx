import { Hero } from '../../components/home/Hero';
import { FeatureStrip } from '../../components/home/FeatureStrip';
import type { PageProps } from '../../types';

export default function Home({ onNavigate }: PageProps) {
  return (
    <div className="page">
      <Hero onNavigate={onNavigate} />
      <FeatureStrip />
    </div>
  );
}
