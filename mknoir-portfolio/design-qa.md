# Portfolio redesign QA

Date: 2026-10-08. Branch: `mickey/portfolio-field-notes`.

## Result

Implementation and local production preview passed the checks below. Not deployed. The existing root `index.html` change was preserved.

## Automated verification

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; homepage, About, Work, and social preview prerender successfully.
- `git diff --check`: passed.
- Social preview response: valid 1200 × 630 PNG, visually inspected.

## Browser verification

Checked in the Codex Chromium browser at 1440 × 1000, 800 × 900, 390 × 844, and 320 × 800.

- Hero, featured project images, Thoughts, About, Work, contact, and both themes visually inspected.
- Homepage has no horizontal overflow at 320, 390, 800, or 1440 pixels; About and Work also fit at 390.
- Portrait, featured project previews, and all Work logos load.
- Primary route links and home anchors resolve. Thoughts is explicitly Coming soon; no fabricated article links.
- Mobile menu opens, closes on its backdrop and Escape, restores focus, and releases the body scroll lock. Switching to desktop size also closes it.
- Closed mobile-menu links are excluded from keyboard navigation. Tab from the menu trigger reaches the visible hero action without horizontal scrolling.
- Menu navigation from About to Thoughts closes the dialog and releases scroll lock in the production preview.
- More experiments expands to reveal seven retained project links.
- Back to top stays on the current page and focuses the main content.
- Contact links retain their existing mail, telephone, GitHub, and LinkedIn destinations.
- Reduced-motion styles disable smooth scrolling and nonessential transitions.

## Scope and limits

The voice assistant is opt-in and clearly identified as AI with a synthetic voice. Its permission, cancellation, retry, error, and cleanup logic was reviewed. An actual microphone session was not started; live ElevenLabs connectivity and conversational behavior are unverified. No email, phone call, or external message was sent. Cross-browser Safari and Firefox testing was not performed.

Existing employment titles, dates, and quantitative claims were preserved, not independently reverified. Cornucopia and Thread of Life project imagery comes from current live sites; the portrait comes from the existing workspace.

## Evidence

Screenshots: `/Users/Mickey/.codex/visualizations/2026/10/06/01a111a1-6041-7aa3-961f-fdb98fb8193f/portfolio-redesign/`.

Main final captures: `13-home-production.png`, `14-thoughts-production.png`, `15-home-production-mobile.png`.

Some Playwright screenshots omitted sticky-header compositing after scrolling; a direct browser screenshot confirmed the header renders and remains interactive. Final captures use the direct browser screenshot method.

Local production preview: http://localhost:3001.

## Follow-up: Cornucopia destinations, shadcn, and DNA

- Cornucopia has separate Discovery and Open app actions, both using the exact requested domains. The hero links to the project card so both choices are visible.
- Existing shadcn Button, Card, and Badge components now drive featured projects, Thoughts, the primary hero action, and the voice card. Shared control sizes are 44–48px; base resets no longer override component foreground colors.
- Replaced the old timed overlay with a reusable DNA component and a genuine Next route-loading fallback. Voice uses a static helix while idle and animated helix during pending/closing states. No new dependencies or loading delays.
- Server-rendered smoke checks cover nine DNA rungs, idle/connecting/connected voice states, a single voice live region, route-loading markup, and reduced-motion CSS. ElevenLabs was mocked; zero microphone sessions started.
- Browser inspection confirms the idle DNA uses animation-name: none and both Cornucopia actions use correct destinations, contrasting colors, and 44px targets.
- Repeated fragment navigation is handled by native anchors so selecting the same section can scroll back to it reliably.
- Final lint, TypeScript, production build, and diff checks pass. Updated desktop cards and dark-mode DNA card were visually checked; no horizontal overflow at 320, 390, or 1440px. Repeating Projects correctly restores the section to the 104px header offset. Browser error log is empty.
- Follow-up captures: `17-projects-shadcn-desktop.png`, `18-projects-shadcn-mobile.png`, and `19-dna-shadcn-mobile-dark.png` in the evidence folder above.

## Follow-up: Three rotating appearances

- Field Notes preserves the warm design; Monochrome uses a centered black-and-white presentation; Orbit adds an interactive Three.js DNA sculpture. About and Work share each appearance's tokens and layout treatment.
- Fresh arrivals and reloads randomly select one of three looks with equal probability. The same look can be selected again. Internal navigation and back/forward preserve the selection. Explicit `?look=field`, `?look=mono`, and `?look=orbit` URLs provide stable review links.
- The palette dialog changes designs immediately, traps focus, closes on Escape/backdrop, restores trigger focus, and releases its scroll lock. The light/dark toggle remains independent after selection.
- Eleven automated bootstrap tests pass, covering random boundaries, reloads, internal navigation, history, explicit URLs, invalid values, storage failures, and system color mode. Lint, TypeScript, production build, and diff checks pass.
- Production-browser checks confirmed randomization on reload, preservation through About and Home, all three desktop appearances, and mobile layouts down to 320px without horizontal overflow. The picker was checked at 390px and 320px; Escape and focus restoration were verified.
- Orbit rendered a live WebGL scene on desktop and at 320px. Pause/play, keyboard rotation, and reset worked. Orbit light mode also rendered correctly. Navigating away removed the canvas; other appearances do not mount it. Final browser error/warning log was empty.
- Three.js is lazy-loaded only for Orbit. Rendering is capped for phones and stops while paused, offscreen, or hidden. Reduced-motion handling and static WebGL-failure fallback were reviewed in source but not simulated in the browser. Cross-browser and physical-device testing remain unperformed.
- Fixed a provider initialization effect that initially reapplied a stale color mode after manual appearance changes; rebuilt and verified both Monochrome and Orbit initialize dark and the theme toggle stays functional.
- Captures: `20-field-appearance.png`, `21-design-picker.png`, `22-monochrome-desktop.png`, `23-orbit-desktop.png`, `24-picker-mobile.png`, `25-monochrome-mobile.png`, `26-orbit-mobile.png`, and `27-orbit-mobile-light.png`.

## Follow-up: Independent notebook and desktop experiences

- Replaced the shared structure for Monochrome and Orbit with separate dynamically mounted experiences and their own navigation, hierarchy, and interactions. Field Notes retains its warm homepage and route layouts; verified its portrait, content, and sticky navigation still render correctly.
- Recovered the original memo from `HEAD:mknoir-portfolio/src/sections/About.tsx`, retained the science/hardware/software argument and personal details, and edited repetitive/abstract prose. Restored all ten original radar values. Monochrome now leads with the essay, followed by the stack/radar, life, project index, work history, Thoughts, and contact.
- Orbit uses the visually inspected Eddy Naboulet site as a reference for spatial desktop navigation and file windows, with an original scientific particle scene and portfolio content. Cornucopia, Thread of Life, and seven small experiments are accessible through the file browser. Native dialogs support focus trapping, Escape/backdrop dismissal, maximize/restore, and bounded desktop dragging.
- Fixed a development StrictMode WebGL initialization failure: forced context loss during effect cleanup invalidated the canvas before React reused it. Resource/listener cleanup remains; the corrected live particle scene renders successfully in both development and production.
- Verified production at 1440px and 320px, and the notebook radar at 390px during development. No page overflow at 320px. Orbit's mobile project sheet is 304px wide in a 320px viewport, with its content contained. The live scene reports ready, pause/play works, and selecting Monochrome removes the canvas and releases the scroll lock.
- Verified project selection, both Cornucopia destinations, window maximize, Escape focus return, and dragging (55px horizontal / 30px vertical). Manual appearance selection now updates an existing explicit preview query to match the chosen look.
- Verified notebook deep link `#skills` clears the sticky navigation (154px on mobile), `/experience?look=mono` opens the work section, and `/about?look=orbit` opens the profile file. Dynamic mounting restores deep links after content becomes available. Unknown routes retain their existing error content.
- Lint, TypeScript, all 11 appearance-policy tests, production build, and diff check pass. The final production browser error/warning log is empty. No microphone session started. Physical phones and other browser engines were not tested; reduced-motion and WebGL fallback paths were reviewed in source.
- Final evidence in the existing screenshot directory: `28-orbit-desktop-mobile.png`, `29-orbit-file-mobile.png`, `30-notebook-mobile.png`, `31-notebook-radar-mobile.png`, `32-monochrome-notebook-desktop.png`, `33-orbit-desktop-final.png`.
- Local production preview runs on port 3001. No deployment, commit, or push performed.

## Follow-up: Original, Seasons, and the explorable lab

- Restored The Original from Git HEAD and visually compared its desktop hero with the live `www.mknoir.com` site. Original Inter, centered hero, pill buttons, navigation, project cards, full About memoir, and ten-value radar are present. Cornucopia links, Thoughts, the appearance picker, responsive controls, and the safer opt-in voice lifecycle remain additive.
- Seasons is a separate landscape-led field guide with four functional season choices, a month-based default, serif typography, portrait essay, outdoor interests, project prints, expandable work history, and Thoughts. Generated landscape provenance and the exact prompt are recorded in `brand-spec.md`.
- The Lab is a real Three.js cutaway room, inspired by the spatial presentation at `growon.kr`. Nine objects map to individual stories: Mickey, laptop, cells, mouse, robot arm, reagents, snowboard, bike, and wetsuit. The room supports pointer exploration, object selection, bounded camera dragging, keyboard camera controls, reset, and an accessible object index. Story sheets use native dialogs, Escape, pagination, focus restoration, and body-scroll cleanup.
- Browser checks covered direct 3D selection of the laptop, mouse, and robot arm; the cells through the object index; camera drag/reset; Thoughts; story pagination; and return focus to the original Cells trigger after advancing to Mouse. Cornucopia Discovery and App destinations were checked in the story and seasonal project entry. No microphone session was started.
- Checked the three designs at desktop sizes (1257/1280/1440px) and phone sizes (320/390px). No horizontal page overflow was found. The lab renders on a 320px screen; its reset control and object index remain within the viewport. Original radar labels fit at 320px, the `#skills` link settles at the 56px header offset, and the mobile menu supports Escape/focus return and dark mode. Seasonal controls, dark mode, project anchors, and phone homepage were checked.
- Corrected overlapping scene controls, a mobile text spacing issue, transform-sensitive anchor placement, small-label contrast, and pagination overwriting the original focus target. Updated the removed Three.js PCFSoftShadowMap constant to PCFShadowMap. Final production browser warning/error log is empty.
- The scene renders on demand, suspends while hidden/offscreen, caps phone pixel density, and has a static WebGL fallback. The fallback and reduced-motion paths were reviewed in source; a forced WebGL failure and physical devices were not tested. A source-level camera-ray audit found visible hit surfaces for all nine objects.
- Lint, TypeScript, production build, and diff check pass. All 11 appearance-policy tests pass. Fresh visits/reloads still randomize; internal/history navigation stays consistent, and explicit look URLs remain stable. All three designs start light; The Original and Seasons retain their own dark-mode controls.
- Local production preview is running at `http://localhost:3001` with The Lab left open. No commit, push, or deployment performed; the unrelated pre-existing root `index.html` edit remains untouched.
- Evidence in the existing screenshot directory: `34-lab-first-desktop.png`, `35-lab-laptop-story.png`, `36-lab-phone.png`, `37-original-restored-desktop.png`, `38-original-skills-phone.png`, `39-seasons-desktop.png`, `40-seasons-phone-winter.png`, `41-seasons-projects-phone.png`, `42-seasons-home-phone.png`, `43-original-skills-final-phone.png`, `44-lab-final-phone.png`, and `45-lab-final-desktop.png`. Captures 34–42 precede the final small polish fixes; 45 is the final desktop lab.

## Follow-up: Atlas, After Hours, and portrait details

- Added two independent, dynamically loaded experiences while preserving Seasons, The Original, and The Lab. Atlas uses a cobalt concept map with an ivory chapter reader. After Hours uses locally hosted Barlow Condensed and a Work / Play switch that changes the hero, palette, and content order. Section numbers track the visible order in either mode.
- Five designs now participate in fresh-visit randomization. The picker exposes all five, fits at 320×740, and updates an explicit preview URL when switching. Eleven appearance-policy tests cover equal fifths, reloads, internal/history continuity, invalid values, and storage failures.
- Fixed The Lab's portrait by using the source's natural 1892:2832 ratio, rendered at 140×209px. Verified the full head and shoulders in the desktop story sheet and its layout at 320px. Seasons now crops from the top to retain the head; new Atlas and After Hours portraits use their full image proportions. Neutral alt text does not invent a location.
- Centralized ratings in `src/lib/skills.ts`: Bike 75 and Swim 45. Browser inspection confirms both values in The Original's accessible radar data, Atlas's outdoor chapter, and After Hours's interest panels. All other values remain unchanged.
- Checked new layouts at 1440px, 800px, and 320px; no horizontal page overflow. Atlas's 800px split reader also contains its content. Verified chapter selection, Escape close/focus return, browser Back, and mobile reading starting at the top. Atlas navigation labels are at least 12px; functional captions are at least 11px. Decorative SVG annotations are hidden from assistive technology.
- Verified After Hours's Work / Play order change, project selector, both exact Cornucopia URLs, full phone portrait, and About/Cornucopia deep links. At 320px, anchors clear the actual 72px header. Cream headlines on the final orange have 3.19:1 contrast; charcoal text has 4.70:1. Atlas's three text pairs range from 5.32:1 to 8.77:1.
- Final lint, TypeScript, all 11 automated tests, production build, and diff check pass. Build prints the existing stale Browserslist database advisory. Browser error/warning logs were empty during this pass. No microphone sessions, messages, deployments, commits, or pushes.
- Browser validation used the local in-app browser with viewport emulation. Physical devices, Safari, and Firefox remain untested. New reduced-motion styles were reviewed in source; no OS motion-preference change was made.
- Evidence: `46-lab-portrait-before.png`, `47-lab-portrait-fixed.png`, `48-atlas-desktop.png`, `49-atlas-reading-desktop.png`, `50-atlas-reading-phone.png`, `51-five-design-picker-phone.png`, `52-afterhours-work-phone.png`, `53-afterhours-ratings-phone.png`, `54-afterhours-portrait-phone.png`, `55-afterhours-work-desktop.png`, `56-afterhours-play-desktop.png`, `57-original-updated-skills-phone.png`, `58-seasonal-portrait-fixed.png`, `59-atlas-phone-final.png`, and `60-afterhours-final-desktop.png`. Captures 48–56 precede the final caption-size, contrast, and section-number polish.
- Production preview remains at `http://localhost:3001`. Stable new review links are `/?look=atlas` and `/?look=afterhours`.

## Follow-up: Cornucopia Discovery screenshot

- Replaced the old marketing homepage preview with Mickey's supplied 1810×1024 screenshot of the Discovery Full Lab Team page. The new descriptive asset path avoids cached copies of the old image; all active and archived screenshot references now use it. The Original retains its existing text-only project cards.
- Updated image dimensions and alt text. Seasons and The Lab now retain the complete screenshot instead of applying a cover crop; Atlas already uses natural dimensions, and After Hours uses contain. Discovery and App destinations are unchanged.
- Lint, TypeScript, production build, and diff checks pass. SHA-256 confirms the asset is identical to the supplied image. The local server returns the exact asset and the Next Image optimized response with HTTP 200. Crop rules were reviewed in source; fresh browser screenshot comparison was not performed in this pass.
