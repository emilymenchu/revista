// Valores aportados en contenido-revista.md. Sustituir por los exactos de PNUD.
// La serie tiene 9 observaciones: agregar un año verificado para cubrir 10 años.
const hdiData = [
  {year:2015,value:0.64},{year:2016,value:0.64},{year:2017,value:0.65},
  {year:2018,value:0.65},{year:2019,value:0.65},{year:2020,value:0.65},
  {year:2021,value:0.64},{year:2022,value:0.66},{year:2023,value:0.662}
];
const regions = [
  ['Metropolitana','Guatemala',0.759],['Central','Chimaltenango, Sacatepéquez, Escuintla',0.674],
  ['Promedio nacional','Guatemala',0.662],['Noreste','Chiquimula, El Progreso, Izabal, Zacapa',0.655],
  ['Sureste','Jutiapa, Jalapa, Santa Rosa',0.648],['Petén','',0.642],
  ['Suroeste','Quetzaltenango, Retalhuleu, San Marcos, Suchitepéquez, Sololá, Totonicapán',0.641],
  ['Norte','Alta Verapaz, Baja Verapaz',0.589],['Noroeste','Huehuetenango, Quiché',0.587]
];
const themeButton=document.querySelector('#theme');
function setTheme(dark){document.body.classList.toggle('dark',dark);themeButton.setAttribute('aria-label',dark?'Activar modo claro':'Activar modo oscuro');themeButton.setAttribute('aria-pressed',String(dark));}
let savedTheme=null;try{savedTheme=localStorage.getItem('revista-theme')}catch{}
setTheme(savedTheme ? savedTheme==='dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
themeButton.addEventListener('click',()=>{const dark=!document.body.classList.contains('dark');setTheme(dark);try{localStorage.setItem('revista-theme',dark?'dark':'light')}catch{}});
const menu=document.querySelector('#menu'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus()}});
const W=960,H=300,L=55,R=45,T=30,B=48;
const x=i=>L+i*(W-L-R)/(hdiData.length-1),y=v=>T+(0.67-v)/0.04*(H-T-B);
const points=hdiData.map((d,i)=>`${x(i)},${y(d.value)}`).join(' ');
let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">Evolución aproximada del IDH de Guatemala, 2015 a 2023</title><desc id="chart-desc">Nueve observaciones. 0.64 en 2015 y 2016; 0.65 de 2017 a 2020; 0.64 en 2021; 0.66 en 2022 y 0.662 en 2023. Eje vertical de 0.63 a 0.67. Tabla de datos disponible debajo.</desc>`;
for(let i=0;i<5;i++){const v=0.63+i*0.01;svg+=`<line x1="${L}" y1="${y(v)}" x2="${W-R}" y2="${y(v)}" stroke="var(--line)" stroke-dasharray="3 5"/><text x="${L-13}" y="${y(v)+4}" text-anchor="end" font-size="12" fill="var(--muted)">${v.toFixed(2)}</text>`}
svg+=`<polygon points="${L},${y(.63)} ${points} ${x(hdiData.length-1)},${y(.63)}" fill="var(--green)" opacity=".5"/><polyline points="${points}" fill="none" stroke="var(--orange)" stroke-width="3" stroke-linejoin="round"/>`;
hdiData.forEach((d,i)=>{svg+=`<circle cx="${x(i)}" cy="${y(d.value)}" r="5" fill="var(--card)" stroke="var(--orange)" stroke-width="2"><title>${d.year}: ${d.value.toFixed(3)} (aproximado)</title></circle><text x="${x(i)}" y="${H-16}" text-anchor="middle" font-size="12" fill="var(--muted)">${d.year}</text>`});
svg+=`<text x="${x(8)}" y="${y(hdiData[8].value)-16}" text-anchor="middle" font-size="15" font-weight="bold" fill="var(--orange)">0.662</text></svg>`;
document.querySelector('#chart').innerHTML=svg;
document.querySelector('#chart-data').innerHTML=hdiData.map(d=>`<tr><th scope="row">${d.year}</th><td>${d.value.toFixed(3)}</td></tr>`).join('');
document.querySelector('#regional-bars').innerHTML=regions.map(([name,desc,value])=>`<div class="region ${name==='Promedio nacional'?'national':''}"><div>${name}${desc?`<small>${desc}</small>`:''}</div><div class="bar-track" aria-hidden="true"><div class="bar" style="width:${value*100}%"></div></div><strong>${value.toFixed(3)}</strong></div>`).join('');
const links=[...nav.querySelectorAll('a')];
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>{if(a.hash===`#${entry.target.id}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}})},{rootMargin:'-18% 0px -50% 0px'});
links.forEach(a=>{const section=document.querySelector(a.hash);if(section)observer.observe(section)});
let ticking=false;function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=`${max>0?scrollY/max*100:0}%`;ticking=false}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true}},{passive:true});updateProgress();
