// Credit card application: four steps, validation, review and result.
(function () {
  'use strict';

  var form = document.querySelector('[data-apply]');
  if (!form) return;

  var DRAFT_KEY = 'sb_apply_draft';
  var LABELS = {
    years: { lt1: 'Under 1 year', '1to3': '1 to 3 years', '3plus': '3 years or more' },
    housing: { own: 'Homeowner with mortgage', outright: 'Homeowner, no mortgage', rent: 'Renting', family: 'Living with family' },
    emp: { employed: 'Employed', self: 'Self-employed', retired: 'Retired', student: 'Student', other: 'Other' }
  };

  var gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
  var cards = null;
  var step = 1;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var steps = $$('.step', form);
  var progress = $$('[data-steps] li');
  var errbox = $('[data-errors]', form);
  var backBtn = $('[data-back]', form);
  var backLink = $('[data-back-link]', form);
  var nextBtn = $('[data-next]', form);
  var navRow = $('[data-nav]', form);
  var done = $('[data-done]', form);
  var title = $('[data-title]');
  var stepsList = $('[data-steps]');

  function num(v) { var n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return isFinite(n) ? n : 0; }
  function val(name) {
    var el = form.elements[name];
    if (!el) return '';
    if (el.type === 'checkbox') return el.checked;
    return String(el.value).trim();
  }

  // Validation rules per step: [field, test, message]. A test returns true when the value is OK.
  var filled = function (v) { return v !== '' && v !== false; };
  function isAdult(v) {
    var d = new Date(v + 'T00:00:00');
    if (isNaN(d)) return false;
    var now = new Date();
    var age = now.getFullYear() - d.getFullYear() - ((now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) ? 1 : 0);
    return age >= 18 && age < 120;
  }
  var RULES = {
    1: [
      ['first', filled, 'Enter your first name'],
      ['last', filled, 'Enter your last name'],
      ['dob', filled, 'Enter your date of birth'],
      ['dob', isAdult, 'You must be 18 or over to apply'],
      ['mobile', filled, 'Enter your mobile number'],
      ['mobile', function (v) { return /^(\+447|07)\d{9}$/.test(v.replace(/[\s()-]/g, '')); }, 'Enter a UK mobile number, like 07700 900123'],
      ['email', filled, 'Enter your email address'],
      ['email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Enter an email address in the correct format, like name@example.com']
    ],
    2: [
      ['address1', filled, 'Enter the first line of your address'],
      ['town', filled, 'Enter your town or city'],
      ['postcode', filled, 'Enter your postcode'],
      ['postcode', function (v) { return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(v); }, 'Enter a real postcode, like SW1A 1AA']
    ],
    3: [
      ['income', filled, 'Enter your annual income'],
      ['income', function (v) { return num(v) > 0; }, 'Annual income must be a number, like 32,000']
    ],
    4: [
      ['c1', filled, 'Confirm you agree to the terms'],
      ['c2', filled, 'Confirm we can run a credit search']
    ]
  };

  function validate() {
    var errors = [];
    var seen = {};
    (RULES[step] || []).forEach(function (r) {
      if (seen[r[0]]) return; // one message per field
      if (!r[1](val(r[0]))) { errors.push({ name: r[0], msg: r[2] }); seen[r[0]] = true; }
    });
    return errors;
  }

  function clearErrors() {
    errbox.hidden = true;
    $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
  }

  function showErrors(errors) {
    clearErrors();
    var list = $('ul', errbox);
    list.textContent = '';
    errors.forEach(function (e) {
      var el = form.elements[e.name];
      el.setAttribute('aria-invalid', 'true');
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + el.id;
      a.textContent = e.msg;
      a.addEventListener('click', function (ev) { ev.preventDefault(); el.focus(); });
      li.append(a);
      list.append(li);
    });
    errbox.hidden = false;
    errbox.focus();
  }

  // Card data comes from the shared cards.json used to build the card pages.
  function currentCard() {
    var key = val('card') || 'cashback';
    return { key: key, data: cards ? cards[key] : null };
  }

  function paintSidebar() {
    var c = currentCard();
    $$('[data-card-link]').forEach(function (a) { a.href = window.SB_BASE + 'credit-cards/' + c.key + '/'; });
    if (!c.data) return;
    var face = $('[data-sum="face"]');
    face.className = 'sum-face ' + c.data.cls;
    $('[data-sum="short"]').textContent = c.data.short;
    $('[data-sum="name"]').textContent = c.data.name;
    $('[data-sum="apr"]').textContent = c.data.apr;
    $('[data-sum="fee"]').textContent = c.data.fee;
  }

  function formatDate(v) {
    var d = new Date(v + 'T00:00:00');
    return isNaN(d) ? v : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function paintReview() {
    var c = currentCard();
    var set = function (k, v) { $('[data-rv="' + k + '"]', form).textContent = v; };
    set('card', c.data ? c.data.name : c.key);
    set('name', [val('title'), val('first'), val('last')].filter(Boolean).join(' '));
    set('dob', formatDate(val('dob')));
    set('email', val('email'));
    set('mobile', val('mobile'));
    set('address', [val('address1'), val('address2'), val('town'), val('postcode').toUpperCase()].filter(Boolean).join(', '));
    set('years', LABELS.years[val('years')]);
    set('housing', LABELS.housing[val('housing')]);
    set('emp', LABELS.emp[val('emp')] + (val('employer') ? ' · ' + val('employer') : ''));
    set('income', gbp.format(num(val('income'))));
    set('housingCost', gbp.format(num(val('housingCost'))));
    set('bt', val('bt') === 'yes' ? 'Yes, after approval' : 'No');
  }

  function go(n, opts) {
    step = n;
    clearErrors();
    steps.forEach(function (s) { s.hidden = Number(s.dataset.step) !== n; });
    progress.forEach(function (li, i) {
      var k = i + 1;
      li.dataset.state = k < n ? 'done' : k === n ? 'current' : 'todo';
      if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    backBtn.hidden = n === 1;
    backLink.hidden = n !== 1;
    nextBtn.textContent = n === 4 ? 'Submit application' : 'Continue';
    if (n === 4) paintReview();
    saveDraft();
    if (!opts || opts.focus !== false) {
      window.scrollTo(0, 0);
      var heading = $('.step:not([hidden]) h2', form);
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
  }

  // Progress is kept for this browser tab only, so a refresh doesn't lose answers.
  // Storing an application for 30 days, as the copy promises, needs a server.
  function saveDraft() {
    try {
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      delete data.c1; delete data.c2;
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step: Math.min(step, 4), data: data }));
    } catch (e) { /* storage unavailable */ }
  }
  function loadDraft() {
    try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY)); } catch (e) { return null; }
  }
  function clearDraft() {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) { /* storage unavailable */ }
  }
  function restore(data) {
    Object.keys(data).forEach(function (k) {
      var el = form.elements[k];
      if (!el) return;
      if (el instanceof RadioNodeList || el.type === 'radio') {
        $$('input[name="' + k + '"]', form).forEach(function (r) { r.checked = r.value === data[k]; });
      } else {
        el.value = data[k];
      }
    });
  }

  // DEMONSTRATION ONLY: every application is approved and nothing leaves the browser.
  // Replace this with a call to the real application service.
  function submitApplication() {
    var c = currentCard();
    var max = c.data ? c.data.maxLimit : 15000;
    var limit = Math.max(250, Math.min(max, Math.round(num(val('income')) * 0.15 / 250) * 250));
    var digits = new Uint32Array(1);
    (window.crypto || window.msCrypto).getRandomValues(digits);
    return Promise.resolve({
      approved: true,
      limit: limit,
      reference: 'SB-' + String(digits[0] % 1000000).padStart(6, '0')
    });
  }

  function showResult(res) {
    var c = currentCard();
    var set = function (k, v) { $('[data-done="' + k + '"]', form).textContent = v; };
    set('first', val('first'));
    set('card', c.data ? c.data.name : '');
    set('limit', gbp.format(res.limit));
    set('apr', c.data ? c.data.apr : '');
    set('ref', res.reference);
    set('email', val('email'));
    steps.forEach(function (s) { s.hidden = true; });
    navRow.hidden = true;
    stepsList.hidden = true;
    done.hidden = false;
    clearDraft();
    window.scrollTo(0, 0);
    done.focus({ preventScroll: true });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var errors = validate();
    if (errors.length) { showErrors(errors); return; }
    if (step < 4) { go(step + 1); return; }
    nextBtn.disabled = true;
    submitApplication().then(showResult).finally(function () { nextBtn.disabled = false; });
  });
  backBtn.addEventListener('click', function () { go(Math.max(1, step - 1)); });
  $$('[data-goto]', form).forEach(function (b) {
    b.addEventListener('click', function () { go(Number(b.dataset.goto)); });
  });
  $('[data-restart]', form).addEventListener('click', function () {
    form.reset();
    done.hidden = true;
    navRow.hidden = false;
    stepsList.hidden = false;
    paintSidebar();
    go(1, { focus: false });
    title.focus();
  });
  form.addEventListener('change', function (e) {
    if (e.target.name === 'card') paintSidebar();
    if (e.target.getAttribute('aria-invalid') === 'true' && filled(val(e.target.name))) e.target.removeAttribute('aria-invalid');
    saveDraft();
  });
  form.addEventListener('input', saveDraft);
  $('input[name="income"]', form).addEventListener('blur', function (e) {
    var n = num(e.target.value);
    if (n) e.target.value = n.toLocaleString('en-GB');
  });

  // Start: restore a draft from this tab, then honour ?card= from the "Apply now" links.
  var draft = loadDraft();
  if (draft && draft.data) restore(draft.data);
  var wanted = new URLSearchParams(window.location.search).get('card');
  if (wanted) {
    var radio = $('input[name="card"][value="' + wanted.replace(/[^a-z]/g, '') + '"]', form);
    if (radio) radio.checked = true;
  }
  go(draft && draft.step ? draft.step : 1, { focus: false });
  paintSidebar();
  fetch(window.SB_BASE + 'assets/data/cards.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { cards = data; paintSidebar(); if (step === 4) paintReview(); })
    .catch(function () { /* sidebar keeps its default content */ });
})();
