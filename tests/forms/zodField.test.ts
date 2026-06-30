import { describe, it, expect } from 'vitest';
import type { z } from 'zod';
import { numberFieldSchema } from '@/lib/forms/zodField';
import { messages } from '@/content/fa';

function firstMessage(result: z.ZodSafeParseResult<unknown>): string | undefined {
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe('numberFieldSchema', () => {
  it('accepts a valid number', () => {
    expect(numberFieldSchema().safeParse(5).success).toBe(true);
  });

  it('rejects null/empty with the invalid-number message', () => {
    expect(firstMessage(numberFieldSchema().safeParse(null))).toBe(messages.invalidNumber);
  });

  it('rejects negatives by default with the negative message', () => {
    expect(firstMessage(numberFieldSchema().safeParse(-1))).toBe(messages.negativeInput);
  });

  it('allows negatives when allowNegative is set', () => {
    expect(numberFieldSchema({ allowNegative: true }).safeParse(-5).success).toBe(true);
  });

  it('enforces an explicit min/max with the out-of-range message', () => {
    const schema = numberFieldSchema({ min: 40, max: 52 });
    expect(firstMessage(schema.safeParse(10))).toBe(messages.outOfRange);
    expect(firstMessage(schema.safeParse(60))).toBe(messages.outOfRange);
    expect(schema.safeParse(48).success).toBe(true);
  });
});
