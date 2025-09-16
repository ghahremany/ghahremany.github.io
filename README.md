# رزومه محمد جواد قهرمانی

یک رزومه مدرن و ریسپانسیو با طراحی حرفه‌ای که به صورت کامل با HTML، CSS و بدون وابستگی خارجی ساخته شده است.

## ویژگی‌ها

- **طراحی مدرن**: استفاده از گرادیانت‌های مدرن و افکت‌های بصری جذاب
- **کاملاً ریسپانسیو**: سازگار با تمام دستگاه‌ها (موبایل، تبلت، دسکتاپ)
- **بدون وابستگی**: تنها به فونت Google Fonts وابسته است
- **قابل چاپ**: بهینه‌سازی شده برای چاپ با کیفیت بالا
- **انیمیشن‌های ظریف**: شامل hover effects، shimmer effects، و انیمیشن‌های CSS
- **طراحی Glassmorphism**: استفاده از backdrop-filter برای افکت‌های شیشه‌ای مدرن

## تکنولوژی‌های استفاده شده

- **HTML5**: ساختار معنایی و دسترسی‌پذیر
- **CSS3**: 
  - CSS Grid و Flexbox برای layout
  - CSS Variables برای مدیریت رنگ‌ها
  - Gradient backgrounds و text effects
  - Custom animations و transitions
  - Responsive design
- **SVG Icons**: آیکون‌های وکتوری با CSS masks

## پالت رنگی

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    --warm-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}
```

## ساختار فایل

```
resume/
│
├── index.html          # فایل اصلی رزومه
└── README.md          # مستندات پروژه
```

## نحوه استفاده

### مشاهده محلی
1. فایل `index.html` را دانلود کنید
2. آن را در مرورگر باز کنید
3. برای چاپ: `Ctrl+P` (Windows) یا `Cmd+P` (Mac)

### تبدیل به PDF
1. در مرورگر فایل را باز کنید
2. `Ctrl+P` یا `Cmd+P` را فشار دهید
3. در بخش Destination گزینه "Save as PDF" را انتخاب کنید
4. تنظیمات:
   - Paper size: A4
   - Margins: Minimum
   - Background graphics: تیک بزنید

### شخصی‌سازی

#### تغییر اطلاعات شخصی
در بخش header فایل HTML:
```html
<h1>نام شما</h1>
<h2>عنوان شغلی شما</h2>
<span>متولد: تاریخ تولد</span>
```

#### تغییر رنگ‌ها
متغیرهای CSS را در ابتدای فایل تغییر دهید:
```css
:root {
    --primary-color: #your-color;
    --accent-color: #your-accent;
}
```

#### اضافه کردن بخش جدید
```html
<div class="section">
    <h3 class="section-title icon icon-your-icon">عنوان بخش</h3>
    <div class="your-content">
        <!-- محتوای شما -->
    </div>
</div>
```

## ویژگی‌های طراحی

### Responsive Breakpoints
- **موبایل**: < 768px - تک ستونه
- **تبلت**: 768px - 1024px - layout تطبیقی  
- **دسکتاپ**: > 1024px - دو ستونه

### افکت‌های بصری
- **Floating Animation**: ذرات شناور در header
- **Shimmer Effect**: افکت درخشان روی skill bars
- **Hover Transitions**: انتقال نرم در hover
- **Glassmorphism**: افکت شیشه‌ای با backdrop-filter

### دسترسی‌پذیری
- Semantic HTML structure
- Proper heading hierarchy
- Alt text برای تصاویر
- High contrast colors
- Keyboard navigation support

## سازگاری مرورگرها

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

> **نکته**: برخی افکت‌های پیشرفته مثل backdrop-filter در مرورگرهای قدیمی‌تر پشتیبانی نمی‌شوند.

## بهینه‌سازی عملکرد

- تنها یک فایل HTML (کمتر از 100KB)
- استفاده از CSS محلی بجای CDN
- بهینه‌سازی انیمیشن‌ها با `will-change`
- استفاده از `transform` بجای تغییر position

## مجوز

این پروژه تحت مجوز MIT قرار دارد. می‌توانید آزادانه از آن استفاده کنید.

## مشارکت

برای بهبود این پروژه:

1. Fork کنید
2. Feature branch ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add amazing feature'`)
4. Branch را push کنید (`git push origin feature/amazing-feature`)
5. Pull Request ایجاد کنید

## تماس

برای سوالات یا پیشنهادات:
- ایمیل: your.email@example.com
- LinkedIn: [پروفایل شما]
- GitHub: [نام کاربری شما]

---

ساخته شده با ❤️ برای جامعه توسعه‌دهندگان ایران
