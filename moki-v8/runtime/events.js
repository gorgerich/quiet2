document.addEventListener('click',e=>{
 const screen=e.target.closest('[data-screen]');if(screen){if(screen.dataset.tab)S.ui.worldTab=screen.dataset.tab;return setScreen(screen.dataset.screen)}
 const st=e.target.closest('[data-start]');if(st)return openMission(st.dataset.start);
 if(e.target.closest('[data-chest]')){S.ui.overlay={type:'chest'};save();return render()}
 if(e.target.closest('[data-reveal]'))return chestReveal();
 if(e.target.closest('[data-close]')){const was=S.ui.overlay?.type;S.ui.overlay=null;if(was==='chestReveal')S.ui.screen='world';save();return render()}
 if(e.target.closest('[data-step-done]'))return missionStepDone();
 if(e.target.closest('[data-open-help]')){S.ui.overlay.type='help';save();return render()}
 if(e.target.closest('[data-back-step]')){S.ui.overlay.type='mission';save();return render()}
 const h=e.target.closest('[data-help]');if(h){S.ui.overlay.type='help';chooseHelp(h.dataset.help);return}
 const ef=e.target.closest('[data-effort]');if(ef)return completeMission(ef.dataset.effort);
 const wt=e.target.closest('[data-worldtab]');if(wt){S.ui.worldTab=wt.dataset.worldtab;save();return render()}
 const ch=e.target.closest('[data-character]');if(ch){S.child.character=ch.dataset.character;save();return render()}
 const ac=e.target.closest('[data-accessory]');if(ac){const a=accessories.find(x=>x.id===ac.dataset.accessory);if(S.child.chests>=a.need){S.child.accessory=a.id;save();render()}return}
 if(e.target.closest('[data-parent]')){S.ui.overlay={type:'parentGate'};save();return render()}
 if(e.target.closest('[data-parent-enter]')){const p=$('#pin');if(p?.value!==S.parent.pin){p.style.borderColor='#ff6978';return}S.ui.overlay=null;S.ui.screen='parent';save();return render()}
 const pt=e.target.closest('[data-parenttab]');if(pt){S.ui.parentTab=pt.dataset.parenttab;save();return render()}
 const tg=e.target.closest('[data-toggle]');if(tg){const m=S.missions.find(x=>x.id===tg.dataset.toggle);if(m.enabled&&active().length<=1)return;m.enabled=!m.enabled;save();return render()}
 const ah=e.target.closest('[data-adult-hp]');if(ah){const m=S.family.members.find(x=>x.id===ah.dataset.adultHp),hp=Number(ah.dataset.hp||5);if(m){m.earned=(m.earned||0)+hp;S.family.feed.unshift({id:'a'+Date.now(),memberId:m.id,category:'Взрослое дело',text:'Закрыл полезное дело',hp,ts:Date.now()});save();render()}return}
 if(e.target.closest('[data-nudge]')){S.ui.overlay={type:'nudge'};save();return render()}
 const ns=e.target.closest('[data-nudge-send]');if(ns){S.ui.overlay=null;S.family.feed.unshift({id:'n'+Date.now(),memberId:'child',category:'Команда',text:`Отправил реакцию: ${ns.dataset.nudgeSend}`,hp:0,ts:Date.now()});save();return render()}
 if(e.target.closest('[data-challenge]')){S.ui.overlay={type:'challenge'};save();return render()}
 const ct=e.target.closest('[data-challenge-to]');if(ct){S.family.challenge={targetId:ct.dataset.challengeTo,done:false,startedAt:Date.now()};S.ui.overlay=null;save();return render()}
 if(e.target.closest('[data-photo-family]')){S.child.portraitFamily=!S.child.portraitFamily;save();return render()}
 if(e.target.closest('[data-photo-remove]')){S.child.portrait=null;save();return render()}
 const og=e.target.closest('[data-ob-goal]');if(og){const m=S.missions.find(x=>x.id===og.dataset.obGoal),enabled=S.missions.filter(x=>x.enabled);if(m.enabled)m.enabled=false;else if(enabled.length<3)m.enabled=true;save();return render()}
 const os=e.target.closest('[data-ob-support]');if(os){S._obSupport=Number(os.dataset.obSupport);save();return render()}
 const theme=e.target.closest('[data-theme]');if(theme){S.child.theme=theme.dataset.theme;save();return render()}
 if(e.target.closest('[data-ob-save]')){const n=$('#obName')?.value.trim(),p=$('#obPin')?.value.trim();if(!n||!/^\d{4}$/.test(p))return;S.child.name=n;S.parent.pin=p;S.family.members.find(x=>x.id==='child').name=n;S.ui.onboardingStep++;save();return render()}
 if(e.target.closest('[data-ob-next]')){S.ui.onboardingStep++;save();return render()}
 if(e.target.closest('[data-ob-finish]')){S.onboarded=true;S.child.hp+=3;const c=childMember();c.earned=S.child.hp;S.family.feed.unshift({id:'tutorial',memberId:'child',category:'Первая победа',text:'Нашёл рюкзак',hp:3,ts:Date.now()});S.ui.screen='home';S.ui.onboardingStep=0;save();return render()}
});
document.addEventListener('change',e=>{if(e.target.id==='photoInput')handlePhoto(e.target.files?.[0])});
document.addEventListener('click',e=>{if(e.target.classList.contains('overlay')){S.ui.overlay=null;save();render()}});
const params=new URLSearchParams(location.search);if(params.get('debug')){S.onboarded=true;S.ui.screen=params.get('debug');if(params.get('char'))S.child.character=params.get('char');if(params.get('tab'))S.ui.worldTab=params.get('tab');save();document.body.insertAdjacentHTML('beforeend','<div class="debug-badge">DEBUG</div>')}
render();