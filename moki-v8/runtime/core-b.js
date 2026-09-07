function asset(n){
 const key=n.replace(/\.(webp|png)$/,'');
 if(key==='room')return window.MOKI_ROOM||'';
 if(['moki','tobi','runi','bip','nori'].includes(key))return (window.MOKI_ART&&window.MOKI_ART[key])||(window.MOKI_ART&&window.MOKI_ART.moki)||'';
 const I=window.MOKI_ITEMS||{};
 if(key==='boss')return I.boss||'';
 return I[key]||'';
}
function characterImg(id=S.child.character){return asset(chars[id]?.img||chars.moki.img)}
function itemImg(id){return asset((items.find(x=>x.id===id)||{}).img||'plant.webp')}
function accessoryHtml(){
 const a=accessories.find(x=>x.id===S.child.accessory); if(!a?.img)return '';
 return `<span class="acc ${a.id}"><img src="${asset(a.img)}" alt=""></span>`;
}
function portraitOrPet(cls='user-avatar'){
 if(S.child.portrait)return `<div class="${cls}"><img src="${S.child.portrait}" alt=""></div>`;
 return `<div class="${cls} pet"><img src="${characterImg()}" alt=""></div>`;
}
function hero(){
 return `<div class="hero ${S.child.character}" data-pet><img src="${characterImg()}" alt="${chars[S.child.character].name}">${accessoryHtml()}</div>`;
}
function setScreen(x){S.ui.screen=x;S.ui.overlay=null;save();render()}
function rewardItem(){return items.find(x=>S.child.chests>=x.need-1&&!S.child.collection.includes(x.id))||null}
function updateFamily(hp,category,text){
 let c=childMember();if(!c){c={id:'child',role:'child',name:S.child.name,earned:0,target:70};S.family.members.unshift(c)}c.name=S.child.name;c.earned=(c.earned||0)+hp;S.child.hp=c.earned;
 S.family.feed.unshift({id:'f'+Date.now(),memberId:'child',category,text,hp,ts:Date.now()});S.family.feed=S.family.feed.slice(0,20);
 if(S.family.challenge&&!S.family.challenge.done){S.family.challenge.done=true;S.family.challenge.result='Первое выполненное дело — твоё. Раунд завершён.'}
}
function completeMission(effort){
 const o=S.ui.overlay,m=S.missions.find(x=>x.id===o.missionId);if(!m)return;
 const support=o.coop?'together':o.help?'hint':'solo';S.daily.completed[m.id]={support,effort};S.history.push({type:'mission',date:today(),missionId:m.id,support,effort,hp:m.hp});updateFamily(m.hp,m.group,m.title);save();
 S.ui.overlay={type:'reward',missionId:m.id,hp:m.hp,support};save();render();
}
function openMission(id){S.ui.overlay={type:'mission',missionId:id,step:0,help:false,coop:false};save();render()}
function missionStepDone(){let o=S.ui.overlay,m=S.missions.find(x=>x.id===o.missionId);if(o.step<m.steps.length-1){o.step++;o.help=false;o.coop=false}else{o.type='effort'}save();render()}
function chooseHelp(kind){let o=S.ui.overlay;o.help=true;if(kind==='together')o.coop=true;o.helpMode=kind;save();render()}
function chestReveal(){const r=rewardItem();S.daily.chestOpened=true;S.child.chests++;if(r)S.child.collection.push(r.id);S.ui.overlay={type:'chestReveal',item:r?.id||null};save();render()}