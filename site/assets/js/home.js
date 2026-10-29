// Home page: savings and mortgage calculator.
(function () {
  'use strict';

  var root = document.querySelector('[data-calc]');
  if (!root) return;

  var MODES = {
    save: {
      rate: 4.85, defaults: { amount: 10000, term: '3' },
      rateLabel: 'High-yield account', rateChip: '4.85% AER', amountLabel: 'You deposit', termLabel: 'For',
      r1Label: 'Interest earned', r2Label: 'Balance at end of term',
      cta: 'Start saving', ctaHref: '#'
    },
    loan: {
      rate: 5.29, defaults: { amount: 250000, term: '25' },
      rateLabel: '5-year fixed mortgage', rateChip: '5.29% APRC', amountLabel: 'You borrow', termLabel: 'Over',
      r1Label: 'Monthly repayment', r2Label: 'Total repaid',
      cta: 'Get my mortgage offer', ctaHref: '#'
    }
  };

  var gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 });
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panel = root.querySelector('[role="tabpanel"]');
  var amount = root.querySelector('#sb-amount');
  var term = root.querySelector('#sb-term');
  var out = {};
  root.querySelectorAll('[data-out]').forEach(function (el) { out[el.dataset.out] = el; });
  var mode = 'save';

  function parse(v) {
    var n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
    return isFinite(n) && n > 0 ? Math.min(n, 1e9) : 0;
  }

  function calc() {
    var m = MODES[mode];
    var p = parse(amount.value);
    var years = Number(term.value);
    var r1, r2;
    if (mode === 'save') {
      // Compounded monthly: p × (1 + r/12)^(12y)
      var end = p * Math.pow(1 + m.rate / 100 / 12, 12 * years);
      r1 = end - p; r2 = end;
    } else {
      // Standard repayment: p·i / (1 − (1+i)^−n)
      var i = m.rate / 100 / 12, n = 12 * years;
      var monthly = p * i / (1 - Math.pow(1 + i, -n));
      r1 = monthly; r2 = monthly * n;
    }
    out.r1.textContent = gbp.format(r1);
    out.r2.textContent = gbp.format(r2);
  }

  function setMode(next, opts) {
    mode = next;
    var m = MODES[mode];
    tabs.forEach(function (t) {
      var sel = t.dataset.mode === mode;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
      if (sel) panel.setAttribute('aria-labelledby', t.id);
    });
    ['rateLabel', 'rateChip', 'amountLabel', 'termLabel', 'r1Label', 'r2Label', 'cta'].forEach(function (k) { out[k].textContent = m[k]; });
    out.cta.href = m.ctaHref;
    if (!opts || opts.reset !== false) {
      amount.value = m.defaults.amount.toLocaleString('en-GB');
      term.value = m.defaults.term;
    }
    calc();
  }

  tabs.forEach(function (t, idx) {
    t.addEventListener('click', function () { if (t.dataset.mode !== mode) setMode(t.dataset.mode); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var next = tabs[(idx + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      setMode(next.dataset.mode);
    });
  });
  amount.addEventListener('input', calc);
  amount.addEventListener('blur', function () {
    var v = parse(amount.value);
    amount.value = v ? v.toLocaleString('en-GB') : '0';
    calc();
  });
  term.addEventListener('change', calc);

  // Links such as /#mortgage-calculator open the calculator on the right tab.
  function fromHash() {
    var h = window.location.hash;
    if (h !== '#mortgage-calculator' && h !== '#savings-calculator') return;
    var want = h === '#mortgage-calculator' ? 'loan' : 'save';
    if (want !== mode) setMode(want);
    root.scrollIntoView({ block: 'start' });
  }
  window.addEventListener('hashchange', fromHash);

  setMode('save', { reset: false });
  fromHash();
})();
