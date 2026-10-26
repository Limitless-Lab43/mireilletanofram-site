/* LIENS DE PAIEMENT : renseigner ici, une seule fois. Tant qu'un lien est vide, le bouton reste caché. */
var LIENS={livre:"https://paystack.shop/pay/mireille-livre-50-ans",traversee:"https://paystack.shop/pay/mireille-la-traversee",experience:"https://paystack.shop/pay/mireille-experience-complete",honte:"https://paystack.shop/pay/oh-la-honte"};
document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('[data-lien]').forEach(function(a){var u=LIENS[a.getAttribute('data-lien')];if(u){a.href=u;a.hidden=false;}});document.querySelectorAll('[data-sans-lien]').forEach(function(e){if(LIENS[e.getAttribute('data-sans-lien')])e.hidden=true;});});

document.addEventListener('DOMContentLoaded',()=>{
 const menu=document.querySelector('[data-menu]'); const panel=document.querySelector('[data-panel]');
 if(menu&&panel){menu.addEventListener('click',()=>{panel.classList.toggle('open');menu.setAttribute('aria-expanded',panel.classList.contains('open'))});}
 const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
 document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.style.scrollBehavior='auto';}
 document.querySelectorAll('[data-scroll]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.dataset.scroll);if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}));
});

document.addEventListener('DOMContentLoaded',function(){
if(/informations-legales/.test(location.pathname))return;
var seen=[];document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
if(a.closest('footer')||a.closest('header'))return;var p=a.parentElement;if(!p||seen.indexOf(p)>-1)return;if(!/(btn|primary|ghost)/.test(a.className)&&!p.matches('.action-grid,.actions'))return;seen.push(p);
var addr=a.getAttribute('href').slice(7).split('?')[0];var d=document.createElement('p');d.className='mail-fallback';
d.innerHTML='Contact : <strong>'+addr+'</strong> <button type="button" class="mail-copy" data-addr="'+addr+'">Copier l\u2019adresse</button>';p.insertAdjacentElement('afterend',d);});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.mail-copy');if(!b)return;var t=b.getAttribute('data-addr');
function ok(){b.textContent='Adresse copi\u00e9e';}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,function(){var r=document.createRange();r.selectNodeContents(b.previousElementSibling);var s=getSelection();s.removeAllRanges();s.addRange(r);});}else{var r=document.createRange();r.selectNodeContents(b.previousElementSibling);var s=getSelection();s.removeAllRanges();s.addRange(r);}});
});
