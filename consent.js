/* The Collect — cookie / analytics consent gate.
   Privacy-first: GA4 (and any Meta Pixel added later) loads ONLY after the
   visitor accepts. Nothing analytics-related contacts a third party until then.
   Choice is remembered in localStorage ('tc_consent' = granted | denied). */
(function () {
  var KEY = 'tc_consent';
  var GA_ID = 'G-G6TJ65YJPM';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { dataLayer.push(arguments); };

  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  function loadAnalytics() {
    if (window.__tcAnalytics) return;
    window.__tcAnalytics = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    /* Meta Pixel init belongs here when it's added — same consent gate. */
  }

  function removeBanner() {
    var b = document.getElementById('tc-consent');
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function showBanner() {
    var wrap = document.createElement('div');
    wrap.id = 'tc-consent';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Cookie consent');
    wrap.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:680px;margin:0 auto;background:#0d170f;color:#eaf2ec;border:1px solid rgba(212,175,55,.35);border-radius:14px;box-shadow:0 14px 40px rgba(0,0,0,.5);padding:16px 18px;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;display:flex;gap:14px;flex-wrap:wrap;align-items:center;justify-content:space-between';
    wrap.innerHTML =
      '<div style="flex:1;min-width:220px">We use analytics cookies to understand how the site is used — nothing more, and never for third-party advertising. <a href="privacy.html" style="color:#F0D078;text-decoration:underline">Privacy Policy</a>.</div>' +
      '<div style="display:flex;gap:10px;flex-shrink:0">' +
        '<button type="button" data-decline style="cursor:pointer;background:transparent;color:#eaf2ec;border:1px solid rgba(255,255,255,.25);border-radius:9px;padding:9px 16px;font-weight:700;font-size:13.5px">Decline</button>' +
        '<button type="button" data-accept style="cursor:pointer;background:#D4AF37;color:#1a1403;border:0;border-radius:9px;padding:9px 18px;font-weight:800;font-size:13.5px">Accept</button>' +
      '</div>';
    document.body.appendChild(wrap);
    wrap.querySelector('[data-accept]').addEventListener('click', function () {
      store('granted'); loadAnalytics(); removeBanner();
    });
    wrap.querySelector('[data-decline]').addEventListener('click', function () {
      store('denied'); removeBanner();
    });
  }

  function init() {
    var c = read();
    if (c === 'granted') loadAnalytics();
    else if (c === 'denied') { /* stay off */ }
    else showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
