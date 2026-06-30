// متن tooltipها («!») — docs/05. دوزبانه (fa/en). از content/fa/index با کلید خوانده می‌شود.
import type { Locale } from '@/lib/i18n/locale';

const fa = {
  // ماژول ۱ — موتور هزینه و MAR
  'mar.direct':
    'هزینه‌های مستقیم سالانه: حقوق پایه‌ی شما/کارمندان، هاست پروژه‌ها و لایسنس‌های اختصاصی. یعنی پولی که مستقیماً صرف «انجام کار» می‌شود.',
  'mar.overhead':
    'سربار سالانه: هزینه‌هایی که به یک پروژه‌ی خاص وصل نیستند ولی لازم‌اند؛ اجاره، نرم‌افزارها (فیگما/اسلک/آسانا)، بیمه، حسابداری، بازاریابی.',
  'mar.profit':
    'هدف سود خالص: سودی که می‌خواهید بعد از همه‌ی هزینه‌ها (و حتی حقوق خودتان) باقی بماند. این «دستمزد» نیست، «سود» است.',
  'mar.weeks':
    'هفته‌های کاری واقعی در سال. با کسر مرخصی و تعطیلات معمولاً حدود ۴۸ هفته است، نه ۵۲.',
  'mar.hoursPerWeek': 'ساعات کاری در هفته. مبنای محاسبه، نه لزوماً ساعات حضور.',
  'mar.utilization':
    'نرخ بهره‌وری: چه کسری از ساعات کاری واقعاً به مشتری فاکتور می‌شود. زمان ایمیل، مذاکره، مدیریت و بازاریابی فاکتور نمی‌شود. واقع‌بینانه: ۰٫۵۵ تا ۰٫۷۰. فرض ۱٫۰ «اشتباه مرگبار» است.',
  'mar.result':
    'حداقل نرخ قابل‌قبول (MAR): کفِ مطلق نرخ ساعتی شما. پایین‌تر از این عدد، در حال ضرر دادن هستید حتی اگر حس کنید درآمد دارید.',
  'mar.overheadRatio':
    'نسبت سربار = سربار ÷ هزینه‌ی مستقیم. محک سالم آژانس: ۴۰٪ تا ۸۰٪. بالای ۱۰۰٪ یعنی ساختار بیش از حد سنگین شده.',

  // ماژول ۲ — قیمت‌گذاری وب/وردپرس
  'web.rateSource':
    'نرخ پایه: می‌توانید از MAR محاسبه‌شده‌ی خودتان استفاده کنید یا یک نرخ بازار دستی وارد کنید.',
  'web.hours':
    'تخمین ساعت کل پروژه. می‌توانید از «جدول طلایی ویژگی‌ها» یک ردیف انتخاب کنید تا ساعت و ضریب پیشنهادی خودکار پر شود.',
  'web.cm':
    'ضریب پیچیدگی فنی (CM): ساده=۱٫۰، متوسط=۱٫۳–۱٫۵، پیچیده=۱٫۶–۲٫۰، بسیار پیچیده=۲٫۱–۲٫۵. هرچه منطق فنی و یکپارچه‌سازی بیشتر، عدد بالاتر.',
  'web.rb':
    'بافر ریسک (RB): برای پوشش عدم‌قطعیت. هر موردی که صدق می‌کند را تیک بزنید؛ درصدها جمع می‌شوند (مثلاً Brief مبهم ۱۵٪ + اولین پروژه از این نوع ۲۰٪ = ۳۵٪).',
  'web.builder':
    'معماری ساخت: Page Builder استاندارد سریع‌تر ولی کد اضافه‌تر؛ تم سفارشی کنترل و عملکرد بالاتر ولی زمان بیشتر. روی قیمت اثر می‌گذارد.',
  'web.maintenance':
    'برای کد سفارشی، یک بند «نگهداری سالانه» معادل ۱۵٪–۲۰٪ هزینه‌ی ساخت پیشنهاد دهید؛ هم ریسک را پوشش می‌دهد هم درآمد مکرر می‌سازد.',
  'web.cwv':
    'اگر مشتری به سرعت و سئو حساس است، «بهینه‌سازی عملکرد» را جدا قیمت دهید: معمولاً ۱۰٪–۱۵٪ کل بودجه.',
  'web.multilang': 'برای هر زبان اضافه، حدود ۲۰٪ به ساعت پایه‌ی همان بخش اضافه کنید.',
  'web.tiers':
    'ارائه‌ی سه‌سطحی (پایه/حرفه‌ای/سازمانی) نرخ تبدیل را بالا می‌برد. بیشتر مشتری‌ها سطح وسط را می‌گیرند؛ سطح سوم باعث می‌شود وسط منطقی‌تر دیده شود.',
  'web.waterfall':
    'این نمودار نشان می‌دهد قیمت پایه چطور با ضریب پیچیدگی و بافر ریسک به قیمت نهایی می‌رسد — برای توضیح «چرا این قیمت» به مشتری عالی است.',

  // ماژول ۳ — سئو و ROI
  'seo.audit':
    'حسابرسی یک پروژه‌ی یک‌باره و نقطه‌ی ورود مشتری است. رایگانش نکنید؛ ارزش تخصص شما را قبل از تعهد بلندمدت اثبات می‌کند (معمولاً ۱۵ تا ۵۰ میلیون تومان).',
  'seo.contentHours': 'ساعات تولید محتوای ماهانه × نرخ نویسنده.',
  'seo.technicalHours': 'ساعات بهینه‌سازی فنی ماهانه × نرخ متخصص سئو.',
  'seo.outreachHours': 'ساعات لینک‌سازی و ارتباط با ناشران × نرخ متخصص سئو.',
  'seo.tools': 'سهم این مشتری از هزینه‌ی ابزارها (Ahrefs/SEMrush/Screaming Frog و …).',
  'seo.performance':
    'مدل عملکردمحور پرریسک‌ترین است چون الگوریتم گوگل خارج از کنترل شماست. همیشه یک «هزینه‌ی پایه» بگیرید که حداقل ۷۰٪ هزینه‌ی واقعی را پوشش دهد و بافر ریسک ≥ ۴۰٪ بگذارید. هرگز ۱۰۰٪ ریسک را نپذیرید.',
  'seo.cr': 'نرخ تبدیل سایت مشتری (به‌صورت اعشاری؛ ۲٪ = ۰٫۰۲).',
  'seo.aov': 'میانگین ارزش هر سفارش مشتری.',
  'seo.deltaTraffic':
    'افزایش پیش‌بینی‌شده‌ی بازدیدکننده‌ی ارگانیک ماهانه. محافظه‌کارانه تخمین بزنید.',
  'seo.roi':
    'ROI مشتری = (ارزش ماهانه‌ی ترافیک − هزینه‌ی ماهانه) ÷ هزینه. به‌جای «۲۵ میلیون در ماه»، بگویید «۱۴۰٪ بازگشت در همان ماه اول». مکالمه را از «هزینه» به «سرمایه‌گذاری» می‌برد.',

  // ماژول ۴ — مقیاس‌پذیری آژانس
  'agency.directLabor':
    'نیروی مستقیم: حقوق توسعه‌دهنده‌ها، طراح‌ها و متخصص‌های سئو که مستقیم روی پروژه کار می‌کنند.',
  'agency.indirectLabor':
    'نیروی غیرمستقیم: حقوق مدیر پروژه، فروش، منابع انسانی، مدیرعامل. این لایه‌ها باید در قیمت هر پروژه پوشش داده شوند.',
  'agency.asf':
    'ضریب مقیاس‌پذیری = ۱ + (نیروی غیرمستقیم ÷ نیروی مستقیم). به همین دلیل یک ساعت کار در آژانس گران‌تر از همان فرد به‌عنوان فریلنسر است.',
  'agency.blended':
    'نرخ ترکیبی: میانگین وزنی نرخ همه‌ی نقش‌ها. یک عدد واحد و شفاف به مشتری می‌دهید و در پشت صحنه ترکیب تیم را آزادانه بهینه می‌کنید.',
  'agency.roles':
    'برای هر نقش، ساعت و نرخ داخلی را وارد کنید. نرخ ترکیبی = مجموع (ساعت×نرخ) ÷ مجموع ساعت‌ها.',
  'agency.mar':
    'MAR فردی شما (از ماژول «هزینه و MAR»). مبنای محاسبه‌ی نرخ سطح آژانس است: نرخ آژانس = MAR × ASF × ضریب پیچیدگی.',
  'agency.margin':
    'حاشیه سود واقعی = (قیمت نهایی − هزینه‌ی واقعی) ÷ قیمت نهایی. هدف سالم: ۲۵٪–۴۵٪. زیر ۱۵٪ یعنی یا قیمت‌گذاری اشتباه است یا اجرای پروژه ناکارآمد.',
} as const;

export type TooltipKey = keyof typeof fa;

const en: Record<TooltipKey, string> = {
  // Module 1 — Cost engine & MAR
  'mar.direct':
    'Annual direct costs: your/your staff’s base salaries, project hosting, and dedicated licenses. In other words, money spent directly on "doing the work".',
  'mar.overhead':
    'Annual overhead: costs not tied to any single project but still necessary — rent, software (Figma/Slack/Asana), insurance, accounting, marketing.',
  'mar.profit':
    'Target net profit: the profit you want left over after all costs (even your own salary). This is not a "wage", it is "profit".',
  'mar.weeks':
    'Actual working weeks per year. After deducting leave and holidays it is usually around 48 weeks, not 52.',
  'mar.hoursPerWeek':
    'Working hours per week. The basis for calculation, not necessarily hours present.',
  'mar.utilization':
    'Utilization rate: what fraction of your working hours is actually billed to clients. Time spent on email, negotiation, management, and marketing is not billable. Realistic: 0.55 to 0.70. Assuming 1.0 is a "fatal mistake".',
  'mar.result':
    'Minimum Acceptable Rate (MAR): the absolute floor of your hourly rate. Below this number you are losing money, even if it feels like you are earning.',
  'mar.overheadRatio':
    'Overhead ratio = overhead ÷ direct cost. Healthy agency benchmark: 40% to 80%. Above 100% means the structure has become too heavy.',

  // Module 2 — Web/WordPress pricing
  'web.rateSource':
    'Base rate: you can use your own calculated MAR or enter a market rate manually.',
  'web.hours':
    'Estimated total project hours. You can pick a row from the "feature cheat-sheet" to auto-fill the suggested hours and multiplier.',
  'web.cm':
    'Complexity Multiplier (CM): simple=1.0, medium=1.3–1.5, complex=1.6–2.0, very complex=2.1–2.5. The more technical logic and integration, the higher the number.',
  'web.rb':
    'Risk Buffer (RB): to cover uncertainty. Check every item that applies; the percentages add up (e.g. vague brief 15% + first project of this type 20% = 35%).',
  'web.builder':
    'Build architecture: a standard Page Builder is faster but adds bloat; a custom theme gives higher control and performance but takes more time. It affects the price.',
  'web.maintenance':
    'For custom code, propose an "annual maintenance" line equal to 15%–20% of the build cost; it both covers risk and creates recurring revenue.',
  'web.cwv':
    'If the client cares about speed and SEO, price "performance optimization" separately: typically 10%–15% of the total budget.',
  'web.multilang':
    'For each additional language, add roughly 20% to the base hours of that same section.',
  'web.tiers':
    'A three-tier offer (Basic/Pro/Enterprise) raises the conversion rate. Most clients pick the middle tier; the third tier makes the middle one look more reasonable.',
  'web.waterfall':
    'This chart shows how the base price reaches the final price through the complexity multiplier and risk buffer — perfect for explaining "why this price" to the client.',

  // Module 3 — SEO & ROI
  'seo.audit':
    'An audit is a one-time project and the client’s point of entry. Do not give it away for free; it proves the value of your expertise before any long-term commitment (typically 15–50 million Toman).',
  'seo.contentHours': 'Monthly content-production hours × writer’s rate.',
  'seo.technicalHours': 'Monthly technical-optimization hours × SEO specialist’s rate.',
  'seo.outreachHours': 'Hours for link building and publisher outreach × SEO specialist’s rate.',
  'seo.tools': 'This client’s share of tooling costs (Ahrefs/SEMrush/Screaming Frog, etc.).',
  'seo.performance':
    'The performance-based model is the riskiest because Google’s algorithm is outside your control. Always charge a "base fee" that covers at least 70% of the real cost, and set a risk buffer ≥ 40%. Never accept 100% of the risk.',
  'seo.cr': 'The client site’s conversion rate (as a decimal; 2% = 0.02).',
  'seo.aov': 'The client’s average order value.',
  'seo.deltaTraffic':
    'The forecasted increase in monthly organic visitors. Estimate conservatively.',
  'seo.roi':
    'Client ROI = (monthly traffic value − monthly cost) ÷ cost. Instead of "25 million per month", say "140% return in the very first month". It moves the conversation from "cost" to "investment".',

  // Module 4 — Agency scalability
  'agency.directLabor':
    'Direct labor: salaries of developers, designers, and SEO specialists who work directly on the project.',
  'agency.indirectLabor':
    'Indirect labor: salaries of the project manager, sales, HR, and CEO. These layers must be covered in the price of every project.',
  'agency.asf':
    'Agency Scaling Factor = 1 + (indirect labor ÷ direct labor). This is why one hour of work at an agency costs more than the same person as a freelancer.',
  'agency.blended':
    'Blended rate: the weighted average rate across all roles. You give the client a single, transparent number while freely optimizing the team mix behind the scenes.',
  'agency.roles':
    'For each role, enter the hours and the internal rate. Blended rate = sum of (hours × rate) ÷ sum of hours.',
  'agency.mar':
    'Your individual MAR (from the "Cost & MAR" module). It is the basis for the agency-level rate: agency rate = MAR × ASF × complexity multiplier.',
  'agency.margin':
    'Actual profit margin = (final price − real cost) ÷ final price. Healthy target: 25%–45%. Below 15% means either the pricing is wrong or the project execution is inefficient.',
};

export const tooltips: Record<Locale, Record<TooltipKey, string>> = { fa, en };
