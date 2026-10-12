# 🚀 راه‌اندازی پشتیبانی هوشمند سایت (۵ دقیقه)

این Worker باعث می‌شود دکمهٔ پشتیبانی سایت **داخل همان صفحه** باز شود (بدون پنجرهٔ جدا).

## گام‌ها

۱. برو به **[dash.cloudflare.com](https://dash.cloudflare.com/sign-up)** و با ایمیل یا گوگل ثبت‌نام کن (رایگان، بدون کارت بانکی).
۲. از منوی چپ: **Workers & Pages** → دکمهٔ **Create** → **Create Worker**.
۳. یک نام بده (مثلاً `site-ai`) → **Deploy**.
۴. روی **Edit code** بزن → کل محتوای فایل `worker/site-ai.js` را جای‌گزین کن → **Deploy**.
۵. برگرد به صفحهٔ Worker → **Settings** → **Variables and Secrets**:
   - **Add** → Type: **Secret** → Name: `GROQ_KEY` → Value: کلید Groq را بگذار → **Save**
   - (اختیاری) Variable با نام `KB_URL` اگر خواستی دانشنامه جای دیگری باشد.
۶. آدرس Worker را کپی کن (مثل `https://site-ai.<your-name>.workers.dev`) و برای من بفرست
   تا در سایت وصلش کنم.

## تست

```bash
curl -X POST https://site-ai.<your-name>.workers.dev -d "q=سلام، شما کی هستید؟"
```

باید پاسخ JSON با `{"ok":true,"answer":"..."}` برگردد.

## دانشنامه

متن دانشنامه در فایل **`site-kb.md`** همین مخزن است؛ هر ویرایشی روی آن، حداکثر ۵ دقیقه بعد در پاسخ‌ها اعمال می‌شود (کش Worker).
