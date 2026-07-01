/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  // میزبانی زیرِ زیرمسیر (مثلاً /pricing/). CI مقدار را با VITE_BASE ست می‌کند؛
  // پیش‌فرضِ محلی '/pricing/'. اگر زیرمسیر عوض شد، workflow و همین‌جا را به‌روزرسانی کن.
  base: process.env.VITE_BASE ?? '/pricing/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-48.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'ماشین‌حساب قیمت‌گذاری وب، وردپرس و سئو',
        short_name: 'قیمت‌گذاری',
        description:
          'محاسبه‌ی قیمت قابل‌دفاع پروژه‌های وب، وردپرس و سئو — کلاینت‌ساید، فارسی و آفلاین.',
        lang: 'fa',
        dir: 'rtl',
        theme_color: '#7c5cff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,ico}'],
        cleanupOutdatedCaches: true,
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    include: ['tests/**/*.{test,spec}.{ts,tsx}', 'src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: ['src/lib/**'],
      // glueهای مرورگری/lazy (driver.js) که تست واحد ندارند.
      exclude: ['src/lib/onboarding/**'],
      thresholds: {
        // architecture §10/§11: lib کلی ≥ ۹۰٪، موتور قیمت‌گذاری = ۱۰۰٪ خطوط.
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
        'src/lib/pricing/**': {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  },
});
