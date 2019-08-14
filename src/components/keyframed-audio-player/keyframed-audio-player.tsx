import { Component, Prop, State, h } from '@stencil/core';
import { getTimecode } from '../../utils/utils'
import AudioContainer from './audio-container'

@Component({
  tag: 'keyframed-audio-player',
  styleUrl: 'keyframed-audio-player.css',
  shadow: true
})

export class KeyframedAudioPlayer {
  @Prop() name: string;
  @Prop() url: string;

  @State() isPaused: boolean = true;
  @State() currentTime: number = 0;
  @State() duration: number = 0;
  @State() audioFile: HTMLAudioElement;

  private keyframeEditorVolume?: HTMLKeyframeEditorElement;
  private keyframeEditorPan?: HTMLKeyframeEditorElement;
  audioContainer: AudioContainer;

  componentDidLoad() {
    this.audioContainer = new AudioContainer(this.url);
    this.audioContainer.audio.addEventListener('loadeddata', () => {
      this.duration = this.audioContainer.duration;
    });
    this.audioContainer.audio.addEventListener('ended', () => {
      this.audioContainer.reset();
      this.isPaused = true;
    });
    this.audioContainer.audio.addEventListener('timeupdate', () => {
      this.updateTime();
      this.updatePan();
      if (!this.isPaused) this.updateVolume();
    });
  }

  componentDidUpdate() {
    // internally checks if it should reload, but resets audio to start regardless
    this.audioContainer.reInit(this.url);
  }

  updateTime = () => {
    this.currentTime = this.audioContainer.currentTime;
  }

  updatePan = async () => {
    const percentage = this.currentTime / this.duration;
    const pan = await this.keyframeEditorPan.getHeightPercentage(percentage);
    this.audioContainer.pan = pan;
  }

  updateVolume = async () => {
    const percentage = this.currentTime / this.duration;
    const volume = await this.keyframeEditorVolume.getHeightPercentage(percentage);
    this.audioContainer.volume = volume;
  }

  togglePlay = () => {
    if (!this.url) return;
    this.isPaused = this.audioContainer.togglePlayer()
  }

  handleTimeSeek = e => {
    const el = e.target.className === "progress-bar" ? e.target.parentElement : e.target;
    const { x, width } = el.getBoundingClientRect();
    const percentage = (e.x - x) / width;
    this.audioContainer.currentTime = percentage * this.duration;
  }

  getTime = () => `${getTimecode(this.currentTime)} / ${getTimecode(this.duration)}`

  getWidth = () => this.currentTime / this.duration * 100 + '%'

  render() {
    return <div class="audioplayer">
      <div class="timeline" onClick={this.handleTimeSeek}>
        <div class="progress-bar" style={{width: this.getWidth()}}></div>
      </div>
      <div class="body">
        <div class={"play-container" + (!this.url ? " disabled" : "")}>
          <div
            class={(this.isPaused ? "play" : "pause") + " btn"}
            onClick={this.togglePlay}
          />
        </div>
        <div class="name">{this.name || "Unknown Song"}</div>
        <div class="time">
          {this.getTime()}
        </div>
      </div>
      <keyframe-editor
        ref={el => this.keyframeEditorVolume = el as HTMLKeyframeEditorElement}
        open={true}
        name="volume"
      />
      <keyframe-editor
        ref={el => this.keyframeEditorPan = el as HTMLKeyframeEditorElement}
        open={true}
        name="pan"
      />
    </div>;
  }
}
