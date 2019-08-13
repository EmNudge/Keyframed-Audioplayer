import { p as patchBrowser, g as globals, b as bootstrapLazy } from './core-d79ee1c8.js';

patchBrowser().then(options => {
  globals();
  return bootstrapLazy([["keyframe-editor",[[1,"keyframe-editor",{"open":[4],"isCollapsed":[32],"getHeightPercentage":[64]}]]],["keyframed-audio-player",[[1,"keyframed-audio-player",{"name":[1],"url":[1],"isPaused":[32],"currentTime":[32],"duration":[32],"audioFile":[32]}]]]], options);
});
