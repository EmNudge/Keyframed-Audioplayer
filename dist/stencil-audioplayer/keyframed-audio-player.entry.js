import { r as registerInstance, h } from './chunk-e49b5c18.js';

function getTimecode(seconds) {
    const minutesNum = Math.floor(seconds / 60);
    const minutesStr = String(minutesNum).padStart(2, "0");
    const secondsNum = Math.floor(seconds - minutesNum * 60);
    const secondsStr = String(secondsNum).padStart(2, "0");
    return `${minutesStr}:${secondsStr}`;
}

class KeyframedAudioPlayer {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isPlaying = true;
        this.currentTime = 0;
        this.duration = 1;
        this.updateTime = () => {
            console.log(this.audioFile.volume, this.currentTime / this.duration);
            this.currentTime = this.audioFile.currentTime;
        };
        this.togglePlay = () => {
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
    componentDidLoad() {
        this.audioFile = new Audio(this.url);
        this.audioFile.addEventListener('timeupdate', this.updateTime);
        this.audioFile.addEventListener('ended', this.togglePlay);
        this.audioFile.addEventListener('loadeddata', () => this.duration = this.audioFile.duration);
    }
    render() {
        return h("div", { class: "audioplayer" }, h("div", { class: "timeline", onClick: this.handleTimeSeek }, h("div", { class: "progress-bar", style: { width: this.getWidth() } })), h("div", { class: "body" }, h("div", { class: "play-container" }, h("div", { class: (this.isPlaying ? "play" : "pause") + " btn", onClick: this.togglePlay })), h("div", { class: "name" }, this.name), h("div", { class: "time" }, this.getTime())), h("keyframe-editor", { open: true }));
    }
    static get style() { return ".audioplayer {\n  height: 50px;\n  font-family: Arial, Helvetica, sans-serif;\n  background: #223143;\n  color: white;\n\n  display: grid;\n  grid-template-rows: auto 40px 1fr;\n}\n\n.timeline {\n  cursor: pointer;\n  height: 10px;\n  background: rgb(226, 226, 226);\n}\n\n.progress-bar {\n  height: 100%;\n  width: 0%;\n  background: coral;\n  -webkit-transition: .5s;\n  transition: .5s;\n}\n\n.body {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  grid-gap: 10px;\n  -ms-flex-line-pack: center;\n  align-content: center;\n}\n\n.body > * {\n  padding: 5px 20px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n  justify-content: center;\n  -ms-flex-align: center;\n  align-items: center;\n}\n\n.name {\n  text-align: center;\n}\n\n.btn {\n  cursor: pointer;\n}\n\n.play-container {\n  width: 20px;\n}\n\n.play {\n  border: 7px solid transparent;\n  border-left: 12px solid #fff;\n  position: relative;\n  right: -4px;\n}\n\n\n.pause:before,\n.pause:after {\n  content: \"\";\n  position: absolute;\n  width: 3px;\n  top: 0;\n  bottom: 0;\n  background: #fff;\n}\n.pause {\n  height: 13px;\n  width: 11px;\n  position: relative;\n}\n.pause:before {\n  left: 0;\n}\n.pause:after {\n  right: 0;\n}"; }
}

export { KeyframedAudioPlayer as keyframed_audio_player };
