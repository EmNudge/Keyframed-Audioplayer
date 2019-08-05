import { Component, Prop, Method, h } from '@stencil/core';
import { mapRange } from '../../utils/utils'
import Canvas from './canvas'

@Component({
  tag: 'keyframe-editor',
  styleUrl: 'keyframe-editor.css',
  shadow: true
})

export class KeyframeEditor {
  @Prop() open: boolean;

  private canvasElement?: HTMLCanvasElement;
  private canvasContainer?: HTMLDivElement;
  private canvas: Canvas;

  canvasClick = e => {
    const { x, y } = this.getPos(e);
    this.canvas.onClick(x, y);
  }

  canvasRelease = () => {
    this.canvas.onRelease();
  }

  handleHover = e => {
    this.canvas.handleHover(this.getPos(e))
  }

  getPos = e => {
    const { x, y } = e.target.getBoundingClientRect();
    return {
      x: ~~(e.clientX - x),
      y: ~~(e.clientY - y)
    }
  }

  @Method()
  async getAudioLevel(percentage: number): Promise<number> {
    const num = this.canvasElement.width * percentage;
    const { prev, next } = this.canvas.getSurroundingKeyframes(num);
    const mappedHeight = mapRange(
      num, 
      { min: prev.x, max: next.x }, 
      { min: prev.y, max: next.y }
    );
    const volume = mappedHeight / this.canvasElement.height;

    // inversing since we go bottom to top in the UI
    return 1 - volume;
  }

  componentDidLoad() {
    const { width, height } = this.canvasContainer.getBoundingClientRect();
    this.canvasElement.width = width
    this.canvasElement.height = height

    this.canvas = new Canvas(this.canvasElement);
    this.canvas.draw();
  }

  render() {
    return (
      <div
        class="keyframe-editor"
        ref={el => this.canvasContainer = el as HTMLDivElement}
        onMouseDown={this.canvasClick}
        onMouseUp={this.canvasRelease}
        onMouseMove={this.handleHover}
      >
        <canvas
          width="100%"
          height="500%"
          ref={el => this.canvasElement = el as HTMLCanvasElement}
        />
      </div>
    )
  }
}
