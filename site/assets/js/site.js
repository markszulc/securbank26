// Shared header behaviour: search panel, language selector and mobile menu.
// Only one of the three overlays is open at a time; Esc closes the open one.
(function () {
  'use strict';

  // The site root, worked out from this script's URL so the site can live in any folder.
  // Page scripts use window.SB_BASE to build links and fetch data.
  var BASE = window.SB_BASE = new URL('../../', document.currentScript.src).href;
  var LANG_COOKIE = 'sb_lang';
  var THEME_KEY = 'sb_theme';
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

  // A button that opens a short list of options, one of which is selected (aria-pressed).
  // opts.value(option) reads an option's value, opts.show(option) updates the button for the
  // selected option, and opts.save(value) stores a choice the visitor makes.
  function initChoiceMenu(root, opts) {
    var toggle = root.querySelector('[aria-controls]');
    var menu = root.querySelector('.pop-menu');
    var options = Array.prototype.slice.call(menu.querySelectorAll('.pop-opt'));
    var overlay = makeOverlay(toggle, menu, {
      onOpen: function () { (menu.querySelector('[aria-pressed="true"]') || options[0]).focus(); }
    });

    function select(value) {
      var cur = options.filter(function (b) { return opts.value(b) === value; })[0] || options[0];
      options.forEach(function (b) { b.setAttribute('aria-pressed', String(b === cur)); });
      opts.show(cur, toggle);
      return opts.value(cur);
    }
    select(opts.initial);

    root.selectValue = select;
    options.forEach(function (b) {
      b.addEventListener('click', function () {
        opts.save(select(opts.value(b)));
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

  // Language: label only for now (copy isn't translated). The choice is kept in a cookie
  // so it carries across pages.
  // There are two controls: the header menu, and in the mobile menu a dropdown.
  function initLang() {
    var root = document.querySelector('[data-lang]');
    if (!root) return;
    var codeEl = root.querySelector('[data-lang-code]');
    var select = document.querySelector('[data-lang-select]');
    initChoiceMenu(root, {
      initial: readCookie(LANG_COOKIE) || 'en-GB',
      value: function (b) { return b.dataset.code; },
      show: function (b, toggle) {
        codeEl.textContent = b.dataset.short;
        toggle.setAttribute('aria-label', 'Language: ' + b.querySelector('span').textContent + '. Change language');
        if (select) select.value = b.dataset.code;
      },
      save: function (code) { writeCookie(LANG_COOKIE, code); }
    });
    if (select) {
      select.addEventListener('change', function () {
        writeCookie(LANG_COOKIE, root.selectValue(select.value));
      });
    }
  }

  // Theme: light, dark, or match the system setting (the default). A forced choice sets
  // data-theme on <html>; the inline script in <head> re-applies it on the next page load.
  // There are two controls: the header menu, and on phones a switch in the mobile menu.
  function initTheme() {
    var root = document.querySelector('[data-theme-picker]');
    var seg = Array.prototype.slice.call(document.querySelectorAll('[data-theme-set]'));
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* storage unavailable */ }

    function apply(v) {
      if (v === 'system') delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = v;
      seg.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.themeSet === v)); });
    }
    function save(v) {
      try {
        if (v === 'system') localStorage.removeItem(THEME_KEY);
        else localStorage.setItem(THEME_KEY, v);
      } catch (e) { /* storage unavailable: the choice lasts for this page only */ }
    }

    var initial = stored === 'light' || stored === 'dark' ? stored : 'system';
    if (root) {
      initChoiceMenu(root, {
        initial: initial,
        value: function (b) { return b.dataset.value; },
        show: function (b, toggle) {
          var v = b.dataset.value;
          root.querySelectorAll('[data-theme-icon]').forEach(function (icon) { icon.hidden = icon.dataset.themeIcon !== v; });
          toggle.setAttribute('aria-label', 'Theme: ' + b.querySelector('span').textContent.toLowerCase() + '. Change theme');
          apply(v);
        },
        save: save
      });
    } else {
      apply(initial);
    }
    seg.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.dataset.themeSet;
        if (root) root.selectValue(v); else apply(v);
        save(v);
      });
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

  initTheme();
  initLang();
  initMenu();
  initSearch();
})();
