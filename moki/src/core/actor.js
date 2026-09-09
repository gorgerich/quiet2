import {ACTOR_STATES} from './director.js';
export class AnimationController {
 constructor(){this.animations=new Set();this.calm=false;}
 play(el,frames,options={}){if(!el||this.calm||!el.animate)return null;const a=el.animate(frames,{duration:600,easing:'cubic-bezier(.22,.8,.24,1)',...options});this.animations.add(a);a.finished.catch(()=>{}).finally(()=>this.animations.delete(a));return a;}
 stop(){for(const a of this.animations)a.cancel();this.animations.clear();}
}
export class CharacterActor {
 constructor(markup){this.markup=markup;this.body=document.createElement('span');this.body.className='actor-body';this.motion=new AnimationController();this.state='idle';this.pose='idle';this.character=null;}
 bind(host,character,accessory,calm){this.motion.stop();this.motion.calm=calm;this.host=host;if(!host)return;this.body.remove();host.replaceChildren(this.body);if(character!==this.character||accessory!==this.accessory){this.character=character;this.accessory=accessory;this.paint(this.pose);}host.dataset.actorState=this.state;}
 paint(pose){this.pose=pose;this.body.innerHTML=this.markup(this.character,pose,this.accessory);}
 act(decision){if(!decision||!this.host?.isConnected)return;this.motion.stop();this.state=decision.state;this.host.dataset.actorState=this.state;this.paint(decision.pose||ACTOR_STATES[this.state][0]);const target=decision.target;this.host.dataset.look=target||'';
  const moves={greet:[0,-5,-1,0],small_success:[0,-9,2,0],big_success:[0,-15,-3,0],discover_item:[0,-8,-2,0],receive_hp:[0,-5,0,0],idle_variant:[0,2,1,0],curious:[0,-3,-1,0]};
  if(moves[this.state])this.motion.play(this.body,moves[this.state].map((y,i)=>({transform:`translateY(${y}px) rotate(${i===1?-3:0}deg) scale(${i===1?1.035:1})`})),{duration:this.state==='big_success'?1200:900});
  else if(['observe_object','invite_mission','look_at_target'].includes(this.state))this.motion.play(this.body,[{transform:'rotate(0deg)'},{transform:`rotate(${target==='prop'?-4:4}deg) translateX(${target==='prop'?-5:5}px)`},{transform:'rotate(0deg)'}],{duration:1800});
 }
 destroy(){this.motion.stop();this.body.remove();}
}
