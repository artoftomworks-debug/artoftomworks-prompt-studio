# Local AI: image understanding and GPU memory

**First installation / Első telepítés:** [Eight-language setup and empty-list troubleshooting](LOCAL_AI_FIRST_RUN_8_LANGUAGES.md). Install and start Ollama separately, download a local vision model, then check the list again. The Studio ZIP does not supply model weights.

Prompt Studio does not generate images or videos. Its optional local assistant uses a separately installed Ollama model for prompt assistance and, when supported by the selected model, image understanding.

**Run local image analysis and GPU-based image/video generation one after the other.** SwarmUI, ComfyUI and Ollama may compete for the same GPU memory. Running them together can exhaust VRAM, cause major slowdowns or errors, and make the computer appear frozen. We have encountered this during concurrent use on our own machine.

1. Wait for generation to finish. If the generator keeps its model on the GPU, use its own unload/free-memory feature or close the generator.
2. Then request image analysis or a prompt suggestion in Prompt Studio.
3. Before starting generation again, unload the Ollama model too if it is still resident. Receiving a completed answer does not necessarily mean the model has already left GPU memory.

Download size is not total runtime memory usage: image processing, context and runtime overhead also consume memory. Having 12 GB of VRAM does not guarantee that multiple models can run together. An empty generation queue does not prove that GPU memory is free.

## Optional models

- `gemma3:4b`: general text and image assistance; it may decline some requests.
- `dolphin3:8b`: text only; it cannot interpret attached images.
- `promptstudio-vision:4b`: a local experimental vision profile for `huihui_ai/qwen3-vl-abliterated:4b-instruct-q4_K_M` (approximately 3.3 GB download). Its creator modified it to reduce refusals. The profile uses a 4096-token context and a small processing batch; it references the same model weights without duplicating the large files. Successful processing of every content type or high-quality responses is not guaranteed.
- The previously examined `huihui_ai/gemma3-abliterated:4b` failed to load in our setup (Ollama 0.40.4, token-embedding dimension mismatch). We do not currently recommend that variant.

Models are separate downloads and are not bundled with Prompt Studio. Their own terms apply. The selector indicates image capability, not content permissiveness.

Model reference: https://ollama.com/huihui_ai/qwen3-vl-abliterated:4b-instruct-q4_K_M


A helyi MI válaszának befejezése után az UNLOAD_LOCAL_AI.cmd segítségével kiüríthetők az Ollama-modelljei; ez nem törli a letöltött fájlokat.
After the local AI answer has finished, UNLOAD_LOCAL_AI.cmd can unload resident Ollama models without deleting their downloaded files.

## Set up the optional experimental vision profile

The profile is **not installed by the ZIP**. Install and start Ollama separately. With generation stopped and enough free memory/storage, open a terminal in this folder and run:

```powershell
ollama pull huihui_ai/qwen3-vl-abliterated:4b-instruct-q4_K_M
ollama create promptstudio-vision:4b -f Modelfile.vision
```

The first command downloads approximately 3.3 GB. The second creates an alias with the settings below and reuses the weights. If you use portable Ollama, run its executable instead of `ollama`, using the same `OLLAMA_MODELS` location as your normal Ollama server. No personal portable path is built into this release. A functioning Ollama version with support for this model is required; our local test used 0.40.4.

In the AI helper, choose **Local Ollama**, attach an image and select `promptstudio-vision:4b` in **Local model**. Refresh the model list or reopen the helper if it was open during installation. The underlying full model name is also selectable if it reports vision support. Check the profile and source-model terms before use.

This community model is experimental. It can misunderstand a scene, produce repeated text or ignore the requested explanation language. English prompt output was tested; Hungarian explanation adherence was imperfect. It is not a verified replacement for every content type. A model's image capability and its content policy are different things.

The built-in assistant reads image content to suggest wording; it does not edit the pixels or generate the final video. Pick an appropriate generator separately.

---

# Helyi MI: képértés és videómemória

A Prompt Studio nem generál képeket vagy videókat. A helyi MI-segítő az Ollama külön telepített modelljét használja promptokhoz és – képet értő modell esetén – képelemzéshez.

**A helyi képelemzést és a GPU-t használó kép-/videógenerálást egymás után futtasd.** A SwarmUI, ComfyUI és Ollama ugyanazért a videómemóriáért versenyezhet. Ha egyszerre használod őket, a memória elfogyhat, a programok jelentősen lelassulhatnak vagy hibázhatnak; a gép akár lefagyottnak is tűnhet. A saját gépünkön párhuzamos használatnál már jelentkezett ilyen probléma.

1. Várd meg a generálás végét. Ha a generálóprogram továbbra is a GPU-n tartja a modelljét, szabadítsd fel azt a program saját modellkiürítési funkciójával, vagy zárd be a generálóprogramot.
2. Ezután kérj képelemzést vagy promptjavaslatot a Prompt Studióban.
3. Új generálás előtt ürítsd ki az Ollama-modellt is, ha még a memóriában van. A válasz elkészülte nem feltétlenül jelenti azt, hogy a modell azonnal felszabadult.

A letöltési méret nem azonos a teljes futási memóriaigénnyel: a kép feldolgozása, a szövegkörnyezet és a futtatóprogram is használ memóriát. A 12 GB VRAM önmagában nem garantálja több modell párhuzamos működését. Az üres generálási sor sem bizonyítja, hogy a GPU memóriája szabad.

## Választható modellek

- `gemma3:4b`: általános szöveges és képes segítség; egyes kéréseket visszautasíthat.
- `dolphin3:8b`: csak szöveg; csatolt képet nem értelmez.
- `promptstudio-vision:4b`: helyi, kísérleti képes profil a `huihui_ai/qwen3-vl-abliterated:4b-instruct-q4_K_M` modellhez (körülbelül 3,3 GB letöltés). A készítő csökkentett elutasításokra módosította. A profil 4096 tokenes szövegkörnyezetet és kis feldolgozási köteget használ; ugyanazokra a súlyfájlokra hivatkozik, ezért nem duplázza a nagy modellfájlokat. Nem garantált minden tartalom feldolgozása vagy a jó válaszminőség.
- A korábban megvizsgált `huihui_ai/gemma3-abliterated:4b` nálunk betöltési hibát adott (Ollama 0.40.4, token-beágyazási méreteltérés). Ezt a változatot jelenleg nem ajánljuk.

A modellek külön letöltések, nem részei a Prompt Studio csomagjának. A használatukra a saját feltételeik vonatkoznak. A választó képértést jelez, nem tartalmi engedékenységet.

## Az opcionális kísérleti képes profil telepítése

A ZIP nem telepíti a modellt. Külön telepített, futó Ollama mellett, leállított generálásnál nyiss terminált ebben a mappában, és add ki a fenti két parancsot. Az első körülbelül 3,3 GB-ot tölt le; a második ugyanazokkal a súlyokkal elkészíti a `promptstudio-vision:4b` profilt.

Hordozható Ollamánál a saját futtatható fájlodat használd, ugyanazzal az `OLLAMA_MODELS` tárolóval, amellyel a megszokott Ollama-kiszolgálód fut. Nincs személyes útvonal beépítve. A helyi próbához 0.40.4-et használtunk; a választott változatnak támogatnia kell a modellt.

Az MI-segítőben válaszd a Helyi Ollamát, csatolj képet, majd a Helyi modell mezőben a `promptstudio-vision:4b` profilt. Telepítés közben nyitva maradt modelllistát frissítsd, vagy nyisd újra a segítőt. A teljes modellnév is választható, ha képértést jelez.

Ez kísérleti közösségi modell. Félreérthet képet, ismételhet, és a magyarázat nyelvét sem mindig tartja be. Az angol promptot működőnek találtuk; a magyar magyarázat nem mindig sikerült. A képértés és a tartalmi engedékenység külön tulajdonság. Explicit kép feldolgozását nem ellenőriztük.
