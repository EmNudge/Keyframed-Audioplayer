export default class Canvas {
    constructor(canvas) {
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
            this.drawKeyframe(pos);
        }
        requestAnimationFrame(() => this.draw());
    }
    handleHover(mousePos) {
        this.mousePos = mousePos;
    }
    addKeyframe(x, y) {
        this.keyframes = [...this.keyframes, { x, y }].sort((pos1, pos2) => pos1.x - pos2.x);
    }
    drawLine() {
        let prevPos = {
            x: 0,
            y: this.keyframes.length ? this.keyframes[0].y : this.height / 2
        };
        this.ctx.strokeStyle = '#aaa';
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
    getDist(point, circle) {
        const distX = point.x - circle.x;
        const distY = point.y - circle.y;
        return Math.sqrt(distX ** 2 + distY ** 2);
    }
    drawKeyframe(pos) {
        const isHovering = this.getDist(this.mousePos, pos) < 8;
        this.ctx.beginPath();
        this.ctx.fillStyle = isHovering ? '#444' : 'grey';
        this.ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        this.ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}
