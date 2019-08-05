export declare class KeyframeEditor {
    open: boolean;
    private canvasElement?;
    private canvasContainer?;
    private canvas;
    canvasClick: (e: any) => void;
    canvasRelease: () => void;
    handleHover: (e: any) => void;
    handleKeyPress: (e: any) => void;
    getPos: (e: any) => {
        x: number;
        y: number;
    };
    getAudioLevel(percentage: number): Promise<number>;
    componentDidLoad(): void;
    render(): any;
}
