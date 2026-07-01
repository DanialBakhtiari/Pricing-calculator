// انتشار خروجی build به شاخه‌ی `deploy` برای میزبانی از راهِ git-clone در cPanel
// (زیرِ زیرمسیر /pricing/؛ base در vite.config.ts باید با همان مسیر یکی باشد).
//
// اجرا:  pnpm deploy
// نتیجه: build تازه → شاخه‌ی deploy (فایل‌های استاتیک در ریشه) → push -f به origin.
// روی هاست فقط کافی است در پوشه‌ی کلون‌شده `git pull` بزنی.

import { execSync } from 'node:child_process';
import { mkdtempSync, readdirSync, cpSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BRANCH = 'deploy';
const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const quiet = (cmd, opts = {}) => {
  try {
    execSync(cmd, { stdio: 'ignore', ...opts });
  } catch {
    /* بی‌اهمیت (مثلاً حذفِ چیزی که وجود ندارد) */
  }
};

// build تازه (خطا ⇒ توقف).
run('pnpm build');

const wt = mkdtempSync(join(tmpdir(), 'deploy-wt-'));
try {
  quiet(`git worktree remove --force "${wt}"`);
  quiet(`git branch -D ${BRANCH}`);
  run(`git worktree add -f --detach "${wt}"`);

  // شاخه‌ی orphan تمیز؛ همه‌ی فایل‌های ردیابی‌شده را پاک کن.
  run(`git checkout --orphan ${BRANCH}`, { cwd: wt });
  quiet('git rm -rf .', { cwd: wt });

  // خروجی build را در ریشه‌ی شاخه بریز.
  for (const entry of readdirSync('dist')) {
    cpSync(join('dist', entry), join(wt, entry), { recursive: true });
  }

  // این پوشه به‌صورت کلونِ زنده سرو می‌شود؛ دسترسی به .git را ببند.
  writeFileSync(
    join(wt, '.htaccess'),
    '# served git clone — hide VCS internals\nRedirectMatch 404 /\\.git(/|$)\n',
  );

  run('git add -A -f', { cwd: wt });
  run('git commit -q -m "deploy: prebuilt static site (Vite base /pricing/)"', { cwd: wt });
  run(`git push -f -u origin ${BRANCH}`, { cwd: wt });
} finally {
  quiet(`git worktree remove --force "${wt}"`);
  quiet(`git branch -D ${BRANCH}`);
}

console.log('\n✓ deploy branch published. On the host, inside the clone: git pull');
