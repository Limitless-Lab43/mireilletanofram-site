/* Page de remerciement : vérifie le paiement Paystack auprès du serveur et ouvre la lecture.
   Paystack renvoie ici avec ?reference=... (ou ?trxref=...). */
(function () {
  var RELAIS = window.RELAIS_FRAMYXCC || '';
  var SUPPORT = 'meetme@mireilletanofram.com';
  var zone = document.getElementById('etat');
  if (!zone) return;
  var q = new URLSearchParams(location.search);
  var ref = q.get('reference') || q.get('trxref') || '';
  function rendre(h) { zone.innerHTML = h; }
  function formRetrouver() {
    rendre('<p>Votre lien de lecture personnel vous a été envoyé par e-mail juste après votre paiement.</p>'
      + '<p class="note">Vous ne le retrouvez pas ? Indiquez l’adresse e-mail utilisée lors de l’achat.</p>'
      + '<form id="rf" class="mini" novalidate><input type="email" id="rEmail" autocomplete="email" placeholder="Votre adresse e-mail" aria-label="Votre adresse e-mail"><button class="btn" type="submit">Recevoir mon lien</button></form><p class="note" id="rNote"></p>');
    document.getElementById('rf').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('rEmail').value.trim(), n = document.getElementById('rNote');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { n.textContent = 'Vérifiez l’adresse e-mail.'; return; }
      if (!RELAIS) { n.innerHTML = 'Écrivez-nous à <strong>' + SUPPORT + '</strong> : nous vous renvoyons votre lien.'; return; }
      fetch(RELAIS + '/lecture/retrouver', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: email }) })
        .then(function () { n.textContent = 'Si cette adresse correspond à un achat, votre lien vient de vous être envoyé. Pensez à regarder dans les courriers indésirables.'; })
        .catch(function () { n.innerHTML = 'L’envoi n’a pas abouti. Écrivez-nous à <strong>' + SUPPORT + '</strong>.'; });
    });
  }
  function echec(raison) {
    var msg = raison === 'reseau' ? 'La vérification n’a pas abouti. Vérifiez votre connexion, puis rechargez cette page.'
      : 'Nous n’avons pas pu confirmer votre paiement pour le moment.';
    rendre('<p>' + msg + '</p><p class="note">Si votre compte a été débité, écrivez-nous en indiquant votre référence de paiement'
      + (ref ? ' : <strong style="user-select:all">' + ref.replace(/[^A-Za-z0-9_.-]/g, '') + '</strong>' : '') + '. Nous vous envoyons votre accès rapidement.</p>');
  }
  // Aperçu seulement (serveur non branché) : montre l'écran « paiement confirmé »
  if (!RELAIS && location.hash === '#apercu') {
    return rendre('<p><strong>Votre paiement est confirmé.</strong> Votre lecture vous attend.</p><a class="btn" href="lecture/index.html">Ouvrir ma lecture</a>'
      + '<p class="note">Nous avons aussi envoyé ce lien à a*****@exemple.ci. Conservez cet e-mail : il vous permet de revenir à votre lecture à tout moment, sans limite de durée, sur 3 appareils au maximum.</p>');
  }
  if (!ref) return formRetrouver();
  if (!RELAIS) return rendre('<p>Merci pour votre achat.</p><p class="note">Votre lien de lecture personnel vous est envoyé par e-mail. Une question ? Écrivez à <strong>' + SUPPORT + '</strong>.</p>');
  rendre('<p class="note">Vérification de votre paiement…</p>');
  var essais = 0;
  (function verifier() {
    essais++;
    fetch(RELAIS + '/lecture/activer', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reference: ref }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.ok) {
          rendre('<p><strong>Votre paiement est confirmé.</strong> Votre lecture vous attend.</p>'
            + '<a class="btn" href="' + d.lien + '">Ouvrir ma lecture</a>'
            + '<p class="note">Nous avons aussi envoyé ce lien à ' + (d.email || 'votre adresse e-mail') + '. Conservez cet e-mail : il vous permet de revenir à votre lecture à tout moment, sans limite de durée, sur 3 appareils au maximum.</p>');
        } else if ((d.erreur === 'non_reussi' || d.erreur === 'introuvable' || d.erreur === 'en_cours') && essais < 4) {
          setTimeout(verifier, 2500);
        } else echec(d.erreur);
      })
      .catch(function () { if (essais < 3) setTimeout(verifier, 2500); else echec('reseau'); });
  })();
})();
