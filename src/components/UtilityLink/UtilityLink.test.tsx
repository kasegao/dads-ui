import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { UtilityLink } from './UtilityLink';

test('renders a link with the utility link style', async () => {
  const screen = await render(<UtilityLink href='/contact'>お問い合わせ</UtilityLink>);

  const link = screen.getByRole('link', { name: 'お問い合わせ' });
  await expect.element(link).toHaveAttribute('href', '/contact');

  const style = getComputedStyle(link.element());
  expect(style.color).toBe('rgb(51, 51, 51)');
  expect(style.textDecorationLine).toBe('underline');
  expect(link.element().querySelector('svg')).toBeNull();
});

test('adds a labelled external-link icon when target is _blank', async () => {
  const screen = await render(
    <UtilityLink href='https://www.digital.go.jp' target='_blank' rel='noreferrer'>
      デジタル庁
    </UtilityLink>,
  );

  await expect
    .element(screen.getByRole('link', { name: 'デジタル庁 新規タブで開きます' }))
    .toBeVisible();
});

test('icon label can be overridden', async () => {
  const screen = await render(
    <UtilityLink
      href='https://www.digital.go.jp/en'
      target='_blank'
      icon={{ 'aria-label': 'Opens in a new tab' }}
    >
      Digital Agency
    </UtilityLink>,
  );

  await expect.element(screen.getByRole('img', { name: 'Opens in a new tab' })).toBeVisible();
});

test('asChild applies the style to the child element', async () => {
  const screen = await render(
    <UtilityLink asChild={true}>
      <a href='/sitemap'>サイトマップ</a>
    </UtilityLink>,
  );

  const link = screen.getByRole('link', { name: 'サイトマップ' });
  expect(getComputedStyle(link.element()).color).toBe('rgb(51, 51, 51)');
});
