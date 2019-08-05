interface Position {
  x: number;
  y: number;
}

interface SurroundingPos {
  prev: Position;
  next: Position;
}

export default class Canvas {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  keyframes: Position[];
  mousePos: Position;
  draggingIndex: number;

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
    for (const pos of this.keyframes) {
      this.drawKeyframe(pos)
    }

    requestAnimationFrame(() => this.draw())
  }

  handleHover(mousePos: Position) {
    this.mousePos = mousePos;
    if (this.draggingIndex === null) return;
    
    this.keyframes = this.sortKeyframes(this.keyframes.map((pos, index) => 
      this.draggingIndex !== index ? pos : mousePos
    ))
    this.draggingIndex = this.getKeyframeIndex(mousePos)
  }

  onClick(x: number, y: number) {
    let draggingIndex = null;
    for (const [index, pos] of this.keyframes.entries()) {
      if (this.getDist({ x, y }, pos) >= 8) continue;
      draggingIndex = index;
    }

    if (draggingIndex === null) {
      this.keyframes = this.sortKeyframes([...this.keyframes, { x, y }]);
      this.draggingIndex = this.getKeyframeIndex({ x, y })
    } else {
      this.draggingIndex = draggingIndex;
    }
  }

  onRelease() {
    this.draggingIndex = null;
  }

  sortKeyframes(keyframes) {
    return keyframes.sort((pos1, pos2) => pos1.x - pos2.x)
  }

  getKeyframeIndex(pos) {
    for (const [index, pos1] of this.keyframes.entries()) {
      if (pos1.x === pos.x && pos1.y === pos.y) {
        return index;
      }
    }
  }

  drawLine() {
    let prevPos: Position = {
      x: 0,
      y: this.keyframes.length ? this.keyframes[0].y : this.height / 2
    };

    this.ctx.strokeStyle = '#aaa'
    for (const pos of this.keyframes) {
      this.ctx.beginPath();
      this.ctx.moveTo(prevPos.x, prevPos.y);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();

      prevPos = pos;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(prevPos.x, prevPos.y);
    this.ctx.lineTo(this.width, prevPos.y);
    this.ctx.stroke();
  }

  getSurroundingKeyframes(xPos: number): SurroundingPos {
    if (xPos < this.keyframes[0].x) {
      return {
        prev: { ...this.keyframes[0], x: 0 },
        next: this.keyframes[0]
      }
    } else if (xPos > this.keyframes.slice(-1)[0].x) {
      const lastKeyframe = this.keyframes.slice(-1)[0];
      return {
        prev: lastKeyframe,
        next: { ...lastKeyframe, x: this.width }
      }
    }

    const leftIndex = this.keyframes.reduce((accum, pos, index) => {
      const currentDist = xPos - pos.x;
      const accumDist = xPos - this.keyframes[accum].x;

      if (accumDist < currentDist) return accum;
      return index;
    }, 0);

    return {
      prev: this.keyframes[leftIndex],
      next: this.keyframes[leftIndex + 1]
    }
  }

  getDist(point: Position, circle: Position): number {
    const distX = point.x - circle.x;
    const distY = point.y - circle.y;
    return Math.sqrt(distX**2 + distY**2);
  }

  drawKeyframe(pos: Position) {
    const isHovering = this.getDist(this.mousePos, pos) < 8;

    this.ctx.beginPath();
    this.ctx.fillStyle = isHovering ? '#444' : 'grey'
    this.ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = 'white'
    this.ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}
