// Credit cards page: product filters and the eligibility checker.
(function () {
  'use strict';

  // Filters
  var group = document.querySelector('[data-filters]');
  if (group) {
    var buttons = Array.prototype.slice.call(group.querySelectorAll('[data-filter]'));
    var products = Array.prototype.slice.call(document.querySelectorAll('.product[data-groups]'));
    var status = document.querySelector('[data-filter-status]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.dataset.filter;
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var shown = 0;
        products.forEach(function (p) {
          var show = f === 'all' || p.dataset.groups.split(' ').indexOf(f) !== -1;
          p.hidden = !show;
          if (show) shown++;
        });
        status.textContent = 'Showing ' + shown + (shown === 1 ? ' card' : ' cards');
      });
    });
  }

  // Eligibility checker.
  // ILLUSTRATION ONLY: these rules are invented for the demo and are not a credit decision.
  // A real implementation would call a soft-search eligibility service here instead.
  function likelyCards(income, employment) {
    if (employment === 'student' || income < 12000) return ['SecurBank Starter'];
    var out = [];
    if (income >= 18000) out.push('SecurBank Cashback');
    out.push('SecurBank Clear');
    if (income >= 35000) out.push('SecurBank Voyager');
    if (income < 18000) out.push('SecurBank Starter');
    return out;
  }

  var form = document.querySelector('[data-elig]');
  if (form) {
    var result = form.querySelector('[data-elig-result]');
    var list = result.querySelector('ul');
    var parse = function (v) {
      var n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
      return isFinite(n) && n > 0 ? n : 0;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      list.textContent = '';
      likelyCards(parse(form.income.value), form.employment.value).forEach(function (name) {
        var li = document.createElement('li');
        li.textContent = name;
        list.append(li);
      });
      result.hidden = false;
    });
    // Changing an answer clears the previous result.
    form.addEventListener('input', function () { result.hidden = true; });
  }
})();
