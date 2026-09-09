import {WebGLRenderer, Assets, Container, Sprite, Texture, Rectangle, Graphics} from './vendor/pixi.min.mjs';
import {ASSETS,asset} from './manifest.js';
import {composition} from './layout.js';

// This isolated presentation never imports domain controllers or opens storage.
// Gate A is intentionally static: no actor behavior, rewards, or pretend buttons.
export async function boot(){
  const shell=document.querySelector('#scene-shell');
  const host=document.querySelector('#scene');
  const diagnostics=document.querySelector('#diagnostics');
  const support={webgl:!!document.createElement('canvas').getContext('webgl'),webgl2:!!document.createElement('canvas').getContext('webgl2')};
  diagnostics.textContent=JSON.stringify(support);
  if(!support.webgl&&!support.webgl2)throw new Error('WebGLUnavailable: this browser returned null for both WebGL1 and WebGL2 contexts. See the separate DOM composition proof; WebGL QA is blocked.');
  const renderer=new WebGLRenderer();
  const stage=new Container();
  const resolution=Math.min(2,Math.max(1,window.devicePixelRatio||1));
  await renderer.init({width:shell.clientWidth,height:shell.clientHeight,resolution,
    preferWebGLVersion:1,failIfMajorPerformanceCaveat:false,autoDensity:true,antialias:false,
    autoStart:false,sharedTicker:false,powerPreference:'low-power',background:0x765236});
  host.append(renderer.canvas);
  renderer.canvas.setAttribute('aria-hidden','true');
  const layers=Object.fromEntries(['background','environment','midground','gameplay','foreground','light','atmosphere'].map(label=>{
    const layer=new Container({label,eventMode:'none'});stage.addChild(layer);return [label,layer];
  }));
  const started=performance.now();
  const textures=new Map();
  await Promise.all(Object.entries(ASSETS).map(async([id,entry])=>{
    const texture=await Assets.load(entry.src);
    if(texture.width!==entry.size[0]||texture.height!==entry.size[1])throw Error(`Asset dimensions mismatch: ${id}`);
    textures.set(id,texture);
  }));
  const assetLoadMs=Math.round(performance.now()-started);
  function sprite(id,type){
    const spec=asset(id,type);
    const texture=new Texture({source:textures.get(id).source,frame:new Rectangle(...spec.frame)});
    const s=new Sprite({texture,label:id});s.anchor.set(...spec.anchor);return s;
  }
  const room=sprite('environment.forest.base','ENVIRONMENT');layers.background.addChild(room);
  // A real foreground crop is derived from the same environment texture. It
  // preserves pixel alignment and occludes the gameplay plane at the near edge.
  const foreground=new Sprite({texture:new Texture({source:textures.get('environment.forest.base').source,frame:new Rectangle(0,1210,1024,326)}),label:'near-foliage'});
  layers.foreground.addChild(foreground);
  const shadows=new Graphics({label:'contact-shadows'});layers.gameplay.addChild(shadows);
  const moki=sprite('character.moki.idle','CHARACTER');
  const bag=sprite('prop.backpack','WORLD_PROP');
  const chest=sprite('prop.chest.closed','WORLD_PROP');
  layers.gameplay.addChild(moki,chest,bag);
  let renders=0,resizePending=0,disposed=false,measuring=false;
  let measureResult=null;
  const gl=renderer.gl;
  const originalDraw=gl.drawElements;
  let draws=0;
  gl.drawElements=function(...args){draws++;return originalDraw.apply(this,args)};
  const longTasks=[];
  const observer=typeof PerformanceObserver!=='undefined'&&PerformanceObserver.supportedEntryTypes?.includes('longtask')?new PerformanceObserver(list=>{for(const t of list.getEntries())longTasks.push(Math.round(t.duration));}):null;
  observer?.observe({type:'longtask',buffered:true});
  const textureMiB=Object.values(ASSETS).reduce((n,a)=>n+a.size[0]*a.size[1]*4,0)/1048576;
  function report(){
    diagnostics.textContent=JSON.stringify({gate:'A — awaiting visual review',renderer:gl.getParameter(gl.VERSION),viewport:[shell.clientWidth,shell.clientHeight],surface:[renderer.canvas.width,renderer.canvas.height],resolution,textureCount:textures.size,textureMiB:+textureMiB.toFixed(2),assetBytes:Object.values(ASSETS).reduce((n,a)=>n+a.bytes,0),assetLoadMs,renders,drawCallsLastRender:draws,staticTickerStopped:true,longTasks,benchmark:measureResult},null,2);
    host.dataset.ready='true';host.dataset.renderer='webgl';host.dataset.renders=String(renders);
  }
  function shadow(x,y,w,h,alpha){
    for(let i=8;i>0;i--)shadows.ellipse(x,y,w*(.5+i/16),h*(.5+i/16)).fill({color:0x362419,alpha:alpha/8});
  }
  function place(s,x,y,height){s.position.set(x,y);s.scale.set(height/s.texture.height);}
  function render(){draws=0;renderer.render({container:stage});renders++;report();}
  function layout(){
    if(disposed)return;
    const w=shell.clientWidth,h=shell.clientHeight;
    renderer.resize(w,h,resolution);
    const c=composition(w,h),{scale,left,top}=c;
    room.position.set(w/2,h/2);room.scale.set(scale);
    foreground.position.set(left,top+1210*scale);foreground.scale.set(scale);
    const {x:mx,y:my,height:heroHeight}=c.moki;
    const {x:bx,y:by,height:bagHeight}=c.bag;
    const {x:cx,y:cy,height:chestHeight}=c.chest;
    place(moki,mx,my,heroHeight);place(bag,bx,by,bagHeight);place(chest,cx,cy,chestHeight);
    shadows.clear();
    shadow(mx,my-heroHeight*.025,heroHeight*.36,heroHeight*.044,.20);
    shadow(bx,by-2,bag.width*.43,bagHeight*.045,.30);
    shadow(cx,cy-2,chest.width*.43,chestHeight*.055,.29);
    render();
  }
  const resizeObserver=new ResizeObserver(()=>{
    if(resizePending)return;
    resizePending=requestAnimationFrame(()=>{resizePending=0;layout()});
  });resizeObserver.observe(shell);
  document.querySelectorAll('[data-size]').forEach(button=>button.addEventListener('click',()=>{
    const [w,h]=button.dataset.size.split(',').map(Number);
    shell.style.width=`${w}px`;shell.style.height=`${h}px`;
    document.querySelectorAll('[data-size]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }));
  document.querySelector('#measure').addEventListener('click',async event=>{
    if(measuring)return;measuring=true;event.target.disabled=true;
    const deltas=[];let previous=null;
    for(let i=0;i<121&&!disposed;i++)await new Promise(resolve=>requestAnimationFrame(now=>{
      if(previous!==null)deltas.push(now-previous);previous=now;draws=0;renderer.render({container:stage});renders++;resolve();
    }));
    if(deltas.length){const sorted=[...deltas].sort((a,b)=>a-b);measureResult={frames:deltas.length,fps:+(1000/(deltas.reduce((a,b)=>a+b,0)/deltas.length)).toFixed(1),p95FrameMs:+sorted[Math.floor(sorted.length*.95)].toFixed(1),framesOver25ms:deltas.filter(d=>d>25).length};}
    measuring=false;event.target.disabled=false;report();
  });
  renderer.canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();const error=Error('WebGL context lost — reload review scene');
    console.error(error);document.querySelector('#fatal').hidden=false;document.querySelector('#error-detail').textContent=error.message;
  });
  window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(resizePending);resizeObserver.disconnect();observer?.disconnect();gl.drawElements=originalDraw;stage.destroy({children:true,texture:true,textureSource:true});renderer.destroy(true);},{once:true});
  layout();document.querySelector('#loading').hidden=true;
}
