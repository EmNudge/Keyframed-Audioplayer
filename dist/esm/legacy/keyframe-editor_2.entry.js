var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { r as registerInstance, h } from './chunk-10dd6b23.js';
function getTimecode(seconds) {
    var minutesNum = Math.floor(seconds / 60);
    var minutesStr = String(minutesNum).padStart(2, "0");
    var secondsNum = Math.floor(seconds - minutesNum * 60);
    var secondsStr = String(secondsNum).padStart(2, "0");
    return minutesStr + ":" + secondsStr;
}
function getClass() {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return classes.flatMap(function (className) {
        if (typeof className === "string")
            return [className];
        var classNamesArr = [];
        for (var prop in className) {
            if (className[prop])
                classNamesArr.push(prop);
        }
        return classNamesArr;
    }).join(' ');
}
function mapRange(val, range1, range2) {
    var valueDelta = val - range1.min;
    var range1Delta = range1.max - range1.min;
    var percentage = valueDelta / range1Delta;
    var range2Delta = range2.max - range2.min;
    var mappedRange2Delta = percentage * range2Delta;
    return mappedRange2Delta + range2.min;
}
var Canvas = /** @class */ (function () {
    function Canvas(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d');
        this.keyframes = [];
    }
    Canvas.prototype.draw = function () {
        var _this = this;
        this.ctx.clearRect(0, 0, this.width, this.width);
        this.drawLine();
        for (var _i = 0, _a = this.keyframes; _i < _a.length; _i++) {
            var keyframe = _a[_i];
            this.drawKeyframe(keyframe);
        }
        requestAnimationFrame(function () { return _this.draw(); });
    };
    Canvas.prototype.handleHover = function (mousePos) {
        var _this = this;
        this.mousePos = mousePos;
        if (this.draggedId === null)
            return;
        this.keyframes = this.sortKeyframes(this.keyframes.map(function (keyframe) { return _this.draggedId === keyframe.id ? Object.assign({}, mousePos, { id: keyframe.id }) : keyframe; }));
    };
    Canvas.prototype.onClick = function (mousePos) {
        for (var _i = 0, _a = this.keyframes; _i < _a.length; _i++) {
            var keyframe = _a[_i];
            if (this.getDist(mousePos, keyframe) >= 8)
                continue;
            this.selectedId = this.draggedId = keyframe.id;
            return;
        }
        this.addKeyframe(mousePos);
    };
    Canvas.prototype.addKeyframe = function (pos) {
        var keyframe = Object.assign({}, pos, { id: Symbol() });
        this.keyframes = this.sortKeyframes(this.keyframes.concat([keyframe]));
        this.draggedId = this.selectedId = keyframe.id;
    };
    Canvas.prototype.onRelease = function () {
        this.draggedId = null;
    };
    // removes keyframe and reassigns selectedId if any id is selected
    Canvas.prototype.onDelete = function () {
        var _this = this;
        if (this.selectedId === null)
            return;
        var selectedIndex = this.getKeyframeIndex(this.selectedId);
        this.keyframes = this.keyframes.filter(function (keyframe) { return keyframe.id !== _this.selectedId; });
        // if no more keyframes, set selectedId to null and return
        if (!this.keyframes.length) {
            this.selectedId = null;
            return;
        }
        // change selected ID
        var newIndex = this.keyframes.length > selectedIndex ? selectedIndex : selectedIndex - 1;
        this.selectedId = this.keyframes[newIndex].id;
    };
    Canvas.prototype.sortKeyframes = function (keyframes) {
        return keyframes.sort(function (pos1, pos2) { return pos1.x - pos2.x; });
    };
    Canvas.prototype.getKeyframeIndex = function (id) {
        for (var _i = 0, _a = this.keyframes.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], index = _b[0], keyframe = _b[1];
            if (keyframe.id === id)
                return index;
        }
    };
    Canvas.prototype.drawLine = function () {
        var keyframes = this.getFullKeyframes();
        var prevPos = keyframes[0];
        this.ctx.strokeStyle = '#aaa';
        for (var _i = 0, _a = keyframes.slice(1); _i < _a.length; _i++) {
            var pos = _a[_i];
            this.ctx.beginPath();
            this.ctx.moveTo(prevPos.x, prevPos.y);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
            prevPos = pos;
        }
    };
    // gets keyframes including imaginary beginning and ending keyframes
    Canvas.prototype.getFullKeyframes = function () {
        var firstKeyframe = this.keyframes[0];
        var lastKeyframe = this.keyframes[this.keyframes.length - 1];
        var startY = firstKeyframe ? firstKeyframe.y : this.height / 2;
        var endY = lastKeyframe ? lastKeyframe.y : this.height / 2;
        return [
            { x: 0, y: startY, id: Symbol('start') }
        ].concat(this.keyframes, [
            { x: this.width, y: endY, id: Symbol('end') }
        ]);
    };
    Canvas.prototype.getSurroundingKeyframes = function (xPos) {
        var keyframes = this.getFullKeyframes();
        // array.prototype.reduce was looking weird, so switched to a for-loop
        var leftIndex = 0;
        for (var _i = 0, _a = keyframes.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], index = _b[0], pos = _b[1];
            if (xPos <= pos.x)
                break;
            var x = keyframes[leftIndex].x;
            if (xPos - pos.x < xPos - x)
                leftIndex = index;
        }
        return {
            prev: keyframes[leftIndex],
            next: keyframes[leftIndex + 1]
        };
    };
    Canvas.prototype.getDist = function (point, circle) {
        var distX = point.x - circle.x;
        var distY = point.y - circle.y;
        return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
    };
    Canvas.prototype.drawKeyframe = function (keyframe) {
        var isHovering = this.getDist(this.mousePos, keyframe) < 8;
        var isSelected = keyframe.id === this.selectedId;
        this.ctx.beginPath();
        this.ctx.fillStyle = isHovering ? '#444' : 'grey';
        this.ctx.arc(keyframe.x, keyframe.y, 8, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = isSelected ? 'coral' : 'white';
        this.ctx.arc(keyframe.x, keyframe.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
    };
    return Canvas;
}());
var KeyframeEditor = /** @class */ (function () {
    function KeyframeEditor(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.isCollapsed = false;
        this.canvasClick = function (e) {
            _this.canvas.onClick(_this.getPos(e));
        };
        this.canvasRelease = function () {
            _this.canvas.onRelease();
        };
        this.handleHover = function (e) {
            _this.canvas.handleHover(_this.getPos(e));
        };
        this.handleKeyPress = function (e) {
            if (e.key !== 'Backspace' && e.key !== 'Delete')
                return;
            _this.canvas.onDelete();
        };
        this.getPos = function (e) {
            var _a = e.target.getBoundingClientRect(), x = _a.x, y = _a.y;
            return {
                x: ~~(e.clientX - x),
                y: ~~(e.clientY - y)
            };
        };
        this.collapseToggle = function () {
            _this.isCollapsed = !_this.isCollapsed;
        };
    }
    KeyframeEditor.prototype.getHeightPercentage = function (widthPercentage) {
        return __awaiter(this, void 0, void 0, function () {
            var num, _a, prev, next, mappedHeight, heightPercentage;
            return __generator(this, function (_b) {
                num = this.canvasElement.width * widthPercentage;
                _a = this.canvas.getSurroundingKeyframes(num), prev = _a.prev, next = _a.next;
                mappedHeight = mapRange(num, { min: prev.x, max: next.x }, { min: prev.y, max: next.y });
                heightPercentage = mappedHeight / this.canvasElement.height;
                // inversing since we go bottom to top in the UI
                return [2 /*return*/, 1 - heightPercentage];
            });
        });
    };
    KeyframeEditor.prototype.componentDidLoad = function () {
        var _a = this.canvasContainer.getBoundingClientRect(), width = _a.width, height = _a.height;
        this.canvasElement.width = width;
        this.canvasElement.height = height;
        window.addEventListener('keydown', this.handleKeyPress);
        this.canvas = new Canvas(this.canvasElement);
        this.canvas.draw();
    };
    KeyframeEditor.prototype.render = function () {
        var _this = this;
        return (h("div", { class: getClass("keyframe-editor", { collapsed: this.isCollapsed }) }, h("div", { class: getClass("canvas-container", { collapsed: this.isCollapsed }), ref: function (el) { return _this.canvasContainer = el; } }, h("canvas", { ref: function (el) { return _this.canvasElement = el; }, onMouseDown: this.canvasClick, onMouseUp: this.canvasRelease, onMouseMove: this.handleHover })), h("div", { class: getClass("expand-contract-toggle", { collapsed: this.isCollapsed }), onClick: this.collapseToggle }, h("span", null, "<"))));
    };
    Object.defineProperty(KeyframeEditor, "style", {
        get: function () { return ".keyframe-editor{--canvas-height:50px;--btn-height:10px;height:calc(var(--canvas-height) + var(--btn-height));cursor:pointer;-webkit-transition:.5s;transition:.5s}.keyframe-editor.collapsed{height:10px}.canvas-container{height:var(--canvas-height);overflow:hidden;background:#e2e2e2;-webkit-transition:.5s;transition:.5s}.canvas-container.collapsed{height:0}.expand-contract-toggle{height:var(--btn-height);background:#20212c;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.expand-contract-toggle span{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block;-webkit-transform:rotate(90deg) scaleX(.5);transform:rotate(90deg) scaleX(.5);-webkit-transition:.5s;transition:.5s}.expand-contract-toggle.collapsed span{-webkit-transform:rotate(90deg) scaleX(-.5);transform:rotate(90deg) scaleX(-.5)}"; },
        enumerable: true,
        configurable: true
    });
    return KeyframeEditor;
}());
var KeyframedAudioPlayer = /** @class */ (function () {
    function KeyframedAudioPlayer(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.isPlaying = true;
        this.currentTime = 0;
        this.duration = 0;
        this.updateTime = function () {
            _this.currentTime = _this.audioFile.currentTime;
        };
        this.updateVolume = function () { return __awaiter(_this, void 0, void 0, function () {
            var percentage, volume;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        percentage = this.currentTime / this.duration;
                        return [4 /*yield*/, this.keyframeEditor.getHeightPercentage(percentage)];
                    case 1:
                        volume = _a.sent();
                        this.audioFile.volume = volume;
                        return [2 /*return*/];
                }
            });
        }); };
        this.togglePlay = function () {
            if (!_this.audioFile)
                return;
            _this.audioFile[_this.isPlaying ? "play" : "pause"]();
            _this.isPlaying = !_this.isPlaying;
        };
        this.handleTimeSeek = function (e) {
            var el = e.target.className === "progress-bar" ? e.target.parentElement : e.target;
            var _a = el.getBoundingClientRect(), x = _a.x, width = _a.width;
            var percentage = (e.x - x) / width;
            _this.audioFile.currentTime = percentage * _this.duration;
        };
        this.getTime = function () {
            return getTimecode(_this.currentTime) + " / " + getTimecode(_this.duration);
        };
        this.getWidth = function () {
            return _this.currentTime / _this.duration * 100 + '%';
        };
    }
    KeyframedAudioPlayer.prototype.componentDidUpdate = function () {
        if (!this.audioFile || this.audioFile.src !== this.url)
            this.initializeAudio();
    };
    KeyframedAudioPlayer.prototype.initializeAudio = function () {
        var _this = this;
        this.audioFile = new Audio(this.url);
        this.audioFile.addEventListener('timeupdate', function () {
            _this.updateTime();
            _this.updateVolume();
        });
        this.audioFile.addEventListener('ended', this.togglePlay);
        this.audioFile.addEventListener('loadeddata', function () { return _this.duration = _this.audioFile.duration; });
    };
    KeyframedAudioPlayer.prototype.render = function () {
        var _this = this;
        return h("div", { class: "audioplayer" }, h("div", { class: "timeline", onClick: this.handleTimeSeek }, h("div", { class: "progress-bar", style: { width: this.getWidth() } })), h("div", { class: "body" }, h("div", { class: "play-container" + (!this.audioFile ? " disabled" : "") }, h("div", { class: (this.isPlaying ? "play" : "pause") + " btn", onClick: this.togglePlay })), h("div", { class: "name" }, this.name || "Unknown Song"), h("div", { class: "time" }, this.getTime())), h("keyframe-editor", { ref: function (el) { return _this.keyframeEditor = el; }, open: true }));
    };
    Object.defineProperty(KeyframedAudioPlayer, "style", {
        get: function () { return ".audioplayer{height:50px;font-family:Arial,Helvetica,sans-serif;background:#223143;color:#fff;display:grid;grid-template-rows:auto 40px 1fr}.timeline{cursor:pointer;height:10px;background:#e2e2e2}.progress-bar{height:100%;width:0;background:coral;-webkit-transition:.5s;transition:.5s}.body{display:grid;grid-template-columns:auto 1fr auto;grid-gap:10px;-ms-flex-line-pack:center;align-content:center}.body>*{padding:5px 20px;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}.name{text-align:center}.btn{cursor:pointer}.play-container{width:20px}.play-container.disabled{opacity:.5}.play-container.disabled .btn{cursor:auto}.play{border:7px solid transparent;border-left:12px solid #fff;position:relative;right:-4px}.pause:after,.pause:before{content:\"\";position:absolute;width:3px;top:0;bottom:0;background:#fff}.pause{height:13px;width:11px;position:relative}.pause:before{left:0}.pause:after{right:0}"; },
        enumerable: true,
        configurable: true
    });
    return KeyframedAudioPlayer;
}());
export { KeyframeEditor as keyframe_editor, KeyframedAudioPlayer as keyframed_audio_player };
