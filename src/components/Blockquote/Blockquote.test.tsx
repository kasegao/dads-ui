import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { css } from '../../../styled-system/css';
import { Blockquote } from './Blockquote';

const paragraph = css({ marginBlock: '16' });

test('renders a blockquote with the DADS rule', async () => {
  const screen = await render(<Blockquote cite='https://example.com'>引用文</Blockquote>);

  const element = screen.getByText('引用文').element();
  expect(element.tagName).toBe('BLOCKQUOTE');
  expect(element.getAttribute('cite')).toBe('https://example.com');

  const style = getComputedStyle(element);
  expect(style.borderLeftWidth).toBe('8px');
  expect(style.borderLeftColor).toBe('rgb(118, 118, 118)');
  expect(style.paddingLeft).toBe('24px');
  expect(style.marginLeft).toBe('40px');
});

test('trims the outer margins of the first and last child', async () => {
  const screen = await render(
    <Blockquote>
      <p className={paragraph}>最初</p>
      <p className={paragraph}>中間</p>
      <p className={paragraph}>最後</p>
    </Blockquote>,
  );

  const first = getComputedStyle(screen.getByText('最初').element());
  const middle = getComputedStyle(screen.getByText('中間').element());
  const last = getComputedStyle(screen.getByText('最後').element());

  expect(first.marginTop).toBe('0px');
  expect(first.marginBottom).toBe('16px');
  expect(middle.marginTop).toBe('16px');
  expect(last.marginTop).toBe('16px');
  expect(last.marginBottom).toBe('0px');
});
