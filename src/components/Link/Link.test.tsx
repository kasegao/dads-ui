import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Link, LinkExternalLinkIcon } from './Link';

test('renders an anchor with the DADS link style', async () => {
  const screen = await render(<Link href='/next'>次のページ</Link>);

  const link = screen.getByRole('link', { name: '次のページ' });
  await expect.element(link).toHaveAttribute('href', '/next');

  const style = getComputedStyle(link.element());
  expect(style.color).toBe('rgb(0, 17, 143)');
  expect(style.textDecorationLine).toBe('underline');
  expect(style.textUnderlineOffset).toBe('3px');
});

test('adds the external-link icon for target=_blank', async () => {
  const screen = await render(
    <Link href='https://www.digital.go.jp' target='_blank'>
      デジタル庁
    </Link>,
  );

  await expect
    .element(screen.getByRole('link'))
    .toHaveAccessibleName(/デジタル庁\s*新規タブで開きます/);
  await expect.element(screen.getByRole('img', { name: '新規タブで開きます' })).toBeVisible();
});

test('does not add the icon for same-tab links', async () => {
  const screen = await render(<Link href='/next'>次のページ</Link>);

  expect(screen.container.querySelector('svg')).toBeNull();
});

test('icon props override the icon label', async () => {
  const screen = await render(
    <Link href='https://example.com' target='_blank' icon={{ 'aria-label': '別ウィンドウで開く' }}>
      外部サイト
    </Link>,
  );

  await expect.element(screen.getByRole('img', { name: '別ウィンドウで開く' })).toBeVisible();
});

test('asChild applies the link style to the child element', async () => {
  const screen = await render(
    <Link asChild={true}>
      <a href='/child'>
        子要素
        <LinkExternalLinkIcon />
      </a>
    </Link>,
  );

  const link = screen.getByRole('link');
  await expect.element(link).toHaveAttribute('href', '/child');
  expect(getComputedStyle(link.element()).textDecorationLine).toBe('underline');
});
