interface Position {
  x: number;
  y: number;
}

interface SurroundingPos {
  prev: Position;
  next: Position;
}

interface Keyframe {
  x: number;
  y: number;
  id: symbol;
}

export default class Canvas {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  keyframes: Keyframe[];
  mousePos: Position;

  draggedId: symbol;
  selectedId: symbol;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.keyframes = [];
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.width);

    this.drawLine();
    for (const keyframe of this.keyframes) {
      this.drawKeyframe(keyframe)
    }

    requestAnimationFrame(() => this.draw())
  }

  handleHover(mousePos: Position) {
    this.mousePos = mousePos;
    if (this.draggedId === null) return;
    if (this.isColliding(mousePos)) return;

    this.keyframes = this.sortKeyframes(this.keyframes.map(keyframe =>
      this.draggedId === keyframe.id ? { ...mousePos, id: keyframe.id } : keyframe
    ));
  }

  onClick(mousePos: Position) {
    for (const keyframe of this.keyframes) {
      if (this.getDist(mousePos, keyframe) >= 8) continue;

      this.selectedId = this.draggedId = keyframe.id;
      return;
    }

    this.addKeyframe(mousePos);
  }

  addKeyframe(pos: Position) {
    const keyframe = { ...pos, id: Symbol() };
    this.keyframes = this.sortKeyframes([...this.keyframes, keyframe]);
    this.draggedId = this.selectedId = keyframe.id;
  }

  onRelease() {
    this.draggedId = null;
  }

  // removes keyframe and reassigns selectedId if any id is selected
  onDelete() {
    if (this.selectedId === null) return;

    const selectedIndex = this.getKeyframeIndex(this.selectedId);
    this.keyframes = this.keyframes.filter(keyframe => keyframe.id !== this.selectedId);

    // if no more keyframes, set selectedId to null and return
    if (!this.keyframes.length){
      this.selectedId = null;
      return;
    }
    // change selected ID
    const newIndex =  this.keyframes.length > selectedIndex ? selectedIndex : selectedIndex - 1;
    this.selectedId = this.keyframes[newIndex].id;
  }

  sortKeyframes(keyframes: Keyframe[]): Keyframe[] {
    return keyframes.sort((pos1, pos2) => pos1.x - pos2.x)
  }

  getKeyframeIndex(id: symbol) {
    for (const [index, keyframe] of this.keyframes.entries()) {
      if (keyframe.id === id) return index;
    }
  }

  hasSelected() {
    return this.selectedId !== null;
  }
  deselect() {
    this.selectedId = null;
  }

  drawLine() {
    const keyframes = this.getFullKeyframes();
    let prevPos = keyframes[0];

    this.ctx.strokeStyle = '#aaa'
    for (const pos of keyframes.slice(1)) {
      this.ctx.beginPath();
      this.ctx.moveTo(prevPos.x, prevPos.y);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();

      prevPos = pos;
    }
  }

  // gets keyframes including imaginary beginning and ending keyframes
  getFullKeyframes(): Keyframe[] {
    const firstKeyframe = this.keyframes[0];
    const lastKeyframe = this.keyframes[this.keyframes.length - 1];
    const startY = firstKeyframe ? firstKeyframe.y : this.height / 2;
    const endY = lastKeyframe ? lastKeyframe.y : this.height / 2;

    return [
      { x: 0, y: startY, id: Symbol('start') },
      ...this.keyframes,
      { x: this.width, y: endY, id: Symbol('end')}
    ]
  }

  getSurroundingKeyframes(xPos: number): SurroundingPos {
    const keyframes = this.getFullKeyframes();

    // array.prototype.reduce was looking weird, so switched to a for-loop
    let leftIndex = 0;
    for (const [index, pos] of keyframes.entries()) {
      if (xPos <= pos.x) break;
      const {x} = keyframes[leftIndex];
      if (xPos - pos.x < xPos - x) leftIndex = index;
    }

    return {
      prev: keyframes[leftIndex],
      next: keyframes[leftIndex + 1]
    }
  }

  getDist(point: Position, circle: Position|Keyframe): number {
    const distX = point.x - circle.x;
    const distY = point.y - circle.y;
    return Math.sqrt(distX**2 + distY**2);
  }

  isColliding(mousePos: Position) {
    return this.keyframes.some(keyframe => {
      return Math.abs(mousePos.x - keyframe.x) < 2
    })
  }

  drawKeyframe(keyframe: Keyframe) {
    const isHovering = this.getDist(this.mousePos, keyframe) < 8;
    const isSelected = keyframe.id === this.selectedId;

    this.ctx.beginPath();
    this.ctx.fillStyle = isHovering ? '#444' : 'grey';
    this.ctx.arc(keyframe.x, keyframe.y, 8, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = isSelected ? 'coral' : 'white';
    this.ctx.arc(keyframe.x, keyframe.y, 4, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}
