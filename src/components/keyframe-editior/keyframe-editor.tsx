import { Component, Prop, State, Method, h } from '@stencil/core';
import { mapRange, getClass } from '../../utils/utils'
import Canvas from './canvas'

@Component({
  tag: 'keyframe-editor',
  styleUrl: 'keyframe-editor.css',
  shadow: true
})

export class KeyframeEditor {
  @Prop() open: boolean;
  @Prop() name: string;
  @State() isCollapsed: boolean = false;

  private canvasElement?: HTMLCanvasElement;
  private canvasContainer?: HTMLDivElement;
  private canvas: Canvas;

  canvasClick = e => {
    this.canvas.onClick(this.getPos(e));
  }

  canvasRelease = () => {
    this.canvas.onRelease();
  }

  handleHover = e => {
    this.canvas.handleHover(this.getPos(e))
  }

  handleKeyPress = e => {
    if (e.key !== 'Backspace' && e.key !== 'Delete') return;
    this.canvas.onDelete();
  }

  getPos = e => {
    const { x, y } = e.target.getBoundingClientRect();
    return {
      x: ~~(e.clientX - x),
      y: ~~(e.clientY - y)
    }
  }

  collapseToggle = () => {
    this.isCollapsed = !this.isCollapsed;
  }

  @Method()
  async getHeightPercentage(widthPercentage: number): Promise<number> {
    const num = this.canvasElement.width * widthPercentage;
    const { prev, next } = this.canvas.getSurroundingKeyframes(num);
    const mappedHeight = mapRange(
      num,
      { min: prev.x, max: next.x },
      { min: prev.y, max: next.y }
    );
    const heightPercentage = mappedHeight / this.canvasElement.height;

    // inversing since we go bottom to top in the UI
    return 1 - heightPercentage;
  }

  componentDidLoad() {
    const { width, height } = this.canvasContainer.getBoundingClientRect();
    this.canvasElement.width = width;
    this.canvasElement.height = height;

    window.addEventListener('keydown', this.handleKeyPress);

    this.canvas = new Canvas(this.canvasElement);
    this.canvas.draw();
  }

  render() {
    return (
      <div
        class={getClass("keyframe-editor", {collapsed: this.isCollapsed})}
      >
        <div
          class={getClass("canvas-container", {collapsed: this.isCollapsed})}
          ref={el => this.canvasContainer = el as HTMLDivElement}
        >
          <canvas
            ref={el => this.canvasElement = el as HTMLCanvasElement}
            onMouseDown={this.canvasClick}
            onMouseUp={this.canvasRelease}
            onMouseMove={this.handleHover}
          />
        </div>
        <div
          class={getClass("expand-contract-toggle", {collapsed: this.isCollapsed})}
          onClick={this.collapseToggle}
        >
          <div class="name">{this.name || ''}</div>
          <div class="icon">
            <span>&lt;</span>
          </div>
        </div>
      </div>
    )
  }
}
