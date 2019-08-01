import { r as registerInstance, h } from './chunk-f2536b62.js';

function initialize(ctx, looped = 0) {
    for (const [index] of Array(10).entries()) {
        ctx.beginPath();
        ctx.arc(10 * index + looped, 10 * index, 10, 0, 2 * Math.PI);
        ctx.stroke();
    }
    requestAnimationFrame(() => initialize(ctx, looped + 1));
}

class KeyframeEditor {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
        return (h("div", { class: "keyframe-editor", ref: el => this.canvasContainer = el, onClick: this.addKeyframe }, h("canvas", { width: "100%", height: "500%", ref: el => this.canvas = el }), this.keyframes.map(keyframe => (h("div", { class: "keyframe" }, keyframe)))));
    }
    static get style() { return ".keyframe-editor {\n    height: 50px;\n    background: rgb(226, 226, 226);\n}"; }
}

export { KeyframeEditor as keyframe_editor };
