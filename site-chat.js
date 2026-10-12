/* 🌐 دستیار هوشمند سایت — ویجت پشتیبانی
   ظاهر هم‌سان قبلی (دکمهٔ گرد قرمز) ولی محتوا از سرور خودمان می‌آید:
   https://negahbanyar.xo.je/widget.html  (هوش مصنوعی + دانشنامهٔ سایت)
   چرا iframe؟ چون هاست، درخواست‌های بین‌دامنه‌ای را با چالش امنیتی رد می‌کند؛
   داخل iframe همه‌چیز هم‌دامنه است و چالش خودکار حل می‌شود. */
(function () {
  var SRC = 'https://negahbanyar.xo.je/widget.html';
  var SMALL = 64, WIDE = 400, TALL = 600;

  var f = document.createElement('iframe');
  f.id = 'nyFrame';
  f.src = SRC;
  f.title = 'پشتیبانی هوشمند';
  f.setAttribute('allowtransparency', 'true');
  f.setAttribute('loading', 'lazy');
  f.style.cssText = 'position:fixed;bottom:22px;right:22px;width:' + SMALL + 'px;height:' + SMALL + 'px;' +
    'border:0;z-index:99999;border-radius:50%;overflow:hidden;background:transparent;' +
    'transition:width .22s ease,height .22s ease,border-radius .22s ease;' +
    'box-shadow:0 10px 26px rgba(231,66,102,.35)';
  document.body.appendChild(f);

  function size(open) {
    var w = Math.min(WIDE, window.innerWidth - 32);
    var h = Math.min(TALL, window.innerHeight - 120);
    f.style.width = (open ? w : SMALL) + 'px';
    f.style.height = (open ? h : SMALL) + 'px';
    f.style.borderRadius = open ? '18px' : '50%';
    f.style.boxShadow = open ? '0 24px 60px rgba(10,30,45,.28)' : '0 10px 26px rgba(231,66,102,.35)';
    try { f.contentWindow.postMessage({ ny: open ? 'opened' : 'closed' }, '*'); } catch (e) {}
  }
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.ny === 'open') size(true);
    else if (d.ny === 'close') size(false);
  });
  window.addEventListener('resize', function () {
    if (f.style.borderRadius === '18px') size(true);
  });
})();
