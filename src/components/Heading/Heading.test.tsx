import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Heading, HeadingShoulder, HeadingTitle } from './Heading';

test('renders the requested heading level inside a div', async () => {
  const screen = await render(
    <Heading size='36' data-testid='root'>
      <HeadingTitle level='h3'>見出し</HeadingTitle>
    </Heading>,
  );

  await expect.element(screen.getByRole('heading', { level: 3, name: '見出し' })).toBeVisible();

  const root = screen.getByTestId('root').element();
  const style = getComputedStyle(root);
  expect(root.tagName).toBe('DIV');
  expect(style.fontSize).toBe('36px');
  expect(style.fontWeight).toBe('700');
  expect(style.color).toBe('rgb(51, 51, 51)');
  expect(style.borderBottomWidth).toBe('0px');
});

test('uses hgroup and sizes the shoulder from the heading size', async () => {
  const screen = await render(
    <Heading size='64' data-testid='root'>
      <HeadingShoulder>ショルダー</HeadingShoulder>
      <HeadingTitle level='h1'>見出し</HeadingTitle>
    </Heading>,
  );

  expect(screen.getByTestId('root').element().tagName).toBe('HGROUP');

  const shoulder = getComputedStyle(screen.getByText('ショルダー').element());
  expect(shoulder.fontSize).toBe('28px');
  expect(shoulder.lineHeight).toBe('42px');
  expect(shoulder.fontWeight).toBe('700');
});

test('draws the key-color rule', async () => {
  const screen = await render(
    <Heading size='24' rule='6' data-testid='root'>
      <HeadingTitle level='h2'>見出し</HeadingTitle>
    </Heading>,
  );

  const style = getComputedStyle(screen.getByTestId('root').element());
  expect(style.borderBottomWidth).toBe('6px');
  expect(style.borderBottomStyle).toBe('solid');
  expect(style.borderBottomColor).toBe('rgb(0, 23, 193)');
  expect(style.paddingBottom).toBe('24px');
});

test('draws the chip bar', async () => {
  const screen = await render(
    <Heading size='36' hasChip={true} data-testid='root'>
      <HeadingTitle level='h2'>見出し</HeadingTitle>
    </Heading>,
  );

  const root = screen.getByTestId('root').element();
  const bar = getComputedStyle(root, '::before');
  expect(getComputedStyle(root).paddingLeft).toBe('30px');
  expect(bar.position).toBe('absolute');
  expect(bar.width).toBe('12px');
  expect(bar.backgroundColor).toBe('rgb(0, 23, 193)');
  // 0.5lh - 0.45em = 25.2px - 16.2px
  expect(Number.parseFloat(bar.top)).toBeCloseTo(9, 1);
});

test('aligns the chip bar to the shoulder when there is one', async () => {
  const screen = await render(
    <Heading size='36' hasChip={true} data-testid='root'>
      <HeadingShoulder>ショルダー</HeadingShoulder>
      <HeadingTitle level='h2'>見出し</HeadingTitle>
    </Heading>,
  );

  const bar = getComputedStyle(screen.getByTestId('root').element(), '::before');
  // 20px * (1.5 - 1) / 2
  expect(Number.parseFloat(bar.top)).toBeCloseTo(5, 1);
  expect(bar.backgroundColor).toBe('rgb(0, 23, 193)');
});
