const KEY='moki_v8_state', OLD='moki_v6_product', OLDF='moki_family_v1', OLDV='moki_v7_identity';
const AS='';
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Date().toLocaleDateString('sv-SE');
const chars={
 moki:{name:'Моки',desc:'Любопытный и добрый',img:'moki.webp'},
 tobi:{name:'Тоби',desc:'Спокойный исследователь',img:'tobi.webp'},
 runi:{name:'Руни',desc:'Смелый и быстрый',img:'runi.webp'},
 bip:{name:'Бип',desc:'Логичный и смешной',img:'bip.webp'},
 nori:{name:'Нори',desc:'Игривый мечтатель',img:'nori.webp'}
};
const items=[
 {id:'plant',name:'Растение',img:'plant.webp',need:1},
 {id:'lantern',name:'Фонарь',img:'lantern.webp',need:1},
 {id:'bed',name:'Кровать',img:'bed.webp',need:2},
 {id:'telescope',name:'Телескоп',img:'telescope.webp',need:3}
];
const accessories=[
 {id:'none',name:'Без аксессуара',img:null,need:0},
 {id:'hat',name:'Шапка',img:'hat.webp',need:1},
 {id:'glasses',name:'Очки',img:'glasses.webp',need:2},
 {id:'scarf',name:'Шарф',img:'scarf.webp',need:3}
];
const missions=[
 {id:'morning_hygiene',group:'Утро',order:10,icon:'🪥',title:'Зубы и умывание',mins:4,hp:3,enabled:false,support:1,steps:[
  {text:'Почисти зубы',hint:'Возьми щётку и пасту. Начни только с верхних зубов.',show:'Щётка → паста → верхние зубы.'},
  {text:'Умой лицо',hint:'Намочи лицо прохладной водой и вытри полотенцем.',show:'Вода → лицо → полотенце.'},
  {text:'Проверь себя в зеркале',hint:'Зубы чистые, лицо умыто — миссия готова.',show:'Быстрый взгляд в зеркало — и всё.'}]},
 {id:'breakfast_helper',group:'Утро',order:20,icon:'🍳',title:'Помочь с завтраком',mins:8,hp:5,enabled:false,support:0,steps:[
  {text:'Накрой на стол',hint:'Начни с тарелок и приборов.',show:'Тарелки → приборы → салфетки.'},
  {text:'Сделай один безопасный шаг в готовке',hint:'Например, достань продукты или помешай.',show:'Спроси взрослого, какой один шаг твой.'},
  {text:'После еды помоги убрать',hint:'Сначала отнеси свою посуду.',show:'Своя посуда → ещё одна вещь со стола.'}]},
 {id:'learning_basics',group:'Развитие',order:30,icon:'✏️',title:'Чтение · счёт · письмо',mins:12,hp:8,enabled:false,support:1,steps:[
  {text:'Почитай 5 минут',hint:'Выбери одну страницу или короткий отрывок.',show:'Только 5 минут — не всю книгу.'},
  {text:'Реши 3 коротких примера',hint:'Начни с самого лёгкого.',show:'Один пример → второй → третий.'},
  {text:'Напиши 1–2 строки',hint:'Перепиши одну фразу или напиши свою.',show:'Одной короткой фразы достаточно.'}]},
 {id:'before_walk_clothes',group:'Прогулка',order:40,icon:'🧥',title:'Домашние вещи перед прогулкой',mins:3,hp:3,enabled:false,support:1,steps:[
  {text:'Сними домашнюю одежду аккуратно',hint:'Возьми одну вещь и сразу реши, куда она идёт.',show:'Одна вещь за раз.'},
  {text:'Чистое повесь на вешалку',hint:'Начни с самой большой вещи.',show:'Чистое → вешалка.'},
  {text:'Грязное положи в стирку',hint:'Если сомневаешься, спроси взрослого.',show:'Грязное → корзина для белья.'}]},
 {id:'after_walk_hands',group:'После прогулки',order:50,icon:'🫧',title:'Помыть руки после прогулки',mins:2,hp:3,enabled:false,support:2,steps:[
  {text:'Сними верхнюю одежду и обувь',hint:'Обувь поставь на место, одежду повесь.',show:'Сначала заверши возвращение с улицы.'},
  {text:'Помой руки с мылом',hint:'Ладони, пальцы, между пальцами.',show:'Мыло → 20 секунд → смыть.'},
  {text:'Вытри руки',hint:'Проверь, что полотенце осталось на месте.',show:'Сухие руки — готово.'}]},
 {id:'after_walk_home_clothes',group:'После прогулки',order:60,icon:'👕',title:'Переодеться в домашнее',mins:4,hp:3,enabled:false,support:1,steps:[
  {text:'Переоденься в домашнюю одежду',hint:'Сначала подготовь домашний комплект.',show:'Домашний комплект → переодеться.'},
  {text:'Чистую уличную одежду повесь',hint:'Каждую вещь сразу на свою вешалку.',show:'Чистое не остаётся на стуле.'},
  {text:'Грязное отправь в стирку',hint:'Корзина для белья — финальная точка.',show:'Грязное → стирка.'}]},
 {id:'lunch_helper',group:'День',order:70,icon:'🍽️',title:'Обед: сервировка и уборка',mins:6,hp:5,enabled:false,support:1,steps:[
  {text:'Накрой на стол',hint:'Тарелки → приборы → салфетки.',show:'Начни только с тарелок.'},
  {text:'После еды убери свою посуду',hint:'Отнеси тарелку и кружку.',show:'Сначала ответственность за своё.'},
  {text:'Помоги убрать со стола',hint:'Спроси: «Что ещё убрать?»',show:'Одной дополнительной вещи достаточно.'}]},
 {id:'room',group:'Дом',order:80,icon:'🧺',title:'Уборка в комнате',mins:7,hp:5,enabled:true,support:1,steps:[
  {text:'Собери вещи с пола и кровати',hint:'Начни только с пола или только с кровати.',show:'Одна зона — быстрый результат.'},
  {text:'Разложи вещи по местам',hint:'Игрушки → место, одежда → шкаф или стирка.',show:'Каждой вещи — её дом.'},
  {text:'Сделай быструю проверку',hint:'Можно свободно пройти? Пол и кровать свободны?',show:'Не идеально. Просто достаточно.'}]},
 {id:'bed',group:'Дом',order:85,icon:'🛏️',title:'Поменять постель',mins:10,hp:5,enabled:false,support:0,steps:[
  {text:'Сними старое постельное бельё',hint:'Начни с наволочки.',show:'Наволочка → простыня → пододеяльник.'},
  {text:'Надень чистое бельё',hint:'Если пододеяльник сложный — позови взрослого только на этот шаг.',show:'Можно сделать вместе один сложный кусок.'},
  {text:'Убери старое бельё в стирку',hint:'Сложи всё в одну корзину.',show:'Финальная точка — корзина.'}]},
 {id:'evening_teeth',group:'Вечер',order:90,icon:'🌙',title:'Почистить зубы вечером',mins:3,hp:3,enabled:false,support:1,steps:[
  {text:'Возьми щётку и пасту',hint:'Не думай про всю рутину — только возьми щётку.',show:'Самое важное — начать.'},
  {text:'Почисти зубы около 2 минут',hint:'Верхние → нижние → жевательные поверхности.',show:'Можно идти по зонам.'},
  {text:'Убери щётку и пасту',hint:'Сполосни щётку и верни всё на место.',show:'Чисто + порядок.'}]},
 {id:'bag',group:'Школа',order:100,icon:'🎒',title:'Собрать рюкзак',mins:4,hp:3,enabled:true,support:1,steps:[
  {text:'Посмотри расписание на завтра',hint:'Открой дневник и иди по урокам сверху вниз.',show:'Сначала только узнать, что завтра.'},
  {text:'Положи учебники и тетради',hint:'Один урок → его учебник и тетрадь.',show:'Проверяй по одному уроку.'},
  {text:'Проверь пенал и мелочи',hint:'Ручки, карандаш, дневник, вода.',show:'Последняя короткая проверка.'}]},
 {id:'school_uniform',group:'Школа',order:110,icon:'👟',title:'Подготовить форму',mins:3,hp:3,enabled:false,support:1,steps:[
  {text:'Подготовь школьную одежду',hint:'Собери комплект в одном месте.',show:'Один комплект — меньше решений утром.'},
  {text:'Проверь форму для физкультуры',hint:'Только если она нужна завтра.',show:'Футболка, штаны/шорты, обувь.'},
  {text:'Положи всё рядом с рюкзаком',hint:'Утром должно быть легко найти.',show:'Одна понятная точка.'}]},
 {id:'study',group:'Школа',order:120,icon:'📚',title:'Домашка',mins:20,hp:8,enabled:true,support:1,steps:[
  {text:'Открой дневник и выбери первый предмет',hint:'Выбери самый короткий или понятный.',show:'Не всю домашку. Только первый предмет.'},
  {text:'Сделай один небольшой кусок',hint:'Один номер, упражнение или абзац.',show:'Маленький старт снижает сопротивление.'},
  {text:'Поработай ещё 15 минут или проверь результат',hint:'Если не готово — таймер на 15 минут.',show:'После старта удерживать внимание проще.'}]}
];
const defaults=()=>({
 version:8,onboarded:false,child:{name:'Игрок',character:'moki',theme:'forest',portrait:null,portraitFamily:false,accessory:'none',hp:0,chests:0,collection:[],initiative:0},
 parent:{pin:'2468'},
 missions:missions.map(m=>({...m,steps:m.steps.map(x=>({...x}))})),
 daily:{date:today(),completed:{},noticed:false,chestOpened:false},
 history:[],
 family:{name:'Наша команда',goal:220,bossMax:260,members:[
   {id:'child',role:'child',name:'Игрок',earned:0,target:70},
   {id:'dad',role:'adult',name:'Папа',avatar:'👨',earned:0,target:90},
   {id:'mom',role:'adult',name:'Мама',avatar:'👩',earned:0,target:80}],feed:[],challenge:null},
 ui:{screen:'home',worldTab:'items',parentTab:'today',overlay:null,onboardingStep:0}
});
function safe(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function migrate(){
 let s=safe(KEY); if(s?.version===8)return s;
 const b=safe(OLD)||{}, f=safe(OLDF)||{}, v=safe(OLDV)||{}, d=defaults();
 d.onboarded=!!b.onboarded;
 d.child.name=b.child?.name||f.members?.find(x=>x.id==='child')?.name||'Игрок';
 d.child.character=v.character||'moki'; d.child.portrait=v.portrait||null; d.child.portraitFamily=!!v.portraitVisibleFamily; d.child.accessory=v.accessory||'none';
 d.child.theme=b.child?.theme||'forest'; d.child.chests=b.child?.chests||0; d.child.collection=Array.isArray(b.child?.collection)?b.child.collection:[];
 const oldM=new Map((b.missions||[]).map(x=>[x.id,x])); d.missions.forEach(m=>{const x=oldM.get(m.id);if(x){m.enabled=!!x.enabled;m.support=Number.isFinite(x.support)?x.support:m.support}});
 if(b.daily?.date===today())d.daily={...d.daily,...b.daily,completed:b.daily.completed||{}};
 d.history=Array.isArray(b.history)?b.history:[];
 if(Array.isArray(f.members)){d.family.members=f.members.map(m=>({...m})); const dad=d.family.members.find(x=>x.id==='dad'),mom=d.family.members.find(x=>x.id==='mom');if(dad?.earned===28)dad.earned=0;if(mom?.earned===21)mom.earned=0}
 d.family.feed=Array.isArray(f.feed)&&!(f.feed[0]?.id||'').startsWith('seed')?f.feed:[];
 d.family.goal=f.goal||220; d.family.bossMax=f.bossMax||260; d.family.challenge=f.challenge||null;
 const child=d.family.members.find(x=>x.id==='child'); d.child.hp=child?.earned||0;
 d.parent.pin=b.parent?.pin||'2468';
 save(d); return d;
}
let S=migrate();
function save(s=S){localStorage.setItem(KEY,JSON.stringify(s))}
function resetDay(){if(S.daily.date!==today()){S.daily={date:today(),completed:{},noticed:false,chestOpened:false};save()}}
resetDay();
const active=()=>S.missions.filter(m=>m.enabled).sort((a,b)=>a.order-b.order);
const doneCount=()=>active().filter(m=>S.daily.completed[m.id]).length;
const chestGoal=()=>Math.min(4,active().length||1);
function timeRank(m){const h=new Date().getHours(),g=m.group;if(h<11)return g==='Утро'?0:g==='Школа'?3:1;if(h<17)return ['После прогулки','День','Дом','Развитие','Школа'].indexOf(g)+1;if(h<21)return ['Дом','Школа','Вечер'].indexOf(g)+1;return ['Вечер','Школа','Дом'].indexOf(g)+1}
const nextMission=()=>active().filter(m=>!S.daily.completed[m.id]).sort((a,b)=>{const ra=timeRank(a),rb=timeRank(b);return (ra<0?9:ra)-(rb<0?9:rb)||a.order-b.order})[0]||null;
const totalFamily=()=>S.family.members.reduce((n,m)=>n+(m.earned||0),0);
const childMember=()=>S.family.members.find(m=>m.id==='child');