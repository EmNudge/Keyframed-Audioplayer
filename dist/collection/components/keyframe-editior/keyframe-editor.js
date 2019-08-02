import { h } from '@stencil/core';
import Canvas from './canvas';
export class KeyframeEditor {
    constructor() {
        this.addKeyframe = e => {
            const { x, y } = this.getPos(e);
            this.canvas.addKeyframe(x, y);
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
    componentDidLoad() {
        const { width, height } = this.canvasContainer.getBoundingClientRect();
        this.canvasElement.width = width;
        this.canvasElement.height = height;
        this.canvas = new Canvas(this.canvasElement);
        this.canvas.draw();
    }
    render() {
        return (h("div", { class: "keyframe-editor", ref: el => this.canvasContainer = el, onClick: this.addKeyframe, onMouseMove: this.handleHover },
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
}
