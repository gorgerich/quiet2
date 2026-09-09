# MOKI — Phase 0 forensic report, 2026-09-09

## Current stable baseline
Production was inspected directly in a fresh browser. It opens the nine-step onboarding with a rendered Moki, rather than a blank page. DOM build marker: `game-core-20260909`. Vercel deployment `dpl_9pYDJbtWHNg6ecXsijEHi7GcCXh2`, READY, exact alias `level-up-game-eta.vercel.app`. Production HTML, `src/app.js` and `src/core/scene.js` match local bytes. Fetch of `src/state.js` timed out: no assertion of complete file-hash verification. Browser console returned an extension metadata error, no MOKI error in the inspected entry state. This is entry-state runtime evidence, not a full regression pass.

GitHub current Game Core commit: `333cc898c17ab385826485f840c013ec390dce0e`, `feat/moki-game-core`. Local branch initially pointed at `b59839f` with uncommitted Game Core edits. Preserved those edits as local checkpoint `8cec1dd`; created `game-dev/pixi-evolution`. Do not confuse local checkpoint identity with the remote deployment commit. Prior fallback is `b59839f` visual guidance, before Game Core.

## Experimental changes found
No PixiJS or Antigravity implementation was found in the available checkout, scratch filename search, or four remotely listed repository branches (main, fix/moki-unified-runtime, feat/moki-visual-guidance, feat/moki-game-core). This does not establish that an experiment never existed elsewhere. No alleged Pixi experiment was deleted or overwritten.

`moki-assets/` contains retained app/family/v7/hotfix/pixel/mockup presentation generations. They are outside the production module graph. Preserve them as historical research, not renderer dependencies. Local Game Core adds DOM + WAAPI actor/director, Canvas 2D reward effects, procedural audio and world interactions. These are not PixiJS.

## Feature inventory and state map
| System | Current source of truth | Preservation boundary |
|---|---|---|
| 21 missions, 63 steps, hints, HP, categories, day parts | src/catalog.js | No edits in Phase 1 |
| Active mission / step / effort / help events | src/state.js: start/help/advance/finish | No animation may award or gate progress |
| Identity, five companions, portrait, outfit, collection | child in moki_game_state | Phase 1 never opens storage |
| HP, history, daily completion and chestOpened | schema: 1 state | Current once-only finish/openChest tests pass |
| Lamp, plant touches, stars, discoveries | world normalized by core/world-state.js | Preserve permanent consequences |
| Family members, goal, boss, feed, challenge | family in same local state | Same-device model, no server or authentic remote exchange |
| Adult PIN / privacy / sound / voice / calm / haptics | settings | Keep existing DOM parent product untouched |
| Onboarding | onboarded + onboarding | No migration for a visual review |
| Recovery/export/import | src/persistence.js | moki_last_good_state; export excludes photo/PIN |

Legacy keys inspected: `moki_v6_product`, `moki_v7_identity`, `moki_family_v1`; current loader also references `moki_v8_state`. V6 source uses child.stars/chests/initiative, parent.pin, missions with different IDs, daily and history. Existing loader does NOT comprehensively map V6 stars, challenge state, all prior mission IDs or active progress. This is a real migration gap; before integration create explicit schemaVersion migrations and fixtures from these structures, preserve raw source backup, test idempotence. Do not certify current legacy migration as lossless. Phase 1 cannot trigger it.

## Asset map
See `ASSET-FORENSICS.json` for filenames, dimensions, alpha, SHA-256, old frame coordinates and type separation. All seven shipped raster sheets were visually inspected. `companions.webp`: 1499×1049 RGBA, five columns × seven nonuniform pose rows. `objects.webp`: 1254×1254 RGBA, mixed 4×4 sheet. Both have edge contamination and problematic crop assumptions. Neither is trusted for a new full-scale character/prop.

`room.webp`: 1024×1536 RGB, has a baked chest, lantern and plants. `worlds.webp`: 1774×887 RGB, three rooms; space includes a baked telescope, town includes a chest. `instructions-0/1/2.webp`: each 1086×1448 RGB, three steps × seven missions, UI guidance illustrations, NEVER physical world objects. `controls/volume.svg`: semantic UI icon, not world art. Scratch tobi.webp failed image decoding and is excluded.

New assets are separate single sprites and a cleaned room. Authoritative manifest: `experiments/forest-gate/manifest.js`; all crops central, role-checked. Transparent character/backpack/chest, no UI card substitution. Forest base contains no chest, telescope or collectible furniture. Source identities and cozy toy palette are retained; approval of the resulting composition belongs to the user.

## Reusable / unsafe code
Reuse catalog, pure mission/reward functions, privacy projection, guidance, narration, save service and test fixtures. Director/state-vs-presentation separation is a useful reference. Actor provider should remain replaceable; do not import DOM markup into Pixi.

Do not trust: fractional CSS atlas crops; historical competing renderers; asset names without decoding; procedural oscillators as final sound; Family winner/active boolean as co-op state; old README deployment file list (omits core modules); build success as runtime proof. Family currently stops a race when either side finishes, not childCompleted AND adultCompleted. Future co-op must have explicit accept/decline/cancel/completion states.

## Proposed and implemented Phase-1 files
Only `experiments/forest-gate/`: index.html (semantic review/error shell), review.css, scene.js (static Pixi presentation), manifest.js (asset roles/frames/anchors), assets/*.webp, package.json (pinned Pixi 8.7.0), build.mjs (copies dependency into same-origin vendor). Plus audit documents. Production files remain byte-for-byte unchanged from the preserved checkpoint.

WebGL preferred, WebGL1 requested, DPR capped at 2, autoDensity, one resize observer with one coalesced frame, ticker stopped in static mode. Separate ordered containers: background/environment/midground/gameplay/foreground/light/atmosphere; DOM overlay outside canvas. Empty layers are reserved, not claimed as implemented environmental effects. Foreground uses an aligned crop of the environment. No gameplay imports, no storage access, no fake interactions. Error bootstrap covers dynamic import and initialization. Runtime failures are visible with source stack.

## Gate A acceptance contract
Preview only. Inspect actual rendered composition at four portrait sizes, short and landscape layouts, console, asset loads, reload and WebGL metrics. Static review has no meaningful idle FPS; an explicit 120-frame render benchmark is provided separately. No claim of real iPhone Safari, 60 FPS device qualification, child usability, motion or integration. Stop at Gate A for user review before actor behavior, missions, HP, chest opening, telescope or Family work.

Baseline regression: 21/21 existing Node tests pass on this checkout. Not a substitute for browser regression of all screens.

Technical source: https://pixijs.com/8.x/guides/components/application (WebGL preference, async init, autoDensity, resolution and ticker options).

## Phase 1 runtime outcome
The first preview built successfully but failed in the browser: Pixi autodetection attempted unavailable CanvasRenderer. Explicit WebGLRenderer also failed to obtain a context. Final capability diagnostics confirm `webgl:false, webgl2:false` in this cloud browser. The bootstrap now reports WebGLUnavailable explicitly, with a visible error and source. No hidden automatic fallback.

A separate `composition.html` / `composition.js` DOM art proof was added. It shares the asset manifest and projection math (`layout.js`) with the Pixi scene, loads actual individual sprites, and is explicitly marked NOT WebGL QA. It permits art review despite the hardware blocker. It does not replace the game or prove Pixi rendering parity. Static sprite bounds pass at all four required portrait sizes, 390×600 and 844×390. Browser review evidence is separate below.

Final preview: `dpl_XeWEmnL3C6TLEZqX5k6zUc95bKfa`, READY, no production aliases, hostname `level-up-game-f8ejhkmix-rics-projects-9baa2793.vercel.app`. Production unchanged from its recorded deployment. Gate A remains awaiting visual approval AND successful WebGL runtime verification. No subsequent phases implemented.

Known defects/limits: WebGL runtime and FPS blocked in this browser; DOM/Pixi pixel equivalence unverified; landscape uses a centered portrait composition, not a designed landscape world; no motion or audio at this static gate; no real-device or child testing; no full migration certification. Art still requires the user's review, especially Moki proportions/material and object scale. Generated single sprites use only central manifest frames; low-alpha outer specks are excluded by bounds. Runtime textures retain original resolution (~24 MiB RGBA before framebuffer/driver overhead), so texture downsampling is a later measured optimization, not claimed complete.

## Asset generation provenance
Built-in imagegen, four separate edits based on inspected existing room/companions/objects. Prompts: preserve cozy toy treehouse but remove all collectible furniture and baked chest/lantern/plants; isolate first-column idle Moki with transparent clean alpha and warm key light; isolate coral backpack with star; isolate closed walnut/gold chest. Each sprite requested no UI, labels, floor or baked large shadow. Source outputs retained in conversation workspace generated_images; project WebP copies in experiments/forest-gate/assets. No production asset overwritten.
