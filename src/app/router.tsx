/* eslint-disable react-refresh/only-export-components --
   فایل پیکربندی router: تعریف lazy صفحات این‌جا عمدی است (نه ماژول کامپوننت). */
import { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { MODULES } from '@/content/fa';
import { AppLayout } from './AppLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ModulePlaceholder } from '@/features/placeholder/ModulePlaceholder';

// صفحات سنگین (فرم+موتور+RHF/zod) lazy می‌شوند تا از باندل اولیه جدا بمانند (architecture §11).
const PlaygroundPage = lazy(() =>
  import('@/features/playground/PlaygroundPage').then((m) => ({ default: m.PlaygroundPage })),
);
const MarPage = lazy(() => import('@/features/mar/MarPage').then((m) => ({ default: m.MarPage })));

// Hash router: زیر هر مسیر/ساب‌دامین و در حالت embed (iframe) بدون پیکربندی سرور کار می‌کند.
export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'playground', element: <PlaygroundPage /> },
      ...MODULES.map((m) => ({
        path: m.id,
        element: m.id === 'mar' ? <MarPage /> : <ModulePlaceholder moduleId={m.id} />,
      })),
    ],
  },
]);
