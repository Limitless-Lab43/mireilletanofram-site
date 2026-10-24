/* Assistance technique commune à toutes les offres.
   RELAIS : adresse du relais Cloudflare « Oh la honte », renseignée au déploiement.
   Tant qu'elle est vide, le formulaire affiche l'adresse e-mail à la place de l'envoi. */
(function () {
  var RELAIS = window.RELAIS_FRAMYXCC || '';
  var SUPPORT = 'meetme@mireilletanofram.com';
  var css = '.as-bloc{width:calc(100% - 32px);max-width:560px;margin:28px auto 0;padding:22px 20px;border:1px solid rgba(201,162,91,.45);border-radius:10px;text-align:left;font-family:inherit;box-sizing:border-box}'
    + '.as-bloc *{box-sizing:border-box}.as-k{font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#C9A25B;margin:0 0 8px}'
    + '.as-bloc p{margin:0 0 12px;font-size:15px;line-height:1.6;color:#EADFD5}.as-bloc label{display:block;font-size:14px;color:#EADFD5;margin:0 0 10px}'
    + '.as-bloc input,.as-bloc textarea{display:block;width:100%;margin-top:6px;padding:11px 12px;border-radius:6px;border:1px solid rgba(201,162,91,.5);background:rgba(255,255,255,.06);color:#F5EADA;font:inherit;font-size:15px}'
    + '.as-bloc button{margin-top:4px;background:#F5EADA;color:#35200E;border:0;border-radius:4px;padding:14px 18px;font:inherit;font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;width:100%}'
    + '.as-bloc button[disabled]{opacity:.6}.as-note{font-size:14px!important;color:#C9B79F!important;margin:12px 0 0!important}.as-note strong{user-select:all;color:#F5EADA}';
  function infos(offre) {
    return 'Offre : ' + offre + '\nPage : ' + location.pathname + '\nAppareil : ' + navigator.userAgent + '\nÉcran : ' + screen.width + 'x' + screen.height + '\nDate : ' + new Date().toLocaleString('fr-FR');
  }
  function monter(el) {
    var offre = el.getAttribute('data-assistance') || 'site';
    el.className = 'as-bloc';
    el.innerHTML = '<div class="as-k">Un problème technique ?</div>'
      + '<p>Une page qui ne s’ouvre pas, un lien qui ne fonctionne pas : décrivez ce qui se passe. Votre message part directement à l’assistance, avec les informations utiles pour régler le problème.</p>'
      + '<form novalidate><label>Votre adresse e-mail<input type="email" name="email" autocomplete="email" placeholder="pour vous répondre"></label>'
      + '<label>Le problème<textarea name="message" rows="3" placeholder="Par exemple : mon lien de lecture ne s’ouvre pas sur mon téléphone"></textarea></label>'
      + '<button type="submit">Envoyer à l’assistance</button></form>'
      + '<p class="as-note">Vous pouvez aussi écrire à <strong>' + SUPPORT + '</strong>.</p>';
    var f = el.querySelector('form'), note = el.querySelector('.as-note'), b = el.querySelector('button');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = f.message.value.trim(), email = f.email.value.trim();
      if (!msg) { note.textContent = 'Décrivez le problème en quelques mots.'; return; }
      if (!RELAIS) { note.innerHTML = 'Pour le moment, écrivez-nous à <strong>' + SUPPORT + '</strong> en décrivant le problème.'; return; }
      b.disabled = true;
      fetch(RELAIS + '/assistance', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ offre: offre, email: email, message: msg, infos: infos(offre) }) })
        .then(function (r) { return r.json(); })
        .then(function (d) { note.innerHTML = d.ok ? 'Message envoyé. Nous vous répondons au plus vite.' : 'L’envoi n’a pas abouti. Écrivez-nous à <strong>' + SUPPORT + '</strong>.'; if (d.ok) f.message.value = ''; })
        .catch(function () { note.innerHTML = 'L’envoi n’a pas abouti. Écrivez-nous à <strong>' + SUPPORT + '</strong>.'; })
        .then(function () { b.disabled = false; });
    });
  }
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  document.querySelectorAll('[data-assistance]').forEach(monter);
})();
