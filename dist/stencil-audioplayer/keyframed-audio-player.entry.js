import { r as registerInstance, h } from './core-d79ee1c8.js';
import { m as mapRange, g as getTimecode } from './utils-9ca996e5.js';

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
        registerInstance(this, hostRef);
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
        return h("div", { class: "audioplayer" }, h("div", { class: "timeline", onClick: this.handleTimeSeek }, h("div", { class: "progress-bar", style: { width: this.getWidth() } })), h("div", { class: "body" }, h("div", { class: "play-container" + (!this.url ? " disabled" : "") }, h("div", { class: (this.isPaused ? "play" : "pause") + " btn", onClick: this.togglePlay })), h("div", { class: "name" }, this.name || "Unknown Song"), h("div", { class: "time" }, this.getTime())), h("keyframe-editor", { ref: el => this.keyframeEditorVolume = el, open: true, name: "volume" }), h("keyframe-editor", { ref: el => this.keyframeEditorPan = el, open: true, name: "pan" }));
    }
    static get style() { return ".audioplayer {\n  height: 50px;\n  font-family: Arial, Helvetica, sans-serif;\n  background: #223143;\n  color: white;\n  position: relative;\n  z-index: 2;\n  display: grid;\n  grid-template-rows: auto 40px 1fr;\n}\n\n.timeline {\n  cursor: pointer;\n  height: 10px;\n  background: rgb(226, 226, 226);\n}\n\n.progress-bar {\n  height: 100%;\n  width: 0%;\n  background: coral;\n  -webkit-transition: .5s;\n  transition: .5s;\n}\n\n.body {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  grid-gap: 10px;\n  -ms-flex-line-pack: center;\n  align-content: center;\n}\n\n.body > * {\n  padding: 5px 20px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -ms-flex-align: center;\n  align-items: center;\n}\n\n.name {\n  text-align: center;\n}\n\n.btn {\n  cursor: pointer;\n}\n\n.play-container {\n  width: 20px;\n}\n.play-container.disabled {\n  opacity: .5;\n}\n.play-container.disabled .btn {\n  cursor: auto;\n}\n\n.play {\n  border: 7px solid transparent;\n  border-left: 12px solid #fff;\n  position: relative;\n  right: -4px;\n}\n\n\n.pause:before,\n.pause:after {\n  content: \"\";\n  position: absolute;\n  width: 3px;\n  top: 0;\n  bottom: 0;\n  background: #fff;\n}\n.pause {\n  height: 13px;\n  width: 11px;\n  position: relative;\n}\n.pause:before {\n  left: 0;\n}\n.pause:after {\n  right: 0;\n}"; }
};

export { KeyframedAudioPlayer as keyframed_audio_player };
