/* ═══════════════════════════════════════════════════════════════
   🌐 پشتیبانی هوشمند سایت — Cloudflare Worker
   ─────────────────────────────────────────────────────────────
   این فایل را در Cloudflare Workers کپی کنید (راهنمای گام‌به‌گام در README-worker.md)
   متغیرهای محیطی لازم (Settings → Variables):
     GROQ_KEY   = کلید Groq (به‌صورت Secret ذخیره کنید)
   اختیاری:
     KB_URL     = آدرس فایل دانشنامه (پیش‌فرض: site-kb.md همین مخزن)
   ═══════════════════════════════════════════════════════════════ */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const DEFAULT_KB = 'https://raw.githubusercontent.com/ghahremany/ghahremany.github.io/main/site-kb.md';

const SYS = `تو «دستیار سایت» محمد جواد قهرمانی هستی — سایت شخصی و رزومهٔ او (ghahremany.github.io).
فقط و فقط بر اساس «دانشنامهٔ سایت» که در پیام کاربر می‌آید پاسخ بده.
اگر پاسخ در دانشنامه نبود، فقط کلمهٔ UNKNOWN را بنویس و هیچ توضیحی اضافه نکن.
قواعد: پاسخ کوتاه (حداکثر ۵ خط)، فارسی محاوره‌ای و محترمانه، ایموجی کم و به‌جا.
هرگز اطلاعاتی که در دانشنامه نیست از خودت نساز (شماره، آدرس، قیمت، وعدهٔ زمانی).
هرگز اطلاعات خصوصی (آدرس خانه، کد ملی و…) را اعلام نکن.
اگر سؤال دربارهٔ محصولات «یار» بود، به سایت negahbanyar.xo.je راهنمایی کن.
خودت را «دستیار سایت» معرفی کن.`;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  });
}

async function getKb(env) {
  const url = env.KB_URL || DEFAULT_KB;
  try {
    const r = await fetch(url, { cf: { cacheTtl: 300, cacheEverything: true } });
    if (r.ok) return await r.text();
  } catch (e) { /* ignore */ }
  return '';
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (req.method !== 'POST') return json({ ok: false, err: 'method' }, 405);

    let q = '';
    try {
      const ct = req.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        q = (await req.json()).q || '';
      } else {
        q = new URLSearchParams(await req.text()).get('q') || '';
      }
    } catch (e) { /* ignore */ }
    q = (q || '').trim().slice(0, 500);
    if (!q) return json({ ok: false, err: 'empty' });
    if (!env.GROQ_KEY) return json({ ok: false, err: 'nokey' });

    const kb = await getKb(env);

    const body = {
      model: 'openai/gpt-oss-120b',
      temperature: 0.25,
      max_tokens: 500,
      messages: [
        { role: 'system', content: SYS },
        { role: 'user', content: '### دانشنامهٔ سایت:\n' + kb + '\n\n### سؤال بازدیدکننده:\n' + q },
      ],
    };

    let r;
    try {
      r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + env.GROQ_KEY,
          'Content-Type': 'application/json',
          'User-Agent': 'okhttp/4.9.3',
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      return json({ ok: false, err: 'ai' });
    }
    if (!r.ok) return json({ ok: false, err: 'ai' });
    const d = await r.json();
    const ans = (((d.choices || [])[0] || {}).message || {}).content || '';
    const t = ans.trim();
    if (!t || t.toUpperCase().includes('UNKNOWN')) return json({ ok: false, err: 'unknown' });
    return json({ ok: true, answer: t.slice(0, 1200) });
  },
};
