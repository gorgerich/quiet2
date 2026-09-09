// Local voices only. No account, microphone, remote TTS, or child text leaves MOKI.
export function createNarrator({synth,Utterance,onStatus=()=>{}}={}){
 let generation=0;
 const voice=()=>synth?.getVoices().find(v=>/^ru(?:-|_)/i.test(v.lang)&&v.localService===true);
 function stop(){generation++;synth?.cancel();onStatus('idle');}
 function say(text){
  stop();const v=voice();if(!v||!Utterance){onStatus('unavailable');return false;}
  const token=generation,u=new Utterance(text);u.voice=v;u.lang=v.lang;u.rate=.88;u.pitch=1.04;
  u.onstart=()=>{if(token===generation)onStatus('speaking');};
  u.onend=()=>{if(token===generation)onStatus('idle');};
  u.onerror=()=>{if(token===generation)onStatus('unavailable');};
  try{synth.speak(u);return true;}catch{onStatus('unavailable');return false;}
 }
 return {say,stop,available:()=>!!voice()};
}
