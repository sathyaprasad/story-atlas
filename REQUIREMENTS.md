# Story Atlas Specification

## Product Goal
Story Atlas is a dark, cinematic, map-based explorer for curated and award-winning ArcGIS StoryMaps. It helps viewers discover strong examples by year, understand why each story is notable, and open the original StoryMaps directly.

## Experience Principles
- The first screen is the explorer itself, not a landing page.
- The app should feel cinematic, spatial, and polished while staying usable on common desktop and mobile viewports.
- The UI should stay focused on discovery; avoid explanatory helper copy inside the app unless it directly supports an action.
- Dark mode is the primary visual direction. A future light mode may adjust UI chrome, but the globe can remain dark and cinematic.

### Release Acceptance Criteria
- The app must satisfy the Accessibility Requirements acceptance criteria before release.
- The app must satisfy the Responsive UI Requirements acceptance criteria before release.
- The app must be verified in the in-app browser on at least one desktop viewport and one mobile-width viewport after visual or interaction changes.
- No release should introduce console errors, inaccessible icon-only controls, missing accessible names, keyboard-blocking story selection, or overlapping text on common desktop/mobile viewports.

## Brand And Assets
- App name: Story Atlas.
- Source/product label: ArcGIS StoryMaps, preserving trademark casing.
- Page header uses text for the Story Atlas name; the supplied logo image is not shown in the page header.
- App icon uses the repo-local `assets/story-atlas-logo.png` image supplied by the user.
- Globe texture uses the repo-local `assets/world.jpg` image supplied by the user.

### Acceptance Criteria
- Browser title is `Story Atlas`.
- `index.html` references `assets/story-atlas-logo.png` as favicon/app icon.
- The visible header contains `ArcGIS StoryMaps` and `Story Atlas`.
- No generated or remote replacement image is used for the globe texture.

## Data Contract
- Story data lives in `stories.json`, grouped by year.
- External content URLs used by story data are tracked in `DATA_SOURCES.md` for review and audit.
- Supported years are `2026`, `2025`, and `2024`.
- New stories should be addable through `stories.json` without editing story-rendering logic in `app.js`.
- Each story entry must include:
  - `title`: display title.
  - `place`: human-readable location or representative region.
  - `lat`: decimal latitude.
  - `lon`: decimal longitude.
  - `theme`: category shown in the detail panel and carousel card.
  - `award`: award/year label shown in the detail panel.
  - `url`: direct StoryMaps URL.
  - `summary`: short story description.
  - `strength`: highlights shown in the detail panel.
  - `color`: legacy/fallback story color.
- Valid story URLs must start with one of:
  - `https://storymaps.arcgis.com/stories/`
  - `https://storymaps.arcgis.com/briefings/`
  - `https://storymaps.arcgis.com/frames/`
- Story coordinates may use representative center points for regional or global stories.

### Acceptance Criteria
- JSON parsing succeeds with no runtime errors.
- Every story has all required fields.
- Every `lat` and `lon` value is numeric.
- Every `url` uses one of the allowed direct StoryMaps URL prefixes.
- `DATA_SOURCES.md` is updated whenever `stories.json` story URLs change.
- Selecting a year updates the visible stories without changing `stories.json`.

## Theme Color Contract
- Theme color is the shared visual identity for story themes.
- `app.js` owns the theme-level color map.
- Story card theme text and globe pins must use the same theme-level color for a given theme.
- Story-level `color` remains available only as a fallback for themes missing from the theme color map.

### Current Themes
- Conservation
- Digital Humanities
- Environment
- Health and Safety
- Humanitarian Response
- Infrastructure
- Nature
- People
- Planning and Infrastructure
- Research

### Acceptance Criteria
- Every theme in `stories.json` has a theme color in `app.js`.
- Card theme text uses the story's resolved theme color.
- Pin base, halo, and stem use the story's resolved theme color.
- Theme text contrast should meet WCAG AA for normal text against the card background.
- Active cards and pins must not rely on color alone; they also need shape, border, scale, pulse, or state changes.

## Globe Requirements
- Use Three.js for the main map/globe.
- Globe should feel abstract and cinematic, inspired by 2050.earth, while staying readable.
- Globe uses a UV sphere with the local `assets/world.jpg` equirectangular texture.
- Globe includes subtle graticule lines, atmosphere, stars, story pins, and one active story label.
- Globe must not use generated green land patches, cyan dotted land clusters, filled land blobs, or noisy procedural speckles.
- Selecting a story rotates the globe so the active pin is centered toward the camera.
- Only the active pin label is visible.
- Only the active pin pulses; inactive pins remain steady.
- Users can drag the globe, but carousel/story selection remains the accessible primary selection path.

### Acceptance Criteria
- `#render-health` becomes `Three.js render active` after a successful render.
- Selecting a story updates the active pin, active label, detail panel, and focused globe position.
- Changing years hides pins from other years.
- Inactive pins do not pulse.
- The active label remains limited to the selected story.

## Year Selection Requirements
- Year selector lives in the top-right header area.
- Selecting a year updates:
  - story count.
  - carousel stories.
  - active detail panel.
  - visible pins.
  - focused globe position.
- The first story in the selected year becomes active.

### Acceptance Criteria
- The active year control exposes selected state.
- Story count matches the number of entries for the selected year.
- Switching years resets the autoplay timer.
- Switching years does not require a page reload.

## Story Detail Requirements
- Story detail panel shows:
  - theme/category.
  - award/year label.
  - title.
  - summary.
  - place.
  - highlights.
- Primary action is `Open story`.
- `Open story` opens the current story URL in a new tab.
- The visible action text stays compact as `Open story`.
- The accessible name for the link is `Open story in new tab`.
- Clicking `Open story` pauses autoplay before the story opens, keeping the explorer on that story.
- Secondary panel actions use compact icon-only controls aligned to the right of the primary action.
- On mobile-width viewports, the story detail panel can collapse to reveal more of the globe.

### Acceptance Criteria
- Detail content updates when the active story changes.
- Open story link `href` matches the active story URL.
- Open story link has `target="_blank"` and `rel="noreferrer"`.
- Open story link exposes the accessible name `Open story in new tab`.
- Autoplay is paused immediately when the Open story link is clicked.
- Mobile story detail collapse control exposes expanded/collapsed state and updates its accessible name.

## Carousel Requirements
- Story list is a horizontal carousel.
- Carousel cards are generated from the selected year's stories.
- Clicking a card selects that story.
- Active card scrolls into view automatically.
- Active card exposes `aria-current="true"`.

### Acceptance Criteria
- Carousel contains only stories from the selected year.
- Active card changes when autoplay advances, a card is clicked, a pin is clicked, or the year changes.
- Active card is visually distinguishable without relying only on color.
- Active card scrolls into view when selection changes.

## Autoplay Requirements
- Autoplay starts enabled when the app loads.
- Every 10 seconds, autoplay advances to the next story in the selected year.
- Advancing updates the selected card, story detail panel, active pin, active label, and centered globe focus.
- The detail panel contains a play/pause control for autoplay.
- The detail panel shows a subtle progress indicator for the 10-second interval.
- Autoplay resets when the user manually selects a story or changes year.

### Acceptance Criteria
- Autoplay button exposes `aria-pressed`.
- Autoplay button accessible label changes between `Pause autoplay` and `Play autoplay`.
- Pausing autoplay stops automatic advancement and clears the progress indicator.
- Resuming autoplay starts a fresh 10-second interval.
- Years with fewer than two stories do not schedule unnecessary advancement.

## Accessibility Requirements
- The app must keep a meaningful heading structure with one visible `h1`.
- Decorative canvas, scanline, icon spans, and visual-only globe labels must be hidden from assistive technology when they duplicate accessible content elsewhere.
- Main regions should be labelled where helpful:
  - interactive globe region.
  - story details panel.
  - story list navigation.
  - year selector.
- Icon-only controls must have accessible names.
- Open story link must communicate that it opens a new tab.
- Keyboard users must be able to select stories through the carousel and year selector.
- Color must not be the only selected/active state indicator.

### Acceptance Criteria
- Browser accessibility tree exposes `Story Atlas` as a heading.
- Year controls expose selected state.
- Story detail panel exposes title, summary, place, highlights, and actions.
- `Show on map`, `Pause autoplay`, and `Play autoplay` are named controls.
- Story detail collapse/expand control is named and exposes `aria-expanded`.
- Card selection is available through focusable buttons.
- Keyboard focus states are visible for links, year controls, carousel cards, and icon buttons.
- Open story link exposes `Open story in new tab` as its accessible name while keeping compact visible text.
- Story selection is not dependent on pointer-only globe pin interaction; the carousel remains the keyboard-accessible selection path.
- Visual-only globe labels do not duplicate all story labels into the accessibility tree.
- No meaningful image lacks alt text; decorative/non-content imagery is hidden or used only as an app icon.

## Responsive UI Requirements
- Text should not overlap on common desktop and mobile viewports.
- Cards, controls, and panels should use stable dimensions so hover, labels, icons, and dynamic content do not shift layout unexpectedly.
- Mobile layout may stack metadata and reposition the detail panel above the carousel.
- Avoid page-level scrolling on desktop; mobile may scroll when needed.

### Acceptance Criteria
- Header, year selector, detail panel, globe label, and carousel do not overlap incoherently at common desktop widths.
- At mobile widths, story detail content remains readable and controls remain tappable.
- At mobile widths, users can collapse the story detail panel to view more of the globe.
- At mobile widths, the year selector, Open story link, icon controls, and carousel cards remain reachable without horizontal page scrolling.
- Text in buttons, cards, the detail panel, and the year selector fits within its container without clipping or covering adjacent UI.
- Tap targets for primary actions, year controls, carousel cards, and icon buttons remain large enough for touch interaction.
- Carousel remains horizontally scrollable.

## Analytics And Runtime Requirements
- Vercel Speed Insights should be initialized from the vanilla JavaScript entry for deployed Vercel traffic.
- Speed Insights must not add visible UI.
- Localhost development should not inject the Vercel Speed Insights runtime request, avoiding expected local 404 noise from the Python static server.

### Acceptance Criteria
- Non-localhost pages call `injectSpeedInsights()`.
- Localhost pages skip Speed Insights injection.
- Local Python server logs do not show expected Speed Insights 404 noise after reload.

## Non-Goals
- No landing page.
- No search or theme filtering for now.
- No visible logo image in the page header.
- No generated procedural land masses or decorative map speckle overlays.
- No complex routing or build system; the app remains vanilla HTML/CSS/JS.
- No server-side data dependency; `stories.json` is the source of truth.

## Verification Checklist
- Start local server, usually `python3 -m http.server 5173` or another available port.
- Open the app in the in-app browser at localhost.
- Verify Three.js render health is active.
- Verify browser console warnings/errors.
- Verify story data loads and the default year is populated.
- Verify direct StoryMaps URL prefixes.
- Verify year switching updates story count, carousel, detail panel, pins, and globe focus.
- Verify autoplay advances after 10 seconds and can pause/resume.
- Verify Open story pauses autoplay before opening a new tab.
- Verify mobile story detail panel collapse and expand behavior.
- Verify the accessibility tree contains expected landmarks, labels, and selected states.
- Verify theme color contrast for card theme text.
- Verify keyboard navigation can reach year controls, story cards, Open story, Show on map, and autoplay controls.
- Verify no text overlap, clipping, or unreachable controls on desktop and mobile-width viewports after visual changes.
