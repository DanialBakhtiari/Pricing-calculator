// محتوای مدال‌های آموزش — زبان ساده و دوستانه. دوزبانه (fa/en).
import type { Locale } from '@/lib/i18n/locale';

export interface GuideSection {
  heading: string;
  body: string;
}

export interface Guide {
  title: string;
  intro: string;
  sections: readonly GuideSection[];
  example?: { readonly title: string; readonly body: string };
}

const fa = {
  welcome: {
    title: 'راهنمای کامل: این ابزار چیست و چطور کار می‌کند؟',
    intro:
      'سلام! 👋 این یک ماشین‌حساب هوشمند است که کمک می‌کند قیمت پروژه‌های وب، وردپرس و سئو را به‌جای «حدس‌زدن»، با عدد و منطق محاسبه کنید. لازم نیست هیچ اصطلاح فنی‌ای بلد باشید؛ همه‌چیز همین‌جا به زبان ساده توضیح داده می‌شود. همه‌ی محاسبه‌ها روی دستگاه خودتان انجام می‌شود و هیچ داده‌ای جایی ارسال نمی‌شود.',
    sections: [
      {
        heading: 'چهار ابزار، یک هدف',
        body: 'چهار بخش دارید: «موتور هزینه و MAR» (کف نرخ ساعتی شما)، «وب/وردپرس» (قیمت یک پروژه)، «سئو و ROI» (قیمت خدمات سئو و اثباتِ ارزش آن به مشتری)، و «مقیاس‌پذیری آژانس» (وقتی تیم دارید). پیشنهاد می‌کنیم از همان اولی شروع کنید.',
      },
      {
        heading: 'از کجا شروع کنم؟',
        body: 'اول وارد «موتور هزینه و MAR» شوید و هزینه‌هایتان را وارد کنید تا «کف نرخ ساعتی» شما به‌دست آید. این عدد به‌صورت خودکار در ماژول‌های دیگر هم پیشنهاد می‌شود تا همه‌چیز هماهنگ بماند.',
      },
      {
        heading: 'اصطلاح‌ها به ساده‌ترین زبان',
        body: '«MAR» = پایین‌ترین نرخ ساعتی که زیرش ضرر می‌کنید. «CM» = هرچه پروژه پیچیده‌تر، عددِ بزرگ‌تر و قیمت بالاتر. «RB» = درصدی که برای ریسک و کارهای پیش‌بینی‌نشده اضافه می‌کنید. «ROI» = مشتری به‌ازای هر تومان هزینه، چند تومان برمی‌گرداند. «حاشیه سود» = چند درصد از قیمت نهایی برای شما سود خالص می‌ماند.',
      },
      {
        heading: 'نکته‌های کاربردی',
        body: 'اعداد را فارسی یا انگلیسی وارد کنید—فرقی ندارد. کنار هر فیلد علامت «!» هست؛ رویش بروید (یا در موبایل لمس کنید) تا توضیحش را ببینید. می‌توانید هر حالت را «ذخیره» کنید، خروجی «PDF» بگیرید، تم را روشن/تیره کنید، و حتی آفلاین استفاده کنید (ابزار را روی گوشی نصب کنید).',
      },
    ],
  },

  mar: {
    title: 'آموزش: موتور هزینه و MAR',
    intro:
      'اینجا مهم‌ترین عددِ کاری‌تان را پیدا می‌کنید: «کف نرخ ساعتی». این عدد به شما می‌گوید ساعتی چند باید بگیرید که ضرر نکنید—حتی اگر حس کنید درآمد دارید.',
    sections: [
      {
        heading: 'هزینه‌ها را وارد کنید',
        body: '«مستقیم» = پولی که مستقیم خرج انجام کار می‌شود (حقوق، هاست، لایسنس). «سربار» = هزینه‌های جانبی لازم (اجاره، نرم‌افزارها، بیمه، بازاریابی). «هدف سود» = سودی که می‌خواهید بعد از همه‌چیز برایتان بماند.',
      },
      {
        heading: 'ظرفیت واقعی کارتان',
        body: 'هفته‌های کاری سال (معمولاً ۴۸، نه ۵۲)، ساعت کاری هفته، و مهم‌تر از همه «نرخ بهره‌وری»: چه کسری از ساعاتتان واقعاً به مشتری فاکتور می‌شود. واقع‌بینانه بین ۰٫۵۵ تا ۰٫۷۰ است؛ فرض ۱٫۰ اشتباه پرهزینه‌ای است.',
      },
      {
        heading: 'نتیجه: MAR',
        body: 'عدد بزرگِ سبز، کف مطلق نرخ ساعتی شماست. زیر این عدد قیمت ندهید. «نسبت سربار» هم با نوار رنگی نشان می‌دهد ساختار هزینه‌تان سالم است یا سنگین.',
      },
    ],
    example: {
      title: 'یک مثال ساده',
      body: 'فرض کنید کل هزینه‌ی سالانه‌تان ۴۸۰ میلیون تومان است و در سال ۱۲۴۸ ساعت قابل‌فاکتور دارید. آن‌وقت MAR ≈ ۳۸۴٬۶۱۵ تومان در ساعت می‌شود. یعنی هر پروژه را با نرخی کمتر از این قبول کنید، در واقع از جیب خودتان می‌گذارید.',
    },
  },

  web: {
    title: 'آموزش: قیمت‌گذاری وب/وردپرس',
    intro:
      'اینجا قیمت یک پروژه‌ی مشخص را می‌سازید—طوری که هم منصفانه باشد، هم بتوانید جلوی مشتری از آن دفاع کنید.',
    sections: [
      {
        heading: 'ساعت و نرخ',
        body: 'از «جدول طلایی» یک ویژگی را انتخاب کنید تا ساعت و سطح پیچیدگی خودکار پر شود، یا ساعت را دستی بزنید. نرخ می‌تواند همان MAR خودتان باشد یا نرخ بازار.',
      },
      {
        heading: 'پیچیدگی و ریسک',
        body: '«ضریب پیچیدگی (CM)» را با اسلایدر تنظیم کنید—هرچه پروژه فنی‌تر، بالاتر. در «بافر ریسک» موارد صادق را تیک بزنید (مثل Brief مبهم یا اولین پروژه از این نوع)؛ درصدها جمع می‌شوند و امنیت شما را بالا می‌برند.',
      },
      {
        heading: 'افزودنی‌ها و سه سطح',
        body: 'نگهداری سالانه و بهینه‌سازی عملکرد را می‌توانید روشن کنید تا به «جمع کل پیشنهاد» اضافه شوند. در پایان سه سطح پایه/حرفه‌ای/سازمانی ساخته می‌شود؛ سطح حرفه‌ای پیشنهاد اصلی شماست و معمولاً همان را انتخاب می‌کنند.',
      },
    ],
    example: {
      title: 'یک مثال ساده',
      body: 'قیمت پایه ۱۵۰ میلیون، پیچیدگی ۱٫۸ و بافر ریسک ۲۵٪ ⇒ قیمت نهایی ۳۳۷٫۵ میلیون تومان. نمودار آبشاری دقیقاً نشان می‌دهد هر ضریب چقدر به قیمت اضافه کرده—عالی برای توضیح «چرا این قیمت» به مشتری.',
    },
  },

  seo: {
    title: 'آموزش: سئو و ROI',
    intro:
      'سئو را مشتری معمولاً «هزینه» می‌بیند، نه «سرمایه‌گذاری». این ابزار کمک می‌کند هم قیمت درست بدهید و هم ارزش کارتان را با عدد ثابت کنید.',
    sections: [
      {
        heading: 'سه مدل قیمت',
        body: '«Retainer ماهانه»: مجموع ساعت محتوا/فنی/لینک‌سازی × نرخ + ابزارها. «عملکردمحور»: پایه + پاداش بر اساس نتیجه (پرریسک؛ ابزار به شما هشدار ایمنی می‌دهد). «حسابرسی»: یک پروژه‌ی یک‌باره و نقطه‌ی ورود—هرگز رایگانش نکنید.',
      },
      {
        heading: 'محاسبه‌گر ROI = سلاح مذاکره',
        body: 'نرخ تبدیل، میانگین ارزش سفارش و افزایش ترافیک را وارد کنید تا ببینید سرمایه‌گذاری مشتری چند درصد برمی‌گردد. یک «جمله‌ی آماده‌ی مذاکره» هم تولید می‌شود که گفتگو را از «هزینه» به «سرمایه‌گذاری» می‌برد.',
      },
    ],
    example: {
      title: 'یک مثال ساده',
      body: 'اگر افزایش ترافیک ماهانه ۲۰۰۰ بازدید با ارزش هر بازدید ۳۰٬۰۰۰ تومان باشد، ماهانه ۶۰ میلیون تومان ارزش تولید می‌شود. در برابر Retainer ۲۵ میلیونی، یعنی ۱۴۰٪ بازگشت در همان ماه اول. به‌جای «۲۵ میلیون در ماه»، همین جمله را بگویید.',
    },
  },

  agency: {
    title: 'آموزش: مقیاس‌پذیری آژانس',
    intro:
      'وقتی از فریلنسری به تیم می‌رسید، نرخ‌گذاری فرق می‌کند. اینجا یاد می‌گیرید سربار تیم را در قیمت لحاظ کنید و سود واقعی‌تان را راستی‌آزمایی کنید.',
    sections: [
      {
        heading: 'ضریب مقیاس (ASF)',
        body: 'نیروی مستقیم (روی پروژه) و غیرمستقیم (مدیر، فروش، مدیرعامل) را وارد کنید. ASF = ۱ + (غیرمستقیم ÷ مستقیم). به همین دلیل یک ساعت کار در آژانس از همان فرد به‌عنوان فریلنسر گران‌تر است.',
      },
      {
        heading: 'نرخ ترکیبی',
        body: 'برای هر نقش، ساعت و نرخ داخلی را وارد کنید (می‌توانید ردیف اضافه/حذف کنید). ابزار یک «نرخ ترکیبی» واحد می‌دهد تا به مشتری یک عدد شفاف بدهید و پشت صحنه ترکیب تیم را آزادانه بهینه کنید.',
      },
      {
        heading: 'حاشیه سود',
        body: 'قیمت نهایی و هزینه‌ی واقعی را وارد کنید تا حاشیه‌ی سود واقعی با نوار محک نشان داده شود. هدف سالم ۲۵٪ تا ۴۵٪ است؛ زیر ۱۵٪ هشدار قرمز می‌گیرید.',
      },
    ],
    example: {
      title: 'یک مثال ساده',
      body: 'اگر نیروی غیرمستقیم ۱۲۰ و مستقیم ۱۰۰ میلیون باشد، ASF = ۲٫۲ می‌شود؛ یعنی نرخ ساعتی آژانس ۲٫۲ برابرِ MAR فردی است. این تفاوت همان چیزی است که هزینه‌ی واقعی تیم را پوشش می‌دهد.',
    },
  },
} as const;

export type GuideKey = keyof typeof fa;

const en: Record<GuideKey, Guide> = {
  welcome: {
    title: 'Complete guide: what is this tool and how does it work?',
    intro:
      'Hi! 👋 This is a smart calculator that helps you price web, WordPress, and SEO projects with numbers and logic instead of "guessing." You don\'t need to know any technical jargon; everything is explained here in plain language. All calculations run on your own device, and no data is sent anywhere.',
    sections: [
      {
        heading: 'Four tools, one goal',
        body: 'You have four parts: "Cost engine and MAR" (your hourly-rate floor), "Web/WordPress" (the price of a single project), "SEO and ROI" (the price of SEO services and proving their value to the client), and "Agency scaling" (for when you have a team). We suggest starting with the first one.',
      },
      {
        heading: 'Where do I start?',
        body: 'First go to "Cost engine and MAR" and enter your costs to find your "hourly-rate floor." This number is automatically suggested in the other modules too, so everything stays consistent.',
      },
      {
        heading: 'The terms in the simplest language',
        body: '"MAR" = the lowest hourly rate below which you lose money. "CM" = the more complex the project, the bigger the number and the higher the price. "RB" = the percentage you add for risk and unforeseen work. "ROI" = for every Toman the client spends, how many Toman they get back. "Profit margin" = what percentage of the final price stays with you as net profit.',
      },
      {
        heading: 'Practical tips',
        body: 'Enter numbers in Persian or Latin—it makes no difference. There is a "!" mark next to each field; hover over it (or tap it on mobile) to see its explanation. You can "save" any scenario, export a "PDF," switch the theme to light/dark, and even use it offline (install the tool on your phone).',
      },
    ],
  },

  mar: {
    title: 'Guide: cost engine and MAR',
    intro:
      'Here you find the most important number in your business: your "hourly-rate floor." This number tells you how much you should charge per hour so you don\'t lose money—even when it feels like you\'re earning.',
    sections: [
      {
        heading: 'Enter your costs',
        body: '"Direct" = money spent directly to do the work (salaries, hosting, licenses). "Overhead" = necessary side costs (rent, software, insurance, marketing). "Profit target" = the profit you want left for you after everything.',
      },
      {
        heading: 'Your real capacity',
        body: 'Working weeks in the year (usually 48, not 52), working hours per week, and most importantly the "utilization rate": what fraction of your hours is actually billed to clients. Realistically it is between 0.55 and 0.70; assuming 1.0 is a costly mistake.',
      },
      {
        heading: 'The result: MAR',
        body: 'The big green number is the absolute floor of your hourly rate. Do not price below this number. The "overhead ratio" also uses a colored bar to show whether your cost structure is healthy or top-heavy.',
      },
    ],
    example: {
      title: 'A simple example',
      body: 'Suppose your total annual cost is 480 million Toman and you have 1,248 billable hours per year. Then MAR ≈ 384,615 Toman per hour. That means if you accept any project at a rate lower than this, you are really paying out of your own pocket.',
    },
  },

  web: {
    title: 'Guide: Web/WordPress pricing',
    intro:
      'Here you build the price of a specific project—in a way that is both fair and that you can defend in front of the client.',
    sections: [
      {
        heading: 'Hours and rate',
        body: 'Pick a feature from the "feature cheat-sheet" so the hours and complexity level fill in automatically, or enter the hours manually. The rate can be your own MAR or the market rate.',
      },
      {
        heading: 'Complexity and risk',
        body: 'Set the "Complexity Multiplier (CM)" with the slider—the more technical the project, the higher it goes. In the "Risk Buffer" check the items that apply (such as a vague brief or your first project of this kind); the percentages add up and increase your safety.',
      },
      {
        heading: 'Add-ons and three tiers',
        body: 'You can turn on annual maintenance and performance optimization so they are added to the "total proposal." In the end three tiers are built—Essential/Professional/Enterprise; the Professional tier is your main proposal and it is usually the one they pick.',
      },
    ],
    example: {
      title: 'A simple example',
      body: 'Base price 150 million, complexity 1.8, and Risk Buffer 25% ⇒ final price 337.5 million Toman. The waterfall chart shows exactly how much each factor added to the price—great for explaining "why this price" to the client.',
    },
  },

  seo: {
    title: 'Guide: SEO and ROI',
    intro:
      'Clients usually see SEO as a "cost," not an "investment." This tool helps you both set the right price and prove the value of your work with numbers.',
    sections: [
      {
        heading: 'Three pricing models',
        body: '"Monthly retainer": total content/technical/link-building hours × rate + tools. "Performance-based": a base plus a bonus based on results (high risk; the tool gives you a safety warning). "Audit": a one-time project and entry point—never make it free.',
      },
      {
        heading: 'The ROI calculator = your negotiation weapon',
        body: 'Enter the conversion rate, average order value, and traffic increase to see what percentage of the client\'s investment comes back. A "ready-made negotiation sentence" is also generated that shifts the conversation from "cost" to "investment."',
      },
    ],
    example: {
      title: 'A simple example',
      body: 'If the monthly traffic increase is 2,000 visits with each visit worth 30,000 Toman, then 60 million Toman of value is produced per month. Against a 25-million retainer, that is a 140% return in the very first month. Instead of "25 million per month," say this sentence.',
    },
  },

  agency: {
    title: 'Guide: agency scaling',
    intro:
      'When you go from freelancing to a team, pricing changes. Here you learn to factor your team overhead into the price and verify your real profit.',
    sections: [
      {
        heading: 'Scaling factor (ASF)',
        body: 'Enter direct labor (on the project) and indirect labor (manager, sales, CEO). ASF = 1 + (indirect ÷ direct). This is why one hour of work at an agency, from the same person, is more expensive than as a freelancer.',
      },
      {
        heading: 'Blended rate',
        body: 'For each role, enter the hours and the internal rate (you can add/remove rows). The tool gives a single "blended rate" so you can give the client one clear number while freely optimizing the team mix behind the scenes.',
      },
      {
        heading: 'Profit margin',
        body: 'Enter the final price and the real cost so the actual profit margin is shown with a benchmark bar. A healthy target is 25% to 45%; below 15% you get a red warning.',
      },
    ],
    example: {
      title: 'A simple example',
      body: 'If indirect labor is 120 and direct is 100 million, ASF = 2.2; that means the agency hourly rate is 2.2 times the individual MAR. This difference is exactly what covers the real cost of the team.',
    },
  },
};

export const guides: Record<Locale, Record<GuideKey, Guide>> = { fa, en };
