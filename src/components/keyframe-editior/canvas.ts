interface Position {
  x: number;
  y: number;
}

export default class Canvas {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  keyframes: Position[];
  mousePos: Position;
  hoveredIndex: number;

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
  }

  addKeyframe(x: number, y: number) {
    this.keyframes = [...this.keyframes, { x, y }].sort((pos1, pos2) => pos1.x - pos2.x);
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

  drawKeyframe(pos: Position) {
    const distX = this.mousePos.x - pos.x;
    const distY = this.mousePos.y - pos.y;
    const dist = Math.sqrt(distX**2 + distY**2);

    const isHovering = dist < 8;

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
