// Shared header behaviour: search panel, language selector and mobile menu.
// Only one of the three overlays is open at a time; Esc closes the open one.
(function () {
  'use strict';

  // The site root, worked out from this script's URL so the site can live in any folder.
  // Page scripts use window.SB_BASE to build links and fetch data.
  var BASE = window.SB_BASE = new URL('../../', document.currentScript.src).href;
  var LANG_COOKIE = 'sb_lang';
  var SEARCH_INDEX = BASE + 'assets/data/search-index.json';

  function readCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function writeCookie(name, value) {
    document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=31536000; SameSite=Lax';
  }

  // Overlays register themselves here so opening one closes the others.
  var overlays = [];
  function closeAll(except) {
    overlays.forEach(function (o) { if (o !== except) o.close(); });
  }

  function makeOverlay(toggle, panel, opts) {
    opts = opts || {};
    var o = {
      isOpen: function () { return !panel.hidden; },
      open: function () {
        closeAll(o);
        panel.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        swapIcons(toggle, true);
        if (opts.label) toggle.setAttribute('aria-label', opts.label[1]);
        if (opts.onOpen) opts.onOpen();
      },
      close: function (restoreFocus) {
        if (panel.hidden) return;
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        swapIcons(toggle, false);
        if (opts.label) toggle.setAttribute('aria-label', opts.label[0]);
        if (opts.onClose) opts.onClose();
        if (restoreFocus) toggle.focus();
      }
    };
    toggle.addEventListener('click', function () { o.isOpen() ? o.close() : o.open(); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) o.close(); });
    overlays.push(o);
    return o;
  }

  function swapIcons(btn, open) {
    var closed = btn.querySelector('[data-icon-closed]');
    var opened = btn.querySelector('[data-icon-open]');
    if (closed && opened) { closed.hidden = open; opened.hidden = !open; }
  }

  // Language: label only for now (copy isn't translated). The choice is kept in a cookie
  // so it carries across pages.
  function initLang() {
    var root = document.querySelector('[data-lang]');
    if (!root) return;
    var toggle = root.querySelector('[data-lang-toggle]');
    var menu = root.querySelector('.lang-menu');
    var codeEl = root.querySelector('[data-lang-code]');
    var options = Array.prototype.slice.call(menu.querySelectorAll('.lang-opt'));
    var overlay = makeOverlay(toggle, menu, {
      onOpen: function () {
        var cur = menu.querySelector('[aria-pressed="true"]') || options[0];
        cur.focus();
      }
    });

    function select(code) {
      var cur = options.filter(function (b) { return b.dataset.code === code; })[0] || options[0];
      options.forEach(function (b) { b.setAttribute('aria-pressed', String(b === cur)); });
      codeEl.textContent = cur.dataset.short;
      toggle.setAttribute('aria-label', 'Language: ' + cur.querySelector('span').textContent + '. Change language');
      return cur.dataset.code;
    }
    select(readCookie(LANG_COOKIE) || 'en-GB');

    options.forEach(function (b) {
      b.addEventListener('click', function () {
        writeCookie(LANG_COOKIE, select(b.dataset.code));
        overlay.close(true);
      });
    });
    // Arrow keys move between options.
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      var i = options.indexOf(document.activeElement);
      var next = e.key === 'ArrowDown' ? (i + 1) % options.length : (i - 1 + options.length) % options.length;
      options[next].focus();
    });
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.getElementById('sb-menu');
    if (!toggle || !menu) return;
    makeOverlay(toggle, menu, { label: ['Menu', 'Close menu'] });
    // The menu only exists below 820px; close it if the window grows past that.
    var mq = window.matchMedia('(min-width: 821px)');
    var onChange = function () { if (mq.matches) closeAll(); };
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
  }

  function initSearch() {
    var toggle = document.querySelector('[data-search-toggle]');
    var panel = document.getElementById('sb-search');
    if (!toggle || !panel) return;
    var form = panel.querySelector('[data-search-form]');
    var input = panel.querySelector('input[type="search"]');
    var popular = panel.querySelector('[data-search-popular]');
    var list = panel.querySelector('.results');
    var empty = panel.querySelector('[data-search-empty]');
    var status = document.getElementById('sb-status');
    var index = null;
    var results = [];

    function load() {
      if (index) return Promise.resolve(index);
      return fetch(SEARCH_INDEX).then(function (r) { return r.json(); }).then(function (data) { index = data; return data; });
    }

    function run() {
      var raw = input.value;
      var words = raw.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (!words.length) { results = []; paint(raw, words); return; }
      load().then(function (idx) {
        results = idx.filter(function (it) {
          var hay = (it.title + ' ' + it.desc + ' ' + it.kw).toLowerCase();
          return words.every(function (w) { return hay.indexOf(w) !== -1; });
        }).slice(0, 6);
        paint(raw, words);
      }).catch(function () {
        results = [];
        paint(raw, words);
      });
    }

    function paint(raw, words) {
      popular.hidden = words.length > 0;
      list.hidden = results.length === 0;
      empty.hidden = !(words.length && !results.length);
      list.textContent = '';
      results.forEach(function (r) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        var b = document.createElement('b');
        var s = document.createElement('small');
        a.href = r.href.charAt(0) === '/' ? BASE + r.href.slice(1) : r.href;
        b.textContent = r.title; s.textContent = r.desc;
        a.append(b, s); li.append(a); list.append(li);
      });
      if (words.length && !results.length) {
        empty.textContent = 'No results for “' + raw.trim() + '”. Try “cashback”, “mortgage” or “balance transfer”.';
      }
      status.textContent = words.length ? (results.length ? results.length + (results.length === 1 ? ' result' : ' results') : 'No results') : '';
    }

    makeOverlay(toggle, panel, {
      label: ['Search', 'Close search'],
      onOpen: function () { input.value = ''; run(); input.focus(); load().catch(function () {}); },
      onClose: function () { input.value = ''; }
    });
    input.addEventListener('input', run);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = list.querySelector('a');
      if (first) window.location.href = first.href;
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    overlays.forEach(function (o) { if (o.isOpen()) o.close(true); });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-header], .hdr')) closeAll();
  });

  initLang();
  initMenu();
  initSearch();
})();
