import { Component, Prop, State, h } from '@stencil/core';
import { getTimecode } from '../../utils/utils'

@Component({
  tag: 'keyframed-audio-player',
  styleUrl: 'keyframed-audio-player.css',
  shadow: true
})

export class MyComponent {
  @Prop() name: string;
  @Prop() url: string;

  @State() isPlaying: boolean = true;
  @State() currentTime: number = 0;
  @State() duration: number = 1;
  @State() audioFile: HTMLAudioElement;

  componentDidLoad() {
    this.audioFile = new Audio(this.url);
    this.audioFile.addEventListener('timeupdate', this.updateTime)
    this.audioFile.addEventListener('loadeddata', () => this.duration = this.audioFile.duration)
  }

  updateTime = () => {
    this.currentTime = this.audioFile.currentTime;
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
    </div>;
  }
}
