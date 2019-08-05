interface Position {
    x: number;
    y: number;
}
interface SurroundingPos {
    prev: Position;
    next: Position;
}
export default class Canvas {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    keyframes: Position[];
    mousePos: Position;
    draggingIndex: number;
    constructor(canvas: HTMLCanvasElement);
    draw(): void;
    handleHover(mousePos: Position): void;
    onClick(x: number, y: number): void;
    onRelease(): void;
    sortKeyframes(keyframes: any): any;
    getKeyframeIndex(pos: any): number;
    drawLine(): void;
    getFullKeyframes(): Position[];
    getSurroundingKeyframes(xPos: number): SurroundingPos;
    getDist(point: Position, circle: Position): number;
    drawKeyframe(pos: Position): void;
}
export {};
