import type { Route } from '../../types';

interface PageProps {
  onNavigate: (route: Route) => void;
}

export default function Home({ onNavigate }: PageProps) {
  return (
    <div className="page">
      <section className="section container">
        <h1 className="heading-xl">Feel the frequency. See the sound.</h1>
        <p className="lead">Transform your audio into immersive real-time visual experiences.</p>
        <div className="button-row">
          <button className="btn btn-primary" onClick={() => onNavigate('/studio')}>
            Enter Studio
          </button>
          <button className="btn" onClick={() => onNavigate('/gallery')}>
            Explore Visualizers
          </button>
        </div>
      </section>
    </div>
  );
}
