declare class AudioContainer {
    audio: HTMLAudioElement;
    audioContext: AudioContext;
    track: MediaElementAudioSourceNode;
    gainNode: GainNode;
    panner: StereoPannerNode;
    constructor(url: string);
    reInit(url: string): void;
    togglePlayer(): boolean;
    reset(): void;
    currentTime: number;
    volume: any;
    pan: any;
    readonly duration: number;
}
export default AudioContainer;
