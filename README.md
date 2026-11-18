# AURA — Audio Visualization Studio

AURA is a premium, frontend-only studio that turns local audio into real-time visual art. It runs entirely in the browser: audio files are decoded and analysed with the native Web Audio API and rendered with Canvas 2D. Nothing is uploaded, tracked, or sent to a server.

![AURA](https://img.shields.io/badge/audio-local%20only-43DDF5?style=flat-square) ![Stack](https://img.shields.io/badge/stack-React%20%2B%20TypeScript-4285FF?style=flat-square) ![Tests](https://img.shields.io/badge/tests-Vitest-9A78FF?style=flat-square)

## What it does

- **Local audio library** — click to browse or drag and drop MP3, WAV, OGG, M4A, AAC, FLAC, Opus or WebM files.
- **Custom player** — play/pause, seek, restart, volume, mute, metadata, duration sync and decode-error recovery.
- **Five visualizers** — Aura Ring, Waveform, Frequency Spectrum, Particle Field and Orbital.
- **Live insights** — RMS level, peak hold, relative bass/mid/treble activity and a real spectrum distribution.
- **Creative controls** — sensitivity, animation speed, bar count, particle density, wave thickness, background brightness, glow and five color themes.
- **Fullscreen stage** — a dedicated fullscreen view with transport controls still available.
- **Gallery and settings** — animated previews of every mode, persisted interface defaults and a clear privacy statement.
- **Accessible and responsive** — keyboard shortcuts, skip link, reduced-motion support and layouts for desktop, tablet and mobile.

## Privacy first

AURA has no backend, database, auth, analytics, external audio processing, API keys or cloud storage.

- Audio files become temporary `blob:` URLs on your device.
- Object URLs are revoked when a track is replaced or removed.
- The only persisted data is your selected theme and visualization defaults in `localStorage`.
- All analysis happens through a single lazily-created `AudioContext` after a user gesture.

The app works offline after its assets have loaded. There are no network requests for audio analysis.

## Quick start

```bash
git clone https://github.com/HammadZahid1/aura.git
cd aura
npm install
npm run dev
```

Open the URL printed by Vite. To build and preview the production bundle:

```bash
npm run build
npm run preview
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite dev server. |
| `npm run build` | Type-check with TypeScript and create the production build. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run lint` | Run ESLint across the project. |
| `npm test` | Run the Vitest unit suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |

## Keyboard shortcuts

Available in the Audio Studio when focus is not inside a form control:

| Key | Action |
| --- | --- |
| `1`–`5` | Switch visualization mode. |
| `Space` | Play or pause audio. |
| `F` | Enter or exit fullscreen. |
| `R` | Reset visualization controls and theme. |
| `Esc` | Exit fullscreen or close the mobile menu. |

## Architecture

```text
src/
├── components/          # UI by feature: layout, studio, controls, visualizers, player
├── context/             # Theme and persisted visualization preferences
├── data/                # Mode metadata, theme definitions, default config
├── hooks/               # Audio player, engine, drop, fullscreen, preferences
├── lib/
│   ├── audio/           # Analysis graph, bands, validation, formatting, spectrum
│   ├── config/          # Config normalization and control ranges
│   ├── utilities/       # Small pure helpers
│   └── visualization/   # Renderer registry and Canvas 2D renderers
├── pages/               # Home, Studio, Gallery, Settings, About
├── test/                # Vitest setup
└── types/               # Shared domain types
```

### How rendering works

`AudioEngine` owns one `AudioContext`, one media-element source, one `AnalyserNode` and one gain node. On each animation frame, `VisualizerCanvas` asks the engine for a reused `AudioFrame`, then calls the registered renderer for the selected mode. Typed arrays are reused rather than reallocated, and idle previews use deterministic motion instead of fake audio claims. The insights panel receives throttled immutable snapshots so React does not re-render 60 times per second.

## Browser support

AURA targets current versions of Chrome, Edge, Firefox and Safari. Fullscreen and Web Audio support vary slightly by browser; when fullscreen is blocked, the stage continues to work inline. Audio format support is ultimately decided by the browser's media element.

## Deployment

The build output in `dist/` is static. Deploy it to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages) with no environment variables or server configuration. For GitHub Pages with a project path, set Vite's `base` option accordingly.

## License

MIT.
