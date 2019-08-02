interface Position {
    x: number;
    y: number;
}
export default class Canvas {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    keyframes: Position[];
    mousePos: Position;
    hoveredIndex: number;
    constructor(canvas: HTMLCanvasElement);
    draw(): void;
    handleHover(mousePos: Position): void;
    addKeyframe(x: number, y: number): void;
    drawLine(): void;
    drawKeyframe(pos: Position): void;
}
export {};
