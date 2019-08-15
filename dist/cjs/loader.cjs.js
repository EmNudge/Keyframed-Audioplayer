'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-a8ff6974.js');

const defineCustomElements = (win, options) => {
  return core.patchEsm().then(() => {
    core.bootstrapLazy([["keyframe-editor_2.cjs",[[1,"keyframed-audio-player",{"name":[1],"url":[1],"isPaused":[32],"currentTime":[32],"duration":[32],"audioFile":[32]}],[1,"keyframe-editor",{"open":[4],"name":[1],"isCollapsed":[32],"getHeightPercentage":[64]}]]]], options);
  });
};

exports.defineCustomElements = defineCustomElements;
