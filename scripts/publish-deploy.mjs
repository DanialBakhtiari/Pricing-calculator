// انتشار نسخه‌ی جدیدِ سایت روی همین شاخه‌ی main برای میزبانی از راهِ git-clone در
// cPanel (زیرِ /pricing/؛ base در vite.config.ts باید با همان مسیر یکی باشد).
//
// اجرا:  pnpm deploy
// نتیجه: build تازه → کامیتِ خروجیِ dist (+ .htaccess) روی main → push.
// روی هاست، داخل پوشه‌ی کلون‌شده فقط: git pull

import { execSync } from 'node:child_process';

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });

// build تازه (خطا ⇒ توقف).
run('pnpm build');

// فقط خروجیِ ساخت را stage کن (dist در gitignore نیست؛ -f صرفاً محکم‌کاری است).
run('git add -f dist .htaccess');

// اگر build نسبت به کامیت قبلی تغییری نداشت، کامیتِ خالی نساز.
let changed = true;
try {
  execSync('git diff --cached --quiet');
  changed = false;
} catch {
  changed = true;
}

if (!changed) {
  console.log('\n• build خروجیِ تازه‌ای نداشت؛ کامیتی ساخته نشد.');
} else {
  run('git commit -m "chore: rebuild static site for /pricing/"');
}

run('git push origin HEAD');
console.log('\n✓ منتشر شد روی main. روی هاست، داخل پوشه‌ی کلون: git pull');
