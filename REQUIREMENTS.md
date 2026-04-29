# Story Atlas Requirements

## Product Goal
Story Atlas is a dark, cinematic, map-based explorer for curated and award-winning ArcGIS StoryMaps. It should help viewers discover strong examples by year and open the original StoryMaps directly.

## Current Experience
- App name: Story Atlas.
- Source/product label: ArcGIS StoryMaps, preserving trademark casing.
- First screen is the explorer itself, not a landing page.
- Primary visual is a Three.js UV sphere using `assets/world.jpg` as a dark equirectangular Earth texture, plus subtle graticule, atmosphere, story pins, and one active story label.
- Dark theme with glass panels, neon green year selector, cyan globe accents, and restrained category colors.

## Story Data
- Years available: 2026, 2025, 2024.
- Story data lives in `stories.json`, grouped by year, so new stories can be added without editing `app.js`.
- Story coordinates use decimal latitude/longitude. Regional or global stories may use representative center points rather than exact addresses.
- Year selector lives in the top-right header area.
- Selecting a year updates the story count, carousel, active details, visible pins, and focused globe position.
- Open story links must point directly to `https://storymaps.arcgis.com/stories/...` or `https://storymaps.arcgis.com/briefings/...` or `https://storymaps.arcgis.com/frames/...`, not Esri listing pages or StoryMaps collection pages.

## Globe Requirements
- Use Three.js for the main map/globe.
- Globe should feel abstract and cinematic, inspired by 2050.earth, while staying readable.
- Globe texture should use the repo-local `assets/world.jpg` image supplied by the user.
- Globe must not use generated green land patches, cyan dotted land clusters, filled land blobs, or noisy procedural speckles.
- Selecting a story must rotate the globe so the active pin is centered toward the camera.
- Only the active pin label should be visible.
- Only the active pin should pulse; inactive pins remain steady.

## Autoplay Requirements
- Autoplay starts enabled when the app loads.
- Every 10 seconds, autoplay advances to the next story in the selected year.
- Advancing updates the selected card, story detail panel, active pin, active label, and centered globe focus.
- The detail panel contains a play/pause control for autoplay.
- The detail panel shows a subtle progress indicator for the 10-second interval.
- Clicking Open story pauses autoplay before the story opens in a new tab, keeping the explorer on that story.

## UI Requirements
- Story detail panel shows category, award/year label, title, summary, place, and highlights.
- Story list is a horizontal carousel.
- Story card theme text and globe pins must use the same theme-level color for a given theme.
- When the active story changes, the carousel should scroll the selected card into view.
- Search/theme filtering is intentionally removed for now and may be revisited later.
- Text should not overlap on common desktop/mobile viewports.
- Avoid extra explanatory text inside the app UI.
- Secondary panel actions use compact icon-only controls aligned to the right of the primary action.
- Vercel Speed Insights should be initialized from the vanilla JavaScript entry so deployed Vercel traffic reports Core Web Vitals without adding visible UI.
- Localhost development should not inject the Vercel Speed Insights runtime request, avoiding expected local 404 noise from the Python static server.

## Verification Notes
- After visual or interaction changes, verify in the in-app browser at localhost.
- Check that Three.js render health is active.
- Check console warnings/errors.
- Check direct story links remain direct StoryMaps story/briefing URLs.
