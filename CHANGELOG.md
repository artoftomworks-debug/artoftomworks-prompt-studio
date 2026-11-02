## 1.21.0 — 2026-11-02 — Visual studios, sound and light

- Light sphere: suggested envelope, temperature/tint, strength/softness, XY positioning without Z handles, wheel orbit / Shift tilt / Ctrl zoom, saved scenes and English prompt directions.
- Dog/cat quadruped rigs: three sizes, four base poses, editable paws/head/tail, body/depth previews and full Studio backups. Human BODY_18 exports remain human-only.
- Since the published 1.20.0: style/light mixing, virtual lighting/camera studio, large articulated pose editor, reference alignment, body/depth views and optional local human pose estimation.
- Image and Video workshops: local editing, reusable branding starters/profiles, metadata-aware exports and picture-preserving audio workflows under the existing compatibility rules.
- Sound workshop: 17 included ready WAV samples, own audio import, themes/variants, saved arrangements, waveform cues and frame-based audio/picture alignment.
- Archive root controls and gallery selection/deletion, workflow navigation and NEW labels, local AI first-run help, retained assistant drafts and dedicated prompt copying.
- Clean Windows and source distributions share one build. Optional Ollama/vision models, generation models and FFmpeg remain separate. Avoid concurrent local vision and GPU generation. Third-party runtime/sample notices are included.

## 2026-11-02 — Audio waveform and frame alignment

- Local source waveforms, cue markers, frame stepping and cancellable analysis.
- Align added audio with trim/speed-aware picture seeking; frame offsets, Undo and a sticky picture preview.
- Remembered Sound workshop FPS and arrangement start nudges; eight-language controls and NEW labels.
- Sample-based export delays and floating-point silence; original files retained. Verify the final mix with rendered preview.

## 2026-11-02 — Sound themes and variants

- Two-level theme / sound selectors with library counts and no automatic playback.
- Fourteen localized built-in groups, up to 30 personal themes, renaming and removal without deleting sounds.
- Classify existing sounds and import into the selected theme; retain favorites, notes, arrangements and filter drafts.
- Eight-language controls and a targeted server restart helper beside the update.

## 2026-11-02 — Sound workshop and included starter sounds

- Separate large sound-library tab with search across names/tags/narration text, type/mood/language filters, favorites and local audio import.
- Seventeen included WAVs: seven original English synthetic narrations, four procedural ambiences, four effects and two simple original music beds; bundled usage terms and provenance, no synthesis model required at runtime.
- Rainy café, Arena opening and Quiet reflection starters; editable start/gain/fades/repetition, up to 20 saved custom arrangements, draft retention and revision-safe rights notes.
- Explicit reviewed transfer into Video workshop with existing cuts retained, Undo and duplicate-acceptance protection; final mix uses the existing preview/export pipeline.
- Eight-language controls, NEW launcher, function-search entry and Hungarian/English guide. Custom text-to-speech is not included in this first release.

## 2026-11-02 — Video branding workshop

- Timed editable text, logos and repeating watermarks; image branding profile transfer with replace/append and Undo.
- Drag placement and arrow-key adjustment on a large preview, nine-point alignment, opacity, typography and independent fade-in/out.
- Source-size/FPS H.264/AAC export with validated local PNG layers, source metadata provenance, editable project audit and temporary-file cleanup.
- Lossless intermediate clips for branded final exports; copy/audio-only modes explicitly reject visible branding.
- Eight-language controls and help, a refreshed dismissible Video workshop NEW marker, and VIDEO_BRANDING_HU_EN.md.

## 2026-11-02 — Editable branding starters

- Six editable layouts with live card previews on the original image: signature, cinematic title, portfolio, advertisement, quote and repeated preview watermark.
- Replace existing branding or append, edit the selected headline and save as a reusable profile; source, tone layers and manual prompts are preserved.
- Eight-language labels and help, refreshed dismissible NEW marker and Hungarian/English starter guide.

## 2026-11-02 — Image branding workshop

- Draggable text and raster-logo layers, relative sizing, nine-point alignment, margins, outline/background/shadow and repeated watermarks in the large Image workshop tab.
- Local reusable branding profiles with stale-write protection; image edits remain separate from generator prompts and video-tone recipes.
- Original-size PNG copies and up to 20 branded images in one ZIP, with cancellation, error handling and original-file preservation.
- Eight-language controls and a dismissible NEW launcher. See BRANDING_HU_EN.md for storage, export and metadata limits.

## 2026-11-02 — Local AI first-run guidance

- Explain unreachable Ollama, no local models, text-only models and unverified vision capability directly beside the model picker.
- Add official installation links, a copyable starter command and Check again; no automatic downloads, installation or inference.
- Share guidance with Ask AI; preserve existing draft memory and model choices.
- Include all eight interface languages, dismissible NEW labels and a dedicated eight-language first-install guide linked from the release README/quickstart.

## 2026-10-31 — Frame to Look workshop update

- Send a selected video frame to the linked Image workshop tab; explicitly return visible global tone layers as an editable recipe.
- Apply returned tones to the captured clip, checked clips or the whole video timeline. Per-clip strength, clearing, undo/redo and portable project persistence.
- Render aligned before/after video previews with a draggable divider, or sequential 40/70/100% look previews, without changing the project.
- Load the selected source cut's audio waveform, seek by clicking and step source/result frames using recorded frame rates.
- Match the existing image-tone mathematics through bounded 3D colour lookup tables; serialize analysis/export operations and reject returns for changed source clips.
- Eight-language UI and refreshed, explicitly dismissible NEW labels for Image workshop and Video workshop.
- Global SDR tones only: local masks, light/image layers, background replacements and HDR grading are excluded from transfer. Previews use one clip and its own sound, without separate sound tracks.

## Working module — Video workshop — 2026-10-31

- Separate local video editor: clip timeline, ordering, trimming, speed, fades
  and basic colour controls; independent trimmed/offset audio tracks and mixing.
- Actual short preview render, H.264/AAC assembly, WAV and a picture-preserving
  audio route with encoded-video hash verification. Source files are untouched.
- Local streaming imports, deduplication, portable projects, session undo/redo,
  cancel/progress, completed-export recovery and intermediate-file cleanup.
- Uses existing FFmpeg; no model or engine binary download. Eight languages,
  NEW/navigation integration and a verified multi-file update with targeted restart.
- Initial SDR module; not a complete professional HDR/overlay/tracking suite.

## Working update — Image workshop recipes and workflow — 2026-10-31

- Conservative source-brightness suggestion and five adjustable starting looks.
- Personal tone/light recipe shelf, 24 named looks, separate import/export and
  stale-write protection. Recipes exclude source assets, local masks and text.
- Visible brush/subtract cursor, B/E/V/H and size shortcuts, quick visibility
  and masked layer duplication, all with undo support where edits occur.
- Comparison and mask display reuse computed image effects. Prompt tone intent
  now respects layer strength; manually edited prompts remain protected.
- Workshop NEW revision updated independently; all eight languages retained.

## Working preview — Image workshop — 2026-10-31

- Dedicated local editing tab with non-destructive tone, light and image layers.
- Brush/subtract, rectangle and ellipse masks with feathering and inversion;
  manually masked own-image background/sky replacement.
- Draggable horizontal/vertical before/after, pan/zoom, movable lights and
  selected-light wheel controls; bounded gesture-based undo/redo.
- Source-dimension PNG, fingerprint-checked project reattachment, manual prompt
  preservation, local creator feedback and an explicit copyable AI brief.
- Eight interface languages and a separately dismissible NEW entry.
- Automatic semantic selection and generative image replacement remain future
  integrations. No uploads or automatic AI calls; no claim of model retraining.

# Changelog

## Unreleased — 2026-10-30: Large reference preview

- Near-full-window reference view with independently scrolling light controls.
- Sticky normal preview, bounded portrait sizing and collapsible guidance.
- Reuses the same live canvas/controls; close/Escape restores their placement without losing the reference or saved settings.
- Eight-language controls and refreshed workshop NEW revision.

## Unreleased — 2026-10-30: Reference image lighting workshop

- Local reference-image drop/selection inside Virtual studio, with before/after and original-only views.
- Shared lamp strength, softness, temperature and colour controls drive a bounded illustrative 2D light sketch and the same studio prompt plan.
- Drag/keyboard subject/light markers; camera angle, height and lens controls update the schematic and directions.
- Existing named setups and JSON backups retain numeric reference settings, without embedding image data; legacy backups remain compatible.
- Explicit copy of the current light/camera plan and optional marker-free preview PNG export up to 1600 × 1100 bounding pixels.
- Gesture previews commit on release, with cancellation/write-failure rollback; asynchronous image loads preserve the latest valid reference.
- Eight-language controls, navy/black themes and independently dismissible NEW. No AI calls or media uploads.

## Unreleased — 2026-10-30: Creative trial bench

- Prepare 2–6 image/video variants with one changed lighting, style, framing or camera-motion direction and a common scene/settings plan.
- Copy complete editable prompts and common negatives; manual prompts remain intact with change warnings and confirmed rebuilding.
- Attach local previews or actual archive results, record explicit user decisions/notes, and keep earlier result snapshots when plans change.
- Open two different indexed results in the existing A/B view and save the decision through its experiment journal.
- Open a working result in the existing proven-recipe editor, separating actual archived metadata from planned values.
- Save up to 20 local studies, export/import JSON or export prompt/notes TXT, and resume studies from the start dashboard.
- Eight-language UI, large controls, navy/black themes and a dismissible NEW entry. The dashboard NEW revision highlights trial resumption.

## Unreleased — 2026-10-30: Continue from here

- Optional start dashboard with up to six resumable saved series/publication drafts and truthful status/checklist progress.
- Exact-item resume, existing series-publication draft lookup, and protection for unsaved edits.
- Six favorite tools, accent-tolerant function search and safe navigation without starting processing or deletion.
- Persistent personal next-step note and startup-open preference; storage failures retain the visible note.
- Eight-language interface and independently dismissible NEW entry; previous dismissals remain unchanged.

## Unreleased — 2026-10-30: Publication desk

- Archive-viewer and series handoff, existing archive search and current-prompt starting points.
- Separate editable EN/HU title, teaser and description fields, with individual copy actions.
- Reviewed keyword selection; optional structured AI drafting through the existing helper with confirmed application.
- Opt-in sharing of source prompts and recorded settings; planned scene data stays separately labeled.
- Manual picture/audio/cover/text checklist, series review status and changed-series detection.
- Text-only ZIP publication packages, DRAFT naming for incomplete review, private JSON backups/import and local draft persistence.
- Eight-language interface and NEW registration. Series planner NEW revision updated for its publication handoff.

## Unreleased — 2026-10-30: Discoverable updates

- NEW badges on feature headings and launchers, starting with Series planner.
- Explicit per-feature dismissal saved in this browser; opening does not dismiss.
- What’s new menu with jump-to-feature, dismiss-all and restore controls.
- Versioned feature registry, eight-language copy and cross-tab preference updates.

## Unreleased — 2026-10-30: Series planner

- Three editable, connected scene cards with a shared location, subjects, time, lighting, style, palette and aspect ratio.
- Separate image/video drafts, copy and editor handoff; manual edits are preserved and stale drafts marked.
- Five starting points, duplicate-plan variations, progress states and local result previews.
- Up to 25 locally saved series, JSON backup/import and full TXT prompt export.
- Eight-language controls; English prompt scaffolding preserves user-written text language.
- No AI account or media upload required. Duration and format are planned suggestions.

## 1.20.0 — 2026-10-28

Consolidated release of the working October 22–28 updates, compared with the published 1.19 edition. Generation and optional local AI models remain separate downloads.

### Archive and navigation
- File-modification-date presets and date ranges.
- Daily thumbnail gallery; first/last-page shortcuts and pagination at both ends.
- Startup and periodic automatic refresh of configured folders, with an opt-out.
- Floating back-to-top control and separate positive/negative copy actions in the media viewer.
- Editable Creator Passport from recorded metadata, explicit missing basics and clearer reproducibility limits.

### Prompt writing
- Prompt workbench with an original/working copy, conservative issue hints and optional AI handoff.
- Configurable SwarmUI, Stability Matrix, ComfyUI and custom tool launchers.
- Broader surprise prompt ideas, anatomy wording and model-aware negative suggestions.
- Optional 18+ artistic nude/boudoir theme, excluded from general random picks; non-explicit adult art only.
- Resolution presets, custom dimensions and framing choices for surprise prompts; remembered choices and clearer guidance to set dimensions in the generator.
- Classic saved prompt entries now preserve and search their negative text too, including JSON backups; old entries remain readable.

### AI assistance
- Local Ollama plus optional copy/open choices for external assistants.
- Image attachment and drag-and-drop for art prompts, restrained reinterpretations and image-to-video motion suggestions.
- Optional duration and target-workflow context for video ideas; no guarantee of model-setting compatibility.
- Separate remembered text/vision choices; model capability lookup rather than assuming vision from a name.
- Vision model selectors in the dedicated image-to-video and image analysis helpers; no longer limited there to Gemma.
- Prompt-only copying accepts common marker variants, JSON, headings and code blocks, while preserving the full response. Manual text selection takes priority.
- Optional experimental vision-profile instructions and an Ollama unload helper. Model weights are not included.

### Cleanup and appearance
- Explicit file-health/byte-identical-duplicate scan, recent-file exclusions, list/gallery review, checkboxes and select-all.
- Duplicate keeper preferences, batch review and protection of at least one exact copy; Recycle Bin or permanent deletion after review.
- Cleanup suggestions remain available after individual deletions.
- Readability adjustments, black/dark-blue appearance and eight-language UI updates.

### Distribution and limits
- Fresh English-first Windows package and separate GitHub source package with changelogs, upgrade instructions and local-AI memory guidance.
- Custom Free Use and No Resale License 1.0: commercial creative work allowed; software resale requires separate permission.
- No personal archive, media, downloaded Node runtime, AI weights or local launcher settings are bundled.
- Prompt Studio remains a companion, not a generator. Metadata completeness, accurate anatomy, exact reproduction, universal NSFW support and automatic clipboard insertion into third-party apps are not guaranteed.
- Some older translation/suggestion tools still use `gemma3:4b`. The optional vision profile was tried with an ordinary café image; explicit-image behavior was not validated.

## 1.19 — previous published baseline

Local prompt writing, searchable media archive, metadata recipes, comparison, ratings/categories, glossary, saved prompts and director timeline. See the repository history for that edition.
