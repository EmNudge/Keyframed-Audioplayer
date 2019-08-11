export declare class KeyframedAudioPlayer {
    name: string;
    url: string;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    audioFile: HTMLAudioElement;
    private keyframeEditor?;
    componentDidUpdate(): void;
    initializeAudio(): void;
    updateTime: () => void;
    updateVolume: () => Promise<void>;
    togglePlay: () => void;
    handleTimeSeek: (e: any) => void;
    getTime: () => string;
    getWidth: () => string;
    render(): any;
}
