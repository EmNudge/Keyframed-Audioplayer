declare class AudioContainer {
    audio: HTMLAudioElement;
    audioContext: AudioContext;
    track: MediaElementAudioSourceNode;
    gainNode: GainNode;
    constructor(url: string);
    reInit(url: string): void;
    togglePlayer(): boolean;
    reset(): void;
    currentTime: number;
    volume: any;
    readonly duration: number;
}
export default AudioContainer;
