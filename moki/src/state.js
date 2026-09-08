import {missions,characters,finds} from './catalog.js';
export const KEY='moki_game_state';
export const dateKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const cleanNumber=x=>Math.max(0,Number.isFinite(Number(x))?Number(x):0);
export function fresh(){return {schema:1,onboarded:false,child:{name:'Друг',character:'moki',theme:'forest',portrait:null,accessory:null,hp:0,collection:[],placed:[]},settings:{pinHash:null,pinSalt:null,sound:false,haptics:true,photoFamily:false},missionSettings:Object.fromEntries(missions.map(m=>[m.id,{enabled:['bag','room','reading'].includes(m.id),support:1}])),day:{date:dateKey(),completed:{},chestOpened:false},history:[],activeMission:null,family:{name:'Наша команда',members:[],goal:100,bossMax:100,bossBase:0,feed:[],challenge:null},onboarding:{step:0,support:1}};}
export function load(storage){
 const read=k=>{try{return JSON.parse(storage.getItem(k)||'null')}catch{return null}};
 const current=read(KEY);const s=fresh();
 if(current?.schema===1){
  Object.assign(s,current);s.child={...fresh().child,...current.child};s.settings={...fresh().settings,...current.settings};s.family={...fresh().family,...current.family};s.missionSettings={...fresh().missionSettings,...current.missionSettings};
 }else{
  const old=read('moki_v8_state')||read('moki_v6_product');const identity=read('moki_v7_identity')||{};const family=read('moki_family_v1')||{};
  if(old){s.child.theme=old.child?.theme||old.child?.world||identity.world||'forest';s.child.name=old.child?.name||'Друг';s.child.hp=cleanNumber(old.child?.hp??family.members?.find(m=>m.id==='child')?.earned);s.child.character=old.child?.character||identity.character||'moki';s.child.portrait=old.child?.portrait||identity.portrait||null;s.child.collection=(old.child?.collection||[]).filter(id=>finds.some(f=>f[0]===id));s.child.placed=s.child.collection.filter(id=>!['hat','glasses','scarf'].includes(id));s.history=Array.isArray(old.history)?old.history.map(h=>({...h,legacy:true})):[];
   for(const m of old.missions||[])if(s.missionSettings[m.id])s.missionSettings[m.id]={enabled:!!m.enabled,support:[0,1,2].includes(m.support)?m.support:1};
   if(old.daily?.date===dateKey())s.day={...s.day,completed:old.daily.completed||{},chestOpened:!!old.daily.chestOpened};
   const oldFamily=old.family||family;
   if(Array.isArray(oldFamily.members))s.family.members=oldFamily.members.filter(m=>m.id!=='child').map((m,i)=>({id:/^[\w-]+$/.test(m.id)?m.id:`member-${i}`,name:String(m.name||'Участник').slice(0,24),character:characters.some(c=>c[0]===m.character)?m.character:'tobi',hp:cleanNumber(m.hp??m.earned)}));
   if(oldFamily.goal)s.family.goal=cleanNumber(oldFamily.goal)||100;
   if(Array.isArray(oldFamily.feed))s.family.feed=oldFamily.feed.filter(f=>!String(f.id).startsWith('seed')).map(f=>({id:String(f.id||''),member:f.member||f.memberId||'child',task:String(f.task||f.text||'Полезное дело'),category:String(f.category||'Семья'),hp:cleanNumber(f.hp),at:f.at||f.ts||0})).slice(0,100);
   // Old defaults contained a public PIN. Require adult setup once; retain earned progress.
   s.onboarding.step=0;
  }
 }
 s.child.hp=cleanNumber(s.child.hp);if(!characters.some(c=>c[0]===s.child.character))s.child.character='moki';
 s.history=Array.isArray(s.history)?s.history.slice(-3000):[];s.family.members=Array.isArray(s.family.members)?s.family.members:[];
 s.child.collection=Array.isArray(s.child.collection)?s.child.collection.filter(id=>finds.some(f=>f[0]===id)):[];
 s.child.placed=Array.isArray(s.child.placed)?s.child.placed.filter(id=>s.child.collection.includes(id)):[];
 if(typeof s.child.portrait!=='string'||!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s.child.portrait))s.child.portrait=null;
 s.family.feed=Array.isArray(s.family.feed)?s.family.feed.slice(0,100):[];
 s.family.goal=Math.max(10,cleanNumber(s.family.goal));s.family.bossMax=Math.max(10,cleanNumber(s.family.bossMax));
 if(!s.day||s.day.date!==dateKey()){s.day={date:dateKey(),completed:{},chestOpened:false};s.activeMission=null;}
 return s;
}
export const enabled=s=>missions.filter(m=>s.missionSettings[m.id]?.enabled);
export const completed=s=>Object.keys(s.day.completed).length;
export const chestGoal=s=>Math.min(3,Math.max(1,enabled(s).length));
export const chestReady=s=>enabled(s).length>0&&completed(s)>=chestGoal(s)&&!s.day.chestOpened;
export const familyTotal=s=>s.child.hp+s.family.members.reduce((n,m)=>n+cleanNumber(m.hp),0);
export function next(s,hour=new Date().getHours()) {const order=hour<11?['morning','day','afternoon','evening']:hour<17?['day','afternoon','evening','morning']:['evening','afternoon','day','morning'];return enabled(s).filter(m=>!s.day.completed[m.id]).sort((a,b)=>order.indexOf(a.timeOfDay)-order.indexOf(b.timeOfDay))[0];}
export function start(s,id,now=Date.now()){if(s.day.completed[id]||!s.missionSettings[id]?.enabled)return false;if(s.activeMission?.id===id)return true;s.activeMission={id,step:0,hints:[],startedAt:now,phase:'step'};return true;}
export function help(s,level,now=Date.now()){const a=s.activeMission;if(!a||a.phase!=='step'||![1,2,3].includes(level))return false;a.hints.push({step:a.step,level,at:now});return true;}
export function advance(s){const a=s.activeMission;if(!a||a.phase!=='step')return false;if(a.step<2)a.step++;else a.phase='effort';return true;}
export function finish(s,effort,now=Date.now()){
 const a=s.activeMission;if(!a||a.phase!=='effort'||!['easy','ok','hard'].includes(effort)||s.day.completed[a.id])return null;
 const m=missions.find(m=>m.id===a.id);if(!m)return null;
 const h={id:`${s.day.date}:${m.id}`,date:s.day.date,missionId:m.id,effort,hp:m.hp,hints:a.hints.length,scaffolding:Math.max(0,...a.hints.map(h=>h.level)),durationMs:Math.max(0,now-a.startedAt),startedAt:a.startedAt,completedAt:now,helpEvents:[...a.hints]};
 s.day.completed[m.id]=h;s.history.push(h);s.history=s.history.slice(-3000);s.child.hp+=m.hp;s.family.feed.unshift({id:h.id,member:'child',category:m.category,task:m.title,hp:m.hp,at:now});s.family.feed=s.family.feed.slice(0,100);
 if(s.family.challenge?.active&&s.family.challenge.childMission===m.id){s.family.challenge.active=false;s.family.challenge.winner='child';}
 s.activeMission=null;return h;
}
export function openChest(s){if(!chestReady(s))return null;const item=finds.find(f=>!s.child.collection.includes(f[0]));s.day.chestOpened=true;if(item){s.child.collection.push(item[0]);if(!['hat','glasses','scarf'].includes(item[0]))s.child.placed.push(item[0]);}return item||['reaction','Новая радость','Все предметы уже собраны. Сегодня герой устроит маленький танец!'];}
export function skillSummary(s,id){const h=s.history.filter(h=>h.missionId===id&&!h.legacy);const last=h.slice(-4);return {count:h.length,hints:h.reduce((n,x)=>n+x.hints,0),independent:h.filter(x=>x.scaffolding===0).length,canFade:last.length===4&&last.every(x=>x.scaffolding===0&&x.effort!=='hard'),needsSupport:last.length>=2&&last.slice(-2).every(x=>x.effort==='hard')};}
export function friendFeed(s){return s.family.feed.filter(f=>f.member==='child'&&f.hp>0).map(f=>({name:s.child.name,hp:f.hp,category:f.category}));}
