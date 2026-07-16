(function () {
  try {
    var stored = window.localStorage.getItem('ui-theme');
    if (stored === 'blueprint' || stored === 'barely-there') {
      document.documentElement.dataset.theme = stored;
    }
  } catch (error) {
    void error;
  }
})();
