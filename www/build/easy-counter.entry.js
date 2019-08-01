import { r as registerInstance, h } from './chunk-83889542.js';

class EasyCounter {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
        return (h("div", null, h("button", { type: "button", onClick: this.increment }, "+"), h("span", null, this.value), h("button", { type: "button", onClick: this.decrement }, "-")));
    }
    static get style() { return ""; }
}

export { EasyCounter as easy_counter };
