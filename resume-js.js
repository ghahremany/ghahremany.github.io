// ============================================
// File handling variables
// ============================================
var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};

// Helper function to check if cell is filled
function filledCell(cell) {
    return cell !== '' && cell != null;
}

// Function to load file data
function loadFileData(filename) {
    if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
        try {
            var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];

            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
            var filteredData = jsonData.filter(row => row.some(filledCell));

            var headerRowIndex = filteredData.findIndex((row, index) =>
                row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
            );
            
            if (headerRowIndex === -1 || headerRowIndex > 25) {
                headerRowIndex = 0;
            }

            var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
            csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
            return csv;
        } catch (e) {
            console.error(e);
            return "";
        }
    }
    return gk_fileData[filename] || "";
}

// ============================================
// Skill Bars Animation (Fixed Version)
// ============================================

let skillObserver = null;

// تابع اصلی انیمیشن skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');
    
    // اگر observer قبلی وجود داشت، disconnect کن
    if (skillObserver) {
        skillObserver.disconnect();
    }
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSingleSkillBar(entry.target);
            }
        });
    }, observerOptions);
    
    // Reset و مشاهده همه skill bars
    skillBars.forEach(bar => {
        // ذخیره عرض اصلی در data attribute
        if (!bar.dataset.targetWidth) {
            bar.dataset.targetWidth = bar.style.width;
        }
        bar.style.width = '0%';
        skillObserver.observe(bar);
    });
}

// انیمیت کردن یک skill bar
function animateSingleSkillBar(bar) {
    const targetWidth = bar.dataset.targetWidth || bar.style.width;
    
    bar.style.transition = 'none';
    bar.style.width = '0%';
    
    // Force reflow
    void bar.offsetHeight;
    
    requestAnimationFrame(() => {
        bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        bar.style.width = targetWidth;
    });
}

// Reset کردن skill bars (برای تغییر زبان)
function resetAndAnimateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            animateSingleSkillBar(bar);
        }, index * 80);
    });
}

// ============================================
// Print Button Functionality
// ============================================

function initPrintButton() {
    const printBtn = document.getElementById('printBtn');
    
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });
}

// ============================================
// Mobile Menu
// ============================================

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// ============================================
// Scroll Animations
// ============================================

function addScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    const fadeInOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, fadeInOptions);
    
    sections.forEach(section => {
        fadeInObserver.observe(section);
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// GitHub Projects Integration
// ============================================

const GITHUB_CONFIG = {
    username: 'ghahremany', // 👈 اینجا یوزرنیم گیتهابت رو بنویس
    maxRepos: 5,
    sortBy: 'updated'
};

async function fetchGitHubRepos() {
    const loadingElement = document.getElementById('github-loading');
    const reposContainer = document.getElementById('github-repos');
    const errorElement = document.getElementById('github-error');
    
    if (!loadingElement || !reposContainer) {
        return; // اگر المان‌ها وجود نداشتن، برگرد
    }
    
    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_CONFIG.username}/repos?sort=${GITHUB_CONFIG.sortBy}&per_page=100`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch repos');
        }
        
        const repos = await response.json();
        
        loadingElement.style.display = 'none';
        
        const filteredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, GITHUB_CONFIG.maxRepos);
        
        if (filteredRepos.length === 0) {
            reposContainer.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; font-size: 0.9em;">هنوز پروژه‌ای وجود ندارد</p>';
            return;
        }
        
        reposContainer.innerHTML = filteredRepos.map(repo => createRepoCard(repo)).join('');
        
        const viewAllLink = document.createElement('a');
        viewAllLink.href = `https://github.com/${GITHUB_CONFIG.username}?tab=repositories`;
        viewAllLink.target = '_blank';
        viewAllLink.className = 'github-view-all';
        viewAllLink.setAttribute('data-i18n', 'github-view-all');
        viewAllLink.textContent = getTranslation('github-view-all') || 'مشاهده همه پروژه‌ها →';
        reposContainer.appendChild(viewAllLink);
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        loadingElement.style.display = 'none';
        if (errorElement) errorElement.style.display = 'block';
    }
}

function createRepoCard(repo) {
    const description = repo.description || getTranslation('github-no-description') || 'بدون توضیحات';
    const language = repo.language || 'Unknown';
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    
    return `
        <div class="github-repo" onclick="window.open('${repo.html_url}', '_blank')">
            <div class="github-repo-name">${repo.name}</div>
            <div class="github-repo-description">${description}</div>
            <div class="github-repo-stats">
                ${language !== 'Unknown' ? `<span class="github-language">${language}</span>` : ''}
                ${stars > 0 ? `
                    <span class="github-stat">
                        <span class="github-stat-icon">⭐</span>
                        <span>${stars}</span>
                    </span>
                ` : ''}
                ${forks > 0 ? `
                    <span class="github-stat">
                        <span class="github-stat-icon">🔱</span>
                        <span>${forks}</span>
                    </span>
                ` : ''}
                <span class="github-stat">
                    <span class="github-stat-icon">🔄</span>
                    <span>${formatDate(repo.updated_at)}</span>
                </span>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const currentLang = localStorage.getItem('preferredLanguage') || 'fa';
    
    if (diffDays < 1) {
        return currentLang === 'fa' ? 'امروز' : currentLang === 'ar' ? 'اليوم' : 'Today';
    } else if (diffDays < 7) {
        return currentLang === 'fa' ? `${diffDays} روز پیش` : 
               currentLang === 'ar' ? `منذ ${diffDays} أيام` : 
               `${diffDays}d ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return currentLang === 'fa' ? `${weeks} هفته پیش` : 
               currentLang === 'ar' ? `منذ ${weeks} أسابيع` : 
               `${weeks}w ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return currentLang === 'fa' ? `${months} ماه پیش` : 
               currentLang === 'ar' ? `منذ ${months} أشهر` : 
               `${months}mo ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return currentLang === 'fa' ? `${years} سال پیش` : 
               currentLang === 'ar' ? `منذ ${years} سنوات` : 
               `${years}y ago`;
    }
}

// ============================================
// Multi-Language Support (i18n)
// ============================================

const translations = {
    fa: {
        // Header
        "name": "محمد جواد قهرمانی",
        "title": "مهندس برق",
        "birthdate-label": "متولد:",
        "birthdate": "۱۳۷۱/۶/۲۵",
        "military-status": "وضعیت سربازی: پایان خدمت",
        "summary-title": "خلاصه رزومه",
        "summary": "کارشناس برق قدرت با بیش از 13 سال تجربه در مدیریت زیرساخت فناوری، امنیت سایبری و رهبری تیم‌های فنی. متخصص در راه‌اندازی مراکز داده، مدیریت سرورهای لینوکس و بهبود فرآیندهای ارتباط با مشتری. دارای سابقه موفق در کاهش زمان پاسخگویی و افزایش رضایت مشتری در نقش سرپرستی. به دنبال فرصت‌های چالش‌برانگیز در حوزه IT و برق رهبری تیم‌های تکنولوژی.",
        
        // Contact
        "contact-title": "اطلاعات تماس",
        "email-label": "ایمیل:",
        "phone-label": "موبایل:",
        
        // Skills
        "skills-title": "مهارت‌ها",
        "skill-linux": "سیستم عامل لینوکس",
        "skill-datacenter": "راه‌اندازی مرکز داده",
        "skill-security": "امنیت سایبری (CEH)",
        "skill-mikrotik": "میکروتیک",
        "skill-iot": "اینترنت اشیا (IoT)",
        "skill-crm": "ارتباط با مشتری (CRM)",
        "skill-ai": "هوش مصنوعی",
        "skill-wordpress": "وردپرس",
        "skill-webdesign": "طراحی سایت",
        "skill-mysql": "دیتابیس MySQL",
        "skill-office": "Microsoft Office",
        "social-title": "شبکه‌های اجتماعی",
		
        // Language
        "language-title": "زبان",
        "language-english": "انگلیسی",
        "ielts-score": "آیلتس 7.5",
        "reading-label": "خواندن:",
        "reading-level": "(عالی)",
        "writing-label": "نوشتن:",
        "writing-level": "(خوب)",
        "speaking-label": "گفتاری:",
        "speaking-level": "(خوب)",
        "listening-label": "شنیداری:",
        "listening-level": "(خوب)",
        
        // GitHub
        "github-title": "پروژه‌های GitHub",
        "github-loading": "در حال بارگذاری...",
        "github-error": "خطا در بارگذاری پروژه‌ها",
        "github-no-description": "بدون توضیحات",
        "github-view-all": "مشاهده همه پروژه‌ها →",
        
        // Experience
        "experience-title": "سوابق شغلی",
        "job1-title": " مرکز ارتباط با مشتریان",
        "job1-company": "دیجی پی",
        "job1-date": "مهر ۱۴۰۱ - اکنون | تهران",
        "job1-desc1": "تحلیل و بهبود فرآیندهای تماس با کاربر و کاهش زمان پاسخگویی به مشتریان",
        "job1-desc2": "آموزش و راهنمایی کارشناسان جدید در زمینه بهترین شیوه‌های ارتباط با کاربر",
        "job1-desc3": "پیگیری کاربران ناراضی و تحلیل علت و چگونگی کسب رضایت آنان",
        "job1-desc4": "نظارت بر کیفیت خدمات ارائه شده مرکز به کاربران نهایی",
        "job1-desc5": "افزایش بهره وری تیمی با طراحی سامانه ارتباطی هوشمند جریان های کاری (AI WORKFLOW)",
        
        "job2-title": "پشتیبان فنی",
        "job2-company": "فن آوا",
        "job2-date": "اسفند ۱۳۹۹ - مهر ۱۴۰۱ | تهران",
        "job2-desc1": "تامین و پشتیبانی فنی محصولات نرم‌افزاری و سخت‌افزاری برای مشتریان",
        "job2-desc2": "حل مشکلات فنی مشتریان در کوتاه‌ترین زمان ممکن و افزایش سطح رضایت",
        "job2-desc3": "مشارکت در برگزاری جلسات آموزشی برای کاربران",
        "job2-desc4": "مدیریت و ثبت درخواست‌های پشتیبانی در سیستم‌های مربوطه",
        "job2-desc5": "افزایش بهره وری تیمی با بهبود باز توزیع نقش های تیمی با رویکرد چابک",
        
        "job3-title": "افسر سرباز نیروی زمینی ارتش",
        "job3-company": "افسر سرباز جنگال (فاوا)",
        "job3-date": "اردیبهشت ۱۳۹۶ - آذر ۱۳۹۸ | اصفهان",
        "job3-desc1": "توسعه و پیاده‌سازی ابزارهای امنیت سایبری برای شناسایی تهدیدات",
        "job3-desc2": "مدیریت و نظارت بر عملیات‌های دفاع سایبری و واکنش به حادثه",
        "job3-desc3": "تحلیل نقاط ضعف سیستم‌های اطلاعاتی و پیشنهاد راهکارهای بهبود",
        "job3-desc4": "تدریس و آموزش مباحث امنیت سایبری به اعضای تیم",
        "job3-desc5": "بهبود عملکرد سامانه ارتباطی مرکز به یگان های عملیاتی",
        
        "job4-title": "کارشناس IT",
        "job4-company": "مؤسسه خیریه بیماران خاص",
        "job4-date": "فروردین ۱۳۸۸ - مهر ۱۳۹۲ | تهران",
        "job4-desc1": "پشتیبانی فنی و عیب‌یابی سیستم‌های سخت‌افزاری و نرم‌افزاری برای بیش از ۱۰۰ کاربر",
        "job4-desc2": "طراحی و پیاده‌سازی سیستم‌های تحت وب و پایگاه‌های داده",
        "job4-desc3": "مدیریت و به‌روزرسانی سرورهای شرکت و اطمینان از امنیت اطلاعات",
        "job4-desc4": "آموزش کاربران در زمینه استفاده از نرم‌افزارهای جدید",
        "job4-desc5": "تحلیل نیازهای فناوری اطلاعات سازمان و ارائه راهکارهای نوین",
        
        // Education
        "education-title": "سوابق تحصیلی",
        "edu1-degree": "کارشناسی برق - قدرت",
        "edu1-institution": "موسسه آموزش عالی صائب تبریزی (دولتی)",
        "edu1-date": "۱۳۹۲ - ۱۳۹۶ | زنجان، ابهر",
        "edu1-field": "گرایش: الکتروتکنیک",
        "edu1-gpa": "معدل: ۱۷",
        
        "edu2-degree": "دیپلم برق - قدرت",
        "edu2-institution": "خوجه نصیر طوسی (دولتی)",
        "edu2-date": "۱۳۸۹ - ۱۳۹۲ | تهران، اسلامشهر",
        "edu2-field": "گرایش: الکتروتکنیک",
        "edu2-gpa": "معدل: ۱۸",
        
        // Projects
        "projects-title": "پروژه‌ها",
        "project1-title": "هوشمند سازی و کنترل تحت اینترنت اشیاء",
        "project1-company": "مزرعه سلامتی عمو محسن",
        "project1-date": "تیر ۱۴۰۱",
        
        "project2-title": "راه‌اندازی مرکز کنترل و تماس (VoIP)",
        "project2-company": "فن آوا",
        "project2-date": "اردیبهشت ۱۴۰۱",
        
        "project3-title": "هوشمند سازی مرکز ارتباط با مشتریان فن آوا",
        "project3-company": "فن آوا",
        "project3-date": "اردیبهشت ۱۴۰۱",
        
        // Certificates
        "certificates-title": "دوره‌ها و گواهینامه‌ها",
        "cert1-title": "آموزش هوش مصنوعی مولد و کاربرد در مدیریت پروژه",
        "cert1-institution": "مکتب خونه",
        "cert1-date": "اردیبهشت ۱۴۰۴",
        
        "cert2-title": "آموزش هوش مصنوعی مولد: مبانی مهندسی پرامپت",
        "cert2-institution": "مکتب خونه",
        "cert2-date": "اردیبهشت ۱۴۰۴",
        
        "cert3-title": "آموزش اینترنت اشیا (IoT) در صنعت",
        "cert3-institution": "مکتب خونه",
        "cert3-date": "شهریور ۱۴۰۳",
        
        "cert4-title": "آموزش میکروتیک",
        "cert4-institution": "مکتب خونه",
        "cert4-date": "آبان ۱۴۰۰",
        
        "cert5-title": "مدیریت سرور و امنیت در لینوکس",
        "cert5-institution": "مکتب خونه",
        "cert5-date": "اردیبهشت ۱۳۹۸",
        
        // Honors
        "honors-title": "افتخارات",
        "honor1-title": "افسر نمونه نیروی زمینی ارتش جمهوری اسلامی ایران",
        "honor1-date": "اردیبهشت ۱۳۹۸",
        
        // Footer
        "footer-text": "طراحی و توسعه با",
        "footer-by": "توسط محمد جواد قهرمانی"
    },
    
    en: {
        // Header
        "name": "Mohammad Javad Ghahremani",
        "title": "Electrical Engineer",
        "birthdate-label": "Born:",
        "birthdate": "September 16, 1992",
        "military-status": "Military Service: Completed",
        "summary-title": "Professional Summary",
        "summary": "Power Electrical Engineer with over 13 years of experience in IT infrastructure management, cybersecurity, and technical team leadership. Specialized in data center deployment, Linux server management, and customer relationship process improvement. Proven track record in reducing response time and increasing customer satisfaction in supervisory roles. Seeking challenging opportunities in IT and electrical engineering leadership.",
        
        // Contact
        "contact-title": "Contact Information",
        "email-label": "Email:",
        "phone-label": "Mobile:",
        
        // Skills
        "skills-title": "Skills",
        "skill-linux": "Linux Operating System",
        "skill-datacenter": "Data Center Deployment",
        "skill-security": "Cybersecurity (CEH)",
        "skill-mikrotik": "MikroTik",
        "skill-iot": "Internet of Things (IoT)",
        "skill-crm": "Customer Relationship Management",
        "skill-ai": "Artificial Intelligence",
        "skill-wordpress": "WordPress",
        "skill-webdesign": "Web Design",
        "skill-mysql": "MySQL Database",
        "skill-office": "Microsoft Office",
        "social-title": "Social Media",
		
        // Language
        "language-title": "Languages",
        "language-english": "English",
        "ielts-score": "IELTS 7.5",
        "reading-label": "Reading:",
        "reading-level": "(Excellent)",
        "writing-label": "Writing:",
        "writing-level": "(Good)",
        "speaking-label": "Speaking:",
        "speaking-level": "(Good)",
        "listening-label": "Listening:",
        "listening-level": "(Good)",
        "social-title": "Social Media",
		
        // GitHub
        "github-title": "GitHub Projects",
        "github-loading": "Loading...",
        "github-error": "Error loading projects",
        "github-no-description": "No description",
        "github-view-all": "View All Projects →",
        
        // Experience
        "experience-title": "Work Experience",
        "job1-title": "Customer Contact Center ",
        "job1-company": "DigiPay",
        "job1-date": "Oct 2022 - Present | Tehran",
        "job1-desc1": "Analyzed and improved user contact processes, reducing customer response time",
        "job1-desc2": "Trained and guided new specialists in best customer communication practices",
        "job1-desc3": "Followed up with dissatisfied users, analyzing causes and achieving satisfaction",
        "job1-desc4": "Monitored quality of services provided by the center to end users",
        "job1-desc5": "Increased team productivity by designing intelligent communication workflow system (AI WORKFLOW)",
        
        "job2-title": "Technical Support Specialist",
        "job2-company": "Fanava",
        "job2-date": "Feb 2021 - Oct 2022 | Tehran",
        "job2-desc1": "Provided technical support for software and hardware products to customers",
        "job2-desc2": "Resolved customer technical issues in shortest time, increasing satisfaction levels",
        "job2-desc3": "Participated in organizing training sessions for users",
        "job2-desc4": "Managed and recorded support requests in relevant systems",
        "job2-desc5": "Increased team productivity through improved role redistribution with agile approach",
        
        "job3-title": "Army Ground Forces Cyber Officer",
        "job3-company": "Cyber Officer (FAVA)",
        "job3-date": "May 2017 - Nov 2019 | Isfahan",
        "job3-desc1": "Developed and implemented cybersecurity tools for threat identification",
        "job3-desc2": "Managed and supervised cyber defense operations and incident response",
        "job3-desc3": "Analyzed vulnerabilities in information systems and proposed improvement solutions",
        "job3-desc4": "Taught and trained team members on cybersecurity topics",
        "job3-desc5": "Improved communication system performance from center to operational units",
        
        "job4-title": "IT Specialist",
        "job4-company": "Special Patients Charity Institute",
        "job4-date": "Mar 2009 - Sep 2013 | Tehran",
        "job4-desc1": "Technical support and troubleshooting of hardware and software systems for over 100 users",
        "job4-desc2": "Designed and implemented web-based systems and databases",
        "job4-desc3": "Managed and updated company servers, ensuring information security",
        "job4-desc4": "Trained users on new software applications",
        "job4-desc5": "Analyzed organization's IT needs and provided innovative solutions",
        
        // Education
        "education-title": "Education",
        "edu1-degree": "Bachelor of Electrical Engineering - Power",
        "edu1-institution": "Saeb Tabrizi Higher Education Institute (Public)",
        "edu1-date": "2013 - 2017 | Zanjan, Abhar",
        "edu1-field": "Field: Electrotechnics",
        "edu1-gpa": "GPA: 17/20",

        "edu2-degree": "Diploma in Electrical Engineering - Power",
        "edu2-institution": "Khajeh Nasir Toosi (Public)",
        "edu2-date": "2010 - 2013 | Tehran, Eslamshahr",
        "edu2-field": "Field: Electrotechnics",
        "edu2-gpa": "GPA: 18/20",
        
        // Projects
        "projects-title": "Projects",
        "project1-title": "Automation and Control via Internet of Things",
        "project1-company": "Uncle Mohsen's Health Farm",
        "project1-date": "July 2022",
        
        "project2-title": "Call Center and Control Center Setup (VoIP)",
        "project2-company": "Fanava",
        "project2-date": "May 2022",
        
        "project3-title": "Fanava Customer Contact Center Automation",
        "project3-company": "Fanava",
        "project3-date": "May 2022",
        
        // Certificates
        "certificates-title": "Courses & Certifications",
        "cert1-title": "Generative AI Training and Application in Project Management",
        "cert1-institution": "Maktabkhooneh",
        "cert1-date": "May 2025",
        
        "cert2-title": "Generative AI Training: Prompt Engineering Fundamentals",
        "cert2-institution": "Maktabkhooneh",
        "cert2-date": "May 2025",
        
        "cert3-title": "Internet of Things (IoT) in Industry Training",
        "cert3-institution": "Maktabkhooneh",
        "cert3-date": "Sep 2024",
        
        "cert4-title": "MikroTik Training",
        "cert4-institution": "Maktabkhooneh",
        "cert4-date": "Nov 2021",
        
        "cert5-title": "Linux Server Management and Security",
        "cert5-institution": "Maktabkhooneh",
        "cert5-date": "May 2019",
        
        // Honors
        "honors-title": "Honors & Awards",
        "honor1-title": "Exemplary Officer of the Islamic Republic of Iran Army Ground Forces",
        "honor1-date": "May 2019",
        
        // Footer
        "footer-text": "Designed and Developed with",
        "footer-by": "by Mohammad Javad Ghahremani"
    },
    
    ar: {
        // Header
        "name": "محمد جواد قهرماني",
        "title": "مهندس كهرباء",
        "birthdate-label": "تاريخ الميلاد:",
        "birthdate": "١٦ سبتمبر ١٩٩٢",
        "military-status": "الخدمة العسكرية: مكتملة",
        "summary-title": "الملخص المهني",
        "summary": "مهندس كهرباء طاقة بخبرة تزيد عن 13 عامًا في إدارة البنية التحتية لتكنولوجيا المعلومات والأمن السيبراني وقيادة الفرق التقنية. متخصص في نشر مراكز البيانات وإدارة خوادم لينكس وتحسين عمليات علاقات العملاء. سجل حافل في تقليل وقت الاستجابة وزيادة رضا العملاء في الأدوار الإشرافية. أبحث عن فرص تحدي في مجال تكنولوجيا المعلومات والهندسة الكهربائية القيادية.",
        
        // Contact
        "contact-title": "معلومات الاتصال",
        "email-label": "البريد الإلكتروني:",
        "phone-label": "الجوال:",
        
        // Skills
        "skills-title": "المهارات",
        "skill-linux": "نظام التشغيل لينكس",
        "skill-datacenter": "نشر مركز البيانات",
        "skill-security": "الأمن السيبراني (CEH)",
        "skill-mikrotik": "ميكروتيك",
        "skill-iot": "إنترنت الأشياء (IoT)",
        "skill-crm": "إدارة علاقات العملاء",
        "skill-ai": "الذكاء الاصطناعي",
        "skill-wordpress": "ووردبريس",
        "skill-webdesign": "تصميم المواقع",
        "skill-mysql": "قاعدة بيانات MySQL",
        "skill-office": "Microsoft Office",
        
        // Language
        "language-title": "اللغات",
        "language-english": "الإنجليزية",
        "ielts-score": "IELTS 7.5",
        "reading-label": "القراءة:",
        "reading-level": "(ممتاز)",
        "writing-label": "الكتابة:",
        "writing-level": "(جيد)",
        "speaking-label": "المحادثة:",
        "speaking-level": "(جيد)",
        "listening-label": "الاستماع:",
        "listening-level": "(جيد)",
        "social-title": "وسائل التواصل الاجتماعي",
		
        // GitHub
        "github-title": "مشاريع GitHub",
        "github-loading": "جاري التحميل...",
        "github-error": "خطأ في تحميل المشاريع",
        "github-no-description": "بدون وصف",
        "github-view-all": "عرض جميع المشاريع ←",
        
        // Experience
        "experience-title": "الخبرة العملية",
        "job1-title": "مشرف مركز اتصالات العملاء",
        "job1-company": "ديجي باي",
        "job1-date": "أكتوبر ٢٠٢٢ - الآن | طهران",
        "job1-desc1": "تحليل وتحسين عمليات الاتصال بالمستخدمين وتقليل وقت استجابة العملاء",
        "job1-desc2": "تدريب وتوجيه المتخصصين الجدد في أفضل ممارسات التواصل مع العملاء",
        "job1-desc3": "متابعة المستخدمين غير الراضين وتحليل الأسباب وتحقيق الرضا",
        "job1-desc4": "مراقبة جودة الخدمات المقدمة من المركز للمستخدمين النهائيين",
        "job1-desc5": "زيادة إنتاجية الفريق من خلال تصميم نظام سير عمل اتصالات ذكي (AI WORKFLOW)",
        
        "job2-title": "أخصائي دعم فني",
        "job2-company": "فن آفا",
        "job2-date": "فبراير ٢٠٢١ - أكتوبر ٢٠٢٢ | طهران",
        "job2-desc1": "توفير الدعم الفني لمنتجات البرامج والأجهزة للعملاء",
        "job2-desc2": "حل المشاكل الفنية للعملاء في أقصر وقت ممكن وزيادة مستويات الرضا",
        "job2-desc3": "المشاركة في تنظيم دورات تدريبية للمستخدمين",
        "job2-desc4": "إدارة وتسجيل طلبات الدعم في الأنظمة ذات الصلة",
        "job2-desc5": "زيادة إنتاجية الفريق من خلال تحسين إعادة توزيع الأدوار بنهج رشيق",
        
        "job3-title": "ضابط أمن سيبراني في القوات البرية",
        "job3-company": "ضابط الأمن السيبراني (FAVA)",
        "job3-date": "مايو ٢٠١٧ - نوفمبر ٢٠١٩ | أصفهان",
        "job3-desc1": "تطوير وتنفيذ أدوات الأمن السيبراني لتحديد التهديدات",
        "job3-desc2": "إدارة والإشراف على عمليات الدفاع السيبراني والاستجابة للحوادث",
        "job3-desc3": "تحليل نقاط الضعف في أنظمة المعلومات واقتراح حلول التحسين",
        "job3-desc4": "تدريس وتدريب أعضاء الفريق على موضوعات الأمن السيبراني",
        "job3-desc5": "تحسين أداء نظام الاتصالات من المركز إلى الوحدات التشغيلية",
        
        "job4-title": "أخصائي تكنولوجيا المعلومات",
        "job4-company": "معهد المرضى الخاصين الخيري",
        "job4-date": "مارس ٢٠٠٩ - سبتمبر ٢٠١٣ | طهران",
        "job4-desc1": "الدعم الفني واستكشاف الأخطاء في أنظمة الأجهزة والبرامج لأكثر من 100 مستخدم",
        "job4-desc2": "تصميم وتنفيذ أنظمة قائمة على الويب وقواعد البيانات",
        "job4-desc3": "إدارة وتحديث خوادم الشركة وضمان أمن المعلومات",
        "job4-desc4": "تدريب المستخدمين على تطبيقات البرامج الجديدة",
        "job4-desc5": "تحليل احتياجات تكنولوجيا المعلومات للمنظمة وتقديم حلول مبتكرة",
        
        // Education
        "education-title": "التعليم",
        "edu1-degree": "بكالوريوس الهندسة الكهربائية - الطاقة",
        "edu1-institution": "معهد صائب تبريزي للتعليم العالي (حكومي)",
        "edu1-date": "٢٠١٣ - ٢٠١٧ | زنجان، أبهر",
        "edu1-field": "التخصص: الكهروتقنية",
        "edu1-gpa": "المعدل: 17/20",
        
        "edu2-degree": "دبلوم الهندسة الكهربائية - الطاقة",
        "edu2-institution": "خواجة نصير الطوسي (حكومي)",
        "edu2-date": "٢٠١٠ - ٢٠١٣ | طهران، إسلام شهر",
        "edu2-field": "التخصص: الكهروتقنية",
        "edu2-gpa": "المعدل: 18/20",
        
        // Projects
        "projects-title": "المشاريع",
        "project1-title": "الأتمتة والتحكم عبر إنترنت الأشياء",
        "project1-company": "مزرعة العم محسن الصحية",
        "project1-date": "يوليو ٢٠٢٢",
        
        "project2-title": "إعداد مركز الاتصال والتحكم (VoIP)",
        "project2-company": "فن آفا",
        "project2-date": "مايو ٢٠٢٢",
        
        "project3-title": "أتمتة مركز اتصالات العملاء في فن آفا",
        "project3-company": "فن آفا",
        "project3-date": "مايو ٢٠٢٢",
        
        // Certificates
        "certificates-title": "الدورات والشهادات",
        "cert1-title": "تدريب الذكاء الاصطناعي التوليدي وتطبيقه في إدارة المشاريع",
        "cert1-institution": "مكتب خونه",
        "cert1-date": "مايو ٢٠٢٥",
        
        "cert2-title": "تدريب الذكاء الاصطناعي التوليدي: أساسيات هندسة المطالبات",
        "cert2-institution": "مكتب خونه",
        "cert2-date": "مايو ٢٠٢٥",
        
        "cert3-title": "تدريب إنترنت الأشياء (IoT) في الصناعة",
        "cert3-institution": "مكتب خونه",
        "cert3-date": "سبتمبر ٢٠٢٤",
        
        "cert4-title": "تدريب ميكروتيك",
        "cert4-institution": "مكتب خونه",
        "cert4-date": "نوفمبر ٢٠٢١",
        
        "cert5-title": "إدارة خادم لينكس والأمان",
        "cert5-institution": "مكتب خونه",
        "cert5-date": "مايو ٢٠١٩",
        
        // Honors
        "honors-title": "الجوائز والتكريمات",
        "honor1-title": "ضابط مثالي في القوات البرية للجيش الجمهورية الإسلامية الإيرانية",
        "honor1-date": "مايو ٢٠١٩",
        
        // Footer
        "footer-text": "تم التصميم والتطوير بـ",
        "footer-by": "بواسطة محمد جواد قهرماني"
    }
};

// Language settings
let currentLang = 'fa';

// Helper function to get translation
function getTranslation(key) {
    return translations[currentLang] && translations[currentLang][key];
}

// Function to change language
function changeLanguage(lang) {
    currentLang = lang;
    
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    
    if (lang === 'ar' || lang === 'fa') {
		        html.setAttribute('dir', 'rtl');
        document.body.setAttribute('dir', 'rtl');
    } else {
        html.setAttribute('dir', 'ltr');
        document.body.setAttribute('dir', 'ltr');
    }
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // Update document title
    const titles = {
        fa: 'رزومه محمد جواد قهرمانی',
        en: 'Mohammad Javad Ghahremani - Resume',
        ar: 'السيرة الذاتية - محمد جواد قهرماني'
    };
    document.title = titles[lang];
    
    // Re-animate skill bars after language change
    setTimeout(() => {
        resetAndAnimateSkillBars();
    }, 200);
}

// Initialize language switcher
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // Load saved language preference or default to Persian
    const savedLang = localStorage.getItem('preferredLanguage') || 'fa';
    changeLanguage(savedLang);
}

// ============================================
// Main Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Resume initialized');
    
    // Initialize language switcher first
    initLanguageSwitcher();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize print button
    initPrintButton();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Add scroll animations
    addScrollAnimations();
    
    // Animate skill bars with delay
    setTimeout(() => {
        animateSkillBars();
    }, 300);
    
    // Fetch GitHub repos if the section exists
    if (document.getElementById('github-repos')) {
        fetchGitHubRepos();
    }
});

// If document is already loaded
if (document.readyState !== 'loading') {
    console.log('🚀 Resume already loaded');
    
    initLanguageSwitcher();
    initSmoothScroll();
    initPrintButton();
    initMobileMenu();
    
    setTimeout(() => {
        animateSkillBars();
        addScrollAnimations();
    }, 300);
    
    if (document.getElementById('github-repos')) {
        fetchGitHubRepos();
    }
}

// Log for debugging
console.log('✅ Resume JavaScript loaded successfully');
