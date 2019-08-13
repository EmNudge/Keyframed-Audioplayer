import { h } from "@stencil/core";
import { getTimecode } from '../../utils/utils';
import AudioContainer from './audio-container';
export class KeyframedAudioPlayer {
    constructor() {
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
        return h("div", { class: "audioplayer" },
            h("div", { class: "timeline", onClick: this.handleTimeSeek },
                h("div", { class: "progress-bar", style: { width: this.getWidth() } })),
            h("div", { class: "body" },
                h("div", { class: "play-container" + (!this.url ? " disabled" : "") },
                    h("div", { class: (this.isPaused ? "play" : "pause") + " btn", onClick: this.togglePlay })),
                h("div", { class: "name" }, this.name || "Unknown Song"),
                h("div", { class: "time" }, this.getTime())),
            h("keyframe-editor", { ref: el => this.keyframeEditorVolume = el, open: true, name: "volume" }),
            h("keyframe-editor", { ref: el => this.keyframeEditorPan = el, open: true, name: "pan" }));
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
        "isPaused": {},
        "currentTime": {},
        "duration": {},
        "audioFile": {}
    }; }
}
