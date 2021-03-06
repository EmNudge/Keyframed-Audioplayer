/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface KeyframeEditor {
    'getHeightPercentage': (widthPercentage: number) => Promise<number>;
    'name': string;
    'open': boolean;
  }
  interface KeyframedAudioPlayer {
    'name': string;
    'url': string;
  }
}

declare global {


  interface HTMLKeyframeEditorElement extends Components.KeyframeEditor, HTMLStencilElement {}
  var HTMLKeyframeEditorElement: {
    prototype: HTMLKeyframeEditorElement;
    new (): HTMLKeyframeEditorElement;
  };

  interface HTMLKeyframedAudioPlayerElement extends Components.KeyframedAudioPlayer, HTMLStencilElement {}
  var HTMLKeyframedAudioPlayerElement: {
    prototype: HTMLKeyframedAudioPlayerElement;
    new (): HTMLKeyframedAudioPlayerElement;
  };
  interface HTMLElementTagNameMap {
    'keyframe-editor': HTMLKeyframeEditorElement;
    'keyframed-audio-player': HTMLKeyframedAudioPlayerElement;
  }
}

declare namespace LocalJSX {
  interface KeyframeEditor extends JSXBase.HTMLAttributes<HTMLKeyframeEditorElement> {
    'name'?: string;
    'open'?: boolean;
  }
  interface KeyframedAudioPlayer extends JSXBase.HTMLAttributes<HTMLKeyframedAudioPlayerElement> {
    'name'?: string;
    'url'?: string;
  }

  interface IntrinsicElements {
    'keyframe-editor': KeyframeEditor;
    'keyframed-audio-player': KeyframedAudioPlayer;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


