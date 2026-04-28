# Story Atlas Requirements

## Product Goal
Story Atlas is a dark, cinematic, map-based explorer for curated and award-winning ArcGIS StoryMaps. It should help viewers discover strong examples by year and open the original StoryMaps directly.

## Current Experience
- App name: Story Atlas.
- Source/product label: ArcGIS StoryMaps, preserving trademark casing.
- First screen is the explorer itself, not a landing page.
- Primary visual is a Three.js globe with a transparent abstract surface, subtle graticule, subtle country-boundary hints, story pins, and one active story label.
- Dark theme with glass panels, neon green year selector, cyan globe accents, and restrained category colors.

## Story Data
- Years available: 2026, 2025, 2024.
- Year selector lives in the top-right header area.
- Selecting a year updates the story count, carousel, active details, visible pins, and focused globe position.
- Open story links must point directly to `https://storymaps.arcgis.com/stories/...` or `https://storymaps.arcgis.com/briefings/...`, not Esri listing pages or StoryMaps collection pages.

## Globe Requirements
- Use Three.js for the main map/globe.
- Globe should feel abstract and cinematic, inspired by 2050.earth, while staying readable.
- Globe must not use green land patches, cyan dotted land clusters, filled land blobs, or noisy texture speckles.
- Current globe surface should stay transparent/clean, with only subtle boundary hints and grid/atmosphere effects.
- Selecting a story must rotate the globe so the active pin is centered toward the camera.
- Only the active pin label should be visible.
- Only the active pin should pulse; inactive pins remain steady.

## UI Requirements
- Story detail panel shows category, award/year label, title, summary, place, and why-study-it note.
- Story list is a horizontal carousel.
- Search/theme filtering is intentionally removed for now and may be revisited later.
- Text should not overlap on common desktop/mobile viewports.
- Avoid extra explanatory text inside the app UI.

## Verification Notes
- After visual or interaction changes, verify in the in-app browser at localhost.
- Check that Three.js render health is active.
- Check console warnings/errors.
- Check direct story links remain direct StoryMaps story/briefing URLs.
