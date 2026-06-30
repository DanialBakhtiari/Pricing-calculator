import { test, expect } from '@playwright/test';

// مقدار localStorage را قبل از بارگذاری ست می‌کنیم تا تور خوش‌آمد در تست‌ها باز نشود.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'pricing:app:v1',
      JSON.stringify({ state: { welcomeTourDone: true, theme: 'light' }, version: 1 }),
    );
  });
});

test('dashboard renders and is RTL', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: 'ماشین‌حساب قیمت‌گذاری' }),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('MAR module computes the default MAR', async ({ page }) => {
  await page.goto('/#/mar');
  await expect(page.getByText('۳۸۴٬۶۱۵ تومان').first()).toBeVisible();
});

test('web module shows the final price and the three tiers', async ({ page }) => {
  await page.goto('/#/web');
  await expect(page.getByText('۳۶۴٬۵۰۰٬۰۰۰ تومان').first()).toBeVisible();
  await expect(page.getByText('سه سطح پیشنهادی').first()).toBeVisible();
});

test('web add-on toggle changes the grand total', async ({ page }) => {
  await page.goto('/#/web');
  const grandTotal = page.getByText('جمع کل پیشنهاد').locator('xpath=following-sibling::p[1]');
  const before = await grandTotal.textContent();
  // خاموش‌کردن سوییچ نگهداری
  await page.locator('#add-maint').click();
  await expect(grandTotal).not.toHaveText(before ?? '');
});

test('SEO module shows the client ROI', async ({ page }) => {
  await page.goto('/#/seo');
  await expect(page.getByText('۱۴۰٪').first()).toBeVisible();
});

test('agency module shows the blended rate', async ({ page }) => {
  await page.goto('/#/agency');
  await expect(page.getByText('۷۰۰٬۰۰۰ تومان').first()).toBeVisible();
});

test('module tour opens from the help button', async ({ page }) => {
  await page.goto('/#/mar');
  await page.getByRole('button', { name: 'راهنما' }).click();
  await expect(page.locator('.driver-popover')).toBeVisible();
});

test('PWA manifest is linked', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
});
