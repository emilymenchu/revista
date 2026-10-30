const themeButton=document.querySelector('#edu-theme');
function setTheme(dark){
  document.body.classList.toggle('dark',dark);
  themeButton.setAttribute('aria-label',dark?'Activar modo claro':'Activar modo oscuro');
  themeButton.setAttribute('aria-pressed',String(dark));
}
let savedTheme=null;
try{savedTheme=localStorage.getItem('revista-theme')}catch{}
setTheme(savedTheme ? savedTheme==='dark' : matchMedia('(prefers-color-scheme: dark)').matches);
themeButton.addEventListener('click',()=>{
  const dark=!document.body.classList.contains('dark');
  setTheme(dark);
  try{localStorage.setItem('revista-theme',dark?'dark':'light')}catch{}
});
const menuButton=document.querySelector('#edu-menu');
const nav=document.querySelector('#edu-navigation');
function closeMenu(){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}
menuButton.addEventListener('click',()=>{
  const open=menuButton.getAttribute('aria-expanded')!=='true';
  nav.classList.toggle('open',open);
  menuButton.setAttribute('aria-expanded',String(open));
});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menuButton.focus()}
});
const links=[...nav.querySelectorAll('a')];
const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    links.forEach(link=>{
      if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  });
},{rootMargin:'-18% 0px -50% 0px'});
links.forEach(link=>{const section=document.querySelector(link.hash);if(section)sectionObserver.observe(section)});
const chartObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');chartObserver.unobserve(entry.target)}
  });
},{threshold:.15});
document.querySelectorAll('.comparison-chart').forEach(chart=>chartObserver.observe(chart));
let ticking=false;
function updateProgress(){
  const max=document.documentElement.scrollHeight-innerHeight;
  document.querySelector('.edu-progress').style.width=(max>0?scrollY/max*100:0)+'%';
  ticking=false;
}
addEventListener('scroll',()=>{
  if(!ticking){requestAnimationFrame(updateProgress);ticking=true}
},{passive:true});
updateProgress();
