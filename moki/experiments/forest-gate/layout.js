// Shared composition only. No game state or renderer dependencies.
export function composition(w,h){
  const visibleWidth=Math.min(w,h*2/3),visibleLeft=(w-visibleWidth)/2;
  const scale=Math.max(visibleWidth/1024,h/1536);
  const left=(w-1024*scale)/2,top=(h-1536*scale)/2;
  const point=(x,y)=>[left+x*scale,top+y*scale];
  return {scale,left,top,
    moki:{x:point(494,1065)[0],y:point(494,1065)[1],height:Math.min(610*scale,visibleWidth*.76)*.875},
    bag:{x:Math.max(visibleLeft+visibleWidth*.19,point(235,1210)[0]),y:point(235,1210)[1],height:Math.min(310*scale,visibleWidth*.36)*.825},
    chest:{x:Math.min(visibleLeft+visibleWidth*.80,point(805,1030)[0]),y:point(805,1030)[1],height:Math.min(235*scale,visibleWidth*.29)*.775}};
}
