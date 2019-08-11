'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const __chunk_1 = require('./chunk-3b648be3.js');

const defineCustomElements = (win, options) => {
  return __chunk_1.patchEsm().then(() => {
    __chunk_1.bootstrapLazy([["keyframe-editor_2.cjs",[[1,"keyframed-audio-player",{"name":[1],"url":[1],"isPlaying":[32],"currentTime":[32],"duration":[32],"audioFile":[32]}],[1,"keyframe-editor",{"open":[4],"isCollapsed":[32],"getHeightPercentage":[64]}]]]], options);
  });
};

exports.defineCustomElements = defineCustomElements;
