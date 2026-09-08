# MOKI — unified game runtime

Production entry: `moki/index.html`. This directory is the complete deploy root.
One ES-module entry (`src/app.js`), one catalog, one state layer, one stylesheet.
No dependencies or build step are required. Run `node --test tests/state.test.js`.

## What replaced the old stack
The old production HTML loaded app/family/v7/pixel styles and multiple competing renderers from jsDelivr. `character-assets.js` was truncated inside a string and `app.js` failed on a missing DOM element. The new deployment does not load any legacy files. Those files are retained in git for history and rollback, not shipped.

- `src/state.js`: migration, day boundary, mission state, help history, once-only HP and chest rules, family totals and privacy projection.
- `src/catalog.js`: 21 missions with three steps, help, category, time-of-day, effort/reward data; character and item manifests.
- `src/app.js`: one renderer for each screen and one delegated event path. Overlay changes do not rebuild the scene. Pet reactions update only the pet.
- `src/game.css`: shared tokens and controls, child/world and adult layouts, safe-area/short-viewport behavior, reduced motion.
- `assets/*.webp`: generated and inspected room plus transparent character/object atlases. Original boards were visual references. UI text and controls are HTML.

## Features
Nine-stage onboarding; five companions/seven poses; locally cropped/compressed private portrait; three-level help remembered across all steps; HP/reward/chest/collection; placed room items; wardrobe; local family/boss/challenges/fixed reactions; adult PIN gate and six sections. No reward for saying a task was done without assistance. No negative HP or streak penalties.

## QA-only files — NEVER deploy to production
`qa.html`, `qa-index.html`, `src/qa-app.js` are preview fixtures with synthetic data and adult screen access. Production uploads must exclude all three. They are separate copies of the app for visual QA, never imported by the production entry.

## Important limits
This is a substantial local-game implementation, not a declaration that every original production-grade requirement is closed.
- Family is currently shared on one device. There is no authenticated server, cross-device sync, remote invitations, or actual friend exchange. UI states this explicitly. Friend preview exposes only category/name/HP.
- PIN is a salted SHA-256 local gate with in-memory attempt throttling. It prevents casual navigation, not inspection of browser data. No Face ID. A new adult setup is required when migrating the legacy public-default PIN; earned data is retained.
- Four selectable rooms: forest, space, island, town. Seasonal decor is not implemented.
- Automatic start-without-reminder measurement is not fabricated. In-app help and effort are observed; spoken reminders are not measurable. Four low-help observations yield an optional parent fading suggestion.
- Browser viewport checks do not verify native iOS Safari chrome/PWA behavior, actual 60 FPS on an iPhone, VoiceOver, or usability with children. These require device and participant testing.
- Offline reload/cache, remote backup/account recovery, and conflict-safe multi-device persistence are not implemented.
- Character poses are static sprites with restrained motion, not rigged animation. Pixel-level atlas cleanup and device art review remain appropriate before mass release.

## Deployment
Deploy exactly: index.html, manifest.webmanifest, src/{app,state,catalog}.js, src/game.css, assets/{companions,objects,room,worlds}.webp. Verify READY, exact production alias, build meta `unified-20260908`, file hashes, and visible production UI before claiming deployment.
