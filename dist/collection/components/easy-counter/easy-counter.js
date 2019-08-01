import { h } from '@stencil/core';
export class EasyCounter {
    constructor() {
        this.start = 1;
        this.max = 100;
        this.min = 0;
        this.step = 1;
        this.increment = () => {
            const newValue = this.value + this.step;
            if (newValue > this.max) {
                this.value = this.max;
            }
            else {
                this.value = newValue;
            }
        };
        this.decrement = () => {
            const newValue = this.value - this.step;
            if (newValue < this.min) {
                this.value = this.min;
            }
            else {
                this.value = newValue;
            }
        };
    }
    componentWillLoad() {
        this.value = this.start;
    }
    render() {
        return (h("div", null,
            h("button", { type: "button", onClick: this.increment }, "+"),
            h("span", null, this.value),
            h("button", { type: "button", onClick: this.decrement }, "-")));
    }
    static get is() { return "easy-counter"; }
    static get originalStyleUrls() { return {
        "$": ["easy-counter.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["easy-counter.css"]
    }; }
    static get properties() { return {
        "start": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "start",
            "reflect": false,
            "defaultValue": "1"
        },
        "max": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "max",
            "reflect": false,
            "defaultValue": "100"
        },
        "min": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "min",
            "reflect": false,
            "defaultValue": "0"
        },
        "step": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "step",
            "reflect": false,
            "defaultValue": "1"
        }
    }; }
    static get states() { return {
        "value": {}
    }; }
}
