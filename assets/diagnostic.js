/* FRAMYXCC : diagnostic interactif "Faire le point" (specification V1.0).
   Calcul et affichage dans le navigateur uniquement.
   Aucune reponse n'est envoyee, enregistree (cookie, stockage local) ni transmise. */
(function (root) {
  'use strict';

  var QUESTIONS = [
    { t: 'Aujourd’hui, qu’est-ce qui vous amène à faire le point ?', a: [
      'Je sens qu’un changement devient nécessaire.',
      'Je traverse une transition déjà engagée.',
      'Je veux mieux comprendre ce qui me freine.',
      'Je cherche à clarifier un projet ou une décision.',
      'Je souhaite retrouver un équilibre et une direction.'] },
    { t: 'Dans quel domaine ressentez-vous le besoin de clarté le plus fort ?', a: [
      'Identité, place et direction personnelle.',
      'Relations, famille ou qualité des échanges.',
      'Travail, activité ou projet professionnel.',
      'Organisation, équipe ou institution.',
      'Territoire, collectif ou projet de transformation.',
      'Plusieurs domaines à la fois.'] },
    { t: 'Qu’est-ce qui vous semble le plus difficile en ce moment ?', a: [
      'Mettre des mots sur ce qui se passe.',
      'Faire la différence entre l’essentiel et l’urgent.',
      'Choisir une direction parmi plusieurs possibilités.',
      'Passer de l’intention à une action concrète.',
      'Mobiliser les personnes ou les ressources nécessaires.',
      'Tenir le cap dans la durée.'] },
    { t: 'Depuis quand cette situation demande-t-elle votre attention ?', a: [
      'Depuis peu : quelque chose vient de changer.',
      'Depuis plusieurs mois.',
      'Depuis longtemps, avec des périodes d’accalmie.',
      'Je ne sais pas encore bien le situer.'] },
    { t: 'Quel type d’avancée vous serait le plus utile aujourd’hui ?', a: [
      'Comprendre plus clairement ma situation.',
      'Identifier mes priorités.',
      'Prendre une décision ou choisir une direction.',
      'Structurer un projet ou une démarche.',
      'Améliorer une relation ou une dynamique collective.',
      'Être accompagné·e pour avancer avec méthode.'] },
    { t: 'Où en êtes-vous dans votre capacité à agir ?', a: [
      'J’ai besoin de clarifier avant d’agir.',
      'Je vois des pistes, mais je n’arrive pas à choisir.',
      'Je sais ce que je veux faire, mais j’ai du mal à démarrer.',
      'J’ai commencé, mais j’ai besoin d’ajuster ma trajectoire.',
      'Je suis prêt·e à structurer la suite.'] },
    { t: 'Quel cadre vous correspond le mieux pour la prochaine étape ?', a: [
      'Réfléchir seul·e à partir d’un support simple.',
      'Échanger avec une personne pour clarifier ma situation.',
      'Suivre un parcours structuré.',
      'Travailler avec une équipe ou une organisation.',
      'Je ne sais pas encore.'] },
    { t: 'Quelle phrase décrit le mieux votre attente ?', a: [
      'Je veux d’abord comprendre.',
      'Je veux choisir ce qui compte vraiment.',
      'Je veux transformer une intention en plan.',
      'Je veux faire évoluer une dynamique collective.',
      'Je veux être accompagné·e dans la durée.'] }
  ];

  /* Points : [question (1..8), reponses (1..n), points] */
  var DIMS = ['CLARIFIER', 'CHOISIR', 'STRUCTURER', 'COLLECTIF', 'ACCOMPAGNER'];
  var POINTS = {
    CLARIFIER: [[1, [3, 5], 2], [3, [1, 2], 2], [5, [1], 2], [6, [1], 2], [8, [1], 2]],
    CHOISIR: [[1, [1, 4], 2], [3, [3], 2], [5, [2, 3], 2], [6, [2], 2], [8, [2], 2]],
    STRUCTURER: [[1, [4], 2], [3, [4, 6], 2], [5, [4], 2], [6, [3, 4, 5], 2], [8, [3], 2]],
    COLLECTIF: [[2, [2, 4, 5], 2], [3, [5], 2], [5, [5], 2], [7, [4], 3], [8, [4], 2]],
    ACCOMPAGNER: [[5, [6], 2], [7, [2, 3], 2], [8, [5], 3], [4, [3], 1]]
  };
  /* Departage 1 : Q5 (type d'avancee). Decision du 14/10 : la reponse 3 (decision / direction) alimente CHOISIR. */
  var TIE_Q5 = { 1: 'CLARIFIER', 2: 'CHOISIR', 3: 'CHOISIR', 4: 'STRUCTURER', 5: 'COLLECTIF', 6: 'ACCOMPAGNER' };
  /* Departage 2 : Q2 (domaine). Seules les reponses liees a COLLECTIF par les regles de points ci-dessus. */
  var TIE_Q2 = { 2: 'COLLECTIF', 4: 'COLLECTIF', 5: 'COLLECTIF' };

  var TIE_MENTION = 'Vos réponses font apparaître plusieurs besoins proches ; commencez par le point qui vous pèse le plus aujourd’hui.';

  var RESULTS = {
    CLARIFIER: {
      titre: 'Votre première étape : retrouver de la clarté',
      synthese: 'Vos réponses indiquent que le besoin principal, aujourd’hui, est de mieux comprendre votre situation avant de décider. Vous n’avez pas besoin de tout résoudre immédiatement. Commencez par distinguer les faits, les questions encore ouvertes et ce qui mérite votre attention en premier.',
      etape: 'Notez en une phrase la question à laquelle vous aimeriez répondre en priorité.'
    },
    CHOISIR: {
      titre: 'Votre première étape : choisir une direction',
      synthese: 'Plusieurs possibilités semblent présentes, mais toutes ne demandent pas la même énergie ni la même priorité. Votre prochaine avancée consiste à rendre les options plus lisibles et à choisir un point de départ réaliste, sans chercher à prévoir tout le parcours.',
      etape: 'Écrivez les deux options principales, puis indiquez ce que chacune permettrait de faire avancer.'
    },
    STRUCTURER: {
      titre: 'Votre première étape : organiser le passage à l’action',
      synthese: 'Vous semblez avoir déjà identifié une intention ou engagé un mouvement. Le besoin actuel porte davantage sur l’organisation de la suite : définir un objectif proche, une action observable et un moment pour faire le point.',
      etape: 'Choisissez une action réalisable dans les sept prochains jours et inscrivez-la dans votre agenda.'
    },
    COLLECTIF: {
      titre: 'Votre première étape : clarifier la dynamique collective',
      synthese: 'Votre situation semble impliquer plusieurs personnes, une organisation ou un environnement partagé. Avant de chercher une solution, il est utile de préciser ce qui doit évoluer, qui est concerné et ce qui serait différent si la situation s’améliorait.',
      etape: 'Formulez le changement attendu du point de vue du collectif, sans désigner de responsable ni attribuer de faute.'
    },
    ACCOMPAGNER: {
      titre: 'Votre première étape : choisir un cadre d’accompagnement',
      synthese: 'Vos réponses suggèrent que vous souhaitez avancer avec un cadre plus soutenu. Un regard extérieur peut aider à préciser la demande, le résultat recherché et le type d’accompagnement adapté. Ce résultat ne signifie pas que vous ne pouvez pas avancer seul·e ; il indique simplement une préférence exprimée dans vos réponses.',
      etape: 'Préparez trois éléments : la situation à faire évoluer, le résultat souhaité et la question que vous aimeriez traiter en premier.'
    }
  };

  var DOMAINE = [
    'Votre réflexion peut commencer par la place que vous souhaitez occuper et la direction que vous voulez donner à la suite.',
    'Votre réflexion peut commencer par la situation relationnelle précise que vous souhaitez voir évoluer, sans chercher à tout régler en même temps.',
    'Votre réflexion peut commencer par le résultat professionnel que vous voulez rendre plus clair ou plus accessible.',
    'Votre réflexion peut commencer par l’objectif partagé et les conditions de travail ou de coopération à faire évoluer.',
    'Votre réflexion peut commencer par le besoin du territoire ou du collectif, les acteurs concernés et le changement attendu.',
    'Plusieurs domaines semblent mobiliser votre attention. Pour éviter de vous disperser, choisissez celui dont l’évolution aurait le plus d’effet utile à court terme.'
  ];

  /* Orientation "Decouvrir les accompagnements" selon Q2 (a valider) :
     1-2 univers personnel ; 3-5 univers professionnel ; 6 les deux. */
  var ORIENTATION = {
    1: [['Découvrir les accompagnements', 'univers-personnel.html']],
    2: [['Découvrir les accompagnements', 'univers-personnel.html']],
    3: [['Découvrir les accompagnements', 'univers-professionnel.html']],
    4: [['Découvrir les accompagnements', 'univers-professionnel.html']],
    5: [['Découvrir les accompagnements', 'univers-professionnel.html']],
    6: [['Découvrir les accompagnements (univers personnel)', 'univers-personnel.html'],
        ['Découvrir les accompagnements (univers professionnel)', 'univers-professionnel.html']]
  };

  /* answers : tableau de 8 entiers (1..n), index 0 = question 1 */
  function scores(answers) {
    var s = {};
    DIMS.forEach(function (d) {
      s[d] = 0;
      POINTS[d].forEach(function (r) {
        if (r[1].indexOf(answers[r[0] - 1]) !== -1) { s[d] += r[2]; }
      });
    });
    return s;
  }

  function compute(answers) {
    var s = scores(answers), max = -1, tied = [], dim, tieMention = false;
    DIMS.forEach(function (d) { if (s[d] > max) { max = s[d]; } });
    DIMS.forEach(function (d) { if (s[d] === max) { tied.push(d); } });
    if (tied.length === 1) {
      dim = tied[0];
    } else if (TIE_Q5[answers[4]] && tied.indexOf(TIE_Q5[answers[4]]) !== -1) {
      dim = TIE_Q5[answers[4]];
    } else if (TIE_Q2[answers[1]] && tied.indexOf(TIE_Q2[answers[1]]) !== -1) {
      dim = TIE_Q2[answers[1]];
    } else {
      dim = 'CLARIFIER'; tieMention = true;
    }
    var r = RESULTS[dim];
    return {
      dimension: dim, titre: r.titre, synthese: r.synthese, etape: r.etape,
      tieMention: tieMention ? TIE_MENTION : '',
      domaine: DOMAINE[answers[1] - 1],
      orientation: ORIENTATION[answers[1]]
    };
  }

  function texteACopier(res) {
    var parts = [res.titre, res.synthese];
    if (res.tieMention) { parts.push(res.tieMention); }
    parts.push(res.domaine);
    parts.push('Prochaine étape gratuite : ' + res.etape);
    return parts.join('\n\n');
  }

  var api = { QUESTIONS: QUESTIONS, scores: scores, compute: compute, texteACopier: texteACopier, RESULTS: RESULTS };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; return; }
  root.FraDiag = api;

  /* ---------- Interface (navigateur uniquement) ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var app = document.getElementById('diag-app');
    if (!app) { return; }
    var N = QUESTIONS.length;
    var answers = [], idx = 0;
    var screens = {
      intro: app.querySelector('[data-screen="intro"]'),
      q: app.querySelector('[data-screen="question"]'),
      res: app.querySelector('[data-screen="result"]')
    };
    var qNum = app.querySelector('[data-q-num]');
    var qBar = app.querySelector('[data-q-bar]');
    var qTitle = app.querySelector('[data-q-title]');
    var qList = app.querySelector('[data-q-list]');
    var btnPrev = app.querySelector('[data-prev]');
    var btnNext = app.querySelector('[data-next]');

    function show(name) {
      Object.keys(screens).forEach(function (k) { screens[k].hidden = (k !== name); });
      var h = screens[name].querySelector('[data-focus]');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: false }); }
    }

    function renderQuestion() {
      var q = QUESTIONS[idx];
      qNum.textContent = 'Question ' + (idx + 1) + ' sur ' + N;
      qBar.style.width = (((idx + 1) / N) * 100) + '%';
      qBar.parentNode.setAttribute('aria-valuenow', String(idx + 1));
      qTitle.textContent = q.t;
      qList.innerHTML = '';
      q.a.forEach(function (txt, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'diag-opt';
        b.setAttribute('aria-pressed', answers[idx] === i + 1 ? 'true' : 'false');
        var mark = document.createElement('span'); mark.className = 'diag-mark'; mark.setAttribute('aria-hidden', 'true');
        var t = document.createElement('span'); t.textContent = txt;
        b.appendChild(mark); b.appendChild(t);
        b.addEventListener('click', function () {
          answers[idx] = i + 1;
          Array.prototype.forEach.call(qList.children, function (c, j) { c.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
          updateNav();
        });
        qList.appendChild(b);
      });
      btnPrev.hidden = (idx === 0);
      updateNav();
    }

    function updateNav() {
      var ok = !!answers[idx];
      btnNext.setAttribute('aria-disabled', ok ? 'false' : 'true');
      btnNext.classList.toggle('is-off', !ok);
    }

    function renderResult() {
      var res = compute(answers);
      app.querySelector('[data-r-titre]').textContent = res.titre;
      app.querySelector('[data-r-synthese]').textContent = res.synthese;
      var tm = app.querySelector('[data-r-tie]');
      tm.textContent = res.tieMention; tm.hidden = !res.tieMention;
      app.querySelector('[data-r-domaine]').textContent = res.domaine;
      app.querySelector('[data-r-etape]').textContent = res.etape;
      var links = app.querySelector('[data-r-orient]');
      links.innerHTML = '';
      res.orientation.forEach(function (o) {
        var a = document.createElement('a'); a.className = 'btn ghost'; a.href = o[1]; a.textContent = o[0]; links.appendChild(a);
      });
      app.querySelector('[data-copy-msg]').textContent = '';
      app._res = res;
      show('res');
    }

    app.querySelector('[data-start]').addEventListener('click', function () {
      answers = []; idx = 0; renderQuestion(); show('q');
    });
    function focusTitle() { qTitle.setAttribute('tabindex', '-1'); qTitle.focus(); }
    btnPrev.addEventListener('click', function () { if (idx > 0) { idx--; renderQuestion(); focusTitle(); } });
    btnNext.addEventListener('click', function () {
      if (!answers[idx]) { return; }
      if (idx < N - 1) { idx++; renderQuestion(); focusTitle(); } else { renderResult(); }
    });
    app.querySelector('[data-restart]').addEventListener('click', function () {
      answers = []; idx = 0; app._res = null; show('intro');
    });
    app.querySelector('[data-copy]').addEventListener('click', function () {
      var msg = app.querySelector('[data-copy-msg]');
      var txt = texteACopier(app._res);
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '-1000px';
        document.body.appendChild(ta); ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        msg.textContent = ok ? 'Synthèse copiée.' : 'La copie automatique n’est pas disponible. Sélectionnez le texte du résultat pour le copier.';
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { msg.textContent = 'Synthèse copiée.'; }, fallback);
      } else { fallback(); }
    });
  });
})(typeof window !== 'undefined' ? window : this);
