# Testing

Tests run in a real browser. Use `render` from `vitest-browser-react` and locators
(`screen.getByRole(...)`), `await expect.element(...)`, and `userEvent` from `vitest/browser`.

- Test behavior and accessibility: roles, names, keyboard interaction, state changes, disabled
  handling, callbacks.
- Styles are real, so assert computed styles only for design-critical values (key color, size).
- Do not assert on generated class names.
- Tests share one real pointer. `vitest.setup.ts` parks it on a fixed marker in the bottom-left
  corner before each test so elements do not start in their `:hover` state.
