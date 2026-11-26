import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Disclosure, DisclosureBackLink, DisclosureSummary } from './Disclosure';

const renderDisclosure = (open?: boolean) =>
  render(
    <Disclosure data-testid='disclosure' open={open}>
      <DisclosureSummary id='summary'>詳細を見る</DisclosureSummary>
      <div data-testid='content'>
        詳細の内容
        <DisclosureBackLink href='#summary'>先頭に戻る</DisclosureBackLink>
      </div>
    </Disclosure>,
  );

test('is closed by default and toggles on click', async () => {
  const screen = await renderDisclosure();
  const details = screen.getByTestId('disclosure');

  await expect.element(details).not.toHaveAttribute('open');
  await expect.element(screen.getByTestId('content')).not.toBeVisible();

  await screen.getByText('詳細を見る').click();

  await expect.element(details).toHaveAttribute('open');
  await expect.element(screen.getByTestId('content')).toBeVisible();

  await screen.getByText('詳細を見る').click();

  await expect.element(details).not.toHaveAttribute('open');
});

test('toggles with the keyboard', async () => {
  const screen = await renderDisclosure();

  await userEvent.tab();
  expect(document.activeElement?.tagName).toBe('SUMMARY');

  await userEvent.keyboard(' ');
  await expect.element(screen.getByTestId('disclosure')).toHaveAttribute('open');
});

test('styles the summary and rotates the icon when open', async () => {
  const screen = await renderDisclosure(true);
  const summary = screen.container.querySelector('summary') as HTMLElement;
  const icon = summary.querySelector('svg') as SVGElement;

  expect(getComputedStyle(summary).display).toBe('flex');
  expect(getComputedStyle(summary).listStyleType).toBe('none');
  expect(getComputedStyle(icon).color).toBe('rgb(0, 17, 143)');
  expect(getComputedStyle(icon).transform).toBe('matrix(-1, 0, 0, -1, 0, 0)');
  await expect
    .element(screen.getByRole('link', { name: '先頭に戻る' }))
    .toHaveAttribute('href', '#summary');
});
