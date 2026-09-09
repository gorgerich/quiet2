import {KEY,load} from './state.js';
export const BACKUP_KEY='moki_last_good_state';
export function saveState(storage,state){
 const raw=JSON.stringify(state);
 try{
  const previous=storage.getItem(KEY);
  // A safety copy is best effort; never sacrifice the current save for its quota.
  if(previous){try{const p=JSON.parse(previous);if(p.schema===1)storage.setItem(BACKUP_KEY,previous);}catch{}}
  storage.setItem(KEY,raw);return true;
 }catch{return false;}
}
export function readState(storage){
 let raw=null;try{raw=storage.getItem(KEY);if(raw&&JSON.parse(raw)?.schema===1)return {state:load(storage),recovered:false};}catch{}
 if(raw){try{const backup=storage.getItem(BACKUP_KEY);if(JSON.parse(backup)?.schema===1)return {state:load({getItem:k=>k===KEY?backup:null}),recovered:true};}catch{}}
 return {state:load(storage),recovered:false};
}
export function exportProgress(state){
 // Portable progress excludes the portrait and adult PIN by default.
 const copy=JSON.parse(JSON.stringify(state));copy.child.portrait=null;copy.settings.pinHash=null;copy.settings.pinSalt=null;copy.settings.photoFamily=false;copy.onboarded=false;copy.onboarding={step:0,support:1};
 return JSON.stringify({format:'moki-progress',version:1,savedAt:new Date().toISOString(),state:copy},null,2);
}
export function importProgress(raw){
 if(raw.length>5_000_000)throw Error('Размер файла слишком большой.');
 const data=JSON.parse(raw);if(data.format!=='moki-progress'||data.version!==1||data.state?.schema!==1)throw Error('Это не файл прогресса MOKI.');
 const s=load({getItem:k=>k===KEY?JSON.stringify(data.state):null});s.child.portrait=null;s.settings.pinHash=null;s.settings.pinSalt=null;s.settings.photoFamily=false;s.onboarded=false;s.onboarding={step:0,support:1};return s;
}
