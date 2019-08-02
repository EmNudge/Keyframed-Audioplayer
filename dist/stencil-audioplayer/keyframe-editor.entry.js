import { r as registerInstance, h } from './chunk-f2536b62.js';

class Canvas {
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
        if (this.draggingIndex === null)
            return;
        this.keyframes = this.sortKeyframes(this.keyframes.map((pos, index) => this.draggingIndex !== index ? pos : mousePos));
        this.draggingIndex = this.getKeyframeIndex(mousePos);
    }
    onClick(x, y) {
        let draggingIndex = null;
        for (const [index, pos] of this.keyframes.entries()) {
            if (this.getDist({ x, y }, pos) >= 8)
                continue;
            draggingIndex = index;
        }
        if (draggingIndex === null) {
            this.keyframes = this.sortKeyframes([...this.keyframes, { x, y }]);
            this.draggingIndex = this.getKeyframeIndex({ x, y });
        }
        else {
            this.draggingIndex = draggingIndex;
        }
    }
    onRelease() {
        this.draggingIndex = null;
    }
    sortKeyframes(keyframes) {
        return keyframes.sort((pos1, pos2) => pos1.x - pos2.x);
    }
    getKeyframeIndex(pos) {
        for (const [index, pos1] of this.keyframes.entries()) {
            if (pos1.x === pos.x && pos1.y === pos.y) {
                return index;
            }
        }
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

class KeyframeEditor {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.canvasClick = e => {
            const { x, y } = this.getPos(e);
            this.canvas.onClick(x, y);
        };
        this.canvasRelease = () => {
            this.canvas.onRelease();
        };
        this.handleHover = e => {
            this.canvas.handleHover(this.getPos(e));
        };
        this.getPos = e => {
            const { x, y } = e.target.getBoundingClientRect();
            return {
                x: ~~(e.clientX - x),
                y: ~~(e.clientY - y)
            };
        };
    }
    componentDidLoad() {
        const { width, height } = this.canvasContainer.getBoundingClientRect();
        this.canvasElement.width = width;
        this.canvasElement.height = height;
        this.canvas = new Canvas(this.canvasElement);
        this.canvas.draw();
    }
    render() {
        return (h("div", { class: "keyframe-editor", ref: el => this.canvasContainer = el, onMouseDown: this.canvasClick, onMouseUp: this.canvasRelease, onMouseMove: this.handleHover }, h("canvas", { width: "100%", height: "500%", ref: el => this.canvasElement = el })));
    }
    static get style() { return ".keyframe-editor {\n  height: 50px;\n  background: rgb(226, 226, 226);\n  cursor: pointer;\n}"; }
}

export { KeyframeEditor as keyframe_editor };
