import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  NotificationBanner,
  NotificationBannerBody,
  NotificationBannerClose,
  NotificationBannerMobileClose,
  type NotificationBannerType,
} from './NotificationBanner';

test('renders the title as a heading with the type icon and body', async () => {
  const screen = await render(
    <NotificationBanner bannerStyle='standard' type='error' headingLevel='h3' title='失敗しました'>
      <NotificationBannerBody>もう一度お試しください。</NotificationBannerBody>
    </NotificationBanner>,
  );

  await expect
    .element(screen.getByRole('heading', { level: 3, name: 'エラー 失敗しました' }))
    .toBeVisible();
  await expect.element(screen.getByRole('img', { name: 'エラー' })).toBeVisible();
  await expect.element(screen.getByText('もう一度お試しください。')).toBeVisible();
});

test('renders no heading element when headingLevel is omitted', async () => {
  const screen = await render(
    <NotificationBanner bannerStyle='standard' type='info1' title='お知らせ' />,
  );

  await expect.element(screen.getByText('お知らせ')).toBeVisible();
  await expect.element(screen.getByRole('heading')).not.toBeInTheDocument();
});

test.each<[NotificationBannerType, string, string]>([
  ['info1', 'インフォメーション', 'rgb(0, 23, 193)'],
  ['info2', 'インフォメーション', 'rgb(118, 118, 118)'],
  ['warning', '警告', 'rgb(146, 114, 0)'],
  ['error', 'エラー', 'rgb(236, 0, 0)'],
  ['success', '成功', 'rgb(25, 122, 75)'],
])('uses the %s icon and border color', async (type, iconName, color) => {
  const screen = await render(
    <NotificationBanner data-testid='banner' bannerStyle='standard' type={type} title='タイトル' />,
  );

  await expect.element(screen.getByRole('img', { name: iconName })).toBeVisible();
  const style = getComputedStyle(screen.getByTestId('banner').element());
  expect(style.borderTopColor).toBe(color);
  expect(style.borderTopWidth).toBe('3px');
  expect(style.borderTopLeftRadius).toBe('12px');
  expect(getComputedStyle(screen.getByText('タイトル').element()).color).toBe('rgb(26, 26, 26)');
});

test('draws the color chip as an inset shadow', async () => {
  const screen = await render(
    <>
      <NotificationBanner data-testid='error' bannerStyle='color-chip' type='error' title='A' />
      <NotificationBanner data-testid='warning' bannerStyle='color-chip' type='warning' title='B' />
    </>,
  );

  const error = getComputedStyle(screen.getByTestId('error').element());
  expect(error.borderTopWidth).toBe('2px');
  expect(error.borderTopLeftRadius).toBe('0px');
  expect(error.paddingLeft).toBe('24px');
  expect(error.boxShadow).toBe('rgb(236, 0, 0) 8px 0px 0px 0px inset');
  expect(getComputedStyle(screen.getByTestId('warning').element()).boxShadow).toBe(
    'rgb(255, 199, 0) 8px 0px 0px 0px inset',
  );
});

test('close buttons are labelled and fire onClick', async () => {
  const onClose = vi.fn();
  const onMobileClose = vi.fn();
  const screen = await render(
    <>
      <NotificationBannerClose onClick={onClose} />
      <NotificationBannerClose label='通知を閉じる' />
      <NotificationBannerMobileClose data-testid='mobile' onClick={onMobileClose} />
    </>,
  );

  await screen.getByRole('button', { name: '閉じる', exact: true }).first().click();
  await screen.getByTestId('mobile').click();

  expect(onClose).toHaveBeenCalledOnce();
  expect(onMobileClose).toHaveBeenCalledOnce();
  await expect.element(screen.getByRole('button', { name: '通知を閉じる' })).toBeVisible();
  await expect.element(screen.getByTestId('mobile')).toHaveAccessibleName('閉じる');
  await expect.element(screen.getByTestId('mobile')).toHaveAttribute('type', 'button');
});
