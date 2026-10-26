(function(){
  function tabs(root){
    var btns=[].slice.call(root.querySelectorAll('[role=tab]'));
    var panels=[].slice.call(root.querySelectorAll('[role=tabpanel]'));
    function pick(i,focus){
      btns.forEach(function(b,k){b.setAttribute('aria-selected',k===i?'true':'false');b.tabIndex=k===i?0:-1});
      panels.forEach(function(p,k){p.hidden=k!==i});
      if(focus)btns[i].focus();
    }
    btns.forEach(function(b,i){
      b.tabIndex=i===0?0:-1;
      b.addEventListener('click',function(){pick(i)});
      b.addEventListener('keydown',function(e){
        var n=btns.length,k=i;
        if(e.key==='ArrowDown'||e.key==='ArrowRight'){k=(i+1)%n}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){k=(i-1+n)%n}else return;
        e.preventDefault();pick(k,true);
      });
    });
  }
  document.querySelectorAll('[data-tabs]').forEach(tabs);
  var vb=document.getElementById('vision-btn'),vm=document.getElementById('vision-more');
  if(vb&&vm){vb.addEventListener('click',function(){var open=vm.hidden;vm.hidden=!open;vb.setAttribute('aria-expanded',open?'true':'false');vb.textContent=open?'Masquer ma vision':'Découvrir ma vision'})}
})();
/* V14 : vidéo TEDx chargée seulement au clic */
(function(){document.querySelectorAll('[data-video]').forEach(function(v){var b=v.querySelector('button');if(!b)return;b.addEventListener('click',function(){var f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+v.getAttribute('data-video')+'?autoplay=1&rel=0';f.title='TEDx Abidjan, Trouver son étoile polaire';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;v.innerHTML='';v.appendChild(f);});});})();
/* V15 : les trois piliers s'ouvrent au clic */
(function(){var r=document.querySelector('[data-piliers]');if(!r)return;var bs=[].slice.call(r.querySelectorAll('button'));bs.forEach(function(b){b.addEventListener('click',function(){var open=b.getAttribute('aria-expanded')!=='true';bs.forEach(function(o){o.setAttribute('aria-expanded','false');document.getElementById(o.getAttribute('aria-controls')).hidden=true});if(open){b.setAttribute('aria-expanded','true');document.getElementById(b.getAttribute('aria-controls')).hidden=false}})})})();
