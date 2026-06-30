import { useEffect, useState } from 'react';

/** آیا دستگاه «اشاره‌گر درشت» (لمسی) دارد؟ برای انتخاب Popover(لمس) به‌جای Tooltip(hover). */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const handler = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return coarse;
}
