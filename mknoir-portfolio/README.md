# Mickey’s portfolio

A Next.js portfolio with five independent experiences. Each has its own layout, navigation, typography, and reading order; the selected design is mounted by `src/components/ExperienceRouter.tsx`.

| Experience | Preview | Structure |
| --- | --- | --- |
| **Seasons** | `/?look=field` | An outdoor field guide: alpine horizon, seasonal palette controls, editorial sections, project prints, and an expandable career history. |
| **The Original** | `/?look=mono` | The familiar black-and-white mknoir.com, recovered from the original repository source, including the long About memo and skills radar. |
| **The Lab** | `/?look=orbit` | A procedural Three.js laboratory. Explore objects to open stories about Mickey’s scientific work, software, robotics, and interests. |
| **Atlas** | `/?look=atlas` | A dark cobalt atlas that organizes the work and interests as connected map chapters. |
| **After Hours** | `/?look=afterhours` | An orange-and-charcoal poster with a Work / Play editorial switch. |

The existing internal appearance IDs `field`, `mono`, and `orbit` remain unchanged; the additions use `atlas` and `afterhours`.

## Run locally

```bash
npm install
npm run dev -- --port 3001
```

Open [localhost:3001](http://localhost:3001/). Direct preview links override random assignment.

## Checks and production preview

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run start -- --port 3001
```

Stop the development server before starting production on the same port. The commands above are the verification workflow; recorded results belong in `design-qa.md`.

## Appearance policy

A fresh arrival or reload chooses one of the five designs at random, using equal fifths of the random range. A random pick can repeat the previous design. Internal navigation and browser history retain the current choice. The palette button lets a visitor change it immediately.

Atlas defaults to **dark** mode; Seasons, The Original, The Lab, and After Hours default to **light**. Seasons and The Original also offer a dark-mode control; The Lab is a daylight scene. `src/lib/appearance.ts` initializes appearance and color mode before hydration. Selection is stored locally for navigation continuity, without a visitor identifier, analytics, or backend assignment. Invalid query/storage values and unavailable storage are handled defensively.

`/about` and `/experience` are preserved. They render separate pages in The Original, land on sections in Seasons and After Hours, and open the relevant story or chapter in The Lab and Atlas.

## Active source map

| Area | Files |
| --- | --- |
| Routing and selection | `src/components/ExperienceRouter.tsx`, `src/components/appearance-provider.tsx`, `src/components/AppearanceSwitcher.tsx`, `src/lib/appearance.ts` |
| Seasons | `src/experiences/SeasonalPortfolio.tsx`, `src/styles/seasonal.css` |
| The Original | `src/experiences/OriginalPortfolio.tsx`, `src/experiences/original/`, `src/styles/original.css` |
| The Lab interface | `src/experiences/LabExperience.tsx`, `src/styles/lab-experience.css` |
| The Lab scene and model | `src/components/LabScene.tsx`, `src/lib/lab-model.ts`, `src/styles/lab-scene.css` |
| The Lab story and project content | `src/lib/lab-stories.ts` |
| Atlas | `src/experiences/AtlasPortfolio.tsx`, `src/styles/atlas.css` |
| After Hours | `src/experiences/AfterHoursPortfolio.tsx`, `src/styles/afterhours.css` |
| Shared skills and ratings | `src/lib/skills.ts` |
| Shared appearance tokens | `src/styles/appearances.css` |
| Social sharing card | `src/app/social-preview/route.tsx` |

The earlier `MonochromeNotebook.tsx`, `OrbitDesktop.tsx`, and `ObservatoryScene.tsx` remain in the repository as archived design iterations. They are **not** mounted by the active router. The earlier `src/sections/` layouts are also not the active appearance entry points.

## Interaction and content

Seasons starts with the current Northern Hemisphere season and provides Spring, Summer, Autumn, and Winter controls. The choice changes the palette, landscape grading, and seasonal note. Career entries expand with native disclosure controls. Display typography is Georgia; body copy is self-hosted Satoshi.

The Original uses the recovered Inter font and original shadcn component styling. Its memo and skills radar are in `src/experiences/original/About.tsx`. Intentional additions to the original design are the appearance picker, Cornucopia’s two supplied destinations, and Thoughts / Coming soon. Font provenance and the included Inter license are documented in `src/experiences/original/README.md`.

The Lab contains nine story objects: Mickey in a lab coat, a terminal laptop, cells, a mouse, a robot arm, reagents, a snowboard, a bike, and a wetsuit. Hover previews an object’s story; click or tap opens a native modal. The object index provides equivalent keyboard-accessible buttons. Arrow keys adjust the focused scene, Home or Reset view restores the camera, and Escape closes a story. The scene renders on demand and provides a still fallback if WebGL is unavailable. It is loaded only for The Lab.

Atlas uses a dark cobalt map and chapter structure. After Hours uses oversized Barlow Condensed Bold typography and an editorial Work / Play switch. These are additions: the existing three experiences retain their own layouts and interactions.

Informal skill ratings come from `src/lib/skills.ts`. Bike is **75** and Swim is **45**, as requested by Mickey; the other values and The Original’s memo and radar presentation remain intact.

Every experience includes Thoughts marked **Coming soon**. Cornucopia links to [Discovery](https://discovery.cornucopiabio.com) and [the app](https://app.cornucopiabio.com). Preserve the existing employment facts and contact destinations when changing presentation.

The Original includes the opt-in ElevenLabs voice experiment in `src/experiences/original/OriginalVoice.tsx`. Microphone access begins only after Start conversation. The compact DNA indicator reflects real loading and voice connection states; it has no artificial delay. Reduced-motion styles keep it static.

## Assets and design records

The portrait and project screenshots live in `public/portrait.jpg` and `public/projects/`. Seasons uses `public/images/seasonal-ridge.webp`, a fictional alpine landscape generated with the built-in Image Generation skill, not a photograph of a trip Mickey took. Its exact generation prompt is recorded in `brand-spec.md`.

The Lab portrait retains the full source image at its natural aspect ratio. Seasons anchors its portrait crop at the top to keep Mickey’s hair in frame. The source photograph remains unmodified.

Space Grotesk, Satoshi, and After Hours’ Barlow Condensed Bold provenance is in `src/app/fonts/README.md`; the restored Inter font is documented in `src/experiences/original/README.md`. Barlow is bundled as a local TTF with its SIL Open Font License, obtained from the official Google Fonts repository. The Atlas and After Hours additions do not introduce newly generated images. Update `brand-spec.md` when intentionally changing a design’s direction, and keep test or visual review results in `design-qa.md`.
