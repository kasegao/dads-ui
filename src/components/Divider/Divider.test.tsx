import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Divider } from './Divider';

test('renders a 1px solid gray separator by default', async () => {
  const screen = await render(<Divider />);

  const style = getComputedStyle(screen.getByRole('separator').element());
  expect(style.borderTopWidth).toBe('1px');
  expect(style.borderTopStyle).toBe('solid');
  expect(style.borderTopColor).toBe('rgb(148, 148, 148)');
  expect(style.borderBottomWidth).toBe('0px');
});

test('applies color, thickness and variant', async () => {
  const screen = await render(<Divider color='black' thickness='4' variant='dashed' />);

  const style = getComputedStyle(screen.getByRole('separator').element());
  expect(style.borderTopWidth).toBe('4px');
  expect(style.borderTopStyle).toBe('dashed');
  expect(style.borderTopColor).toBe('rgb(0, 0, 0)');
});

test('applies the gray-536 color', async () => {
  const screen = await render(<Divider color='gray-536' />);

  const style = getComputedStyle(screen.getByRole('separator').element());
  expect(style.borderTopColor).toBe('rgb(118, 118, 118)');
});
