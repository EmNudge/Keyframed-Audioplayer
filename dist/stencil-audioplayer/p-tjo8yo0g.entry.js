import{r as t,h as s}from"./p-905463c5.js";function i(t){const s=Math.floor(t/60),i=String(s).padStart(2,"0"),h=Math.floor(t-60*s);return`${i}:${String(h).padStart(2,"0")}`}function h(...t){return t.flatMap(t=>{if("string"==typeof t)return[t];const s=[];for(const i in t)t[i]&&s.push(i);return s}).join(" ")}function e(t,s,i){if(s.max-s.min==0)return;const h=(t-s.min)/(s.max-s.min);return(h===1/0?.5:h)*(i.max-i.min)+i.min}class n{constructor(t){this.canvas=t,this.width=t.width,this.height=t.height,this.ctx=t.getContext("2d"),this.keyframes=[]}draw(){this.ctx.clearRect(0,0,this.width,this.width),this.drawLine();for(const t of this.keyframes)this.drawKeyframe(t);requestAnimationFrame(()=>this.draw())}handleHover(t){this.mousePos=t,null!==this.draggedId&&(this.isColliding(Object.assign({},t,{id:this.draggedId}))||(this.keyframes=this.sortKeyframes(this.keyframes.map(s=>this.draggedId===s.id?Object.assign({},t,{id:s.id}):s))))}onClick(t){for(const s of this.keyframes)if(!(this.getDist(t,s)>=8))return void(this.selectedId=this.draggedId=s.id);this.addKeyframe(t)}addKeyframe(t){const s=Object.assign({},t,{id:Symbol()});this.keyframes=this.sortKeyframes([...this.keyframes,s]),this.draggedId=this.selectedId=s.id}onRelease(){this.draggedId=null}onDelete(){if(null===this.selectedId)return;const t=this.getKeyframeIndex(this.selectedId);this.keyframes=this.keyframes.filter(t=>t.id!==this.selectedId),this.selectedId=this.keyframes.length?this.keyframes[this.keyframes.length>t?t:t-1].id:null}sortKeyframes(t){return t.sort((t,s)=>t.x-s.x)}getKeyframeIndex(t){for(const[s,i]of this.keyframes.entries())if(i.id===t)return s}hasSelected(){return null!==this.selectedId}deselect(){this.selectedId=null}drawLine(){const t=this.getFullKeyframes();let s=t[0];this.ctx.strokeStyle="#aaa";for(const i of t.slice(1))this.ctx.beginPath(),this.ctx.moveTo(s.x,s.y),this.ctx.lineTo(i.x,i.y),this.ctx.stroke(),s=i}getFullKeyframes(){const t=this.keyframes[0],s=this.keyframes[this.keyframes.length-1],i=s?s.y:this.height/2;return[{x:0,y:t?t.y:this.height/2,id:Symbol("start")},...this.keyframes,{x:this.width,y:i,id:Symbol("end")}]}getSurroundingKeyframes(t){const s=this.getFullKeyframes();let i=0;for(const[h,e]of s.entries()){if(t<=e.x)break;const{x:n}=s[i];t-e.x<t-n&&(i=h)}return{prev:s[i],next:s[i+1]}}getDist(t,s){return Math.sqrt((t.x-s.x)**2+(t.y-s.y)**2)}isColliding(t){return this.keyframes.some(s=>Math.abs(t.x-s.x)<2&&t.id!==s.id)}drawKeyframe(t){const s=this.getDist(this.mousePos,t)<8,i=t.id===this.selectedId;this.ctx.beginPath(),this.ctx.fillStyle=s?"#444":"grey",this.ctx.arc(t.x,t.y,8,0,2*Math.PI),this.ctx.fill(),this.ctx.beginPath(),this.ctx.fillStyle=i?"coral":"white",this.ctx.arc(t.x,t.y,4,0,2*Math.PI),this.ctx.fill()}}const r=class{constructor(s){t(this,s),this.isCollapsed=!1,this.canvasClicked=!1,this.canvasClick=t=>{this.canvas.onClick(this.getPos(t)),this.canvasClicked=!0,setTimeout(()=>this.canvasClicked=!1,0)},this.canvasRelease=()=>{this.canvas.onRelease()},this.deselect=()=>{!this.canvasClicked&&this.canvas.hasSelected()&&this.canvas.deselect()},this.handleHover=t=>{this.canvas.handleHover(this.getPos(t))},this.handleKeyPress=t=>{"Backspace"!==t.key&&"Delete"!==t.key||this.canvas.onDelete()},this.getPos=t=>{const{x:s,y:i}=t.target.getBoundingClientRect();return{x:~~(t.clientX-s),y:~~(t.clientY-i)}},this.collapseToggle=()=>{this.isCollapsed=!this.isCollapsed}}async getHeightPercentage(t){const s=this.canvasElement.width*t,{prev:i,next:h}=this.canvas.getSurroundingKeyframes(s);return 1-e(s,{min:i.x,max:h.x},{min:i.y,max:h.y})/this.canvasElement.height}componentDidLoad(){const{width:t,height:s}=this.canvasContainer.getBoundingClientRect();this.canvasElement.width=t,this.canvasElement.height=s,window.addEventListener("keydown",this.handleKeyPress),window.addEventListener("mousedown",this.deselect),this.canvas=new n(this.canvasElement),this.canvas.draw()}render(){return s("div",{class:h("keyframe-editor",{collapsed:this.isCollapsed})},s("div",{class:h("canvas-container",{collapsed:this.isCollapsed}),ref:t=>this.canvasContainer=t},s("canvas",{ref:t=>this.canvasElement=t,onMouseDown:this.canvasClick,onMouseUp:this.canvasRelease,onMouseMove:this.handleHover})),s("div",{class:h("expand-contract-toggle",{collapsed:this.isCollapsed}),onClick:this.collapseToggle},s("div",{class:"name"},this.name||""),s("div",{class:"icon"},s("span",null,"<"))))}static get style(){return".keyframe-editor{--canvas-height:50px;--btn-height:10px;height:calc(var(--canvas-height) + var(--btn-height));cursor:pointer;-webkit-transition:.5s;transition:.5s;position:relative}.keyframe-editor.collapsed{height:10px}.canvas-container{height:var(--canvas-height);overflow:hidden;background:#e2e2e2;-webkit-transition:.5s;transition:.5s}.canvas-container.collapsed{height:0}.expand-contract-toggle>*{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;height:var(--btn-height)}.expand-contract-toggle{background:#20212c;display:grid;grid-template-columns:20px 1fr;-ms-flex-line-pack:center;align-content:center;padding:0 8px}.expand-contract-toggle .icon{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.expand-contract-toggle .icon span{-webkit-transform:rotate(90deg) scaleX(.5);transform:rotate(90deg) scaleX(.5);-webkit-transition:.5s;transition:.5s}.expand-contract-toggle.collapsed .icon span{-webkit-transform:rotate(90deg) scaleX(-.5);transform:rotate(90deg) scaleX(-.5)}.expand-contract-toggle .name{color:hsla(0,0%,100%,.4);font-size:9px}"}};class o{constructor(t){this.audio=new Audio(t);const s=AudioContext;this.audioContext=new s,this.track=this.audioContext.createMediaElementSource(this.audio),this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=.5,this.panner=new StereoPannerNode(this.audioContext,{pan:0}),this.track.connect(this.gainNode).connect(this.panner).connect(this.audioContext.destination)}reInit(t){t!==this.audio.src&&(this.audio.src=t,this.audio.currentTime=0,this.audio.pause())}togglePlayer(){"suspended"===this.audioContext.state&&this.audioContext.resume();const t=this.audio.paused;return this.audio[t?"play":"pause"](),!t}reset(){this.audio.currentTime=0,this.audio.pause()}get currentTime(){return this.audio.currentTime}set currentTime(t){this.audio.currentTime=t}set volume(t){this.gainNode.gain.value=t}set pan(t){this.panner.pan.value=e(t,{min:0,max:1},{min:-1,max:1})}get duration(){return this.audio.duration}}const a=class{constructor(s){t(this,s),this.isPaused=!0,this.currentTime=0,this.duration=0,this.updateTime=()=>{this.currentTime=this.audioContainer.currentTime},this.updatePan=async()=>{const t=this.currentTime/this.duration,s=await this.keyframeEditorPan.getHeightPercentage(t);this.audioContainer.pan=s},this.updateVolume=async()=>{const t=this.currentTime/this.duration,s=await this.keyframeEditorVolume.getHeightPercentage(t);this.audioContainer.volume=s},this.togglePlay=()=>{this.url&&(this.isPaused=this.audioContainer.togglePlayer())},this.handleTimeSeek=t=>{const s="progress-bar"===t.target.className?t.target.parentElement:t.target,{x:i,width:h}=s.getBoundingClientRect();this.audioContainer.currentTime=(t.x-i)/h*this.duration},this.getTime=()=>`${i(this.currentTime)} / ${i(this.duration)}`,this.getWidth=()=>this.currentTime/this.duration*100+"%"}componentDidLoad(){this.audioContainer=new o(this.url),this.audioContainer.audio.addEventListener("loadeddata",()=>{this.duration=this.audioContainer.duration}),this.audioContainer.audio.addEventListener("ended",()=>{this.audioContainer.reset(),this.isPaused=!0}),this.audioContainer.audio.addEventListener("timeupdate",()=>{this.updateTime(),this.updatePan(),this.isPaused||this.updateVolume()})}componentDidUpdate(){this.audioContainer.reInit(this.url)}render(){return s("div",{class:"audioplayer"},s("div",{class:"timeline",onClick:this.handleTimeSeek},s("div",{class:"progress-bar",style:{width:this.getWidth()}})),s("div",{class:"body"},s("div",{class:"play-container"+(this.url?"":" disabled")},s("div",{class:(this.isPaused?"play":"pause")+" btn",onClick:this.togglePlay})),s("div",{class:"name"},this.name||"Unknown Song"),s("div",{class:"time"},this.getTime())),s("keyframe-editor",{ref:t=>this.keyframeEditorVolume=t,open:!0,name:"volume"}),s("keyframe-editor",{ref:t=>this.keyframeEditorPan=t,open:!0,name:"pan"}))}static get style(){return".audioplayer{height:50px;font-family:Arial,Helvetica,sans-serif;background:#223143;color:#fff;position:relative;z-index:2;display:grid;grid-template-rows:auto 40px 1fr}.timeline{cursor:pointer;height:10px;background:#e2e2e2}.progress-bar{height:100%;width:0;background:coral;-webkit-transition:.5s;transition:.5s}.body{display:grid;grid-template-columns:auto 1fr auto;grid-gap:10px;-ms-flex-line-pack:center;align-content:center}.body>*{padding:5px 20px;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}.name{text-align:center}.btn{cursor:pointer}.play-container{width:20px}.play-container.disabled{opacity:.5}.play-container.disabled .btn{cursor:auto}.play{border:7px solid transparent;border-left:12px solid #fff;position:relative;right:-4px}.pause:after,.pause:before{content:\"\";position:absolute;width:3px;top:0;bottom:0;background:#fff}.pause{height:13px;width:11px;position:relative}.pause:before{left:0}.pause:after{right:0}"}};export{r as keyframe_editor,a as keyframed_audio_player};