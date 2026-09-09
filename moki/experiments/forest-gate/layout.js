// Shared composition only. No game state or renderer dependencies.
export function composition(w,h){
  const visibleWidth=Math.min(w,h*2/3),visibleLeft=(w-visibleWidth)/2;
  const scale=Math.max(visibleWidth/1024,h/1536);
  const left=(w-1024*scale)/2,top=(h-1536*scale)/2;
  const point=(x,y)=>[left+x*scale,top+y*scale];
  return {scale,left,top,
    moki:{x:point(512,1120)[0],y:point(512,1120)[1],height:Math.min(610*scale,visibleWidth*.76)},
    bag:{x:Math.max(visibleLeft+visibleWidth*.21,point(250,1185)[0]),y:point(250,1185)[1],height:Math.min(310*scale,visibleWidth*.36)},
    chest:{x:Math.min(visibleLeft+visibleWidth*.79,point(785,1150)[0]),y:point(785,1150)[1],height:Math.min(235*scale,visibleWidth*.29)}};
}
