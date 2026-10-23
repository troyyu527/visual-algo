// Registers the service worker that makes VisualAlgo work offline.
//
// Every path is resolved against this script's own URL rather than the site
// root. That keeps registration correct both at the domain root and under a
// project sub-path such as /visual-algo/, and from pages at any folder depth.
(function () {
  if (!('serviceWorker' in navigator)) return;

  // currentScript is only readable while this file is being parsed, so capture
  // it now — it is null by the time the load handler runs.
  var script = document.currentScript;
  if (!script) return;
  var swUrl = new URL('../sw.js', script.src).href;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register(swUrl).catch(function () {
      console.info('VisualAlgo service worker registration skipped.');
    });
  });
})();
