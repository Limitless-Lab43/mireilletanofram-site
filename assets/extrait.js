/* Inscription aux premières pages offertes (4 pages du livre et 4 pages de La Traversée), lues dans la liseuse protégée. */
(function () {
  var RELAIS = window.RELAIS_FRAMYXCC || '';
  var SUPPORT = 'meetme@mireilletanofram.com';
  var legal = document.querySelector('[data-extrait-legal]') ? document.querySelector('[data-extrait-legal]').getAttribute('data-extrait-legal') : 'informations-legales.html';
  document.querySelectorAll('[data-extrait]').forEach(function (el, i) {
    el.innerHTML = '<form class="capture extrait-form" novalidate>'
      + '<input type="email" required name="email" maxlength="200" autocomplete="email" placeholder="Votre adresse e-mail" aria-label="Votre adresse e-mail">'
      + '<label class="consent"><input type="checkbox" name="ok" required><span>J’accepte que mon adresse soit utilisée pour m’envoyer les premières pages, conformément aux <a href="' + legal + '">informations légales</a>.</span></label>'
      + '<button type="submit" class="btn btn-solid">Recevoir les premières pages</button>'
      + '<span class="capture-note" role="status" aria-live="polite"></span></form>';
    var f = el.querySelector('form'), note = el.querySelector('.capture-note'), b = el.querySelector('button');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = f.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { note.textContent = 'Vérifiez l’adresse e-mail.'; return; }
      if (!f.ok.checked) { note.textContent = 'Cochez la case pour accepter l’envoi.'; return; }
      if (!RELAIS) { note.innerHTML = 'Écrivez-nous à <strong>' + SUPPORT + '</strong> pour recevoir les premières pages.'; return; }
      b.disabled = true; note.textContent = 'Envoi en cours…';
      fetch(RELAIS + '/lecture/extrait', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: email }) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.ok) { f.reset(); note.textContent = 'C’est envoyé. Ouvrez l’e-mail reçu pour lire les premières pages de « La vie commence à 50 ans » et de « La Traversée ». Pensez à regarder dans les courriers indésirables.'; }
          else if (d.erreur === 'limite') note.textContent = 'Plusieurs demandes ont déjà été faites. Réessayez dans une heure.';
          else note.innerHTML = 'L’envoi n’a pas abouti. Écrivez-nous à <strong>' + SUPPORT + '</strong>.';
        })
        .catch(function () { note.innerHTML = 'L’envoi n’a pas abouti. Écrivez-nous à <strong>' + SUPPORT + '</strong>.'; })
        .then(function () { b.disabled = false; });
    });
  });
})();
