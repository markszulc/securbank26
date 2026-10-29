// Card details pages: the spend / balance estimator.
// All formulas are illustrative and use the example rates for each card.
(function () {
  'use strict';

  var root = document.querySelector('[data-est]');
  var key = document.querySelector('main[data-card]');
  if (!root || !key) return;
  key = key.dataset.card;

  var gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
  var ESTIMATORS = {
    // 5% supermarket boost for 3 months (capped at £100) plus 1% on a year's spend.
    cashback: function (s) { return gbp.format(Math.min(100, s * 3 * 0.04) + s * 12 * 0.01); },
    // One point per £1 for a year plus the 20,000 welcome bonus.
    voyager: function (s) { return (s * 12 + 20000).toLocaleString('en-GB') + ' pts'; },
    // Interest saved at 21.9% over 2 years on a reducing balance, less the 3% transfer fee.
    clear: function (s) { return gbp.format(Math.max(0, s * 0.219 * 2 * 0.55 - s * 0.03)); },
    // Interest avoided by clearing the balance each month.
    starter: function (s) { return gbp.format(s * 0.349 * 0.5); }
  };
  var estimate = ESTIMATORS[key] || ESTIMATORS.cashback;

  var input = root.querySelector('input[type="range"]');
  var amount = root.querySelector('[data-est-amount]');
  var out = root.querySelector('[data-est-out]');

  function update() {
    var s = Number(input.value) || 0;
    var text = gbp.format(s);
    amount.textContent = text;
    input.setAttribute('aria-valuetext', text);
    out.textContent = estimate(s);
  }
  input.addEventListener('input', update);
  update();
})();
