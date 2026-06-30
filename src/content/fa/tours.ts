// گام‌های تور آموزشی — docs/05. دوزبانه (fa/en).
import type { Locale } from '@/lib/i18n/locale';

export interface TourStep {
  /** انتخاب‌گر عنصر هدف (مثلاً `[data-tour="mar-utilization"]`). نبودنش ⇒ مودال مرکزی. */
  target?: string;
  title?: string;
  body: string;
}

const fa = {
  welcome: [
    {
      body: 'به ماشین‌حساب قیمت‌گذاری خوش آمدید 👋 این ابزار کمک می‌کند قیمت پروژه‌های وب، وردپرس و سئو را دقیق و قابل‌دفاع محاسبه کنید.',
    },
    {
      body: 'از این داشبورد یکی از چهار ماژول را انتخاب کنید. پیشنهاد می‌کنیم از «موتور هزینه و MAR» شروع کنید تا کف نرخ‌تان مشخص شود.',
    },
    {
      body: 'هر جا علامت «!» دیدید، با نگه‌داشتن نشانگر (یا لمس در موبایل) توضیح آن فیلد را می‌بینید.',
    },
    {
      body: 'نتیجه‌ها همراه نمودار نمایش داده می‌شوند و می‌توانید آن‌ها را ذخیره یا به‌صورت PDF خروجی بگیرید. شروع کنیم!',
    },
  ],
  mar: [
    {
      target: '[data-tour="mar-costs"]',
      body: 'اول هزینه‌های سالانه‌تان را وارد کنید: مستقیم، سربار و هدف سود.',
    },
    {
      target: '[data-tour="mar-utilization"]',
      body: 'بعد ساعات کاری و مهم‌تر از همه، «نرخ بهره‌وری» را تنظیم کنید — واقع‌بینانه بین ۰٫۵۵ تا ۰٫۷۰.',
    },
    {
      target: '[data-tour="mar-result"]',
      body: 'این عدد، MAR شماست: کف مطلق نرخ ساعتی. زیر این عدد قیمت ندهید.',
    },
    {
      target: '[data-tour="mar-chart"]',
      body: 'این نمودار ترکیب هزینه‌ها را نشان می‌دهد. می‌توانید MAR را به‌عنوان نرخ پایه در ماژول قیمت‌گذاری پروژه استفاده کنید.',
    },
  ],
  web: [
    {
      target: '[data-tour="web-feature"]',
      body: 'از جدول طلایی یک ویژگی انتخاب کنید یا ساعت را دستی بزنید.',
    },
    {
      target: '[data-tour="web-cm-rb"]',
      body: 'سطح پیچیدگی (CM) و موارد بافر ریسک (RB) را مشخص کنید.',
    },
    {
      target: '[data-tour="web-waterfall"]',
      body: 'نمودار آبشاری نشان می‌دهد هر ضریب چقدر به قیمت اضافه کرده — برای توضیح به مشتری.',
    },
    {
      target: '[data-tour="web-tiers"]',
      body: 'در پایان، سه سطح پیشنهادی برای مشتری ساخته می‌شود؛ سطح حرفه‌ای پیشنهاد اصلی شماست.',
    },
  ],
  seo: [
    {
      target: '[data-tour="seo-model"]',
      body: 'بسته به مدل، حسابرسی یا Retainer ماهانه را برآورد کنید.',
    },
    {
      target: '[data-tour="seo-roi"]',
      body: 'بخش ROI را پر کنید تا ارزش سرمایه‌گذاری را به زبان مدیر مالی مشتری نشان دهید.',
    },
    {
      target: '[data-tour="seo-pitch"]',
      body: 'این جمله‌ی آماده را در مذاکره استفاده کنید؛ قیمت را از «هزینه» به «سرمایه‌گذاری» تبدیل می‌کند.',
    },
  ],
  agency: [
    {
      target: '[data-tour="agency-labor"]',
      body: 'نیروی مستقیم و غیرمستقیم را وارد کنید تا ضریب مقیاس‌پذیری (ASF) محاسبه شود.',
    },
    {
      target: '[data-tour="agency-roles"]',
      body: 'ردیف نقش‌ها را اضافه کنید تا نرخ ترکیبی واحد به‌دست آید.',
    },
    {
      target: '[data-tour="agency-margin"]',
      body: 'در پایان، حاشیه‌ی سود واقعی پروژه را راستی‌آزمایی کنید.',
    },
  ],
} as const;

export type TourKey = keyof typeof fa;

const en: Record<TourKey, readonly TourStep[]> = {
  welcome: [
    {
      body: 'Welcome to the pricing calculator 👋 This tool helps you price Web, WordPress, and SEO projects accurately and defensibly.',
    },
    {
      body: 'Pick one of the four modules from this dashboard. We suggest starting with the Cost Engine & MAR so your rate floor is clear.',
    },
    {
      body: 'Wherever you see the "!" icon, hover (or tap on mobile) to read what that field means.',
    },
    {
      body: 'Results come with a chart, and you can save them or export to PDF. Let’s get started!',
    },
  ],
  mar: [
    {
      target: '[data-tour="mar-costs"]',
      body: 'First, enter your annual costs: direct, overhead, and target profit.',
    },
    {
      target: '[data-tour="mar-utilization"]',
      body: 'Next, set your working hours and — most importantly — the utilization rate, realistically between 0.55 and 0.70.',
    },
    {
      target: '[data-tour="mar-result"]',
      body: 'This number is your MAR (Minimum Acceptable Rate): the absolute hourly floor. Never quote below it.',
    },
    {
      target: '[data-tour="mar-chart"]',
      body: 'This chart shows your cost mix. You can use the MAR as the base rate in the project pricing module.',
    },
  ],
  web: [
    {
      target: '[data-tour="web-feature"]',
      body: 'Pick a feature from the cheat-sheet or enter the hours manually.',
    },
    {
      target: '[data-tour="web-cm-rb"]',
      body: 'Set the Complexity Multiplier (CM) level and the Risk Buffer (RB) items.',
    },
    {
      target: '[data-tour="web-waterfall"]',
      body: 'The waterfall chart shows how much each factor added to the price — perfect for explaining it to the client.',
    },
    {
      target: '[data-tour="web-tiers"]',
      body: 'Finally, three proposed tiers are built for the client; the Professional tier is your main recommendation.',
    },
  ],
  seo: [
    {
      target: '[data-tour="seo-model"]',
      body: 'Depending on the model, estimate an audit or a monthly retainer.',
    },
    {
      target: '[data-tour="seo-roi"]',
      body: 'Fill in the ROI section to show the value of the investment in your client’s CFO language.',
    },
    {
      target: '[data-tour="seo-pitch"]',
      body: 'Use this ready-made line in your negotiation; it turns the price from a "cost" into an "investment".',
    },
  ],
  agency: [
    {
      target: '[data-tour="agency-labor"]',
      body: 'Enter your direct and indirect labor so the Agency Scaling Factor (ASF) is calculated.',
    },
    {
      target: '[data-tour="agency-roles"]',
      body: 'Add role rows to get a single blended rate.',
    },
    {
      target: '[data-tour="agency-margin"]',
      body: 'Finally, verify the project’s real profit margin.',
    },
  ],
};

export const tours: Record<Locale, Record<TourKey, readonly TourStep[]>> = { fa, en };
