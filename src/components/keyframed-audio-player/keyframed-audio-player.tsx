import { Component, Prop, State, h } from '@stencil/core';
import { getTimecode } from '../../utils/utils'

@Component({
  tag: 'keyframed-audio-player',
  styleUrl: 'keyframed-audio-player.css',
  shadow: true
})

export class KeyframedAudioPlayer {
  @Prop() name: string;
  @Prop() url: string;

  @State() isPlaying: boolean = true;
  @State() currentTime: number = 0;
  @State() duration: number = 1;
  @State() audioFile: HTMLAudioElement;

  private keyframeEditor?: HTMLKeyframeEditorElement;

  componentDidLoad() {
    this.audioFile = new Audio(this.url);
    this.audioFile.addEventListener('timeupdate', () => {
      this.updateTime();
      this.updateVolume();
    });
    this.audioFile.addEventListener('ended', this.togglePlay);
    this.audioFile.addEventListener('loadeddata', () => this.duration = this.audioFile.duration);
  }

  updateTime = () => {
    this.currentTime = this.audioFile.currentTime;
  }

  updateVolume = async () => {
    const percentage = this.currentTime / this.duration;
    const volume = await this.keyframeEditor.getAudioLevel(percentage);
    this.audioFile.volume = volume;
  }


  togglePlay = () => {
    this.audioFile[this.isPlaying ? "play" : "pause"]();
    this.isPlaying = !this.isPlaying;
  }

  handleTimeSeek = e => {
    const el = e.target.className === "progress-bar" ? e.target.parentElement : e.target;
    const { x, width } = el.getBoundingClientRect();
    const percentage = (e.x - x) / width;
    this.audioFile.currentTime = percentage * this.duration;
  }

  getTime = () => {
    return `${getTimecode(this.currentTime)} / ${getTimecode(this.duration)}`
  }

  getWidth = () => {
    return this.currentTime / this.duration * 100 + '%'
  }

  render() {
    return <div class="audioplayer">
      <div class="timeline" onClick={this.handleTimeSeek}>
        <div class="progress-bar" style={{width: this.getWidth()}}></div>
      </div>
      <div class="body">
        <div class="play-container">
          <div class={(this.isPlaying ? "play" : "pause") + " btn"} onClick={this.togglePlay}></div>
        </div>
        <div class="name">{this.name}</div>
        <div class="time">
          {this.getTime()}
        </div>
      </div>
      <keyframe-editor 
        ref={el => this.keyframeEditor = el as HTMLKeyframeEditorElement} 
        open={true}
      ></keyframe-editor>
    </div>;
  }
}
