import { h } from "@stencil/core";
import { getTimecode } from '../../utils/utils';
export class KeyframedAudioPlayer {
    constructor() {
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
        if (!this.audioFile) {
            this.initializeAudio();
            return;
        }
        if (this.audioFile.src !== this.url) {
            if (!this.isPlaying)
                this.togglePlay();
            this.initializeAudio();
        }
    }
    initializeAudio() {
        this.audioFile = new Audio(this.url);
        this.audioFile.addEventListener('timeupdate', () => {
            this.updateTime();
            this.updateVolume();
        });
        this.audioFile.addEventListener('ended', this.togglePlay);
        this.audioFile.addEventListener('loadeddata', () => this.duration = this.audioFile.duration);
        this.updateTime();
    }
    render() {
        return h("div", { class: "audioplayer" },
            h("div", { class: "timeline", onClick: this.handleTimeSeek },
                h("div", { class: "progress-bar", style: { width: this.getWidth() } })),
            h("div", { class: "body" },
                h("div", { class: "play-container" + (!this.audioFile ? " disabled" : "") },
                    h("div", { class: (this.isPlaying ? "play" : "pause") + " btn", onClick: this.togglePlay })),
                h("div", { class: "name" }, this.name || "Unknown Song"),
                h("div", { class: "time" }, this.getTime())),
            h("keyframe-editor", { ref: el => this.keyframeEditor = el, open: true }));
    }
    static get is() { return "keyframed-audio-player"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["keyframed-audio-player.css"]
    }; }
    static get styleUrls() { return {
        "$": ["keyframed-audio-player.css"]
    }; }
    static get properties() { return {
        "name": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "name",
            "reflect": false
        },
        "url": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "url",
            "reflect": false
        }
    }; }
    static get states() { return {
        "isPlaying": {},
        "currentTime": {},
        "duration": {},
        "audioFile": {}
    }; }
}
