import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  EmergencyBanner,
  EmergencyBannerBody,
  EmergencyBannerButton,
  EmergencyBannerHeading,
} from './EmergencyBanner';

test('renders the heading at the given level with the 【緊急】 prefix', async () => {
  const screen = await render(
    <EmergencyBanner data-testid='banner'>
      <EmergencyBannerHeading level='h3'>避難準備情報が発令されました</EmergencyBannerHeading>
      <EmergencyBannerBody>直ちに避難してください。</EmergencyBannerBody>
    </EmergencyBanner>,
  );

  const heading = screen.getByRole('heading', {
    level: 3,
    name: '【緊急】避難準備情報が発令されました',
  });
  await expect.element(heading).toBeVisible();
  await expect.element(screen.getByText('直ちに避難してください。')).toBeVisible();

  const style = getComputedStyle(screen.getByTestId('banner').element());
  expect(style.borderTopWidth).toBe('6px');
  expect(style.borderTopColor).toBe('rgb(251, 91, 1)');
  expect(style.backgroundColor).toBe('rgb(255, 255, 255)');
});

test('renders the action as a link in the error color', async () => {
  const screen = await render(
    <EmergencyBannerButton href='/shelter'>指定避難所を確認する</EmergencyBannerButton>,
  );

  const link = screen.getByRole('link', { name: '指定避難所を確認する' });
  await expect.element(link).toHaveAttribute('href', '/shelter');
  await expect.element(screen.getByRole('img')).not.toBeInTheDocument();

  const style = getComputedStyle(link.element());
  expect(style.backgroundColor).toBe('rgb(236, 0, 0)');
  expect(style.color).toBe('rgb(255, 255, 255)');
  expect(getComputedStyle(link.element(), '::after').borderTopColor).toBe('rgb(255, 255, 255)');
});

test('announces links that open in a new tab', async () => {
  const screen = await render(
    <EmergencyBannerButton href='/shelter' target='_blank'>
      指定避難所を確認する
    </EmergencyBannerButton>,
  );

  await expect
    .element(screen.getByRole('link', { name: /^指定避難所を確認する\s*新規タブで開きます$/ }))
    .toBeVisible();
});
