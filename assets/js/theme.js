/* ==========================================================================
   theme.js — the style switcher.

   ------------------------------------------------------------------
   TO CHANGE THE SITE-WIDE DEFAULT STYLE, EDIT THIS ONE LINE:
   ------------------------------------------------------------------ */

const DEFAULT_THEME = 'observatory';   // 'auto' | 'academic' | 'paper' | 'observatory' | 'terminal' | 'zine'

/* Bump this whenever you change DEFAULT_THEME. A visitor who once picked a
   style has that choice saved in their browser, and a saved choice normally
   beats the default — so without this, nobody who has ever touched the Style
   menu would see the new default. Raising the number retires those saved
   choices once, and they start being remembered again from then on. */
const STYLE_VERSION = 3;

/* Styles offered in the header menu. To add one: define a matching
   [data-theme="…"] block in assets/css/themes.css, then add a line here. */
const THEMES = [
  { id: 'academic',    label: 'Academic' },
  { id: 'paper',       label: 'Paper' },
  { id: 'observatory', label: 'Observatory' },
  { id: 'terminal',    label: 'Terminal' },
  { id: 'zine',        label: 'Zine' },
  { id: 'auto',        label: 'Auto (follow device)' }
];

/* What 'auto' resolves to, following the visitor's OS setting. */
const AUTO_LIGHT = 'academic';
const AUTO_DARK  = 'observatory';

/* ========================================================================== */

const STORAGE_KEY = 'ak-style';
const ids = THEMES.map(function (t) { return t.id; });

/* Reads the saved choice, but only if it was saved against the current
   STYLE_VERSION. Anything older (including the plain strings written by the
   first version of this script) is ignored, so the current default wins. */
function savedChoice() {
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    var parsed = JSON.parse(raw);
    if (parsed && parsed.v === STYLE_VERSION && typeof parsed.id === 'string') return parsed.id;
    return null;
  } catch (e) {
    return null;   // unreadable, unparsable, or storage blocked
  }
}

function prefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolve(choice) {
  return choice === 'auto' ? (prefersDark() ? AUTO_DARK : AUTO_LIGHT) : choice;
}

/* Order of precedence: ?theme= in the URL, then a saved choice, then the
   default set at the top of this file. */
function initialChoice() {
  var fromUrl = null;
  try {
    fromUrl = new URLSearchParams(window.location.search).get('theme');
  } catch (e) { /* older browser: ignore */ }

  var candidates = [fromUrl, savedChoice(), DEFAULT_THEME];
  for (var i = 0; i < candidates.length; i++) {
    if (candidates[i] && ids.indexOf(candidates[i]) !== -1) return candidates[i];
  }
  return 'observatory';
}

var choice = initialChoice();

function apply(next, persist) {
  choice = next;
  var root = document.documentElement;
  root.setAttribute('data-theme', resolve(next));
  root.setAttribute('data-style-choice', next);
  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: next, v: STYLE_VERSION }));
    } catch (e) { /* private mode */ }
  }
  document.querySelectorAll('.switcher select').forEach(function (sel) {
    if (sel.value !== next) sel.value = next;
  });
}

/* Applied immediately — this script is loaded in <head> without defer, so the
   page never paints in the wrong style. */
apply(choice, false);

/* Follow the OS if the visitor is on 'auto'. */
if (window.matchMedia) {
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var onChange = function () { if (choice === 'auto') apply('auto', false); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);
}

/* Build the switcher into every <div class="switcher" data-switcher></div>. */
function buildSwitcher() {
  document.querySelectorAll('[data-switcher]').forEach(function (host, i) {
    if (host.dataset.built) return;
    host.dataset.built = '1';

    var id = 'style-select-' + i;

    var label = document.createElement('label');
    label.className = 'switcher__label';
    label.setAttribute('for', id);
    label.textContent = 'Style';
    host.appendChild(label);

    var select = document.createElement('select');
    select.id = id;
    THEMES.forEach(function (theme) {
      var opt = document.createElement('option');
      opt.value = theme.id;
      opt.textContent = theme.label;
      select.appendChild(opt);
    });
    select.value = choice;
    select.addEventListener('change', function () { apply(this.value, true); });
    host.appendChild(select);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildSwitcher);
} else {
  buildSwitcher();
}
