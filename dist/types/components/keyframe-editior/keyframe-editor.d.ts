export declare class KeyframeEditor {
    open: boolean;
    private canvasElement?;
    private canvasContainer?;
    private canvas;
    addKeyframe: (e: any) => void;
    handleHover: (e: any) => void;
    getPos: (e: any) => {
        x: number;
        y: number;
    };
    componentDidLoad(): void;
    render(): any;
}
