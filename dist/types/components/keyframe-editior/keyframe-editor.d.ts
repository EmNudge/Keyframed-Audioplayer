export declare class KeyframeEditor {
    open: boolean;
    name: string;
    isCollapsed: boolean;
    private canvasElement?;
    private canvasContainer?;
    private canvas;
    private canvasClicked;
    canvasClick: (e: any) => void;
    canvasRelease: () => void;
    deselect: () => void;
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
