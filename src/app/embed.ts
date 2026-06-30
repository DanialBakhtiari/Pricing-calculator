import { useEffect } from 'react';

/** حالت جاسازی: وقتی ابزار داخل iframe با `?embed=1` بارگذاری شود. */
export function isEmbed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return new URLSearchParams(window.location.search).get('embed') === '1';
  } catch {
    return false;
  }
}

/**
 * ارتفاع سند را به والد (iframe میزبان) postMessage می‌کند تا snippet جاسازی
 * بتواند ارتفاع iframe را خودکار تنظیم کند (architecture §8).
 */
export function usePostHeight(enabled: boolean): void {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const post = () => {
      window.parent.postMessage(
        { type: 'wp-seo-pricing:height', height: document.documentElement.scrollHeight },
        '*',
      );
    };
    post();
    const ro = new ResizeObserver(post);
    ro.observe(document.documentElement);
    window.addEventListener('load', post);
    return () => {
      ro.disconnect();
      window.removeEventListener('load', post);
    };
  }, [enabled]);
}
