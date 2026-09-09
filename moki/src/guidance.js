// Every visual has one stable mission/step meaning. Labels supplement the picture.
const rows=[
 ['morning_teeth','Щётка и паста','Почисти зубы','Убери щётку'],
 ['wash','К раковине','Умой лицо','Вытри лицо'],
 ['breakfast','Спроси взрослого','Помогите вместе','Убери за собой'],
 ['breakfast_table','Кто завтракает?','Тарелки и кружки','Приборы и салфетки'],
 ['breakfast_clear','Отнеси посуду','Уберите продукты','Протри стол'],
 ['reading','Выбери книгу','Почитай немного','Что запомнилось?'],
 ['counting','Приготовь примеры','Посчитай','Проверь ответы'],
 ['writing','Тетрадь и ручка','Напиши строку','Перечитай'],
 ['before_walk_clothes','Возьми вещь','Чистое — повесь','Грязное — в стирку'],
 ['outerwear','Сними куртку','Повесь куртку','Поставь обувь'],
 ['after_walk_hands','Вода и мыло','Помой руки','Смой и вытри'],
 ['after_walk_home_clothes','Приготовь одежду','Переоденься','Убери снятое'],
 ['lunch_table','Кто обедает?','Поставь тарелки','Добавь приборы'],
 ['lunch_dishes','Возьми тарелку','Отнеси к раковине','Кружка и приборы'],
 ['lunch_clear','Спроси взрослого','Убери со стола','Протри стол'],
 ['room','Собери игрушки','Убери одежду','Проход свободен?'],
 ['bed','Сними старое','Наденьте чистое','Старое — в стирку'],
 ['evening_teeth','Щётка и паста','Почисти зубы','Убери щётку'],
 ['homework','Выбери предмет','Одно задание','Проверь. Отдохни'],
 ['bag','Посмотри расписание','Положи учебники','Пенал. Закрой рюкзак'],
 ['uniform','Будет физкультура?','Приготовь одежду','Собери спортивное']
];
export const visualSteps=Object.fromEntries(rows.map(([id,...labels],index)=>[id,labels.map((label,step)=>({label,sheet:Math.floor(index/7),row:index%7,step}))]));
const bounds=[[0,211,415,627,831,1035,1228,1448],[0,200,401,600,800,1001,1200,1448],[0,208,403,597,806,1003,1202,1448]];
export function guidanceFor(id,step){const g=visualSteps[id]?.[step];if(!g)return null;const top=bounds[g.sheet][g.row]+3,height=bounds[g.sheet][g.row+1]-top-3;return {...g,top,height};}
export function supportSuggestion(history,id){
 const recent=history.filter(h=>h.missionId===id&&!h.legacy).slice(-4);
 if(recent.slice(-2).length===2&&recent.slice(-2).every(h=>h.effort==='hard'))return 'together';
 if(recent.length===4&&recent.every(h=>h.scaffolding===0&&h.effort!=='hard'))return 'fade';
 return 'steady';
}
