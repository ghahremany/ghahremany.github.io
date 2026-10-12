/* 🌐 دستیار هوشمند سایت — ویجت پشتیبانی داخلی
   دکمهٔ گرد قرمز (#E74266) + پنجرهٔ کوچک چت در همان صفحه.
   پاسخ‌ها از Cloudflare Worker می‌آید (هوش مصنوعی + دانشنامهٔ site-kb.md).
   تا وقتی WORKER خالی باشد، چت در پنجرهٔ هم‌دامنهٔ سرور باز می‌شود. */
(function () {
  var WORKER = '';                                   // ← آدرس Worker اینجا گذاشته می‌شود
  var FALLBACK = 'https://negahbanyar.xo.je/widget.html';
  var TITLE = 'سلام! 👋';
  var SUB = 'من دستیار هوشمند مهندس قهرمانی هستم!';
  var PH = 'سوال یا درخواست خود را بپرسید...';

  var css = document.createElement('style');
  css.textContent = `
  #nyBtn{position:fixed;bottom:22px;right:22px;width:64px;height:64px;border-radius:50%;background:#E74266;color:#fff;
    border:0;cursor:pointer;box-shadow:0 10px 26px rgba(231,66,102,.45);z-index:99998;display:grid;place-items:center;
    font-size:28px;transition:opacity .22s ease,transform .22s ease,box-shadow .18s}
  #nyBtn.hide{opacity:0;transform:scale(.5);pointer-events:none}
  #nyBtn:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 14px 32px rgba(231,66,102,.55)}
  #nyWin{position:fixed;bottom:22px;right:22px;width:380px;max-width:calc(100vw - 32px);height:540px;max-height:calc(100vh - 130px);
    background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(10,30,45,.28);z-index:99999;display:none;
    flex-direction:column;overflow:hidden;direction:rtl;font-family:Tahoma,system-ui,sans-serif}
  #nyWin.on{display:flex}
  #nyHd{background:linear-gradient(135deg,#E74266,#c62f52);color:#fff;padding:15px 18px;position:relative}
  #nyHd h3{margin:0;font-size:16px;font-weight:800}
  #nyHd p{margin:5px 0 0;font-size:12px;opacity:.92}
  #nyX{position:absolute;top:12px;left:12px;width:28px;height:28px;border:0;border-radius:50%;background:rgba(255,255,255,.2);
    color:#fff;font-size:15px;cursor:pointer;line-height:1}
  #nyMsgs{flex:1;overflow-y:auto;padding:14px;background:#F7F9FB;display:flex;flex-direction:column;gap:9px}
  .nyM{max-width:84%;padding:10px 13px;border-radius:14px;font-size:13px;line-height:1.9;white-space:pre-wrap;word-break:break-word}
  .nyBot{background:#fff;color:#17313f;border:1px solid #e6eef3;align-self:flex-start;border-top-right-radius:5px}
  .nyMe{background:#12B5A5;color:#fff;align-self:flex-end;border-top-left-radius:5px}
  .nyErr{background:#FFF1F1;color:#c0392b;border:1px solid #ffd9d9;align-self:flex-start;font-size:12px}
  #nyTyp{align-self:flex-start;background:#fff;border:1px solid #e6eef3;border-radius:14px;padding:11px 14px;display:none;gap:4px}
  #nyTyp.on{display:flex}
  #nyTyp i{width:7px;height:7px;border-radius:50%;background:#E74266;display:block;animation:nyb 1.2s infinite}
  #nyTyp i:nth-child(2){animation-delay:.2s} #nyTyp i:nth-child(3){animation-delay:.4s}
  @keyframes nyb{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
  #nyBar{display:flex;gap:8px;padding:11px;border-top:1px solid #eef3f7;background:#fff}
  #nyIn{flex:1;border:1px solid #dbe6ee;border-radius:22px;padding:11px 15px;font-size:13px;font-family:inherit;outline:none;color:#17313f;background:#fff}
  #nyIn:focus{border-color:#E74266}
  #nySd{width:44px;height:44px;border:0;border-radius:50%;background:#E74266;color:#fff;font-size:18px;cursor:pointer}
  #nySd:disabled{opacity:.5}
  body.dark #nyWin{background:#16222b} body.dark #nyMsgs{background:#101a21}
  body.dark .nyBot{background:#1d2b35;color:#dfeaf1;border-color:#26363f}
  body.dark #nyBar{background:#16222b;border-color:#22323c}
  body.dark #nyIn{background:#1d2b35;color:#dfeaf1;border-color:#2a3b46}
  @media(max-width:480px){#nyWin{right:10px;left:10px;width:auto;bottom:92px}}
  `;
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.id = 'nyBtn'; btn.type = 'button'; btn.title = 'پشتیبانی'; btn.innerHTML = '💬';
  var win = document.createElement('div');
  win.id = 'nyWin';
  win.innerHTML = '<div id="nyHd"><h3>' + TITLE + '</h3><p>' + SUB + '</p><button id="nyX" type="button" title="بستن">✕</button></div>' +
    '<div id="nyMsgs"></div><div id="nyTyp"><i></i><i></i><i></i></div>' +
    '<div id="nyBar"><input id="nyIn" type="text" placeholder="' + PH + '" autocomplete="off"><button id="nySd" type="button">➤</button></div>';
  document.body.appendChild(btn); document.body.appendChild(win);

  var msgs = win.querySelector('#nyMsgs'), inp = win.querySelector('#nyIn'),
      sd = win.querySelector('#nySd'), typ = win.querySelector('#nyTyp');

  function add(t, c) {
    var d = document.createElement('div'); d.className = 'nyM ' + c; d.textContent = t;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
  }
  function open() {
    win.classList.add('on');
    btn.classList.add('hide');            // 🔴 دکمه محو می‌شود
    if (!msgs.children.length) { add(TITLE, 'nyBot'); add('چطور می‌تونم کمکتون کنم؟', 'nyBot'); }
    setTimeout(function () { inp.focus(); }, 220);
  }
  function close() {
    win.classList.remove('on');
    btn.classList.remove('hide');         // 🔴 دکمه برمی‌گردد
  }
  btn.addEventListener('click', function () {
    if (win.classList.contains('on')) close(); else open();
  });
  win.querySelector('#nyX').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && win.classList.contains('on')) close(); });

  function fallbackWindow() {
    var W = Math.min(440, window.innerWidth - 20), H = Math.min(680, window.innerHeight - 20);
    var w = window.open(FALLBACK, 'nySupport',
      'width=' + W + ',height=' + H + ',menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes');
    if (!w) window.location.href = FALLBACK;
  }

  function ask() {
    var q = (inp.value || '').trim(); if (!q) return;
    inp.value = ''; add(q, 'nyMe'); sd.disabled = true; typ.classList.add('on'); msgs.scrollTop = msgs.scrollHeight;
    if (!WORKER) {                       // واسط تنظیم نشده → پنجرهٔ سرور
      typ.classList.remove('on'); sd.disabled = false;
      add('برای پاسخ هوشمند، پنجرهٔ گفتگو باز می‌شود…', 'nyBot');
      fallbackWindow(); return;
    }
    fetch(WORKER, { method: 'POST', body: new URLSearchParams({ q: q }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        typ.classList.remove('on'); sd.disabled = false;
        if (d && d.ok && d.answer) add(d.answer, 'nyBot');
        else if (d && d.err === 'unknown') add('پاسخ این سؤال در دانشنامهٔ من نیست 🙏\nبرای پاسخ دقیق‌تر تماس بگیرید:\n📧 ghahremany.mj@gmail.com\n📱 ۰۹۱۲۷۲۸۵۰۶۵', 'nyErr');
        else add('الان نتونستم پاسخ بدم 🙏 کمی بعد تلاش کنید یا ایمیل بزنید: ghahremany.mj@gmail.com', 'nyErr');
      })
      .catch(function () {
        typ.classList.remove('on'); sd.disabled = false;
        add('ارتباط برقرار نشد 🙏 لطفاً بعداً تلاش کنید یا ایمیل بزنید: ghahremany.mj@gmail.com', 'nyErr');
      });
  }
  sd.addEventListener('click', ask);
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') ask(); });
})();
