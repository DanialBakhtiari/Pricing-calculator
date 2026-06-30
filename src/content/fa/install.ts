// آموزش نصب PWA («افزودن به صفحه‌ی اصلی») برای هر پلتفرم. دوزبانه (fa/en).
import type { Locale } from '@/lib/i18n/locale';

export type InstallPlatformId = 'ios' | 'android' | 'desktop';

export interface InstallPlatform {
  id: InstallPlatformId;
  title: string;
  steps: readonly string[];
}

const fa: readonly InstallPlatform[] = [
  {
    id: 'ios',
    title: 'آیفون / آیپد (Safari)',
    steps: [
      'دکمه‌ی «اشتراک‌گذاری» (مربعِ پیکان‌دار) را در نوار پایین مرورگر بزنید.',
      'کمی پایین بروید و گزینه‌ی «Add to Home Screen» را انتخاب کنید.',
      'روی «Add» بزنید — آیکن برنامه روی صفحه‌ی اصلی ظاهر می‌شود.',
    ],
  },
  {
    id: 'android',
    title: 'اندروید (Chrome)',
    steps: [
      'منوی سه‌نقطه‌ی مرورگر را باز کنید (یا منتظر پیام نصبِ خودکار بمانید).',
      'گزینه‌ی «Install app» یا «Add to Home screen» را بزنید.',
      'تأیید کنید؛ آیکن برنامه به صفحه‌ی اصلی اضافه می‌شود.',
    ],
  },
  {
    id: 'desktop',
    title: 'دسکتاپ (Chrome / Edge)',
    steps: [
      'آیکن نصب (⊕) را در گوشه‌ی نوار آدرس بزنید — یا منوی مرورگر ← «Install».',
      'روی «Install» تأیید کنید.',
      'برنامه در پنجره‌ی مستقلِ خودش، بدون نوار مرورگر، باز می‌شود.',
    ],
  },
];

const en: readonly InstallPlatform[] = [
  {
    id: 'ios',
    title: 'iPhone / iPad (Safari)',
    steps: [
      'Tap the Share button (a square with an up-arrow) in the bottom bar.',
      'Scroll down and choose “Add to Home Screen”.',
      'Tap “Add” — the app icon appears on your home screen.',
    ],
  },
  {
    id: 'android',
    title: 'Android (Chrome)',
    steps: [
      'Open the browser’s three-dot menu (or wait for the automatic install prompt).',
      'Tap “Install app” or “Add to Home screen”.',
      'Confirm — the icon is added to your home screen.',
    ],
  },
  {
    id: 'desktop',
    title: 'Desktop (Chrome / Edge)',
    steps: [
      'Click the install icon (⊕) at the edge of the address bar — or browser menu → “Install”.',
      'Confirm “Install”.',
      'The app opens in its own window, without browser chrome.',
    ],
  },
];

export const INSTALL_GUIDE: Record<Locale, readonly InstallPlatform[]> = { fa, en };
