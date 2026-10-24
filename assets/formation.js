(function(){
  var d=document.documentElement;
  if(!('IntersectionObserver' in window)||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;
  d.classList.add('js');
  var els=[].slice.call(document.querySelectorAll('.wrap section, .axe, .box, .module, .traversee, .cta-band, form'));
  els.forEach(function(e){e.classList.add('reveal')});
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.05});
  els.forEach(function(e){io.observe(e)});
  setTimeout(function(){els.forEach(function(e){e.classList.add('in')})},4000);
})();
