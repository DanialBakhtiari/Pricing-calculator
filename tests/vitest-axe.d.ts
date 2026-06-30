// Type augmentation for the vitest-axe matcher. `import 'vitest'` keeps this a
// module so the `declare module` MERGES with vitest's types instead of shadowing.
import 'vitest';

interface AxeCustomMatchers<R = unknown> {
  toHaveNoViolations(): R;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = unknown> extends AxeCustomMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeCustomMatchers {}
}
