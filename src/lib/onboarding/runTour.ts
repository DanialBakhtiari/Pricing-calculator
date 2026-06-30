import { tours, label, type TourKey, type TourStep } from '@/content/fa';

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
    popoverClass: 'driverjs-rtl',
    steps,
  });

  drive.drive();
}
