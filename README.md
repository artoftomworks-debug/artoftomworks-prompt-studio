# ArtofTomworks Prompt Studio 1.20.0

**Give your AI creations a memory — and turn yesterday's result into tomorrow's prompt.**

A local-first Windows companion for prompt writing and a searchable archive of your own images and videos. Works alongside SwarmUI, ComfyUI and other generators. **Prompt Studio does not generate images or videos itself, and it is not tied to MiniMax H3 or any single generation model.** Metadata support varies by file format and the information saved by your generator.

[Magyar útmutató](README_HU.md) · [What's new since 1.19](CHANGELOG.md) · [Local AI setup](LOCAL_AI_GUIDE.md) · [Updating an existing installation](UPGRADE.md)

## Start on Windows

1. Download the complete ZIP and extract it to a writable local folder. Do not run files inside the ZIP.
2. Double-click **START.cmd**. Node.js 22 or newer is required. If it is missing, setup offers a portable download from nodejs.org and checks its SHA-256 against the official checksum list. Internet access is needed for that download.
3. Your browser opens `http://127.0.0.1:18819/`.
4. Choose your language and add your own image/video folders in the media archive. A clean installation has no archive folders or media index.

The interface supports **English, Hungarian, German, French, Spanish, Italian, Portuguese and Polish**. English is the default on a fresh browser profile. Existing browser preferences may remain when using the same local address. Choose dark blue or black appearance.

If another Prompt Studio version is already running on port 18819, close its local server before starting this version. Closing only its browser tab does not stop the server. `CHECK.cmd` reports the running version and local log location.

## Find, compare and organize

- Search readable prompts, filenames, model names and folders. Filter by file modification date, category and rating. Modification time is not proof of generation time.
- Use the daily thumbnail gallery, with first/previous/next/last controls above and below the results. Thumbnails are hidden until you enable them for the session.
- Automatic archive refresh is enabled by default: it scans configured folders on startup and periodically, about every 15 minutes while the page is visible and available. It can be switched off; manual refresh remains available.
- Preview images and videos, copy positive or negative prompts, rate work and compare two results. Keep an experiment journal and export browser-based prompt collections for backup.
- Create an editable **Creator Passport** with the recipe actually found in a file. Missing values stay unavailable. It does not verify model weights, LoRA versions or exact reproducibility. Review prompts and notes before sharing.

## Write the next prompt

Use prompt ideas, the writing guide, styles, glossary, camera/movement suggestions and director timeline. The prompt workbench edits a working copy and can flag a few common contradictions. It is not a full semantic validator.

**Surprise me with a prompt** now includes resolution/aspect-ratio guidance and framing choices such as a full figure or a close portrait. These choices affect the suggested wording; **you must set the actual width and height in your generator**. Valid input dimensions are not a guarantee of model support or accurate framing.

An explicitly selected **18+ artistic nude / boudoir** category offers non-explicit adult art ideas. It is excluded from the unrestricted random-theme selection. It does not make local models unrestricted, and it does not generate explicit images. Anatomy wording and negative suggestions cannot guarantee correct hands or anatomy. The effect of negative prompts depends on the generation workflow, particularly for FLUX.

## Optional AI assistance

Core writing and archive functions do not need an AI account. Local assistance uses **Ollama**, installed separately; no model weights are included.

- Choose an installed model in the AI helper. Text and image choices are remembered separately. A text-only model cannot read an attached image. Vision support is checked from model metadata; it is not inferred from a name.
- Drag in a supported image and ask for an art prompt, a more restrained interpretation, or image-to-video motion ideas. An image is sent to local Ollama only when you request a response. The original source file stays unchanged.
- The dedicated image-to-video helper also offers a vision model selector instead of requiring Gemma alone. Some older translation and suggestion functions still use `gemma3:4b`.
- Copy only the prompt or selected text while keeping the full answer and explanations. Automatic extraction handles several common formats; if the answer is ambiguous, select the desired text manually.
- ChatGPT, Copilot and other assistants remain optional external choices. Copy/open actions prepare text on your clipboard; **paste it into the other application yourself**. Images must be attached there separately. An installed Copilot window opening empty is not evidence that the clipboard failed.

**Content refusals depend on the selected model.** The tested experimental vision profile is optional, not a promise that every request will work. The image test used an ordinary café photograph; explicit-image behavior was not validated. See [LOCAL_AI_GUIDE.md](LOCAL_AI_GUIDE.md) for setup and limitations.

**On a shared GPU, run local image analysis and image/video generation sequentially.** A finished generation can leave its model in VRAM. Unload it through that generator's controls before AI analysis. After the AI answer finishes, `UNLOAD_LOCAL_AI.cmd` can unload resident Ollama models without deleting their files. It does not unload SwarmUI or ComfyUI models.

## Cleanup suggestions

Start cleanup explicitly. It checks for empty/suspicious file structures and byte-identical duplicates, skipping files modified within the previous hour. It does **not** judge artistic quality or reliably detect malformed anatomy, and a structural check is not a complete decode test.

Use the list/gallery, checkboxes, select-all and duplicate-selection preferences to prepare a batch. The review protects at least one exact duplicate. Review the actual files, then choose Recycle Bin or permanent deletion. Nothing is deleted automatically; permanent deletion cannot be undone by Prompt Studio. Keep backups of irreplaceable media. Results remain visible after individual deletions.

## Launch your tools

Configure SwarmUI, Stability Matrix, ComfyUI or a custom tool in the workbench. You supply your own local/web address or executable path. Prompt Studio does not install those applications. The separate Workflow Studio/Workflow Flight Check tools are not included.

## Local data and privacy

The archive index and ratings are stored under `data/`; additional local add-on folders are stored in `addon-library-roots.json`. UI choices and saved prompt collections use browser storage; export collections as a backup. Do not share these private files with your public release.

This distribution includes no personal media, archive index, local model files, downloaded runtime, credentials or personal launchers. External assistants and downloads contact their respective services only when you use those options. The local server binds to `127.0.0.1` and is intended for use on your own computer, not public hosting.

## Source and checks

No npm install is required. With Node.js 22+:

```powershell
node build-offline.mjs
node --test --test-concurrency=1
```

`dist/` contains readable modules and the generated single-file page. The server serves `dist/ArtofTomworks_Prompt_Studio_OFFLINE.html`; after source edits, rebuild that file. Opening it directly supports writing tools, but the local server is needed for archive access and local integrations.

The GitHub source package also preserves the [five existing companion ComfyUI workflow backups](workflows/README.md). They are separate optional graphs, require their own dependencies and model rights, and are not in the Civitai Windows ZIP.

## Usage terms

See [LICENSE.txt](LICENSE.txt): free use, modification and free redistribution, including use while creating paid work; selling the software or modified copies requires separate permission. Keep the copyright and license with redistributed copies. Attribution in your finished creative work is not required. Third-party model and component terms still apply. This is a custom source-available license, not an OSI open-source license.

If Prompt Studio helps, a reaction, a short comment or a reproducible bug report helps decide what to improve next.
