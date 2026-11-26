import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Accordion, AccordionBackLink, AccordionContent, AccordionSummary } from './Accordion';

const renderAccordion = (props: { open?: boolean; onToggle?: () => void } = {}) =>
  render(
    <Accordion data-testid='accordion' {...props}>
      <AccordionSummary id='summary'>
        <h3>質問</h3>
      </AccordionSummary>
      <AccordionContent data-testid='content'>
        回答
        <AccordionBackLink href='#summary'>先頭に戻る</AccordionBackLink>
      </AccordionContent>
    </Accordion>,
  );

test('is closed by default and toggles on click', async () => {
  const onToggle = vi.fn();
  const screen = await renderAccordion({ onToggle });
  const details = screen.getByTestId('accordion');

  await expect.element(details).not.toHaveAttribute('open');
  await expect.element(screen.getByTestId('content')).not.toBeVisible();

  await screen.getByText('質問').click();

  await expect.element(details).toHaveAttribute('open');
  await expect.element(screen.getByTestId('content')).toBeVisible();
  await expect.poll(() => onToggle).toHaveBeenCalled();
});

test('toggles with the keyboard', async () => {
  const screen = await renderAccordion();
  const details = screen.getByTestId('accordion');

  await userEvent.tab();
  expect(document.activeElement?.tagName).toBe('SUMMARY');

  await userEvent.keyboard('{Enter}');
  await expect.element(details).toHaveAttribute('open');

  await userEvent.keyboard('{Enter}');
  await expect.element(details).not.toHaveAttribute('open');
});

test('rotates the icon when open and links back to the summary', async () => {
  const screen = await renderAccordion({ open: true });
  const summary = screen.container.querySelector('summary') as HTMLElement;
  const icon = summary.querySelector('span') as HTMLElement;

  expect(getComputedStyle(icon).transform).toBe('matrix(-1, 0, 0, -1, 0, 0)');
  expect(getComputedStyle(icon).color).toBe('rgb(0, 17, 143)');
  await expect
    .element(screen.getByRole('link', { name: '先頭に戻る' }))
    .toHaveAttribute('href', '#summary');
});

test('applies the DADS border and hides the native marker', async () => {
  const screen = await renderAccordion();
  const details = screen.getByTestId('accordion').element();
  const summary = details.querySelector('summary') as HTMLElement;

  expect(getComputedStyle(details).borderBottomWidth).toBe('1px');
  expect(getComputedStyle(details).borderBottomColor).toBe('rgb(148, 148, 148)');
  expect(getComputedStyle(summary).display).toBe('block');
});
