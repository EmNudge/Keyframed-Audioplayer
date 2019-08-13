import { r as registerInstance, h } from './core-d79ee1c8.js';
import { m as mapRange, a as getClass } from './utils-9ca996e5.js';

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
        for (const keyframe of this.keyframes) {
            this.drawKeyframe(keyframe);
        }
        requestAnimationFrame(() => this.draw());
    }
    handleHover(mousePos) {
        this.mousePos = mousePos;
        if (this.draggedId === null)
            return;
        this.keyframes = this.sortKeyframes(this.keyframes.map(keyframe => this.draggedId === keyframe.id ? Object.assign({}, mousePos, { id: keyframe.id }) : keyframe));
    }
    onClick(mousePos) {
        for (const keyframe of this.keyframes) {
            if (this.getDist(mousePos, keyframe) >= 8)
                continue;
            this.selectedId = this.draggedId = keyframe.id;
            return;
        }
        this.addKeyframe(mousePos);
    }
    addKeyframe(pos) {
        const keyframe = Object.assign({}, pos, { id: Symbol() });
        this.keyframes = this.sortKeyframes([...this.keyframes, keyframe]);
        this.draggedId = this.selectedId = keyframe.id;
    }
    onRelease() {
        this.draggedId = null;
    }
    // removes keyframe and reassigns selectedId if any id is selected
    onDelete() {
        if (this.selectedId === null)
            return;
        const selectedIndex = this.getKeyframeIndex(this.selectedId);
        this.keyframes = this.keyframes.filter(keyframe => keyframe.id !== this.selectedId);
        // if no more keyframes, set selectedId to null and return
        if (!this.keyframes.length) {
            this.selectedId = null;
            return;
        }
        // change selected ID
        const newIndex = this.keyframes.length > selectedIndex ? selectedIndex : selectedIndex - 1;
        this.selectedId = this.keyframes[newIndex].id;
    }
    sortKeyframes(keyframes) {
        return keyframes.sort((pos1, pos2) => pos1.x - pos2.x);
    }
    getKeyframeIndex(id) {
        for (const [index, keyframe] of this.keyframes.entries()) {
            if (keyframe.id === id)
                return index;
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
            { x: 0, y: startY, id: Symbol('start') },
            ...this.keyframes,
            { x: this.width, y: endY, id: Symbol('end') }
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
    drawKeyframe(keyframe) {
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

const KeyframeEditor = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isCollapsed = false;
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
        this.collapseToggle = () => {
            this.isCollapsed = !this.isCollapsed;
        };
    }
    async getHeightPercentage(widthPercentage) {
        const num = this.canvasElement.width * widthPercentage;
        const { prev, next } = this.canvas.getSurroundingKeyframes(num);
        const mappedHeight = mapRange(num, { min: prev.x, max: next.x }, { min: prev.y, max: next.y });
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
        return (h("div", { class: getClass("keyframe-editor", { collapsed: this.isCollapsed }) }, h("div", { class: getClass("canvas-container", { collapsed: this.isCollapsed }), ref: el => this.canvasContainer = el }, h("canvas", { ref: el => this.canvasElement = el, onMouseDown: this.canvasClick, onMouseUp: this.canvasRelease, onMouseMove: this.handleHover })), h("div", { class: getClass("expand-contract-toggle", { collapsed: this.isCollapsed }), onClick: this.collapseToggle }, h("div", { class: "name" }, this.name || ''), h("div", { class: "icon" }, h("span", null, "<")))));
    }
    static get style() { return ".keyframe-editor {\n  --canvas-height: 50px;\n  --btn-height: 10px;\n  height: calc(var(--canvas-height) + var(--btn-height));\n  cursor: pointer;\n  -webkit-transition: .5s;\n  transition: .5s;\n  position: relative;\n}\n.keyframe-editor.collapsed {\n  height: 10px;\n}\n\n.canvas-container {\n  height: var(--canvas-height);\n  overflow: hidden;\n  background: rgb(226, 226, 226);\n  -webkit-transition: .5s;\n  transition: .5s;\n}\n.canvas-container.collapsed {\n  height: 0px;\n}\n\n.expand-contract-toggle > * {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  height: var(--btn-height);\n}\n.expand-contract-toggle {\n  background: rgb(32, 33, 44);\n  display: grid;\n  grid-template-columns: 20px 1fr;\n  -ms-flex-line-pack: center;\n  align-content: center;\n  padding: 0 8px;\n}\n\n.expand-contract-toggle .icon {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n  justify-content: center;\n}\n.expand-contract-toggle .icon span {\n  -webkit-transform: rotate(90deg) scale(.5, 1);\n  transform: rotate(90deg) scale(.5, 1);\n  -webkit-transition: .5s;\n  transition: .5s;\n}\n.expand-contract-toggle.collapsed .icon span {\n  -webkit-transform: rotate(90deg) scale(-.5, 1);\n  transform: rotate(90deg) scale(-.5, 1);\n}\n\n.expand-contract-toggle .name {\n  color: rgba(255, 255, 255, 0.4);\n  font-size: 9px;\n}"; }
};

export { KeyframeEditor as keyframe_editor };
