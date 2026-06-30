import { tours, label, type TourKey, type TourStep } from '@/content/fa';
import { toPersianDigits } from '@/lib/format';

/**
 * تور یک ماژول را با driver.js اجرا می‌کند.
 * driver.js و CSS آن فقط هنگام نیاز lazy لود می‌شوند (خارج از باندل اولیه).
 */
export async function startModuleTour(key: TourKey): Promise<void> {
  const { driver } = await import('driver.js');
  await import('driver.js/dist/driver.css');

  const steps = (tours[key] as readonly TourStep[]).map((step) => ({
    element: step.target,
    popover: {
      title: step.title,
      description: step.body,
      popoverClass: 'driverjs-rtl',
    },
  }));

  const drive = driver({
    showProgress: true,
    overlayOpacity: 0.6,
    nextBtnText: label('tour.next'),
    prevBtnText: label('tour.prev'),
    doneBtnText: label('tour.done'),
    progressText: '{{current}} از {{total}}',
    popoverClass: 'driverjs-rtl',
    // متن پیشرفت را با ارقام فارسی و ترتیب درست RTL بازنویسی می‌کنیم
    // (قالب پیش‌فرض «of» در RTL بهم‌ریخته نمایش داده می‌شد).
    onPopoverRender: (popover, opts) => {
      const total = opts.config.steps?.length ?? steps.length;
      const current = opts.state.activeIndex ?? 0;
      if (popover.progress) {
        popover.progress.innerText = `${toPersianDigits(current + 1)} از ${toPersianDigits(total)}`;
      }
    },
    steps,
  });

  drive.drive();
}
