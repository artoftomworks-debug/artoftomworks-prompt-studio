# Companion ComfyUI video workflows

These are five clean backups of the owner's saved ComfyUI graphs. They are **not** the separate Workflow Studio application and do not run inside Prompt Studio. The Prompt Studio `v1.19.0` download ZIP was made before these backups were added; download the JSON files from this folder when needed.

| Model family | Simpler graph | More controls |
| --- | --- | --- |
| Eros H3 | [Eros_H3_Simple_GLOBAL.json](comfyui/Eros_H3_Simple_GLOBAL.json) | [Eros_H3_Pro_GLOBAL.json](comfyui/Eros_H3_Pro_GLOBAL.json) |
| DaSiWa H3 | [DaSiWa_H3_Simple_GLOBAL.json](comfyui/DaSiWa_H3_Simple_GLOBAL.json) | [DaSiWa_H3_Pro_GLOBAL.json](comfyui/DaSiWa_H3_Pro_GLOBAL.json) |
| LTX 2.5 Gym | [LTX_2.5_Gym_Simple_GLOBAL.json](comfyui/LTX_2.5_Gym_Simple_GLOBAL.json) | — |

The Eros files were copied from the locally saved `GOOD` graphs. The DaSiWa files came from the saved `GLOBAL_MONITOR` graphs; the Simple copy had its personal input-image filename and scene prompt replaced with neutral placeholders. The LTX file came from the saved Gym `GLOBAL_REVIEW_Good` graph, with the same two fields replaced. Node identities, links and all generation settings were preserved; no rendering test was claimed for the placeholder prompts. The older LTX `04_LTX_2.5_GLOBAL` drafts are intentionally excluded because their own notes say they were not quality-approved.

To use one on another computer, install compatible ComfyUI, the required model files and custom nodes, then import the JSON. Select your own start image, write your own scene prompt, check model selections, duration, FPS and resolution, and only then queue a generation. The Eros and DaSiWa graphs use H3-related models and the ArtofTomworks H3 monitor; the LTX graph uses LTX 2.5 components and the ArtofTomworks LTX monitor. Other required nodes include rgthree, KJNodes and Crystools. A JSON file alone does **not** install any of those dependencies.

No personal image, video, prompt, local absolute path, model weight, or API credential is included in this folder. The `example.png` image name is only a placeholder: choose a real image in ComfyUI before running. Keep this repository private until you separately review whether any part should be shared publicly.

Hungarian instructions: [README_HU.md](README_HU.md).
