import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  ProgressIndicator,
  ProgressIndicatorLinear,
  ProgressIndicatorSpinner,
  ProgressIndicatorStatic,
} from './ProgressIndicator';

const animationNames = (element: Element | null) =>
  element ? getComputedStyle(element).animationName : undefined;

test('exposes an indeterminate progressbar and runs the loop animation', async () => {
  const screen = await render(
    <ProgressIndicator type='stacked' aria-label='読み込み中'>
      <ProgressIndicatorSpinner />
    </ProgressIndicator>,
  );

  const progressbar = screen.getByRole('progressbar', { name: '読み込み中' });
  await expect.element(progressbar).toBeVisible();
  await expect.element(progressbar).not.toHaveAttribute('aria-valuenow');
  await expect.element(progressbar).toHaveAttribute('data-indeterminate');

  const svg = progressbar.element().querySelector('svg') as SVGElement;
  expect(svg.getAttribute('aria-hidden')).toBe('true');
  expect(animationNames(svg.querySelector('g'))).toBe('dads-spinner-rotate');
  expect(animationNames(svg.querySelector('g > g'))).toBe('dads-spinner-group-rotate');
  expect(animationNames(svg.querySelector('g > g > circle'))).toBe(
    'dads-spinner-bar-rotate, dads-spinner-bar-dash',
  );
  expect(getComputedStyle(progressbar.element()).flexDirection).toBe('column');
});

test('the keyframes are loaded and actually animate the spinner', async () => {
  const screen = await render(
    <ProgressIndicator type='inlined' aria-label='読み込み中'>
      <ProgressIndicatorSpinner size='sm' />
    </ProgressIndicator>,
  );

  const group = screen.getByRole('progressbar').element().querySelector('g') as SVGGElement;
  const [animation] = group.getAnimations() as CSSAnimation[];
  expect(animation.animationName).toBe('dads-spinner-rotate');
  expect((animation.effect as KeyframeEffect).getKeyframes().length).toBeGreaterThan(1);
});

test('reports a clamped value and stops looping when determinate', async () => {
  const screen = await render(
    <>
      <ProgressIndicator type='inlined' value={40} aria-label='A'>
        <ProgressIndicatorLinear size='sm' />
      </ProgressIndicator>
      <ProgressIndicator type='inlined' value={140} aria-label='B'>
        <ProgressIndicatorSpinner size='sm' />
      </ProgressIndicator>
      <ProgressIndicator type='inlined' value={Number.NaN} aria-label='C'>
        <ProgressIndicatorSpinner size='sm' />
      </ProgressIndicator>
    </>,
  );

  const a = screen.getByRole('progressbar', { name: 'A' });
  await expect.element(a).toHaveAttribute('aria-valuenow', '40');
  await expect.element(a).toHaveAttribute('aria-valuemin', '0');
  await expect.element(a).toHaveAttribute('aria-valuemax', '100');
  await expect.element(a).not.toHaveAttribute('data-indeterminate');

  const bar = a.element().querySelectorAll('line')[1];
  expect(getComputedStyle(bar).animationName).toBe('none');
  expect(getComputedStyle(bar).strokeDashoffset).toMatch(/^(calc\()?60px\)?$/);
  expect(getComputedStyle(bar).stroke).toBe('rgb(0, 0, 96)');
  expect(getComputedStyle(a.element().querySelectorAll('line')[0]).stroke).toBe(
    'rgb(217, 230, 255)',
  );

  await expect
    .element(screen.getByRole('progressbar', { name: 'B' }))
    .toHaveAttribute('aria-valuenow', '100');
  await expect
    .element(screen.getByRole('progressbar', { name: 'C' }))
    .toHaveAttribute('data-indeterminate');
});

test('renders nothing when inactive', async () => {
  const screen = await render(
    <ProgressIndicator type='stacked' active={false} aria-label='読み込み中'>
      <ProgressIndicatorSpinner />
    </ProgressIndicator>,
  );

  await expect.element(screen.getByRole('progressbar')).not.toBeInTheDocument();
});

test('stacked-underlay draws a bordered card sized for its indicator', async () => {
  const screen = await render(
    <>
      <ProgressIndicator type='stacked-underlay' aria-label='spinner'>
        <ProgressIndicatorStatic />
      </ProgressIndicator>
      <ProgressIndicator type='stacked-underlay' aria-label='linear'>
        <ProgressIndicatorLinear />
      </ProgressIndicator>
    </>,
  );

  const spinner = getComputedStyle(screen.getByRole('progressbar', { name: 'spinner' }).element());
  expect(spinner.minWidth).toBe('128px');
  expect(spinner.minHeight).toBe('128px');
  expect(spinner.paddingTop).toBe('16px');
  expect(spinner.borderTopWidth).toBe('1px');
  expect(spinner.borderTopLeftRadius).toBe('16px');
  expect(spinner.backgroundColor).toBe('rgb(255, 255, 255)');

  const linear = getComputedStyle(screen.getByRole('progressbar', { name: 'linear' }).element());
  expect(linear.paddingTop).toBe('24px');
  expect(linear.minWidth).not.toBe('128px');
});
