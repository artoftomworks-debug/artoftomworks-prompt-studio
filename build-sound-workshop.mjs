import {audioTimingCore} from './audio-timing-core.mjs';
import {audioTimingLabels,audioTimingCss,audioWavePanel,videoAudioAlignmentPanel} from './dist/audio-timing-ui.mjs';
import {writeFileSync} from 'node:fs';
import {soundWorkshopCore,soundHandoffCore} from './sound-workshop-core.mjs';
import {soundWorkshopLabels,soundWorkshopCss,soundWorkshopApp} from './dist/sound-workshop-ui.mjs';
const code=`const audioTimingCore=${audioTimingCore.toString()};const audioTimingLabels=${audioTimingLabels.toString()};const audioWavePanel=${audioWavePanel.toString()};const videoAudioAlignmentPanel=${videoAudioAlignmentPanel.toString()};const soundWorkshopCore=${soundWorkshopCore.toString()};const soundHandoffCore=${soundHandoffCore.toString()};const soundWorkshopLabels=${soundWorkshopLabels.toString()};(${soundWorkshopApp.toString()})(new URL(location.href).searchParams.get('lang')||'EN',soundWorkshopCore,soundHandoffCore,soundWorkshopLabels,{timingCore:audioTimingCore,timingLabels:audioTimingLabels,wavePanel:audioWavePanel});`;
writeFileSync(new URL('./dist/Sound_Workshop.html',import.meta.url),'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Sound workshop</title><style>'+soundWorkshopCss+audioTimingCss+'</style></head><body><script>'+code.replace(/<\/script/gi,'<\\/script')+'</script></body></html>','utf8');
console.log('Sound workshop page built.');
