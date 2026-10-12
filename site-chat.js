/* 🌐 دستیار هوشمند سایت — دکمهٔ پشتیبانی
   ظاهر هم‌سان قبلی (دایرهٔ قرمز #E74266) ولی محتوا از سرور خودمان می‌آید.
   نکتهٔ فنی: هاست، درخواست‌های بین‌دامنه‌ای را با چالش امنیتی (AES) رد می‌کند و
   کوکی چالش در iframe (شخص‌ثالث) توسط مرورگر بلاک می‌شود؛ پس چت در یک پنجرهٔ
   هم‌دامنه باز می‌شود که چالش خودکار حل شود. */
(function () {
  var URL = 'https://negahbanyar.xo.je/widget.html';
  var SMALL = 64;

  var b = document.createElement('button');
  b.id = 'nyBtn';
  b.type = 'button';
  b.title = 'پشتیبانی هوشمند';
  b.setAttribute('aria-label', 'پشتیبانی هوشمند');
  b.innerHTML = '💬';
  b.style.cssText = 'position:fixed;bottom:22px;right:22px;width:' + SMALL + 'px;height:' + SMALL + 'px;' +
    'border-radius:50%;border:0;background:#E74266;color:#fff;font-size:28px;cursor:pointer;z-index:99999;' +
    'display:grid;place-items:center;box-shadow:0 10px 26px rgba(231,66,102,.45);' +
    'transition:transform .18s,box-shadow .18s';
  b.addEventListener('mouseenter', function () {
    b.style.transform = 'translateY(-2px) scale(1.04)';
    b.style.boxShadow = '0 14px 32px rgba(231,66,102,.55)';
  });
  b.addEventListener('mouseleave', function () {
    b.style.transform = 'none';
    b.style.boxShadow = '0 10px 26px rgba(231,66,102,.45)';
  });

  var w = null;
  b.addEventListener('click', function () {
    var W = Math.min(440, window.innerWidth - 20);
    var H = Math.min(680, window.innerHeight - 20);
    var left = Math.max(0, window.screenX + window.innerWidth - W - 30);
    var top = Math.max(0, window.screenY + 60);
    var feat = 'width=' + W + ',height=' + H + ',left=' + left + ',top=' + top +
               ',menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes';
    if (w && !w.closed) { w.focus(); return; }
    w = window.open(URL, 'nySupport', feat);
    if (!w) window.location.href = URL;   // اگر پاپ‌آپ بلاک شد، همان صفحه باز شود
  });

  document.body.appendChild(b);
})();
