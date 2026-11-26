import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  PageNavigation,
  PageNavigationArrowButton,
  PageNavigationButton,
  PageNavigationCounter,
} from './PageNavigation';

const arrow = (
  <svg aria-hidden='true' height='24' viewBox='0 0 24 24' width='24'>
    <path d='m7.9 12 8-8-1.4-1.4L5.1 12l9.4 9.4 1.4-1.4z' />
  </svg>
);

test('arrow buttons are named by their label and fire click', async () => {
  const onPrev = vi.fn();
  const screen = await render(
    <PageNavigation aria-label='ページ'>
      <PageNavigationArrowButton label='前のページ' size='lg' onClick={onPrev}>
        {arrow}
      </PageNavigationArrowButton>
      <PageNavigationCounter>5 / 9</PageNavigationCounter>
      <PageNavigationArrowButton asChild={true} size='lg'>
        <a href='/page/6' aria-label='次のページ'>
          {arrow}
        </a>
      </PageNavigationArrowButton>
    </PageNavigation>,
  );

  await expect.element(screen.getByRole('navigation', { name: 'ページ' })).toBeVisible();
  await expect.element(screen.getByText('5 / 9')).toBeVisible();

  const prev = screen.getByRole('button', { name: '前のページ' });
  await expect.element(prev).toHaveAttribute('type', 'button');
  await prev.click();
  expect(onPrev).toHaveBeenCalledOnce();

  await expect
    .element(screen.getByRole('link', { name: '次のページ' }))
    .toHaveAttribute('href', '/page/6');
});

test('arrow button sizes follow the DADS scale', async () => {
  const screen = await render(
    <PageNavigation aria-label='ページ'>
      {(['lg', 'md', 'sm', 'xs'] as const).map((size) => (
        <PageNavigationArrowButton key={size} label={size} size={size}>
          {arrow}
        </PageNavigationArrowButton>
      ))}
    </PageNavigation>,
  );

  const expected = { lg: '44px', md: '32px', sm: '24px', xs: '20px' };
  for (const [size, px] of Object.entries(expected)) {
    const element = screen.getByRole('button', { name: size }).element();
    const style = getComputedStyle(element);
    expect(style.width).toBe(px);
    expect(style.height).toBe(px);
    expect(style.borderRadius).not.toBe('0px');
    expect(style.color).toBe('rgb(0, 17, 143)');
  }

  const hitArea = getComputedStyle(screen.getByRole('button', { name: 'xs' }).element(), '::after');
  expect(hitArea.width).toBe('44px');
  expect(hitArea.height).toBe('44px');
});

test('PageNavigationButton overrides one side of the wrapped Button padding', async () => {
  const screen = await render(
    <PageNavigation aria-label='ページ'>
      <PageNavigationButton control='prev' size='md' variant='text'>
        前のページ
      </PageNavigationButton>
      <PageNavigationButton control='next' size='md' variant='text'>
        次のページ
      </PageNavigationButton>
      <PageNavigationButton control='prev' asChild={true} size='lg' variant='outline'>
        <a href='/first'>最初のページ</a>
      </PageNavigationButton>
      <PageNavigationButton control='next' size='lg' variant='outline'>
        最後のページ
      </PageNavigationButton>
    </PageNavigation>,
  );

  const padding = (role: 'button' | 'link', name: string) => {
    const element = screen.getByRole(role, { name }).element();
    const style = getComputedStyle(element);
    return [style.paddingLeft, style.paddingRight, element.getAttribute('data-control')];
  };

  expect(padding('button', '前のページ')).toEqual(['8px', '16px', 'prev']);
  expect(padding('button', '次のページ')).toEqual(['16px', '8px', 'next']);
  expect(padding('link', '最初のページ')).toEqual(['16px', '24px', 'prev']);
  expect(padding('button', '最後のページ')).toEqual(['24px', '16px', 'next']);
});
