import { tour, label, type TourKey } from '@/content/fa';
import { toPersianDigits } from '@/lib/format';
import { getLocale } from '@/lib/i18n/locale';

/**
 * تور یک ماژول را با driver.js اجرا می‌کند (به زبان فعال).
 * driver.js و CSS آن فقط هنگام نیاز lazy لود می‌شوند (خارج از باندل اولیه).
 */
export async function startModuleTour(key: TourKey): Promise<void> {
  const { driver } = await import('driver.js');
  await import('driver.js/dist/driver.css');

  const isRtl = getLocale() === 'fa';
  const sep = isRtl ? 'از' : 'of';
  const popClass = isRtl ? 'driverjs-rtl' : 'driverjs-ltr';

  const steps = tour(key).map((step) => ({
    element: step.target,
    popover: {
      title: step.title,
      description: step.body,
      popoverClass: popClass,
    },
  }));

  const drive = driver({
    showProgress: true,
    overlayOpacity: 0.6,
    nextBtnText: label('tour.next'),
    prevBtnText: label('tour.prev'),
    doneBtnText: label('tour.done'),
    progressText: `{{current}} ${sep} {{total}}`,
    popoverClass: popClass,
    // متن پیشرفت را با ارقام بومی و ترتیب درستِ جهت بازنویسی می‌کنیم
    // (قالب پیش‌فرضِ «of» در RTL بهم‌ریخته نمایش داده می‌شد).
    onPopoverRender: (popover, opts) => {
      const total = opts.config.steps?.length ?? steps.length;
      const current = opts.state.activeIndex ?? 0;
      if (popover.progress) {
        popover.progress.innerText = `${toPersianDigits(current + 1)} ${sep} ${toPersianDigits(total)}`;
      }
    },
    steps,
  });

  drive.drive();
}
