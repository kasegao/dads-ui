import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { ErrorText } from './ErrorText';

test('renders the message in the error color', async () => {
  const screen = await render(<ErrorText id='error'>＊入力内容を確認してください。</ErrorText>);

  const text = screen.getByText('＊入力内容を確認してください。');
  await expect.element(text).toHaveAttribute('id', 'error');

  const style = getComputedStyle(text.element());
  expect(style.color).toBe('rgb(236, 0, 0)');
  expect(style.fontSize).toBe('16px');
});
