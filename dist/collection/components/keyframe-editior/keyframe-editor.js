import { h } from '@stencil/core';
import Canvas from './canvas';
export class KeyframeEditor {
    constructor() {
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
    async getAudioLevel(percentage) {
        const num = this.canvasElement.width * percentage;
        const { prev, next } = this.canvas.getSurroundingKeyframes(num);
        const inBtwnPercentage = (num - prev.x) / (next.x - prev.x);
        const variableVolume = next.y - prev.y;
        const volume = prev.x + inBtwnPercentage * variableVolume;
        return volume;
    }
    componentDidLoad() {
        const { width, height } = this.canvasContainer.getBoundingClientRect();
        this.canvasElement.width = width;
        this.canvasElement.height = height;
        this.canvas = new Canvas(this.canvasElement);
        this.canvas.draw();
    }
    render() {
        return (h("div", { class: "keyframe-editor", ref: el => this.canvasContainer = el, onMouseDown: this.canvasClick, onMouseUp: this.canvasRelease, onMouseMove: this.handleHover },
            h("canvas", { width: "100%", height: "500%", ref: el => this.canvasElement = el })));
    }
    static get is() { return "keyframe-editor"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["keyframe-editor.css"]
    }; }
    static get styleUrls() { return {
        "$": ["keyframe-editor.css"]
    }; }
    static get properties() { return {
        "open": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "open",
            "reflect": false
        }
    }; }
    static get methods() { return {
        "getAudioLevel": {
            "complexType": {
                "signature": "(percentage: number) => Promise<number>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<number>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        }
    }; }
}
