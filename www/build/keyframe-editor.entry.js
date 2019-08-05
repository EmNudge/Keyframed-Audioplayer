import { r as registerInstance, h } from './chunk-e49b5c18.js';
import { m as mapRange } from './chunk-3129caa9.js';

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
        for (const [index, pos] of this.keyframes.entries()) {
            this.drawKeyframe(pos, index);
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
    onClick(mousePos) {
        for (const [index, pos] of this.keyframes.entries()) {
            if (this.getDist(mousePos, pos) >= 8)
                continue;
            this.selectedIndex = this.draggingIndex = index;
            return;
        }
        this.addKeyframe(mousePos);
    }
    addKeyframe(pos) {
        this.keyframes = this.sortKeyframes([...this.keyframes, pos]);
        this.draggingIndex = this.selectedIndex = this.getKeyframeIndex(pos);
    }
    onRelease() {
        this.draggingIndex = null;
    }
    onDelete() {
        if (this.selectedIndex === null)
            return;
        this.keyframes = this.keyframes.filter((_, index) => index !== this.selectedIndex);
        if (this.selectedIndex > this.keyframes.length - 1 && this.keyframes.length) {
            this.selectedIndex--;
        }
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
        const keyframes = this.getFullKeyframes();
        let prevPos = keyframes[0];
        this.ctx.strokeStyle = '#aaa';
        for (const pos of keyframes.slice(1)) {
            this.ctx.beginPath();
            this.ctx.moveTo(prevPos.x, prevPos.y);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
            prevPos = pos;
        }
    }
    // gets keyframes including imaginary beginning and ending keyframes
    getFullKeyframes() {
        const firstKeyframe = this.keyframes[0];
        const lastKeyframe = this.keyframes[this.keyframes.length - 1];
        const startY = firstKeyframe ? firstKeyframe.y : this.height / 2;
        const endY = lastKeyframe ? lastKeyframe.y : this.height / 2;
        return [
            { x: 0, y: startY },
            ...this.keyframes,
            { x: this.width, y: endY }
        ];
    }
    getSurroundingKeyframes(xPos) {
        const keyframes = this.getFullKeyframes();
        // array.prototype.reduce was looking weird, so switched to a for-loop
        let leftIndex = 0;
        for (const [index, pos] of keyframes.entries()) {
            if (xPos <= pos.x)
                break;
            const { x } = keyframes[leftIndex];
            if (xPos - pos.x < xPos - x)
                leftIndex = index;
        }
        return {
            prev: keyframes[leftIndex],
            next: keyframes[leftIndex + 1]
        };
    }
    getDist(point, circle) {
        const distX = point.x - circle.x;
        const distY = point.y - circle.y;
        return Math.sqrt(distX ** 2 + distY ** 2);
    }
    drawKeyframe(pos, index) {
        const isHovering = this.getDist(this.mousePos, pos) < 8;
        const isSelected = index === this.selectedIndex;
        this.ctx.beginPath();
        this.ctx.fillStyle = isHovering ? '#444' : 'grey';
        this.ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = isSelected ? 'coral' : 'white';
        this.ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}

class KeyframeEditor {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.canvasClick = e => {
            this.canvas.onClick(this.getPos(e));
        };
        this.canvasRelease = () => {
            this.canvas.onRelease();
        };
        this.handleHover = e => {
            this.canvas.handleHover(this.getPos(e));
        };
        this.handleKeyPress = e => {
            if (e.key !== 'Backspace' && e.key !== 'Delete')
                return;
            this.canvas.onDelete();
        };
        this.getPos = e => {
            const { x, y } = e.target.getBoundingClientRect();
            return {
                x: ~~(e.clientX - x),
                y: ~~(e.clientY - y)
            };
        };
    }
    async getAudioLevel(percentage) {
        const num = this.canvasElement.width * percentage;
        const { prev, next } = this.canvas.getSurroundingKeyframes(num);
        const mappedHeight = mapRange(num, { min: prev.x, max: next.x }, { min: prev.y, max: next.y });
        const volume = mappedHeight / this.canvasElement.height;
        // inversing since we go bottom to top in the UI
        return 1 - volume;
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
        return (h("div", { class: "keyframe-editor", ref: el => this.canvasContainer = el, onMouseDown: this.canvasClick, onMouseUp: this.canvasRelease, onMouseMove: this.handleHover }, h("canvas", { width: "100%", height: "500%", ref: el => this.canvasElement = el })));
    }
    static get style() { return ".keyframe-editor {\n  height: 50px;\n  background: rgb(226, 226, 226);\n  cursor: pointer;\n}"; }
}

export { KeyframeEditor as keyframe_editor };
