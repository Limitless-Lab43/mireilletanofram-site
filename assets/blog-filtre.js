/* FRAMYXCC, filtre du blog : Tous / Professionnel / Personnel. Sans JavaScript, tout reste visible. */
(function(){
  var bar = document.getElementById('filtre-blog');
  if (!bar) return;
  var cards = [].slice.call(document.querySelectorAll('[data-univers]'));
  var empty = document.getElementById('filtre-vide');
  var status = document.getElementById('filtre-statut');
  var btns = [].slice.call(bar.querySelectorAll('button[data-filtre]'));
  bar.hidden = false;
  function apply(v){
    var n = 0;
    cards.forEach(function(c){
      var ok = (v === 'tous') || (c.getAttribute('data-univers') === v);
      c.hidden = !ok; if (ok) n++;
    });
    btns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-filtre') === v ? 'true' : 'false'); });
    if (empty) empty.hidden = (n !== 0);
    if (status) status.textContent = n === 0 ? '' : (n + (n > 1 ? ' articles affichés' : ' article affiché'));
  }
  btns.forEach(function(b){ b.addEventListener('click', function(){ apply(b.getAttribute('data-filtre')); }); });
  apply('tous');
})();
