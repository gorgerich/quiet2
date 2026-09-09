# MOKI Game Core 1.0 — vertical slice

Baseline b59839f, 2026-09-09. Existing production retained: 21 missions / 63 steps, five companions / seven poses, four themes, HP, effort, help events, chest, permanent finds, outfit, room placement, local family/boss/challenge/nudges, parent six tabs/PIN, portrait crop, narration, calm, migration/backup/export/import.

## Diagnosis
The previous release improved visual instructions, persistence and privacy. Ten game gaps: (1) no autonomous behavior director; (2) one idle loop; (3) flat wallpaper; (4) generic object bounce; (5) hard screen replacement; (6) reward has no spatial journey; (7) two oscillator tones lack event identity; (8) no persistent world interaction state; (9) no chapter projection; (10) no temporal regression contract.

## Architecture decision
DOM scene graph + Web Animations + a bounded Canvas 2D VFX plane. Keep real buttons, semantics and forms. This slice has one companion and fewer than a dozen props: WebGL/Pixi would add a texture lifecycle and a second hit-test/accessibility tree without a demonstrated bottleneck. Introduce it only for measured scene complexity. The environment root survives child scene changes. Actor instance/behavior survive UI remount; presentation cannot award HP.

State -> deterministic BehaviorDirector -> CharacterActor + AnimationController.
SceneManager owns environment/camera and binds actor; AudioManager owns voices/events and gesture unlock; VFXManager owns bounded particles. WorldState owns interactions/discoveries. Existing mission/reward/family/save controllers remain authoritative. Accessibility derives calm/reduced-motion and visibility suspension for all presentation systems.

No game mutation waits for animation. Save first, animate the committed result. Canceled, hidden or unsupported animation must never lose rewards. Director has a single scheduled decision, no MutationObserver, no per-frame DOM polling. Audio stops on background/modal/narration. Canvas only animates while particles exist. Repeated events are bounded/rate limited.

## Slice
Forest + Moki + Backpack remains the reference. Other companions/worlds retain their current functions; environmental presets may run without claiming a completed art pass for every world.

## Art / motion bible
Round toy proportions, large oval eyes, matte soft material, warm key light upper-left, soft contact shadows, no black outlines. Keep existing source palette mint/coral/lilac/honey. Actor must use authored atlas poses, never CSS anatomy. Transform entire poses with small displacement, stable foot contact. Ambient changes every 6–11 seconds; no competing attention demands. Interaction cue points to a real control. No persistent shaking. Motion scale: tap < step < mission < discovery. Calm replaces travel with a static visible result. Scene camera movement <= 3%, parallax <= 5px. No flashing.

## Chapters
Forest projection from permanent real mission completions: 0 Home, 3 Cozy corner, 9 Window discoveries, 18 Star stories. Milestones open visual exploration or memory surfaces; never block the original inventory. No streak resets, negative HP, timers demanding return, or daily attendance requirement. Chapter events use completion history, not taps or self-report of independence. Plant growth depends on real completed missions, watering stays playful and grants no HP.

## Release gates
Existing test suite + director interruption/visibility, bounded scheduling, no animation dependency, item persistence, chapter history, audio rate limit. Browser: 30 seconds idle, no-text QA, full backpack + help + pause + effort/reward + chest/unlock + object interaction/reload, calm, all four viewports, parent/family preservation. Device FPS and child comprehension need actual device/participant validation; never infer them from screenshots.
