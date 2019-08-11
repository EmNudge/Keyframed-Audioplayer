import { a as patchEsm, b as bootstrapLazy } from './chunk-10dd6b23.js';

const defineCustomElements = (win, options) => {
  return patchEsm().then(() => {
    bootstrapLazy([["keyframe-editor_2",[[1,"keyframed-audio-player",{"name":[1],"url":[1],"isPlaying":[32],"currentTime":[32],"duration":[32],"audioFile":[32]}],[1,"keyframe-editor",{"open":[4],"isCollapsed":[32],"getHeightPercentage":[64]}]]]], options);
  });
};

export { defineCustomElements };
