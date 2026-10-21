// Runs before first paint. The static HTML is Russian; when another language is asked for
// (?lang=en in the link, or a saved choice), the page stays behind a loader until React
// re-renders the text, so the visitor never sees the wrong language flash by.
(function () {
  var LOCALES = ['ru', 'en'];
  var DEFAULT_LOCALE = 'ru';
  var STORAGE_KEY = 'ui-lang';
  var FALLBACK_MS = 5000;
  var root = document.documentElement;

  function valid(value) {
    return LOCALES.indexOf(value) !== -1;
  }

  try {
    var requested = new URLSearchParams(window.location.search).get('lang');
    var locale = null;

    if (valid(requested)) {
      locale = requested;
      window.localStorage.setItem(STORAGE_KEY, requested);
    } else {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (valid(stored)) locale = stored;
    }

    if (!locale || locale === DEFAULT_LOCALE) return;

    root.lang = locale;
    root.dataset.localePending = locale;
    // If scripts fail to load, show the page in the default language rather than a loader forever.
    window.setTimeout(function () {
      delete root.dataset.localePending;
    }, FALLBACK_MS);
  } catch (error) {
    void error;
  }
})();
