import { a as patchEsm, b as bootstrapLazy } from './core-36f15eaa.js';

const defineCustomElements = (win, options) => {
  return patchEsm().then(() => {
    bootstrapLazy([["keyframe-editor_2",[[1,"keyframed-audio-player",{"name":[1],"url":[1],"isPaused":[32],"currentTime":[32],"duration":[32],"audioFile":[32]}],[1,"keyframe-editor",{"open":[4],"name":[1],"isCollapsed":[32],"getHeightPercentage":[64]}]]]], options);
  });
};

export { defineCustomElements };
