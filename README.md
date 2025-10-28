# Kabbalistic Tree of Life: Tzimtzum Visualization

A dynamic, interactive visualization of the Kabbalistic concept of **Tzimtzum** - the primordial divine contraction that creates space for creation. Built with Next.js and p5.js.

## Overview of the Illustration: A Visual Representation of Tzimtzum in Kabbalistic Cosmology

This illustration is a dynamic, animated digital artwork created using p5.js (a JavaScript library for creative coding, inspired by Processing). It visualizes the Kabbalistic concept of **tzimtzum**—the primordial "contraction" or self-withdrawal of the infinite divine light (Ein Sof) to create a conceptual "void" or space for the finite world to emerge. 

In Kabbalah, tzimtzum is not a literal shrinking but a metaphysical retreat that allows for multiplicity, structure, and creation within what was previously undifferentiated unity. The artwork metaphorically depicts this through a series of concentric circles representing layered emanations (sephirot or worlds in Kabbalistic terms), starting from a singular "monad" (the central dot representing the divine point-source) and an outermost boundary, then progressively "contracting" to reveal inner structures.

The design evokes a scholarly, meditative aesthetic: a clean white background symbolizing the infinite void, solid black lines for the divine emanations (contrasting the void like light piercing darkness), and subtle animations that cycle continuously to simulate the eternal, rhythmic process of creation and return (a common Kabbalistic motif of expansion and contraction). The animation loops rapidly (accelerated for dramatic effect), completing a full cycle roughly every few seconds, allowing viewers to contemplate the process repeatedly.

### Key Visual Elements:

- **Central Dot**: A small black filled circle (4-pixel radius, pulsing subtly) representing the Monad or the initial spark of Ein Sof—the undifferentiated divine essence.

- **Concentric Layers**: 5 radial layers, where the innermost 4 consist of paired thick black circles (4-pixel stroke weight, separated by an 8-pixel gap), and the outermost is a single thick circle. These layers symbolize the progressive sephirot or Olamot (worlds) in Kabbalah: Atzilut (emanation), Beriah (creation), Yetzirah (formation), Asiyah (action), with the outer ring as the cosmic boundary.

- **Thin Intermediary Circles**: 10 ultra-thin black circles (0.8-pixel stroke weight) in each gap between layers, appearing as faint "echoes" or sub-emanations during contraction, evoking the infinite gradations of divine light fracturing into form.

- **Dynamic Effects**: A subtle pulsing (sinusoidal oscillation ±3-5 pixels) on all circles for a breathing, living quality; a small rotating "gap" (a thin white radial slit, up to ~10 degrees wide) that sweeps around the diagram like a divine "revelation" or the moment of emergence; and progressive opacity/fading for layers and thins during the cycle.

The entire composition is centered in a responsive canvas, ensuring symmetry and focus across all devices.

## Technical Implementation

### Static Structure: Building the Kabbalistic Layers

The foundational geometry is pre-calculated to ensure equal spacing and proportionality, mimicking the harmonious, mathematically precise emanations in Kabbalah (e.g., the Tree of Life's balanced paths).

**Global Parameters:**
- `numCircles = 5`: Defines 5 layers, aligning with the 5 primary worlds or partzufim (configurations) in Lurianic Kabbalah
- `maxRadius = 300`: The outermost circle's radius, scaled for a "Kabbalistic scale" that fits the canvas without overwhelming the viewer
- `dotRadius = 4`: Tiny central point, emphasizing the Monad's infinitesimal origin
- `layerThickness = 8`: Fixed gap between paired circles in inner layers, representing the "vessel" (kli) that holds divine light without shattering (a key tzimtzum motif)
- `numInnerLayers = 4`: Only the first 4 layers have dual circles; the outermost is singular, symbolizing the ultimate boundary of creation
- `numGaps = 5`: One gap per layer (including between dot and first layer), ensuring 5 equal inter-layer spaces

**Total Space Allocation:**
- `totalThickness = 4 * 8 = 32`: Cumulative width of all inner dual-circle pairs
- `totalGapSpace = 300 - 4 - 32 = 264`: Remaining radial space for gaps
- `gapSize = 264 / 5 = 52.8`: Each gap gets ~52.8 pixels, creating uniform "breathing room" between layers—metaphorically, the void spaces birthed by tzimtzum

### Dynamic Animation: The Tzimtzum Cycle

The draw() function clears the canvas to white (the void) and redraws everything ~30 times/second. It uses time-based trigonometry for a looping, hypnotic effect. The core is a single sinusoidal phase that drives the entire tzimtzum process: expansion (full form, all layers visible) → contraction (layers fade inward, thins emerge) → revelation (small gap opens) → return to unity.

**Time and Phase Calculation:**
- `time = frameCount * 0.0167`: Slower time progression (1/3 speed) for meditative contemplation
- `phase = sin(time * 1.0)`: Oscillates between -1 and 1 rapidly
- `contractProgress = max(0, -phase)`: Maps the negative half-cycle to 0-1 (contraction phase only)
- `contractionAmount = contractProgress * 0.3`: Scales inward pull to 30% max shrinkage
- `scaleFactor = 1 - contractionAmount`: All radii shrink uniformly (0.7-1.0), simulating divine withdrawal
- `gapAngle = contractProgress * (PI / 18)`: Opens a tiny ~10° white slit during contraction
- `rotation = time * 1.0`: Sweeps the gap clockwise at high speed, like a scanning divine eye

### Responsive Design

The visualization automatically adapts to different screen sizes:
- **Mobile**: Smaller canvas with reduced padding for optimal viewing
- **Desktop**: Larger canvas up to 1200x900px for detailed observation
- **Scale Factor**: All elements scale proportionally (0.4x to 1.5x) based on viewport size
- **Window Resize**: Real-time adaptation when browser window is resized

## Kabbalistic Labels

Each layer is labeled with Hebrew terms and English translations:

- **אין סוף [Ein Sof]**: The Infinite - Central dot representing the undifferentiated divine essence
- **אצילות [Atzilut]**: Emanation - The highest world of pure divine light
- **בריאה [Beriah]**: Creation - The world of divine thought and will
- **יצירה [Yetzirah]**: Formation - The world of emotions and divine attributes
- **עשיה [Asiyah]**: Action - The physical world of manifestation
- **גבול [Boundary]**: The outermost limit of creation

## Philosophical Mapping: How It Illustrates Tzimtzum

**Pre-Contraction (Expansion Phase)**: Full diagram visible, no gap—undifferentiated pleroma (fullness)

**Initiation (contractProgress rising)**: Scale shrinks; small gap rotates open like the "point of withdrawal." Inner layers/thins fade in progressively, inner-first for thins (light from core), outer-first for layers (structure from boundary)—mirroring Lurianic tzimtzum where the infinite contracts from within to birth worlds outward

**Climax (contractProgress=1)**: Max shrinkage (70% scale), full gap (~10° white ray piercing to center), all elements pulsing in waves—evoking the "breaking of vessels" (shevirat ha-kelim) as light overflows into form, with thins as residual sparks (nitzotzot)

**Return (phase rising to positive)**: Gap closes, opacities hold briefly, then fade reverses—dissolving back to Monad + boundary, symbolizing tikkun (repair) and eternal cycle

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- **Next.js 15**: React framework for the web application
- **p5.js**: JavaScript library for creative coding and visualization
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework for responsive design

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [p5.js Reference](https://p5js.org/reference/) - creative coding library documentation
- [Kabbalah and Tzimtzum](https://en.wikipedia.org/wiki/Tzimtzum) - Wikipedia article on the concept

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
