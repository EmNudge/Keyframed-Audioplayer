import { Component, Prop, h } from '@stencil/core';
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

  addKeyframe = e => {
    const { x, y } = this.getPos(e);
    this.canvas.addKeyframe(x, y);
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
        onClick={this.addKeyframe}
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
