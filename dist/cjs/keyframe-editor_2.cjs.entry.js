'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const __chunk_1 = require('./chunk-3b648be3.js');

function getTimecode(seconds) {
    const minutesNum = Math.floor(seconds / 60);
    const minutesStr = String(minutesNum).padStart(2, "0");
    const secondsNum = Math.floor(seconds - minutesNum * 60);
    const secondsStr = String(secondsNum).padStart(2, "0");
    return `${minutesStr}:${secondsStr}`;
}
function getClass(...classes) {
    return classes.flatMap(className => {
        if (typeof className === "string")
            return [className];
        const classNamesArr = [];
        for (const prop in className) {
            if (className[prop])
                classNamesArr.push(prop);
        }
        return classNamesArr;
    }).join(' ');
}
function mapRange(val, range1, range2) {
    const valueDelta = val - range1.min;
    const range1Delta = range1.max - range1.min;
    const percentage = valueDelta / range1Delta;
    const range2Delta = range2.max - range2.min;
    const mappedRange2Delta = percentage * range2Delta;
    return mappedRange2Delta + range2.min;
}

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

class KeyframeEditor {
    constructor(hostRef) {
        __chunk_1.registerInstance(this, hostRef);
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
        return (__chunk_1.h("div", { class: getClass("keyframe-editor", { collapsed: this.isCollapsed }) }, __chunk_1.h("div", { class: getClass("canvas-container", { collapsed: this.isCollapsed }), ref: el => this.canvasContainer = el }, __chunk_1.h("canvas", { ref: el => this.canvasElement = el, onMouseDown: this.canvasClick, onMouseUp: this.canvasRelease, onMouseMove: this.handleHover })), __chunk_1.h("div", { class: getClass("expand-contract-toggle", { collapsed: this.isCollapsed }), onClick: this.collapseToggle }, __chunk_1.h("span", null, "<"))));
    }
    static get style() { return ".keyframe-editor{--canvas-height:50px;--btn-height:10px;height:calc(var(--canvas-height) + var(--btn-height));cursor:pointer;-webkit-transition:.5s;transition:.5s}.keyframe-editor.collapsed{height:10px}.canvas-container{height:var(--canvas-height);overflow:hidden;background:#e2e2e2;-webkit-transition:.5s;transition:.5s}.canvas-container.collapsed{height:0}.expand-contract-toggle{height:var(--btn-height);background:#20212c;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.expand-contract-toggle span{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block;-webkit-transform:rotate(90deg) scaleX(.5);transform:rotate(90deg) scaleX(.5);-webkit-transition:.5s;transition:.5s}.expand-contract-toggle.collapsed span{-webkit-transform:rotate(90deg) scaleX(-.5);transform:rotate(90deg) scaleX(-.5)}"; }
}

class KeyframedAudioPlayer {
    constructor(hostRef) {
        __chunk_1.registerInstance(this, hostRef);
        this.isPlaying = true;
        this.currentTime = 0;
        this.duration = 0;
        this.updateTime = () => {
            this.currentTime = this.audioFile.currentTime;
        };
        this.updateVolume = async () => {
            const percentage = this.currentTime / this.duration;
            const volume = await this.keyframeEditor.getHeightPercentage(percentage);
            this.audioFile.volume = volume;
        };
        this.togglePlay = () => {
            if (!this.audioFile)
                return;
            this.audioFile[this.isPlaying ? "play" : "pause"]();
            this.isPlaying = !this.isPlaying;
        };
        this.handleTimeSeek = e => {
            const el = e.target.className === "progress-bar" ? e.target.parentElement : e.target;
            const { x, width } = el.getBoundingClientRect();
            const percentage = (e.x - x) / width;
            this.audioFile.currentTime = percentage * this.duration;
        };
        this.getTime = () => {
            return `${getTimecode(this.currentTime)} / ${getTimecode(this.duration)}`;
        };
        this.getWidth = () => {
            return this.currentTime / this.duration * 100 + '%';
        };
    }
    componentDidUpdate() {
        if (!this.audioFile || this.audioFile.src !== this.url)
            this.initializeAudio();
    }
    initializeAudio() {
        this.audioFile = new Audio(this.url);
        this.audioFile.addEventListener('timeupdate', () => {
            this.updateTime();
            this.updateVolume();
        });
        this.audioFile.addEventListener('ended', this.togglePlay);
        this.audioFile.addEventListener('loadeddata', () => this.duration = this.audioFile.duration);
    }
    render() {
        return __chunk_1.h("div", { class: "audioplayer" }, __chunk_1.h("div", { class: "timeline", onClick: this.handleTimeSeek }, __chunk_1.h("div", { class: "progress-bar", style: { width: this.getWidth() } })), __chunk_1.h("div", { class: "body" }, __chunk_1.h("div", { class: "play-container" + (!this.audioFile ? " disabled" : "") }, __chunk_1.h("div", { class: (this.isPlaying ? "play" : "pause") + " btn", onClick: this.togglePlay })), __chunk_1.h("div", { class: "name" }, this.name || "Unknown Song"), __chunk_1.h("div", { class: "time" }, this.getTime())), __chunk_1.h("keyframe-editor", { ref: el => this.keyframeEditor = el, open: true }));
    }
    static get style() { return ".audioplayer{height:50px;font-family:Arial,Helvetica,sans-serif;background:#223143;color:#fff;display:grid;grid-template-rows:auto 40px 1fr}.timeline{cursor:pointer;height:10px;background:#e2e2e2}.progress-bar{height:100%;width:0;background:coral;-webkit-transition:.5s;transition:.5s}.body{display:grid;grid-template-columns:auto 1fr auto;grid-gap:10px;-ms-flex-line-pack:center;align-content:center}.body>*{padding:5px 20px;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}.name{text-align:center}.btn{cursor:pointer}.play-container{width:20px}.play-container.disabled{opacity:.5}.play-container.disabled .btn{cursor:auto}.play{border:7px solid transparent;border-left:12px solid #fff;position:relative;right:-4px}.pause:after,.pause:before{content:\"\";position:absolute;width:3px;top:0;bottom:0;background:#fff}.pause{height:13px;width:11px;position:relative}.pause:before{left:0}.pause:after{right:0}"; }
}

exports.keyframe_editor = KeyframeEditor;
exports.keyframed_audio_player = KeyframedAudioPlayer;
