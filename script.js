const audio=document.getElementById('audio');
const play=document.getElementById('play');
const icon=document.getElementById('playIcon');
const seek=document.getElementById('seek');
const time=document.getElementById('time');
const mute=document.getElementById('mute');
const START_AT=80;
let initialPositionSet=false;
const format=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function update(){const duration=Number.isFinite(audio.duration)?audio.duration:0;const progress=duration?audio.currentTime/duration*100:0;seek.value=progress;seek.style.setProperty('--progress',`${progress}%`);time.textContent=`${format(audio.currentTime)} / ${format(duration)}`;}
function updatePlay(){const paused=audio.paused;icon.innerHTML=paused?'<path d="M8 5v14l11-7z"/>':'<path d="M7 5h4v14H7zm6 0h4v14h-4z"/>';play.setAttribute('aria-label',paused?'Reproduzir música':'Pausar música');}
play.addEventListener('click',async()=>{if(audio.paused){try{if(!initialPositionSet){audio.currentTime=START_AT;initialPositionSet=true;}await audio.play()}catch(e){console.error('Não foi possível reproduzir o áudio',e)}}else audio.pause()});
seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration))(initialPositionSet=true,audio.currentTime=Number(seek.value)/100*audio.duration)});
mute.addEventListener('click',()=>{audio.muted=!audio.muted;mute.style.opacity=audio.muted?'.4':'1';mute.setAttribute('aria-label',audio.muted?'Ativar som':'Silenciar música')});
audio.addEventListener('timeupdate',update);audio.addEventListener('loadedmetadata',()=>{if(!initialPositionSet){audio.currentTime=START_AT;initialPositionSet=true;}update()});audio.addEventListener('play',updatePlay);audio.addEventListener('pause',updatePlay);audio.addEventListener('ended',updatePlay);


// O vídeo da carta acompanha a posição do scroll, inclusive ao voltar.
(()=>{
  const section=document.querySelector('.section-three');
  const video=document.getElementById('letter-video');
  if(!section||!video)return;
  let duration=0,raf=0,last=-1;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  video.pause();
  function render(){
    raf=0;
    if(!duration)return;
    const distance=Math.max(1,section.offsetHeight-window.innerHeight);
    const progress=Math.max(0,Math.min(1,-section.getBoundingClientRect().top/distance));
    const target=(reduced.matches?1:progress)*Math.max(0,duration-0.035);
    if(Math.abs(target-last)>.012){last=target;try{video.currentTime=target}catch(e){}}
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(render)}
  video.addEventListener('loadedmetadata',()=>{duration=video.duration;schedule()});
  video.addEventListener('durationchange',()=>{duration=video.duration;schedule()});
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener('change',schedule);
  if(video.readyState>=1){duration=video.duration;schedule()}
})();
