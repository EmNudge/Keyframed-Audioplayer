class AudioContainer {
    constructor(url) {
        this.audio = new Audio(url);
    }
    reInit(url) {
        if (url === this.audio.src)
            return;
        this.audio.src = url;
        this.audio.currentTime = 0;
        this.audio.pause();
    }
    togglePlayer() {
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
    set volume(level) { this.audio.volume = level; }
    get duration() { return this.audio.duration; }
}
export default AudioContainer;
