import { createHashRouter } from 'react-router-dom';
import { MODULES } from '@/content/fa';
import { AppLayout } from './AppLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { PlaygroundPage } from '@/features/playground/PlaygroundPage';
import { ModulePlaceholder } from '@/features/placeholder/ModulePlaceholder';

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
        element: <ModulePlaceholder moduleId={m.id} />,
      })),
    ],
  },
]);
