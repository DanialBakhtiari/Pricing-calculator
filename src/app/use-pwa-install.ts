import { useCallback, useEffect, useState } from 'react';
import type { InstallPlatformId } from '@/content/fa';

/** رویداد غیراستانداردِ Chromium برای نصب PWA. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** پلتفرم کاربر را برای نمایش گام‌های درست تشخیص می‌دهد. */
export function detectPlatform(): InstallPlatformId {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  if (/iphone|ipad|ipod/i.test(ua) || iPadOS) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

/** آیا برنامه از قبل به‌صورت نصب‌شده (standalone) باز شده است؟ */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const mm = window.matchMedia?.('(display-mode: standalone)');
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return Boolean(mm?.matches) || iosStandalone;
}

export interface PwaInstall {
  /** پرامپتِ نیتیوِ نصب در دسترس است (Chromium اندروید/دسکتاپ). */
  canPrompt: boolean;
  /** پرامپت نیتیو را نشان می‌دهد؛ true اگر کاربر نصب را پذیرفت. */
  promptInstall: () => Promise<boolean>;
  /** در این نشست نصب شد. */
  installed: boolean;
  /** هم‌اکنون به‌صورت نصب‌شده باز شده است. */
  standalone: boolean;
  platform: InstallPlatformId;
  isIOS: boolean;
}

/**
 * وضعیت نصب PWA: رویداد `beforeinstallprompt` را می‌گیرد، نصب‌شدن را دنبال می‌کند،
 * و پلتفرم/standalone را تشخیص می‌دهد. هیچ پرامپتی را خودکار نشان نمی‌دهد.
 */
export function usePwaInstall(): PwaInstall {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault(); // از پرامپت خودکار مرورگر جلوگیری کن تا خودمان کنترل کنیم
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferred) return false;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null); // پرامپت یک‌بارمصرف است
    return outcome === 'accepted';
  }, [deferred]);

  const platform = detectPlatform();
  return {
    canPrompt: deferred !== null,
    promptInstall,
    installed,
    standalone: isStandalone(),
    platform,
    isIOS: platform === 'ios',
  };
}
