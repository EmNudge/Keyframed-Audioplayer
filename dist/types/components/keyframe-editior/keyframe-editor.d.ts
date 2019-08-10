export declare class KeyframeEditor {
    open: boolean;
    isCollapsed: boolean;
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
    collapseToggle: () => void;
    getHeightPercentage(widthPercentage: number): Promise<number>;
    componentDidLoad(): void;
    render(): any;
}
