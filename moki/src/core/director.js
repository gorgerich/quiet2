// Pure presentation decisions. No rewards, persistence, DOM or real timers.
export const ACTOR_STATES=Object.freeze({
 enter_room:['idle',800],notice_player:['excited',900],greet:['happy',1400],idle:['idle',6000],idle_variant:['thinking',1600],observe_object:['thinking',1700],look_at_target:['thinking',1200],look_at_ui_target:['helping',1600],curious:['excited',1400],invite_mission:['helping',2200],waiting:['idle',8000],encourage:['happy',1600],thinking:['thinking',2000],confused:['thinking',1300],help:['helping',2400],demonstrate:['helping',2200],anticipation:['excited',750],small_success:['happy',1500],big_success:['celebrate',2300],receive_hp:['excited',1600],celebrate:['celebrate',2400],discover_item:['excited',2100],interact_item:['helping',1600],family_reaction:['happy',2100],boss_reaction:['excited',1700],tired:['sleeping',2400],sleep:['sleeping',14000],wake:['excited',1600],surprised:['excited',1300],proud:['happy',2200]
});
const EVENTS={pet:'greet',mission:'invite_mission',step:'small_success',help:'help',demonstrate:'demonstrate',complete:'big_success',hp:'receive_hp',chest:'anticipation',discover:'discover_item',item:'interact_item',family:'family_reaction',boss:'boss_reaction',sleep:'sleep',wake:'wake'};
export class BehaviorDirector {
 constructor(){this.state='idle';this.until=0;this.index=0;this.entered=false;this.lastInvite=-Infinity;this.active=true;this.context={};}
 setContext(context,now){this.context=context;if(!this.entered){this.entered=true;return this.set('enter_room',now);}return null;}
 set(state,now,target=null){if(!ACTOR_STATES[state])return null;this.state=state;this.until=now+ACTOR_STATES[state][1];return {state,pose:ACTOR_STATES[state][0],duration:ACTOR_STATES[state][1],target};}
 event(event,now,target){return EVENTS[event]?this.set(EVENTS[event],now,target):null;}
 update(now){if(!this.active||now<this.until)return null;const c=this.context;
  if(this.state==='enter_room')return this.set('notice_player',now);
  if(this.state==='notice_player')return this.set('greet',now);
  if(c.napping||(c.night&&!c.mission))return this.set('sleep',now);
  if(c.screen==='mission')return this.set(c.difficult?'encourage':'waiting',now);
  if(c.calm)return this.set('idle',now);
  if(c.screen==='home'&&c.mission&&now-this.lastInvite>28000){this.lastInvite=now;return this.set('invite_mission',now,'mission');}
  const cycle=['idle','observe_object','idle','idle_variant','idle','curious'];const state=cycle[this.index++%cycle.length];const r=this.set(state,now,state==='observe_object'?'prop':null);if(state==='idle')this.until+=this.index%3*1700;return r;
 }
 suspend(){this.active=false;}
 resume(now){this.active=true;this.until=now+1200;}
}
