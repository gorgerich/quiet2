import {ASSETS} from './manifest.js';
import {composition} from './layout.js';
// Explicit, separate DOM proof sheet for art review when WebGL is unavailable.
// Never selected automatically; never imported by production or Pixi renderer.
export async function boot(){
 const host=document.querySelector('#scene'),shell=document.querySelector('#scene-shell');
 const images={};
 for(const [id,a] of Object.entries(ASSETS)){
  const image=new Image();image.src=a.src;await image.decode();
  if(image.naturalWidth!==a.size[0]||image.naturalHeight!==a.size[1])throw Error(`Asset dimensions: ${id}`);
  images[id]=image;
 }
 const room=images['environment.forest.base'];room.style.position='absolute';host.append(room);
 const props={};
 for(const [name,id] of [['chest','prop.chest.closed'],['moki','character.moki.idle'],['bag','prop.backpack']]){
  const box=document.createElement('div'),shadow=document.createElement('div');
  box.style.cssText='position:absolute;overflow:hidden';shadow.style.cssText='position:absolute;background:radial-gradient(ellipse,#36241965 0%,#36241926 35%,transparent 72%);transform:translate(-50%,-50%)';
  const im=images[id];im.style.position='absolute';box.append(im);host.append(shadow,box);props[name]={box,shadow,im,a:ASSETS[id]};
 }
 const foreground=document.createElement('div');foreground.style.cssText='position:absolute;overflow:hidden;pointer-events:none';
 const fg=room.cloneNode();foreground.append(fg);host.append(foreground);
 function layout(){
  const w=shell.clientWidth,h=shell.clientHeight,c=composition(w,h);
  Object.assign(room.style,{left:`${c.left}px`,top:`${c.top}px`,width:`${1024*c.scale}px`,height:`${1536*c.scale}px`});
  for(const [key,{box,shadow,im,a}] of Object.entries(props)){
   const p=c[key],s=p.height/a.frame[3],width=a.frame[2]*s;
   Object.assign(box.style,{left:`${p.x-width/2}px`,top:`${p.y-p.height}px`,width:`${width}px`,height:`${p.height}px`});
   Object.assign(im.style,{left:`${-a.frame[0]*s}px`,top:`${-a.frame[1]*s}px`,width:`${a.size[0]*s}px`,height:`${a.size[1]*s}px`});
   Object.assign(shadow.style,{left:`${p.x}px`,top:`${p.y-2}px`,width:`${width*.88}px`,height:`${p.height*.10}px`});
  }
  Object.assign(foreground.style,{left:`${c.left}px`,top:`${c.top+1210*c.scale}px`,width:`${1024*c.scale}px`,height:`${326*c.scale}px`});
  Object.assign(fg.style,{left:'0',top:`${-1210*c.scale}px`,width:`${1024*c.scale}px`,height:`${1536*c.scale}px`});
  host.dataset.ready='true';host.dataset.renderer='dom-art-proof';
  document.querySelector('#diagnostics').textContent=JSON.stringify({renderer:'DOM art proof — NOT WebGL QA',viewport:[w,h],assets:Object.keys(images).length,frames:Object.fromEntries(Object.entries(props).map(([k,v])=>[k,v.box.getBoundingClientRect().toJSON()]))},null,2);
 }
 const resize=new ResizeObserver(layout);resize.observe(shell);
 document.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{const [w,h]=b.dataset.size.split(',');shell.style.width=w+'px';shell.style.height=h+'px';document.querySelectorAll('[data-size]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
 window.addEventListener('pagehide',()=>resize.disconnect(),{once:true});
 layout();document.querySelector('#loading').hidden=true;
}
