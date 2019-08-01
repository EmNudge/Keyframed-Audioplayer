export declare class MyComponent {
    name: string;
    url: string;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    audioFile: HTMLAudioElement;
    componentDidLoad(): void;
    updateTime: () => void;
    togglePlay: () => void;
    handleTimeSeek: (e: any) => void;
    getTime: () => string;
    getWidth: () => string;
    render(): any;
}
