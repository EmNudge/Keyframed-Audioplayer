import { p as patchBrowser, g as globals, b as bootstrapLazy } from './chunk-f2536b62.js';

patchBrowser().then(resourcesUrl => {
  globals();
  return bootstrapLazy([["keyframe-editor",[[1,"keyframe-editor",{"open":[4]}]]],["keyframed-audio-player",[[1,"keyframed-audio-player",{"name":[1],"url":[1],"isPlaying":[32],"currentTime":[32],"duration":[32],"audioFile":[32]}]]]], { resourcesUrl });
});
