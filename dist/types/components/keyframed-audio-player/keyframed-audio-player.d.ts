import AudioContainer from './audio-container';
export declare class KeyframedAudioPlayer {
    name: string;
    url: string;
    isPaused: boolean;
    currentTime: number;
    duration: number;
    audioFile: HTMLAudioElement;
    private keyframeEditor?;
    audioContainer: AudioContainer;
    componentDidLoad(): void;
    componentDidUpdate(): void;
    updateTime: () => void;
    updateVolume: () => Promise<void>;
    togglePlay: () => void;
    handleTimeSeek: (e: any) => void;
    getTime: () => string;
    getWidth: () => string;
    render(): any;
}
