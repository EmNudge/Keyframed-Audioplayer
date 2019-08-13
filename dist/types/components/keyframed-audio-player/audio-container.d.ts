declare class AudioContainer {
    audio: HTMLAudioElement;
    constructor(url: string);
    reInit(url: string): void;
    togglePlayer(): boolean;
    reset(): void;
    currentTime: number;
    volume: any;
    readonly duration: number;
}
export default AudioContainer;
