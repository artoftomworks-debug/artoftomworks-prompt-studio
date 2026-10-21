# ArtofTomworks Prompt Studio 1.19 — Global Clean Edition

An English-first, multilingual, local-first prompt workbench for images and videos. This is a **clean Windows source distribution** prepared for a GitHub repository or a downloadable ZIP. It runs on the user's computer; it is not a GitHub Pages website. This distribution contains no personal media, prompt archive, saved browser data, or local folder settings.

**Repository owner:** Review `PUBLISH_HU.md` before publishing. No software license has been selected on the owner's behalf. A public repository is not automatically an open-source license.

## Quick start

1. Extract the whole ZIP into a **writable folder** on a Windows 10/11 computer. Do not run it from inside the ZIP or install it under `Program Files`.
2. Double-click `START.cmd`. On first use, if Node.js 22+ is not installed, choose **Y** when asked to download the tested portable Node.js 24.19.0 from the official Node.js archive. The download's SHA-256 is checked against the official checksum list before installation. No administrator rights are required for the portable runtime.
3. The browser opens at `http://127.0.0.1:18819/`. The interface starts in English. Change **Interface language** to HU, DE, FR, ES, IT, PT, or PL at any time.
4. To search your own generated media, enter an **absolute folder path** in **Searchable media archive → Full path of another folder**, click **Add folder**, then **Refresh archive**. Repeat for other folders. The first scan can take a while; later scans reuse unchanged metadata.
5. Search by words in filenames, saved prompts, model names, and paths. Filter by image/video, prompt availability, folder, category, or minimum star rating. Use **Load prompt** or **Copy prompt** when a readable prompt exists.
6. Image thumbnails start **hidden** on every launch for privacy. Turn on **Show thumbnails** for the current session if wanted. **Enlarge image** shows a large in-app preview; **Open in default app** launches the original image in the Windows program associated with its file type.

Run `SETUP.cmd` separately if you want to prepare the runtime before opening the application. `START.cmd` will also offer setup when needed. `CHECK.cmd` shows a read-only status report if something does not work.

## Creative echoes — rediscover your own work

Once you have written or assembled a prompt, use **Creative echoes** in the right column. Choose images, videos, or both, then click **Find related creations**. Prompt Studio compares meaningful words against saved prompts in the already indexed local archive. Relevant favorites receive a modest boost, but unrelated five-star items do not appear. Each result shows its shared words and lets you expand or copy the old prompt, or find the original archive entry. This is an on-demand, local, read-only search: it does not load thumbnails automatically, upload content, change files, or start generation. It matches words rather than translating meanings across languages; translate your current prompt first if your archive uses another language.

## Surprise prompt and idea cross-pollinator

At the top of the page, choose a **theme** (or **Anything goes**) and an **image/video** mode, then select **Surprise me with a prompt**. The random English draft needs no Ollama, remains editable, and replaces your current prompt only after you click **Use in editor** and approve the replacement if necessary.

In the media archive, mark two items with readable prompts as **A** and **B**, then open **Compare and analyze**. The **Idea cross-pollinator** takes the scene from one and a visual direction from the other. You can swap the roles, edit or copy the result, or send it to the editor. It does not merge model, LoRA, or generation settings, and it never starts generation.

## Director's timeline

Choose a video model and target duration, then describe the action, camera and sound in editable time segments. **Build timeline prompt** produces an editable prompt you can revise or send to the classic video editor. Timeline instructions are in English; your entered scene text is preserved as written, not translated automatically. The separate FPS and frame-count recommendation must be entered manually in SwarmUI or your ComfyUI workflow. The H3/DaSiWa/Eros calculation uses the 24 FPS, 5+17n frame grid; LTX 2.5 and other-model settings are advisory and must be checked against the chosen workflow.

On a video result in the media archive, choose **Link to Director** to attach its filename, readable prompt and current rating/category to the plan. Enter what worked or should change; that feedback becomes a revision priority in the next generated prompt. Saved plans live in this browser, with JSON export/import for backup or transfer. The app neither generates video nor changes SwarmUI/ComfyUI settings or source media.

## What is included — and excluded

Included: the application, the local catalog server, an offline HTML fallback, setup/start scripts, and multilingual interface text. **Not included:** anyone's media, prompts, timeline plans, browser storage, custom choices, glossaries, model files, media index, logs, personal paths, Node.js binary, or Ollama binary. The clean archive starts with **zero indexed folders**. Add only folders you want it to read.

The package is small because it downloads Node.js only on a machine that needs it. The local AI model is optional and downloaded separately if desired.

## Optional local AI

The editor, saved prompts, image metadata reading, media archive, and search work without Ollama. For AI-generated suggestions, local visual analysis, and AI-assisted translation:

1. Install Ollama from <https://ollama.com/download/windows>.
2. In a terminal run `ollama pull gemma3:4b` once. This model is several gigabytes; allow enough storage and download time.
3. Run `START.cmd` again. It can start an installed Ollama service if needed. The model runs locally on the computer.

The application does not install Ollama or download the model silently. Without it, AI buttons may show a clear unavailable message; the rest remains usable. The browser's built-in translation may separately require a language-pack download.

## Main workflows

- **Text to image / text to video:** Describe the idea, choose camera/composition/quality options, and assemble an editable prompt. Model and resolution suggestions are guidance, not fixed rules.
- **Image to image / image to video:** Drop in an image or choose a file, describe the intended change or motion, then build a prompt. Image prompt metadata can be read when present; visual analysis needs optional Ollama.
- **Languages:** The interface supports EN, HU, DE, FR, ES, IT, PT, and PL. Prompt and translation directions can be switched. Your custom glossary can be exported/imported as JSON.
- **Saved prompts:** Give a successful prompt a title, category, tags, optional video filename, and sample image. A video can supply a sample frame. Export a JSON backup regularly.
- **Searchable media archive:** Add local folders, scan, search embedded/sidecar prompt metadata, preview media, and load or copy prompts. Files without readable prompt metadata still appear but cannot provide a prompt. Give any result 1–5 stars and a category; create your own categories and filter by category or minimum rating.

For text-to-image and image-to-image, choose **Prompt opening / detail → Pro photo opening** to reveal optional **Photographic direction** (such as glamour, portrait, nature, or wildlife) and **Light / time of day** (such as evening, sunset, dawn, or studio lighting). The two choices can be combined. In text-to-image, selected photo lighting replaces the generic lighting phrase so contradictory times of day are not added. The photo opening is omitted for painting, poster, or graphic art. The result remains editable; these are stylistic suggestions, not guaranteed model settings.

Alternatively, **Creative art opening** reveals an **Artistic direction** selector for oil or watercolor painting, expressive painting, digital illustration, graffiti/street art, poster art, and collage. Available directions follow the selected image medium. With a photographic or film-still medium, the creative opening is omitted and a warning appears. Switch medium or opening at any time; the resulting prompt stays editable and does not generate an image.

The personal glossary now holds up to **2,000 pairs**. Open **Suggestions from prompts** inside the glossary to find candidate expressions in the current prompt or the indexed media archive. Only candidate terms are sent to local Ollama for editable translation suggestions. Without Ollama, translations can be typed manually. Every pair requires individual approval; none is saved automatically. The clean ZIP includes no personal glossary or media index.

## From archive result to a new idea or workflow

For results with a readable prompt, **Create something similar** brings that prompt back into Prompt Studio for editing. **Saved settings** shows technical values available in the file; click the row to re-read one result from an older catalog. Missing values are not invented.

**Build a workflow from this** passes the selected prompt, model name, and readable settings to a separately installed and running Workflow Studio on the same computer. Workflow Studio first displays a suggestion and changes its form only when you explicitly accept it. It does not generate anything, overwrite an existing workflow, or automatically transfer the source image. Workflow Studio starts with `Open-Workflow-Studio.cmd` and normally runs at `http://127.0.0.1:18779/`. Prompt Studio remains usable without it.

## Ratings, categories, and previews

Ratings and custom categories are saved separately from the scan index in `data/media-catalog-favorites.json`; the previous saved state is kept in `data/media-catalog-favorites.json.bak`. Both are created only after use and contain personal file identifiers and category choices, so neither is included in this clean ZIP. Back up the `data/` folder before moving a used installation. Ratings are tied to the indexed absolute file paths; moving media to different paths on another computer requires re-cataloging and will not automatically reconnect old ratings. Hiding thumbnails prevents automatic image loading in the results; deliberate large previews and opening in the Windows default app remain available. Opening or previewing never edits the original image.

## Video thumbnails and preview

Archive cards and enlarged viewers show readable saved model, LoRA names and strengths, and technical settings such as resolution, duration, FPS, steps, CFG, seed, sampler, and scheduler. The archive reads details gradually for visible results; opening an enlarged view reads that file directly, so an existing catalog needs no full rescan. Missing metadata is shown as unreadable rather than guessed. Clicking the dark backdrop outside an enlarged image or video closes its viewer; clicks on the media or controls do not. Escape and Close remain available.

The enlarged image and video viewers also show the saved positive and negative prompts. **Copy prompt** copies both when available; **Copy full recipe** adds the readable model, LoRAs with strengths, and technical settings. Unavailable values are marked unreadable. This is a text reference, not an automatic restoration of a generation workflow. Existing catalog entries do not need a rescan because details are read when the viewer opens.

The enlarged image and video viewers have **Previous/Next** navigation across the current search results, including page boundaries and mixed media. From the enlarged view you can rate, choose an existing category, mark an item for later, or open the separately confirmed delete dialog. Marks persist across searching and paging for this browser session only; they do not yet trigger bulk actions. Ratings and categories are saved. With thumbnails enabled, hovering over a video thumbnail briefly starts a muted moving preview. The enlarged video still starts only when you press Play.

When **Show thumbnails** is enabled, visible video results display a frame taken from the video itself. Frames are created temporarily in the browser, not stored in the catalog or written over the original media. Disable the switch to hide them. Click a video to open a larger preview with playback controls. Playback starts only when you press Play and stops when the preview closes. Linking a separate original starting image may be added later.

## A/B comparison and quick analysis

Choose **Select as A** on one archive result and **Select as B** on another, then **Compare and analyze**. The selection survives searching and paging during the session but is not saved. The two files and prompts appear side by side; two videos can be started or paused together. If thumbnails are off, comparison previews stay hidden until explicitly revealed in that comparison.

The immediate analysis distinguishes readable facts from possible trade-offs. It compares prompts, models, and available settings, and reads the video's actual dimensions, duration, frame count and FPS when possible. LoRA and seed values appear only when unambiguously available in saved metadata; unknown values are marked as such. Higher resolution or FPS is not automatically a better result.

**Analyze visible frames locally** is a separate, optional action requiring previews to be shown and local `gemma3:4b`. It sends one image or three sampled video frames per item to local Ollama only. The model's strengths, weaknesses and next-test suggestion are subjective observations, not an objective score; full motion and sound are not assessed. The samples are not stored in the catalog or uploaded to the cloud. Original media remains unchanged. A rescan is not needed for an existing catalog; technical details are reread when the comparison opens.

## Removing media safely

Each search result has **Delete…**. A confirmation window lists the **exact files** before anything is changed. Choose **Move to Recycle Bin** or **Delete permanently**; permanent deletion also requires ticking an acknowledgement box. The operation affects only the selected media file and, when unambiguous, its matching `.swarm.json` sidecar. It does **not** hunt down copies in other folders or delete a separate entry from your browser's Saved prompts. If a file changed since indexing, refresh the archive before deleting it. If Recycle Bin operation fails, the program never switches to permanent deletion automatically.

Try the Recycle Bin choice on an unimportant file first, especially on removable or network drives. Permanent deletion may not be recoverable.

## Data and privacy

- The server listens only on `127.0.0.1:18819`, not on your network or cloud account.
- The catalog index is created after use at `data/media-catalog-index.json.gz`; it contains local paths and extracted prompt text and is **not encrypted**. Logs are stored under `data/logs/`.
- Saved prompts, sample thumbnails, custom choices, language settings, and glossaries live in that browser's local storage. Use the application's JSON export buttons before switching browser, profile, or computer.
- The app does not upload media to the cloud. Optional Ollama runs locally. The user-selected ZIP upload is independent of the app.
- **Important:** The original ZIP is clean. After you run the extracted folder, `data/` and browser-local content may become personal. Do not zip and share a used folder without removing/inspecting that data.

## Troubleshooting

| Symptom | What to do |
| --- | --- |
| Nothing opens | Extract the ZIP, run `SETUP.cmd`, then `START.cmd`. Read any error shown in the command window. |
| Port 18819 belongs to another app | Close the other server first. This edition will not stop an unknown process. |
| Archive has no results | Add an existing absolute folder path and click **Refresh archive**. Search may find a file even if it contains no prompt. |
| AI unavailable | Install/start Ollama and pull `gemma3:4b`; then restart the app. Archive/search still work without AI. |
| Recycle Bin removal fails | The file remains untouched if the primary move fails. Check permissions, file locks, and the drive's Recycle Bin support. |
| A result is stale | Refresh the archive. It is an index, not a live filesystem watcher. |
| Need technical diagnostics | Run `CHECK.cmd`, then check `data/logs/server.stderr.log` if needed. No personal media is bundled in a clean copy. |

For a Hungarian guide, see `README_HU.md`. For short setup steps in all eight interface languages, see `QUICKSTART_8_LANGUAGES.md`.

Official dependencies: <https://nodejs.org/en/download/> · <https://ollama.com/download/windows> · <https://ollama.com/library/gemma3:4b>.

## Optional prompt-writing guide

Open **Prompt writing guide** below the mode selector. **Suggest words while typing** uses your saved prompts, glossary, and candidate expressions from an already indexed local archive. Suggestions appear after two characters; Tab or click inserts one, Esc dismisses it, and nothing is inserted automatically. The setting persists in this browser. No new media scan is needed.

**Suggest a prompt structure** looks for a repeated order in saved working prompts of the selected mode. With too little evidence it clearly shows a basic template instead. The draft is editable and enters the prompt field only when you choose to apply it. The **Step-by-step guide** teaches the subject, setting, action/change, camera, lighting, and style with examples; any answer may be skipped. Inserting a draft asks before replacing a nonempty prompt. After the guide creates a draft, it displays possible contradictions and up to five optional local LoRA suggestions when the model family and inventory are available. Otherwise choose the model family manually. Matches show the contributing words and uncertainty; only the filename can be copied, and nothing is inserted automatically. These helpers do not run generation or send prompt text to the cloud; review and translate the result as needed.

**Check this prompt** runs a local, heuristic checklist for recognizable subject, setting, action, camera, lighting and style. It flags possible contradictions such as locked versus moving camera, silence versus music, a continuous shot versus a cut, photograph versus painting, or strong daylight versus night without a transition. The two new visual conflicts include example wording for a clearer choice, but never rewrite the prompt. This is not a quality score or a guarantee; omissions may be intentional. For a simple omission, the checker offers one editable improvement draft. Replace its ⟦…⟧ placeholder with your own words before applying; replacement requires confirmation and a fresh check if the prompt changes. No AI model or generation is started.
## Selected-word helper

Select a word or short phrase (up to 120 characters) in any of the four prompt editors. The helper checks your personal, bidirectional glossary first. If there is no exact match, you can explicitly ask the optional local Ollama translator for a suggestion; only the selected phrase is sent. Edit the suggestion, then choose whether to replace the selection or save the pair to your glossary. Manual entry works without Ollama. No Google API, automatic replacement, or automatic saving is involved.
## Repeated sentences and hover word preview

**Sentences from archive** in the writing guide suggests sentences that occur in at least two prompts of the selected image/video type. Adding one to the current prompt requires a click. The local launcher can use indexed media prompts; the offline HTML uses browser-saved prompts only.

**Hover word preview** below a prompt is read-only. Hovering checks the personal glossary first; selecting text in the editable prompt still handles multiword phrases. Optional DeepL lookup requires your own [DeepL API key](https://www.deepl.com/en/developers), the local launcher, and explicit opt-in. The key remains in the open browser tab; only the hovered word and language pair are sent over HTTPS. Suggestions never replace text or save glossary entries automatically.
## Experiment journal

Select two archive results as **A** and **B**, then open the A/B comparison. Save a named experiment with your preferred result and a note explaining why. The journal retains readable differences in model, LoRA, seed, resolution, prompt and other settings. Generation time may be entered manually if known; it is not inferred from video duration.

Entries stay in this browser. Export a JSON backup before changing browsers or computers, and import it to restore the journal. Removing a journal entry never deletes media. A saved pair can be reopened only while both unchanged source files remain indexed. The journal does not start generation.
## Local addon advisor

Open **What could help this prompt?** in the result column. Choose the target model family and review the current prompt to see optional LoRA, embedding, and wildcard matches from local filenames and adjacent `.cm-info.json` / `.metadata.json` descriptions. The clean package starts with no personal folders: add specific addon folders under **Local collection** and refresh the inventory. No network lookup or model download occurs. Suggestions are lexical hints, most useful with English prompts, not compatibility or quality guarantees. Unknown compatibility is flagged; no strength is invented. Nothing is enabled or added to a workflow automatically. Wildcards require a compatible workflow.

## Separate negative prompts

All four creation modes and **Surprise me with a prompt** now have a separate editable negative prompt. **Suggest exclusions** offers scene-aware phrases that can be added or removed individually; surprise drafts and image-based suggestions also receive an initial editable negative draft. Positive and negative text can be copied separately. In the classic modes, the **Avoid** input is translated into the separate negative output rather than appended to the positive prompt. Saved-prompt JSON backups and TXT downloads retain the negative text. Use it only when your generation workflow has a separate negative input; suggestions do not imply model support.
