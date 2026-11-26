import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  CloseWithLabelIcon,
  HamburgerIcon,
  HamburgerMenuButton,
  HamburgerMenuIconButton,
  HamburgerWithLabelIcon,
} from './HamburgerMenuButton';

test('renders a button named by its text label and handles click', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <HamburgerMenuButton aria-expanded={false} onClick={onClick}>
      <HamburgerIcon />
      メニュー
    </HamburgerMenuButton>,
  );

  const button = screen.getByRole('button', { name: 'メニュー' });
  await expect.element(button).toHaveAttribute('type', 'button');
  await expect.element(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  expect(onClick).toHaveBeenCalledOnce();

  const style = getComputedStyle(button.element());
  expect(style.borderRadius).toBe('6px');
  expect(style.paddingLeft).toBe('12px');
  expect(style.color).toBe('rgb(51, 51, 51)');
});

test('icon button takes its name from the labelled icon and is 44px square', async () => {
  const screen = await render(
    <HamburgerMenuIconButton>
      <HamburgerWithLabelIcon />
    </HamburgerMenuIconButton>,
  );

  const button = screen.getByRole('button', { name: 'メニュー' });
  await expect.element(button).toBeVisible();
  const rect = button.element().getBoundingClientRect();
  expect(rect.width).toBe(44);
  expect(rect.height).toBe(44);
});

test('labelled icons switch their label for English and accept an override', async () => {
  const screen = await render(
    <>
      <HamburgerWithLabelIcon isEnglish={true} />
      <CloseWithLabelIcon />
      <CloseWithLabelIcon isEnglish={true} />
      <CloseWithLabelIcon aria-label='メニューを閉じる' />
    </>,
  );

  await expect.element(screen.getByRole('img', { name: 'MENU' })).toBeVisible();
  await expect.element(screen.getByRole('img', { name: '閉じる', exact: true })).toBeVisible();
  await expect.element(screen.getByRole('img', { name: 'CLOSE' })).toBeVisible();
  await expect.element(screen.getByRole('img', { name: 'メニューを閉じる' })).toBeVisible();
});
