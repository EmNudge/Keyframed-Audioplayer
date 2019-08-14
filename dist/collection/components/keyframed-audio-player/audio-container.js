import { mapRange } from '../../utils/utils';
class AudioContainer {
    constructor(url) {
        this.audio = new Audio(url);
        const AudioCtx = AudioContext;
        this.audioContext = new AudioCtx();
        this.track = this.audioContext.createMediaElementSource(this.audio);
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = .5;
        this.panner = new StereoPannerNode(this.audioContext, { pan: 0 });
        this.track
            .connect(this.gainNode)
            .connect(this.panner)
            .connect(this.audioContext.destination);
    }
    reInit(url) {
        if (url === this.audio.src)
            return;
        this.audio.src = url;
        this.audio.currentTime = 0;
        this.audio.pause();
    }
    togglePlayer() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        const isPaused = this.audio.paused;
        this.audio[isPaused ? "play" : "pause"]();
        return !isPaused;
    }
    reset() {
        this.audio.currentTime = 0;
        this.audio.pause();
    }
    get currentTime() { return this.audio.currentTime; }
    set currentTime(time) { this.audio.currentTime = time; }
    set volume(level) { this.gainNode.gain.value = level; }
    set pan(level) {
        this.panner.pan.value = mapRange(level, { min: 0, max: 1 }, { min: -1, max: 1 });
    }
    get duration() { return this.audio.duration; }
}
export default AudioContainer;
