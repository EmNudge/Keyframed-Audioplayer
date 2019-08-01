import { Component, Prop, State, h } from '@stencil/core';
import { initialize } from './canvas'

@Component({
  tag: 'keyframe-editor',
  styleUrl: 'keyframe-editor.css',
  shadow: true
})

export class KeyframeEditor {
  @Prop() open: boolean;

  @State() keyframes: any[] = ['hi', 'hello', 'hey'];

  private canvas?: HTMLCanvasElement;
  private canvasContainer?: HTMLDivElement;

  addKeyframe = () => {
    this.keyframes = [...this.keyframes, 'bargles']
  }

  componentDidLoad() {
    const { width, height } = this.canvasContainer.getBoundingClientRect();
    this.canvas.width = width
    this.canvas.height = height
    
    const ctx = this.canvas.getContext('2d');
    initialize(ctx);
  }

  render() {
    return (
      <div 
        class="keyframe-editor"
        ref={el => this.canvasContainer = el as HTMLDivElement}
        onClick={this.addKeyframe}
      >
        <canvas 
          width="100%" 
          height="500%" 
          ref={el => this.canvas = el as HTMLCanvasElement} 
        />
        {this.keyframes.map(keyframe => (
          <div class="keyframe">{keyframe}</div>
        ))}
      </div>
    )
  }
}