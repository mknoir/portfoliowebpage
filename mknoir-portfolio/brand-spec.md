# Mickey Makhija — five independent experiences

## Direction

Mickey’s portfolio should have five distinct identities: the familiar mknoir.com, an outdoorsy seasonal field guide, an explorable laboratory, a dark cobalt atlas, and a bold Work / Play editorial poster. Each experience owns its navigation, layout, typography, and hierarchy. They should feel like different ways of getting to know the same person, rather than recolored versions of one page.

The active names and stable internal IDs are **Seasons** (`field`), **The Original** (`mono`), **The Lab** (`orbit`), **Atlas** (`atlas`), and **After Hours** (`afterhours`). `ExperienceRouter` mounts one at a time. The earlier personal notebook and retro desktop remain archived source iterations; `MonochromeNotebook.tsx`, `OrbitDesktop.tsx`, and `ObservatoryScene.tsx` are not active experiences.

Protect the existing three designs when adding Atlas and After Hours. Keep their navigation, hierarchy, typography, and content intact, apart from the shared ratings update and portrait framing corrections requested by Mickey.

Audience: scientific collaborators, technical teams, and people curious about Mickey. Keep the voice direct and personal. Preserve actual work, dates, project destinations, and contact details. Do not invent race results, medals won, travel history, company ownership, project outcomes, or professional responsibilities. Thoughts is an honest **Coming soon** placeholder in every design.

## The Original

Source: the original mknoir.com section components and shadcn button/card styling recovered from the repository’s original Git HEAD. Match that existing site’s centered composition, black-and-white colors, compact navigation, cards, and separate About and Work pages.

The long personal memo and original skills radar belong here. Retain the personal material and the original chart rather than replacing them with a short generic biography. The homepage retains the original sequence of introduction, About preview, projects, voice experiment, and contact. Thoughts / Coming soon is a small addition.

The canonical informal ratings are in `src/lib/skills.ts`. Mickey’s latest values are Bike **75** and Swim **45**. Preserve the remaining ratings and the original radar presentation.

Typography: recovered Inter variable font, locally bundled at `src/experiences/original/Inter-Latin.woff2`. The font matches the existing personal site’s asset at `https://www.mknoir.com/_next/static/media/83afe278b6a6bb3c-s.p.3a6ba036.woff2`. Provenance and SIL Open Font License are included in `src/experiences/original/README.md` and `Inter-OFL.txt`.

Colors and components: neutral shadcn tokens, white/light default, black text, quiet gray borders, original rounded controls. Dark mode remains available. All restoration styles stay under `.original-portfolio` in `src/styles/original.css`.

Intentional changes from the recovered source are the appearance picker, Cornucopia Discovery and App destinations, Thoughts / Coming soon, and current voice connection handling. Voice remains explicitly opt-in and identifies itself as AI. The DNA indicator animates for real connecting/closing states, never to impose a decorative wait.

## Seasons

An outdoor field guide with its own reading order: alpine horizon and identity, a numbered route index, a short personal essay and portrait, outdoor interests, project prints, expandable work history, a page for future thoughts, and contact.

Typography: Georgia for expressive serif display and editorial headings; self-hosted Satoshi for body copy, navigation, and labels. The natural system serif is intentional. Do not substitute the technical display font used by The Lab.

Base palette: warm paper `#f2efe5`, fir ink `#30382c`, muted text `#646b5d`, burnt amber `#925239`, deep green `#283d2e`. Fine rules, generous editorial margins, slightly angled project prints and portrait, and contour-line artwork provide the visual language. Avoid a uniform grid of rounded cards.

Spring, Summer, Autumn, and Winter controls change the palette, landscape grading, and seasonal note. The initial season follows the current local month using Northern Hemisphere seasons. Autumn is the neutral initial render. Seasons also supports a dark reading mode. The season choice is a visual setting, not a claim about current weather or Mickey’s whereabouts.

Phone layouts keep the landscape opening, collapse editorial columns into a deliberate reading order, and preserve the field-guide index. Keep touch controls usable and motion limited to short interaction feedback. All local styling remains scoped to `.seasonal-*` in `src/styles/seasonal.css`.

The portrait crop is anchored at the top, preserving the full hairline. Keep the source photograph unmodified.

## The Lab

A small, daylight-filled laboratory built with real Three.js geometry. The reference is the explorable room and object-led storytelling of [growon.kr](https://growon.kr/), translated into Mickey’s scientific workspace and interests. The scene is its own navigation system, not a decorative canvas above a conventional portfolio stack.

Typography: self-hosted Space Grotesk headings with Satoshi body copy. Palette: pale sage `#e8ece7`, dark green ink `#273830`, warm off-white story sheets, soft daylight and shadows, muted cabinet colors, and restrained warm material accents. The default presentation is light.

Nine objects carry the narrative:

| Object | Story |
| --- | --- |
| Mickey in a lab coat | Introduction and interests |
| Terminal laptop | Scientific software, machine learning, and Cornucopia |
| Cell cultures | In vitro work, iPSCs, and molecular assays |
| Mouse | In vivo experimental background |
| Robot arm | Robotics and lab automation |
| Reagents | Sample preparation, PCR, assays, and hands-on lab work |
| Snowboard | Snowboarding and time in the mountains |
| Bike | Cycling, running, and time outside |
| Wetsuit | Swimming and learning |

The model may contain decorative medals beside the wetsuit, following Mickey’s requested scene ideas. Do not attach invented awards, race names, finish times, or sporting achievements to them. The character and room are stylized representations, not a reconstruction of a specific real laboratory or physical appearance.

Hover highlights an object and previews its story. Click or tap opens a native modal with a longer story and relevant links. The object index supplies keyboard-accessible buttons for the same content. Arrow keys change the focused camera view; Home and Reset view restore it. Escape and the close control return to the room. Navigation also offers project, work, Thoughts, and contact panels.

The Three.js renderer loads only for The Lab. It renders on demand, limits mobile rendering cost, pauses work when hidden/offscreen, and disposes its resources on unmount. If WebGL is unavailable, a still composition accompanies the story controls. Avoid a continuous camera orbit or decorative loading timer. Global reduced-motion preferences apply to interface transitions.

Source ownership: `src/experiences/LabExperience.tsx` for interface and dialogs, `src/components/LabScene.tsx` for rendering and interaction, `src/lib/lab-model.ts` for procedural geometry, and `src/lib/lab-stories.ts` for the object stories and project destinations.

The profile sheet displays the portrait at its natural 1892:2832 aspect ratio, 140px wide with automatic height. Do not reintroduce a centered cover crop that trims the top of Mickey’s head. Its alt text identifies Mickey without inventing a location.

## Atlas

A dark cobalt atlas with map chapters for work, projects, and interests. The map and its connections establish the reading order, while chapter content provides the detail. This is a separate composition from The Lab’s room and Seasons’ field guide.

Design read: an additional portfolio experience for scientific collaborators and curious visitors, using an expressive map-led identity while preserving the existing designs. Dials: **8 / 3 / 6 / 3 / 4** for visual variance, motion intensity, information density, asset dependence, and brand fidelity, respectively. Let map structure carry the identity, group chapter detail for scanning, and use restrained motion to clarify selection and connections. Keep chapter content reachable on phones and by keyboard.

Default color mode: dark. Source: `src/experiences/AtlasPortfolio.tsx` and `src/styles/atlas.css`. Reuse established facts and project destinations; do not add invented biographical details to map labels.

## After Hours

An editorial poster in orange and charcoal. An explicit Work / Play switch separates the scientific and technical side from outdoor interests. Oversized condensed typography, strong rules, and asymmetric editorial composition give this experience its own hierarchy. Orange `#e95324` gives cream `#f4efdf` large headlines 3.19:1 contrast and charcoal `#1b1b1b` body text 4.70:1 contrast. Section numbers follow the visible order in each mode.

Design read: an additional portfolio experience for the same audience, using a bold type-led editorial identity while preserving the existing designs. Dials: **8 / 3 / 5 / 4 / 4** for visual variance, motion intensity, information density, asset dependence, and brand fidelity, respectively. Give the Work / Play views different editorial rhythms, use existing imagery selectively, and keep the switch and reading order clear at phone widths. Use motion as interaction feedback.

Display typography: self-hosted Barlow Condensed Bold, bundled as `src/app/fonts/BarlowCondensed-Bold.ttf` with `BarlowCondensed-OFL.txt`. Source and license provenance are recorded in `src/app/fonts/README.md`, using the official [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/barlowcondensed).

Default color mode: light. Source: `src/experiences/AfterHoursPortfolio.tsx` and `src/styles/afterhours.css`. Preserve the supplied skill ratings and distinguish personal interests from professional claims. Atlas and After Hours require no new generated imagery.

## Appearance and navigation policy

Mickey explicitly chose **randomize every visit**. A fresh arrival or reload selects among the five designs in equal fifths of the random range. Repeats are possible. Internal navigation and browser history retain the selected appearance for continuity. The palette control permits manual selection.

Atlas defaults to **dark**; all four other designs default to **light**. The Original and Seasons offer dark-mode controls. A fresh selection applies its default; normal internal navigation preserves the current color preference.

Direct review URLs intentionally override randomization:

- `/?look=field` — Seasons
- `/?look=mono` — The Original
- `/?look=orbit` — The Lab
- `/?look=atlas` — Atlas
- `/?look=afterhours` — After Hours

The existing `/`, `/about`, and `/experience` routes remain available. About and Work map to each experience’s own page, section, or panel. The head initializer and appearance provider own selection; CSS and content files should not add competing assignment logic. Session storage provides local continuity without tracking a visitor or assigning a server identity.

Cornucopia has two explicit destinations supplied by Mickey: `https://discovery.cornucopiabio.com` and `https://app.cornucopiabio.com`. Preserve both wherever a full Cornucopia project entry appears.

## Asset provenance

- `public/portrait.jpg`: existing user photo, copied unmodified from `../20260114-93.jpg`. Next Image handles delivery optimization.
- `public/avatar.jpg`: existing avatar used by The Original and the social preview.
- `public/projects/cornucopia.png`: actual Cornucopia homepage capture from the portfolio work.
- `public/projects/thread-of-life.png`: actual Thread of Life homepage capture from the portfolio work.
- `public/logos/`: original company logos. The suspect mislabeled Optimized Foods asset is not used as evidence of that company’s identity.
- `src/app/fonts/`: self-hosted Space Grotesk and Barlow Condensed Bold from Google Fonts, and Satoshi from Fontshare, with license references in that directory. Barlow’s local TTF and SIL Open Font License come from the official Google Fonts repository.
- `src/experiences/original/Inter-Latin.woff2`: original site’s Inter variable font; its provenance and license are bundled alongside it.
- `public/images/seasonal-ridge.webp`: generated with the built-in Image Generation skill (`imagegen`). A fictional alpine autumn landscape used as decorative scenery; it is not presented as a photograph Mickey took or a place he visited.
- The Lab’s room, furniture, character, equipment, and sports objects are procedural geometry authored in `src/lib/lab-model.ts`; the scene uses no third-party 3D model download.

Exact image-generation prompt for `seasonal-ridge.webp`:

```text
Use case: photorealistic-natural. Asset type: wide landscape background for a personal outdoors-themed portfolio. Create a cinematic, realistic alpine landscape photograph in a wide 16:9 composition. Layered craggy mountain ridges, autumn ochre grasses in the foreground, dark evergreen forest in the midground, soft mist in distant valleys, a quiet pale blue-gray sky occupying the upper third. Natural late afternoon light, restrained colors, rich atmospheric depth, tactile grass and rock detail. A peaceful editorial travel photograph, no dramatic oversaturation. No people, no buildings, no text, no logos, no watermark. The location is fictional rather than a claim about a real place visited.
```

## Maintenance

Keep presentation separate between experiences while preserving the same underlying person, employment facts, and destinations. The Original’s source is the reference for existing personal and career content. Only the active experience should mount its heavy interactive code.

Do not turn a design specification into a verification log: commands, visual checks, failures, and limitations belong in `design-qa.md`. No new analytics, tracking, contact form backend, or deployment behavior is part of this design change. Preserve the user’s existing edit in the root legacy `index.html`.
