import { h } from '@stencil/core';
import { initialize } from './canvas';
export class KeyframeEditor {
    constructor() {
        this.keyframes = ['hi', 'hello', 'hey'];
        this.addKeyframe = () => {
            this.keyframes = [...this.keyframes, 'bargles'];
        };
    }
    componentDidLoad() {
        const { width, height } = this.canvasContainer.getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;
        const ctx = this.canvas.getContext('2d');
        initialize(ctx);
    }
    render() {
        return (h("div", { class: "keyframe-editor", ref: el => this.canvasContainer = el, onClick: this.addKeyframe },
            h("canvas", { width: "100%", height: "500%", ref: el => this.canvas = el }),
            this.keyframes.map(keyframe => (h("div", { class: "keyframe" }, keyframe)))));
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
    static get states() { return {
        "keyframes": {}
    }; }
}
