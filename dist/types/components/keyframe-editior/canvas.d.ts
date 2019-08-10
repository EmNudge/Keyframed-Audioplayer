interface Position {
    x: number;
    y: number;
}
interface SurroundingPos {
    prev: Position;
    next: Position;
}
interface Keyframe {
    x: number;
    y: number;
    id: symbol;
}
export default class Canvas {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    keyframes: Keyframe[];
    mousePos: Position;
    draggedId: symbol;
    selectedId: symbol;
    constructor(canvas: HTMLCanvasElement);
    draw(): void;
    handleHover(mousePos: Position): void;
    onClick(mousePos: Position): void;
    addKeyframe(pos: Position): void;
    onRelease(): void;
    onDelete(): void;
    sortKeyframes(keyframes: any): any;
    getKeyframeIndex(id: symbol): number;
    drawLine(): void;
    getFullKeyframes(): Position[];
    getSurroundingKeyframes(xPos: number): SurroundingPos;
    getDist(point: Position, circle: Position | Keyframe): number;
    drawKeyframe(keyframe: Keyframe): void;
}
export {};
