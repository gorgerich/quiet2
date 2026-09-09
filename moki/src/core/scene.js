import {BehaviorDirector} from './director.js';
import {CharacterActor,AnimationController} from './actor.js';
import {AudioManager} from './audio.js';
import {chapters} from './world-state.js';

export class CameraController {
 constructor(root){this.root=root;this.motion=new AnimationController();}
 focus(screen,calm){this.motion.calm=calm;this.root.dataset.camera=screen;this.motion.stop();this.motion.play(this.root.querySelector('.scene-environment'),[{transform:'scale(1.035)'},{transform:'scale(1)'}],{duration:900});}
}
export class VFXManager {
 constructor(){this.canvas=document.createElement('canvas');this.canvas.className='scene-vfx';this.canvas.setAttribute('aria-hidden','true');this.ctx=this.canvas.getContext('2d');this.particles=[];this.raf=0;}
 burst(from,to,calm,kind='hp'){if(calm||!from||!to||!this.ctx)return;const d=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;this.canvas.width=w*d;this.canvas.height=h*d;this.ctx.setTransform(d,0,0,d,0,0);for(let i=0;i<Math.min(6,18-this.particles.length);i++)this.particles.push({from,to,kind,start:performance.now()+i*90,duration:850});if(!this.raf)this.raf=requestAnimationFrame(t=>this.frame(t));}
 frame(now){this.raf=0;const c=this.ctx;c.clearRect(0,0,innerWidth,innerHeight);this.particles=this.particles.filter(p=>now-p.start<p.duration);for(const p of this.particles){const t=Math.max(0,Math.min(1,(now-p.start)/p.duration)),e=t*t*(3-2*t),x=p.from.x+(p.to.x-p.from.x)*e,y=p.from.y+(p.to.y-p.from.y)*e-Math.sin(t*Math.PI)*65;c.save();c.translate(x,y);c.fillStyle=p.kind==='leaf'?'#88cc83':'#ff797c';c.globalAlpha=Math.min(t*8,1)*(1-t*.6);c.beginPath();if(p.kind==='leaf'){c.ellipse(0,0,4,8,t*3,0,Math.PI*2);c.fill();c.restore();continue;}c.moveTo(0,4);c.bezierCurveTo(-18,-7,-7,-17,0,-7);c.bezierCurveTo(7,-17,18,-7,0,4);c.fill();c.restore();}if(this.particles.length)this.raf=requestAnimationFrame(t=>this.frame(t));}
 stop(){cancelAnimationFrame(this.raf);this.raf=0;this.particles=[];this.ctx?.clearRect(0,0,this.canvas.width,this.canvas.height);}
}
const point=el=>{if(!el)return null;const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};};
export class SceneManager {
 constructor({app,markup}){
  this.app=app;this.root=document.createElement('div');this.root.className='living-scene';this.root.setAttribute('aria-hidden','true');this.root.innerHTML='<div class="scene-environment"><div class="scene-wall"></div><div class="scene-light"></div><div class="scene-air">'+Array.from({length:7},(_,i)=>`<i style="--i:${i}"></i>`).join('')+'</div><div class="scene-vignette"></div></div>';app.before(this.root);
  this.actor=new CharacterActor(markup);this.director=new BehaviorDirector();this.camera=new CameraController(this.root);this.audio=new AudioManager();this.vfx=new VFXManager();document.body.append(this.vfx.canvas);this.motion=new AnimationController();this.timer=null;this.lastScreen=null;this.calm=false;this.paused=false;this.trace=[];
  this.onPointer=e=>{if(this.calm||this.paused)return;this.root.style.setProperty('--px',`${(e.clientX/innerWidth-.5)*6}px`);this.root.style.setProperty('--py',`${(e.clientY/innerHeight-.5)*4}px`);};app.addEventListener('pointermove',this.onPointer,{passive:true});this.media=matchMedia('(prefers-reduced-motion: reduce)');this.onMedia=()=>{if(this.state)this.bind(this.state,this.ui)};this.media.addEventListener('change',this.onMedia);
 }
 bind(s,ui){this.state=s;this.ui=ui;const screen=s.onboarded?ui.screen:'onboard';const active=['home','mission','practice','reward','chest','find','world'].includes(screen);this.calm=!!s.settings.calm||this.media.matches;this.motion.calm=this.calm;if(this.calm){this.root.style.setProperty('--px','0px');this.root.style.setProperty('--py','0px');}this.root.hidden=!active;document.documentElement.dataset.scene=active?screen:'none';this.root.dataset.theme=s.child.theme;this.root.dataset.time=new Date().getHours()<6||new Date().getHours()>=21?'night':new Date().getHours()>=18?'evening':'day';this.root.dataset.calm=String(this.calm);this.root.dataset.lamp=String(s.world?.lampOn!==false);this.root.dataset.chapter=chapters(s).index;
  this.app.querySelectorAll('[data-id=plant]').forEach(el=>el.dataset.growth=chapters(s).growth);this.audio.configure(s.settings.sound,this.calm,s.child.theme);const host=appHost(this.app,screen);this.actor.bind(host,s.child.character,s.child.accessory,this.calm);
  this.director.context={screen,calm:this.calm,night:this.root.dataset.time==='night',napping:s.world?.napping,mission:!!s.activeMission||Object.entries(s.missionSettings).some(([id,x])=>x.enabled&&!s.day.completed[id]),difficult:s.history.slice(-2).filter(h=>h.effort==='hard').length===2};
  if(active&&host){const entry=this.director.setContext(this.director.context,performance.now());if(entry)this.apply(entry);else this.actor.act({state:this.director.state});}
  if(screen!==this.lastScreen){this.camera.focus(screen,this.calm);this.lastScreen=screen;if(screen==='mission')this.event('mission');if(screen==='reward')this.event('complete');if(screen==='chest')this.event('chest');if(screen==='find')this.event('discover');}
  this.pause(!active||!!ui.modal||document.hidden);if(active&&!this.paused)this.schedule();
 }
 apply(d){this.actor.act(d);this.trace.push({at:Math.round(performance.now()),state:d.state});this.trace=this.trace.slice(-30);this.root.dataset.actorState=d.state;this.app.querySelectorAll('[data-director-cue]').forEach(x=>x.removeAttribute('data-director-cue'));if(d.target==='mission'){const el=this.app.querySelector('.mission-banner');el?.setAttribute('data-director-cue','true');}if(d.state==='greet')this.audio.play('character.greet');}
 schedule(){clearTimeout(this.timer);if(this.paused)return;this.timer=setTimeout(()=>{const d=this.director.update(performance.now());if(d)this.apply(d);this.schedule();},Math.max(250,Math.min(12000,this.director.until-performance.now()+20)));}
 event(name,target){const d=this.director.event(name,performance.now(),target);if(d)this.apply(d);this.schedule();}
 gesture(){this.audio.unlock();}
 sound(name){this.audio.play(name);}
 pause(on){this.paused=on;this.root.dataset.paused=String(on);this.audio.mute(on);clearTimeout(this.timer);if(on){this.director.suspend();this.actor.motion.stop();this.camera.motion.stop();this.vfx.stop();}else{this.director.resume(performance.now());this.schedule();}}
 reward(){this.event('complete');this.sound('mission.complete');this.vfx.burst(point(this.actor.host),point(this.app.querySelector('.reward-hp,.pill')),this.calm);const hp=this.app.querySelector('.reward-hp');this.motion.play(hp,[{transform:'scale(.9)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:1100});}
 item(id,el){this.event(id==='bed'?(this.state.world.napping?'sleep':'wake'):'item','prop');this.sound('world.object.'+id);this.root.dataset.lamp=String(this.state.world.lampOn);this.motion.play(el,[{transform:'rotate(0deg) scale(1)'},{transform:'rotate(-5deg) scale(1.09)'},{transform:'rotate(3deg) scale(.98)'},{transform:'rotate(0deg) scale(1)'}],{duration:800});if(id==='plant')this.vfx.burst(point(el),point(el),this.calm,'leaf');}
 destroy(){clearTimeout(this.timer);this.actor.destroy();this.audio.destroy();this.vfx.stop();this.vfx.canvas.remove();this.root.remove();this.app.removeEventListener('pointermove',this.onPointer);this.media.removeEventListener('change',this.onMedia);}
}
function appHost(app,screen){if(screen==='mission')return app.querySelector('.guide-companion .actor-host');if(['reward','practice'].includes(screen))return app.querySelector('.actor-host');return app.querySelector('.hero-button');}
