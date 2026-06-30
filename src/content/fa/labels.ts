// برچسب‌های UI و فراداده‌ی ماژول‌ها — docs/01/04. هیچ متن فارسی هارد‌کد در JSX.
export const labels = {
  'app.title': 'ماشین‌حساب قیمت‌گذاری',
  'app.tagline': 'قیمت پروژه‌های وب، وردپرس و سئو — دقیق، قابل‌دفاع و بصری',

  'action.save': 'ذخیره سناریو',
  'action.exportPdf': 'خروجی PDF',
  'action.downloadImage': 'دانلود تصویر',
  'action.help': 'راهنما',
  'action.reset': 'پاک‌سازی',
  'action.tryExample': 'یک مثال را امتحان کنید',
  'action.add': 'افزودن',
  'action.remove': 'حذف',
  'action.useMar': 'استفاده از MAR به‌عنوان نرخ',

  'nav.dashboard': 'داشبورد',
  'nav.back': 'بازگشت به داشبورد',

  'table.item': 'مورد',
  'table.value': 'مقدار',

  'breakdown.base': 'قیمت پایه',
  'breakdown.cm': 'ضریب پیچیدگی',
  'breakdown.rb': 'بافر ریسک',
  'breakdown.asf': 'مقیاس آژانس',

  'benchmark.healthy': 'سالم',
  'benchmark.warning': 'احتیاط',
  'benchmark.danger': 'خطر',

  'theme.toLight': 'روشن کردن تم',
  'theme.toDark': 'تیره کردن تم',

  'tour.next': 'بعدی',
  'tour.prev': 'قبلی',
  'tour.done': 'پایان',

  'state.empty': 'برای دیدن نتیجه، فرم را پر کنید — یا یک مثال را امتحان کنید.',
  'state.invalid': 'ورودی نامعتبر است؛ نتیجه قابل‌محاسبه نیست.',

  'unit.toman': 'تومان',
  'unit.hours': 'ساعت',
  'unit.week': 'هفته',
  'unit.perMonth': 'در ماه',
  'unit.percent': '٪',

  'a11y.decrease': 'کاهش',
  'a11y.increase': 'افزایش',
  'a11y.explain': 'توضیح',
  'a11y.fieldHelp': 'توضیح این فیلد',

  'scenario.name': 'نام سناریو',
  'scenario.namePlaceholder': 'نام سناریو (اختیاری)',
  'scenario.restore': 'بازیابی',
  'scenario.empty': 'هنوز سناریویی ذخیره نشده است.',
  'scenario.titlePrefix': 'سناریوی',

  'mar.costsGroup': 'هزینه‌های سالانه',
  'mar.capacityGroup': 'ظرفیت کاری',
  'mar.direct': 'هزینه‌های مستقیم سالانه',
  'mar.overhead': 'سربار سالانه',
  'mar.profit': 'هدف سود خالص',
  'mar.weeks': 'هفته‌های کاری در سال',
  'mar.hoursPerWeek': 'ساعت کاری در هفته',
  'mar.utilization': 'نرخ بهره‌وری',
  'mar.billable': 'ساعت قابل‌فاکتور سالانه',
  'mar.total': 'کل هزینه‌ی سالانه',
  'mar.result': 'حداقل نرخ قابل‌قبول (MAR)',
  'mar.resultHint': 'کف مطلق نرخ ساعتی شما؛ زیر این عدد ضرر می‌کنید.',
  'mar.overheadRatio': 'نسبت سربار',
  'mar.chartTitle': 'ترکیب هزینه‌ها',
  'mar.activeRateSet': 'این MAR به‌عنوان نرخ فعال ذخیره شد و در ماژول‌های بعدی پیشنهاد می‌شود.',
  'mar.overheadNA': 'برای محاسبه‌ی نسبت سربار، هزینه‌ی مستقیم باید بزرگ‌تر از صفر باشد.',
  'unit.hoursPerYear': 'ساعت در سال',

  'web.featureGroup': 'دامنه‌ی پروژه',
  'web.feature': 'ویژگی (جدول طلایی)',
  'web.featurePlaceholder': 'یک ویژگی را انتخاب کنید (اختیاری)',
  'web.hours': 'تخمین ساعت پروژه',
  'web.rateGroup': 'نرخ و ضرایب',
  'web.rateSource': 'منبع نرخ',
  'web.rateMar': 'نرخ MAR من',
  'web.rateMarket': 'نرخ بازار (دستی)',
  'web.marketRate': 'نرخ ساعتی بازار',
  'web.noMar': 'هنوز MAR محاسبه نشده — اول ماژول «هزینه و MAR» را پر کنید.',
  'web.cm': 'ضریب پیچیدگی فنی (CM)',
  'web.rbGroup': 'بافر ریسک (موارد صادق را تیک بزنید)',
  'web.rbTotal': 'مجموع بافر ریسک',
  'web.builder': 'معماری ساخت',
  'web.addonsGroup': 'افزودنی‌های پیشنهادی',
  'web.addMaintenance': 'بند نگهداری سالانه (۱۵–۲۰٪)',
  'web.addCwv': 'بهینه‌سازی عملکرد / CWV (۱۰–۱۵٪)',
  'web.multilang': 'تعداد زبان‌های اضافه',
  'web.multilangExtra': 'ساعت اضافه برای چندزبانه',
  'web.priceGroup': 'قیمت پیشنهادی',
  'web.finalPrice': 'قیمت نهایی پروژه',
  'web.finalHint': 'قیمت پایه × ضریب پیچیدگی × (۱ + بافر ریسک)',
  'web.waterfallTitle': 'تجزیه‌ی قیمت (آبشاری)',
  'web.tiersTitle': 'سه سطح پیشنهادی',
  'web.maintenanceLine': 'نگهداری سالانه',
  'web.performanceLine': 'بهینه‌سازی عملکرد',
  'web.recommended': 'پیشنهادی',

  'playground.title': 'نمونه‌ی کامپوننت‌ها',
  'playground.description':
    'این صفحه نشان می‌دهد فیلدهای فارسی، نوار محک و کارت نتیجه چطور با موتور قیمت‌گذاری کار می‌کنند. اعداد را فارسی یا انگلیسی وارد کنید.',
  'playground.result': 'قیمت تعدیل‌شده',
  'playground.complexity': 'سطح پیچیدگی (محک)',
} as const;

export type LabelKey = keyof typeof labels;

/** فراداده‌ی چهار ماژول برای داشبورد و router. */
export const MODULES = [
  {
    id: 'mar',
    path: '/mar',
    name: 'موتور هزینه و MAR',
    description: 'کف نرخ ساعتی قابل‌دفاع خود را پیدا کنید تا زیر قیمت ندهید.',
  },
  {
    id: 'web',
    path: '/web',
    name: 'قیمت‌گذاری وب/وردپرس',
    description: 'قیمت پروژه را با ضریب پیچیدگی و بافر ریسک، قابل‌دفاع کنید.',
  },
  {
    id: 'seo',
    path: '/seo',
    name: 'سئو و ROI',
    description: 'حسابرسی، Retainer و روایت بازگشت سرمایه برای مذاکره.',
  },
  {
    id: 'agency',
    path: '/agency',
    name: 'مقیاس‌پذیری آژانس',
    description: 'ضریب مقیاس، نرخ ترکیبی و راستی‌آزمایی حاشیه‌ی سود.',
  },
] as const;

export type ModuleId = (typeof MODULES)[number]['id'];
