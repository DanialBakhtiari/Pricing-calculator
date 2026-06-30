import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ModuleId } from '@/content/fa';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locale';

export type Theme = 'light' | 'dark';

/** سناریوی ذخیره‌شده — architecture §2. */
export interface Scenario {
  id: string;
  module: ModuleId;
  title: string;
  inputs: Record<string, unknown>;
  createdAt: number;
}

interface AppState {
  theme: Theme;
  /** زبان فعال رابط کاربری (فارسی RTL / انگلیسی LTR). */
  locale: Locale;
  /** نرخ فعال مشترک (MAR یا نرخ بازار) که به ماژول ۲ و ۴ تزریق می‌شود. */
  activeRate: number | null;
  welcomeTourDone: boolean;
  scenarios: Scenario[];

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setActiveRate: (rate: number | null) => void;
  markWelcomeTourDone: () => void;
  addScenario: (input: Omit<Scenario, 'id' | 'createdAt'>) => Scenario;
  removeScenario: (id: string) => void;
  clearScenarios: () => void;
}

function makeId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `s_${Math.random().toString(36).slice(2)}`; // fallback برای context ناامن
}

export const PERSIST_KEY = 'pricing:app:v1';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      locale: DEFAULT_LOCALE,
      activeRate: null,
      welcomeTourDone: false,
      scenarios: [],

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setLocale: (locale) => set({ locale }),
      toggleLocale: () => set({ locale: get().locale === 'fa' ? 'en' : 'fa' }),
      setActiveRate: (activeRate) => set({ activeRate }),
      markWelcomeTourDone: () => set({ welcomeTourDone: true }),

      addScenario: (input) => {
        const scenario: Scenario = { ...input, id: makeId(), createdAt: Date.now() };
        set({ scenarios: [scenario, ...get().scenarios] });
        return scenario;
      },
      removeScenario: (id) => set({ scenarios: get().scenarios.filter((s) => s.id !== id) }),
      clearScenarios: () => set({ scenarios: [] }),
    }),
    {
      name: PERSIST_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // اسکیمای ورودی‌ها در فازهای بعد تغییر می‌کند؛ هنگام bump نسخه، migrate اضافه شود.
    },
  ),
);
