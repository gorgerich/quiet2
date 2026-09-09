// Original procedural toy/chime palette; TTS remains a separate accessibility channel.
export const SOUND_EVENTS={
 'ui.tap.soft':[660], 'ui.confirm':[523,659], 'mission.step.complete':[587,784], 'mission.complete':[523,659,784,1047], 'hp.spawn':[880], 'hp.travel':[740,880], 'hp.absorb':[1047,1319], 'chest.notice':[392,523], 'chest.ready':[523,784,1047], 'chest.open':[262,392,659,1047], 'reward.common':[659,784,988], 'reward.rare':[523,659,784,1175], 'world.object.plant':[740,988], 'world.object.lantern':[392,587], 'world.object.pet':[660,550,770], 'world.object.bed':[294,392], 'world.object.telescope':[988,1319], 'world.object.shelf':[440,659], 'world.object.trophy':[523,784], 'family.member.success':[392,523,659], 'boss.damage':[196,294], 'boss.defeat':[392,523,659,784], 'transition.focus':[349,440], 'character.greet':[480,620,540], 'character.curious':[420,610], 'character.happy':[600,730,650]
};
export class AudioManager {
 constructor(){this.context=null;this.enabled=false;this.last=new Map();this.nodes=new Set();this.ambientTimer=null;this.theme='forest';this.muted=false;}
 configure(enabled,calm,theme){this.enabled=enabled;this.calm=calm;this.theme=theme;if(!enabled)this.stop();}
 unlock(){if(!this.enabled)return;try{if(!this.context){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.context=new C();}this.context.resume().catch(()=>{});}catch{}}
 play(name){if(!this.enabled||this.muted||!this.context||this.context.state!=='running')return false;const now=this.context.currentTime;if(now-(this.last.get(name)??-10)<.22)return false;this.last.set(name,now);const notes=SOUND_EVENTS[name];if(!notes)return false;notes.forEach((f,i)=>this.note(f,now+i*.085,name.startsWith('character')?'sine':'triangle',this.calm?.012:.025));return true;}
 note(f,at,type,gain){if(this.nodes.size>=16)return;const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,at);o.frequency.exponentialRampToValueAtTime(f*.96,at+.18);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(gain,at+.012);g.gain.exponentialRampToValueAtTime(.0001,at+.32);o.connect(g);g.connect(c.destination);this.nodes.add(o);o.onended=()=>{this.nodes.delete(o);o.disconnect();g.disconnect()};o.start(at);o.stop(at+.34);}
 ambience(){clearTimeout(this.ambientTimer);if(!this.enabled||this.muted)return;const f={forest:1175,space:220,island:440,town:659}[this.theme]||659;if(this.context?.state==='running')this.note(f,this.context.currentTime,'sine',.004);this.ambientTimer=setTimeout(()=>this.ambience(),this.calm?19000:12000);}
 mute(on){this.muted=on;if(on)this.stop();else this.ambience();}
 stop(){clearTimeout(this.ambientTimer);this.ambientTimer=null;for(const o of this.nodes){try{o.stop()}catch{}}this.nodes.clear();}
 destroy(){this.stop();this.context?.close().catch(()=>{});}
}
