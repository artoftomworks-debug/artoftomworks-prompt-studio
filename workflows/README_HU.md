# ComfyUI videós workflow-k — biztonsági másolat

Itt van öt tiszta másolat a gépeden mentett workflow-kból: **Eros Simple és Pro, DaSiWa Simple és Pro, valamint LTX 2.5 Gym Simple**. Ezek ComfyUI-ban nyitható JSON-fájlok; nem a külön Workflow Studio program, és nem a Prompt Studio felületén futnak. A Windows alkalmazáscsomag helyett a külön workflow-ZIP-ben vagy a GitHub `workflows` mappájában találod őket.

| Család | Egyszerűbb változat | Több beállítás |
| --- | --- | --- |
| Eros H3 | [Eros Simple](comfyui/Eros_H3_Simple_GLOBAL.json) | [Eros Pro](comfyui/Eros_H3_Pro_GLOBAL.json) |
| DaSiWa H3 | [DaSiWa Simple](comfyui/DaSiWa_H3_Simple_GLOBAL.json) | [DaSiWa Pro](comfyui/DaSiWa_H3_Pro_GLOBAL.json) |
| LTX 2.5 Gym | [LTX Gym Simple](comfyui/LTX_2.5_Gym_Simple_GLOBAL.json) | — |

Az Eros-fájlok a helyben mentett `GOOD` változatokból készültek. A DaSiWa-mentések a `GLOBAL_MONITOR` változatokból származnak; a Simple példányban a saját kezdőkép nevét és jelenetpromptját semleges mintára cseréltem. Az LTX a bevált Gym `GLOBAL_REVIEW_Good` változat másolata, ugyanezzel a két cserével. A csomópontok, összekötések és generálási számértékek változatlanok. A semleges minta-promptokkal külön videógenerálást nem állítok be kipróbáltnak. A régi LTX `04_LTX_2.5_GLOBAL` kísérleti változatok nincsenek itt, mert a saját leírásuk szerint még nem voltak minőségileg jóváhagyva.

Másik gépen: telepítsd a megfelelő ComfyUI-t, modelleket és kiegészítő csomópontokat, nyisd meg a JSON-t, válaszd ki a saját kezdőképedet, írd be a saját promptodat, majd ellenőrizd a modellt, hosszt, FPS-t és felbontást. Az Eros/DaSiWa H3-hoz H3-modell és ArtofTomworks H3-monitor kell; az LTX-hez LTX 2.5-összetevők és ArtofTomworks LTX-monitor. A grafikonok többek között rgthree-, KJNodes- és Crystools-csomópontokat használnak. **A JSON önmagában nem telepíti ezeket.** Az `example.png` csak helyőrző; futtatás előtt válassz igazi képet.

Ebben a mappában nincs saját kép, videó, személyes jelenetprompt, teljes helyi elérési út, modellfájl vagy API-kulcs. A workflow-mentések nyilvános megosztásra készültek; a modellek és egyedi node-csomagok továbbra is külön szükségesek, saját felhasználási feltételeikkel.
