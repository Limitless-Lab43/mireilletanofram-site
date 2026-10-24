(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  /* barre de progression de lecture */
  var bar=document.querySelector('.fx-progress i');
  if(!bar){var w=document.createElement('div');w.className='fx-progress';w.setAttribute('aria-hidden','true');w.innerHTML='<i></i>';document.body.appendChild(w);bar=w.querySelector('i')}
  function prog(){var h=document.documentElement;var m=h.scrollHeight-h.clientHeight;bar.style.transform='scaleX('+(m>0?Math.min(1,h.scrollTop/m):0)+')'}
  addEventListener('scroll',prog,{passive:true});prog();
  if(reduce)return;
  /* inclinaison 3D au pointeur (souris uniquement) */
  if(fine){
    var auto='.card,.family,.gate,.h-card,.h-tile,.h-mini,.axe,.box,.module,.traversee';
    document.querySelectorAll(auto).forEach(function(e){if(!e.hasAttribute('data-tilt'))e.setAttribute('data-tilt','')});
    document.querySelectorAll('[data-tilt]').forEach(function(el){
      var max=parseFloat(el.getAttribute('data-tilt-max'))||6;
      var layers=[].slice.call(el.querySelectorAll('[data-depth]'));
      el.classList.add('fx-tilt');
      el.addEventListener('pointermove',function(e){
        if(e.pointerType&&e.pointerType!=='mouse')return;
        var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        el.classList.add('moving');
        el.style.transform='perspective(900px) rotateX('+(-y*max*2).toFixed(2)+'deg) rotateY('+(x*max*2).toFixed(2)+'deg) translateZ(0)';
        layers.forEach(function(l){var d=parseFloat(l.getAttribute('data-depth'))||0;l.style.transform='translate3d('+(x*d).toFixed(1)+'px,'+(y*d).toFixed(1)+'px,0)'});
      });
      el.addEventListener('pointerleave',function(){el.classList.remove('moving');el.style.transform='';layers.forEach(function(l){l.style.transform=''})});
    });
  }
  /* parallaxe douce du portrait au défilement */
  var ph=document.querySelector('.h-photo');
  if(ph){addEventListener('scroll',function(){var y=Math.min(scrollY,700);ph.style.setProperty('--sy',(y*-.06).toFixed(1)+'px')},{passive:true})}
  /* chaîne animée : les maillons s'allument l'un après l'autre */
  var chain=document.querySelector('.h-chain');
  if(chain&&'IntersectionObserver' in window){
    var items=[].slice.call(chain.children);
    new IntersectionObserver(function(es,io){es.forEach(function(x){if(x.isIntersecting){items.forEach(function(li,i){setTimeout(function(){li.classList.add('on')},i*260)});io.disconnect()}})},{threshold:.5}).observe(chain);
  }else if(chain){[].forEach.call(chain.children,function(li){li.classList.add('on')})}
  /* livre 3D : rotation au pointeur ou au doigt */
  var book=document.querySelector('[data-book]');
  if(book){
    var inner=book.querySelector('.book3d-inner'),ry=-24,rx=6,dragging=false,sx=0,sy=0,bry=0,brx=0,idle=true,t0=performance.now();
    function apply(){inner.style.transform='rotateX('+rx.toFixed(1)+'deg) rotateY('+ry.toFixed(1)+'deg)'}
    function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
    apply();
    function sway(t){if(idle&&!dragging){ry=-24+Math.sin((t-t0)/1400)*16;rx=6+Math.sin((t-t0)/1900)*3;apply()}requestAnimationFrame(sway)}
    requestAnimationFrame(sway);
    book.addEventListener('pointerdown',function(e){dragging=true;idle=false;sx=e.clientX;sy=e.clientY;bry=ry;brx=rx;try{book.setPointerCapture(e.pointerId)}catch(_){}});
    book.addEventListener('pointermove',function(e){
      if(dragging){ry=clamp(bry+(e.clientX-sx)*.5,-70,70);rx=clamp(brx-(e.clientY-sy)*.3,-25,25);apply()}
      else if(e.pointerType==='mouse'){var r=book.getBoundingClientRect();idle=false;ry=clamp((e.clientX-r.left)/r.width*80-60,-60,20);rx=clamp(-((e.clientY-r.top)/r.height-.5)*30+4,-20,20);apply()}
    });
    function up(){dragging=false}
    book.addEventListener('pointerup',up);book.addEventListener('pointercancel',up);
    book.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'){idle=true;t0=performance.now()}});
    book.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){idle=false;ry=clamp(ry-10,-70,70);apply()}else if(e.key==='ArrowRight'){idle=false;ry=clamp(ry+10,-70,70);apply()}});
  }
})();
