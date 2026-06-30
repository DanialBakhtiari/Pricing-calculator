import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PlaygroundPage } from '@/features/playground/PlaygroundPage';

describe('PlaygroundPage (sample page integration)', () => {
  it('computes and formats the adjusted price from default inputs', () => {
    render(
      <MemoryRouter>
        <PlaygroundPage />
      </MemoryRouter>,
    );
    // 150,000,000 × 1.8 × (1 + 0.25) = 337,500,000 → فرمت تومانِ فارسی
    expect(screen.getByText('۳۳۷٬۵۰۰٬۰۰۰ تومان')).toBeInTheDocument();
  });

  it('renders the field labels from the content layer', () => {
    render(
      <MemoryRouter>
        <PlaygroundPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('نمونه‌ی کامپوننت‌ها')).toBeInTheDocument();
    expect(screen.getByLabelText('قیمت پایه')).toBeInTheDocument();
  });
});
