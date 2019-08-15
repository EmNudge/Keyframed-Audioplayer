'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('./core-a8ff6974.js');

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
    if (range1.max - range1.min === 0)
        return;
    const valueDelta = val - range1.min;
    const range1Delta = range1.max - range1.min;
    const percentage = valueDelta / range1Delta;
    const range2Delta = range2.max - range2.min;
    const fixedPercentage = percentage === Infinity ? 0.5 : percentage;
    const mappedRange2Delta = fixedPercentage * range2Delta;
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
        if (this.isColliding(Object.assign({}, mousePos, { id: this.draggedId })))
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
    hasSelected() {
        return this.selectedId !== null;
    }
    deselect() {
        this.selectedId = null;
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
    isColliding(keyframe) {
        return this.keyframes.some(kf => {
            return Math.abs(keyframe.x - kf.x) < 2 && keyframe.id !== kf.id;
        });
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
        core.registerInstance(this, hostRef);
        this.isCollapsed = false;
        this.canvasClicked = false;
        this.canvasClick = e => {
            this.canvas.onClick(this.getPos(e));
            this.canvasClicked = true;
            setTimeout(() => this.canvasClicked = false, 0);
        };
        this.canvasRelease = () => {
            this.canvas.onRelease();
        };
        this.deselect = () => {
            if (this.canvasClicked || !this.canvas.hasSelected())
                return;
            // if the canvas hasn't been clicked and it has an item selected, deselect the item
            this.canvas.deselect();
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
        window.addEventListener('mousedown', this.deselect);
        this.canvas = new Canvas(this.canvasElement);
        this.canvas.draw();
    }
    render() {
        return (core.h("div", { class: getClass("keyframe-editor", { collapsed: this.isCollapsed }) }, core.h("div", { class: getClass("canvas-container", { collapsed: this.isCollapsed }), ref: el => this.canvasContainer = el }, core.h("canvas", { ref: el => this.canvasElement = el, onMouseDown: this.canvasClick, onMouseUp: this.canvasRelease, onMouseMove: this.handleHover })), core.h("div", { class: getClass("expand-contract-toggle", { collapsed: this.isCollapsed }), onClick: this.collapseToggle }, core.h("div", { class: "name" }, this.name || ''), core.h("div", { class: "icon" }, core.h("span", null, "<")))));
    }
    static get style() { return ".keyframe-editor{--canvas-height:50px;--btn-height:10px;height:calc(var(--canvas-height) + var(--btn-height));cursor:pointer;-webkit-transition:.5s;transition:.5s;position:relative}.keyframe-editor.collapsed{height:10px}.canvas-container{height:var(--canvas-height);overflow:hidden;background:#e2e2e2;-webkit-transition:.5s;transition:.5s}.canvas-container.collapsed{height:0}.expand-contract-toggle>*{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;height:var(--btn-height)}.expand-contract-toggle{background:#20212c;display:grid;grid-template-columns:20px 1fr;-ms-flex-line-pack:center;align-content:center;padding:0 8px}.expand-contract-toggle .icon{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.expand-contract-toggle .icon span{-webkit-transform:rotate(90deg) scaleX(.5);transform:rotate(90deg) scaleX(.5);-webkit-transition:.5s;transition:.5s}.expand-contract-toggle.collapsed .icon span{-webkit-transform:rotate(90deg) scaleX(-.5);transform:rotate(90deg) scaleX(-.5)}.expand-contract-toggle .name{color:hsla(0,0%,100%,.4);font-size:9px}"; }
};

class AudioContainer {
    constructor(url) {
        this.audio = new Audio(url);
        const AudioCtx = AudioContext;
        this.audioContext = new AudioCtx();
        this.track = this.audioContext.createMediaElementSource(this.audio);
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = .5;
        this.panner = new StereoPannerNode(this.audioContext, { pan: 0 });
        this.track
            .connect(this.gainNode)
            .connect(this.panner)
            .connect(this.audioContext.destination);
    }
    reInit(url) {
        if (url === this.audio.src)
            return;
        this.audio.src = url;
        this.audio.currentTime = 0;
        this.audio.pause();
    }
    togglePlayer() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        const isPaused = this.audio.paused;
        this.audio[isPaused ? "play" : "pause"]();
        return !isPaused;
    }
    reset() {
        this.audio.currentTime = 0;
        this.audio.pause();
    }
    get currentTime() { return this.audio.currentTime; }
    set currentTime(time) { this.audio.currentTime = time; }
    set volume(level) { this.gainNode.gain.value = level; }
    set pan(level) {
        this.panner.pan.value = mapRange(level, { min: 0, max: 1 }, { min: -1, max: 1 });
    }
    get duration() { return this.audio.duration; }
}

const KeyframedAudioPlayer = class {
    constructor(hostRef) {
        core.registerInstance(this, hostRef);
        this.isPaused = true;
        this.currentTime = 0;
        this.duration = 0;
        this.updateTime = () => {
            this.currentTime = this.audioContainer.currentTime;
        };
        this.updatePan = async () => {
            const percentage = this.currentTime / this.duration;
            const pan = await this.keyframeEditorPan.getHeightPercentage(percentage);
            this.audioContainer.pan = pan;
        };
        this.updateVolume = async () => {
            const percentage = this.currentTime / this.duration;
            const volume = await this.keyframeEditorVolume.getHeightPercentage(percentage);
            this.audioContainer.volume = volume;
        };
        this.togglePlay = () => {
            if (!this.url)
                return;
            this.isPaused = this.audioContainer.togglePlayer();
        };
        this.handleTimeSeek = e => {
            const el = e.target.className === "progress-bar" ? e.target.parentElement : e.target;
            const { x, width } = el.getBoundingClientRect();
            const percentage = (e.x - x) / width;
            this.audioContainer.currentTime = percentage * this.duration;
        };
        this.getTime = () => `${getTimecode(this.currentTime)} / ${getTimecode(this.duration)}`;
        this.getWidth = () => this.currentTime / this.duration * 100 + '%';
    }
    componentDidLoad() {
        this.audioContainer = new AudioContainer(this.url);
        this.audioContainer.audio.addEventListener('loadeddata', () => {
            this.duration = this.audioContainer.duration;
        });
        this.audioContainer.audio.addEventListener('ended', () => {
            this.audioContainer.reset();
            this.isPaused = true;
        });
        this.audioContainer.audio.addEventListener('timeupdate', () => {
            this.updateTime();
            this.updatePan();
            if (!this.isPaused)
                this.updateVolume();
        });
    }
    componentDidUpdate() {
        // internally checks if it should reload, but resets audio to start regardless
        this.audioContainer.reInit(this.url);
    }
    render() {
        return core.h("div", { class: "audioplayer" }, core.h("div", { class: "timeline", onClick: this.handleTimeSeek }, core.h("div", { class: "progress-bar", style: { width: this.getWidth() } })), core.h("div", { class: "body" }, core.h("div", { class: "play-container" + (!this.url ? " disabled" : "") }, core.h("div", { class: (this.isPaused ? "play" : "pause") + " btn", onClick: this.togglePlay })), core.h("div", { class: "name" }, this.name || "Unknown Song"), core.h("div", { class: "time" }, this.getTime())), core.h("keyframe-editor", { ref: el => this.keyframeEditorVolume = el, open: true, name: "volume" }), core.h("keyframe-editor", { ref: el => this.keyframeEditorPan = el, open: true, name: "pan" }));
    }
    static get style() { return ".audioplayer{height:50px;font-family:Arial,Helvetica,sans-serif;background:#223143;color:#fff;position:relative;z-index:2;display:grid;grid-template-rows:auto 40px 1fr}.timeline{cursor:pointer;height:10px;background:#e2e2e2}.progress-bar{height:100%;width:0;background:coral;-webkit-transition:.5s;transition:.5s}.body{display:grid;grid-template-columns:auto 1fr auto;grid-gap:10px;-ms-flex-line-pack:center;align-content:center}.body>*{padding:5px 20px;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}.name{text-align:center}.btn{cursor:pointer}.play-container{width:20px}.play-container.disabled{opacity:.5}.play-container.disabled .btn{cursor:auto}.play{border:7px solid transparent;border-left:12px solid #fff;position:relative;right:-4px}.pause:after,.pause:before{content:\"\";position:absolute;width:3px;top:0;bottom:0;background:#fff}.pause{height:13px;width:11px;position:relative}.pause:before{left:0}.pause:after{right:0}"; }
};

exports.keyframe_editor = KeyframeEditor;
exports.keyframed_audio_player = KeyframedAudioPlayer;
