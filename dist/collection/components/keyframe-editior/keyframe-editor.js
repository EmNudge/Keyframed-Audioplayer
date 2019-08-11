import { h } from '@stencil/core';
import { mapRange, getClass } from '../../utils/utils';
import Canvas from './canvas';
export class KeyframeEditor {
    constructor() {
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
        return (h("div", { class: getClass("keyframe-editor", { collapsed: this.isCollapsed }) },
            h("div", { class: getClass("canvas-container", { collapsed: this.isCollapsed }), ref: el => this.canvasContainer = el },
                h("canvas", { ref: el => this.canvasElement = el, onMouseDown: this.canvasClick, onMouseUp: this.canvasRelease, onMouseMove: this.handleHover })),
            h("div", { class: getClass("expand-contract-toggle", { collapsed: this.isCollapsed }), onClick: this.collapseToggle },
                h("span", null, "<"))));
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
        "isCollapsed": {}
    }; }
    static get methods() { return {
        "getHeightPercentage": {
            "complexType": {
                "signature": "(widthPercentage: number) => Promise<number>",
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
