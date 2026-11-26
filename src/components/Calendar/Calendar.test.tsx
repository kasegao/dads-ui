import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Calendar } from './Calendar';

afterEach(() => {
  vi.useRealTimers();
});

const range = { min: '2018-01-01', max: '2030-12-31' };

test('renders the month of the selected date in Japanese', async () => {
  const screen = await render(<Calendar defaultValue='2025-02-18' {...range} />);

  await expect.element(screen.getByRole('grid', { name: '2025年2月' })).toBeInTheDocument();
  await expect.element(screen.getByRole('combobox', { name: '年' })).toHaveValue('2025');
  await expect
    .element(screen.getByRole('option', { name: '2019年(令和元年)' }))
    .toBeInTheDocument();
  await expect.element(screen.getByText('2月', { exact: true })).toBeInTheDocument();
  await expect
    .element(screen.getByRole('button', { name: '2025年2月18日火曜日 選択中' }))
    .toBeInTheDocument();
});

test('applies the DADS date cell design', async () => {
  const screen = await render(<Calendar defaultValue='2025-02-18' {...range} />);

  const selected = getComputedStyle(
    screen.getByRole('button', { name: '2025年2月18日火曜日 選択中' }).element(),
  );
  expect(selected.backgroundColor).toBe('rgb(0, 23, 193)');
  expect(selected.color).toBe('rgb(255, 255, 255)');
  expect(selected.width).toBe('40px');
  expect(selected.height).toBe('40px');
  expect(selected.borderRadius).not.toBe('0px');

  const plain = getComputedStyle(
    screen.getByRole('button', { name: '2025年2月19日水曜日' }).element(),
  );
  expect(plain.backgroundColor).toBe('rgba(0, 0, 0, 0)');

  const outside = screen.container.querySelector('[data-value="2025-01-31"][role=button]');
  expect(getComputedStyle(outside as Element).visibility).toBe('hidden');

  const nav = getComputedStyle(screen.getByRole('button', { name: '次の月' }).element());
  expect(nav.width).toBe('44px');
  expect(nav.height).toBe('44px');
  expect(nav.borderTopColor).toBe('rgb(0, 23, 193)');

  expect(getComputedStyle(screen.getByRole('combobox', { name: '年' }).element()).height).toBe(
    '44px',
  );
});

test('selects a date by click', async () => {
  const onValueChange = vi.fn();
  const screen = await render(
    <Calendar defaultValue='2025-02-18' onValueChange={onValueChange} {...range} />,
  );

  await screen.getByRole('button', { name: '2025年2月20日木曜日' }).click();

  expect(onValueChange).toHaveBeenLastCalledWith('2025-02-20');
  await expect
    .element(screen.getByRole('button', { name: '2025年2月20日木曜日 選択中' }))
    .toBeInTheDocument();
});

test('moves between months with the navigation buttons and the year select', async () => {
  const screen = await render(<Calendar defaultValue='2025-02-18' {...range} />);

  await screen.getByRole('button', { name: '次の月' }).click();
  await expect.element(screen.getByRole('grid', { name: '2025年3月' })).toBeInTheDocument();
  await expect.element(screen.getByText('3月', { exact: true })).toBeInTheDocument();

  await screen.getByRole('button', { name: '前の月' }).click();
  await screen.getByRole('button', { name: '前の月' }).click();
  await screen.getByRole('button', { name: '前の月' }).click();
  await expect.element(screen.getByRole('grid', { name: '2024年12月' })).toBeInTheDocument();
  await expect.element(screen.getByRole('combobox', { name: '年' })).toHaveValue('2024');

  await screen.getByRole('combobox', { name: '年' }).selectOptions('2027');
  await expect.element(screen.getByRole('grid', { name: '2027年12月' })).toBeInTheDocument();
});

test('supports keyboard navigation and selection', async () => {
  const onValueChange = vi.fn();
  const screen = await render(
    <Calendar defaultValue='2025-02-18' onValueChange={onValueChange} {...range} />,
  );

  const selected = screen.getByRole('button', { name: '2025年2月18日火曜日 選択中' });
  await expect.element(selected).toHaveAttribute('tabindex', '0');
  (selected.element() as HTMLElement).focus();

  await userEvent.keyboard('{ArrowRight}');
  await expect.element(screen.getByRole('button', { name: '2025年2月19日水曜日' })).toHaveFocus();

  await userEvent.keyboard('{ArrowDown}');
  await expect.element(screen.getByRole('button', { name: '2025年2月26日水曜日' })).toHaveFocus();

  await userEvent.keyboard('{Enter}');
  expect(onValueChange).toHaveBeenLastCalledWith('2025-02-26');

  await userEvent.keyboard('{ArrowDown}');
  await expect.element(screen.getByRole('grid', { name: '2025年3月' })).toBeInTheDocument();
  await expect.element(screen.getByRole('button', { name: '2025年3月5日水曜日' })).toHaveFocus();
});

test('clears the selection with 削除 and selects today with 今日', async () => {
  vi.useFakeTimers({ toFake: ['Date'], now: new Date(2025, 1, 19, 12) });
  const onValueChange = vi.fn();
  const screen = await render(
    <Calendar defaultValue='2025-01-10' onValueChange={onValueChange} {...range} />,
  );

  await screen.getByRole('button', { name: '削除' }).click();
  expect(onValueChange).toHaveBeenLastCalledWith(null);

  await screen.getByRole('button', { name: '今日' }).click();
  expect(onValueChange).toHaveBeenLastCalledWith('2025-02-19');
  await expect.element(screen.getByRole('grid', { name: '2025年2月' })).toBeInTheDocument();
});

test('limits navigation to the min / max range', async () => {
  const screen = await render(
    <Calendar defaultValue='2025-02-18' min='2025-02-10' max='2025-03-20' />,
  );

  await expect.element(screen.getByRole('button', { name: '前の月' })).toBeDisabled();
  expect(screen.getByRole('option').elements()).toHaveLength(1);

  const beforeMin = screen.container.querySelector('[data-value="2025-02-09"][role=button]');
  expect(getComputedStyle(beforeMin as Element).visibility).toBe('hidden');

  await screen.getByRole('button', { name: '次の月' }).click();
  await expect.element(screen.getByRole('button', { name: '次の月' })).toBeDisabled();
});

test('shows unavailable dates as not selectable', async () => {
  const onValueChange = vi.fn();
  const screen = await render(
    <Calendar
      defaultValue='2025-02-18'
      isDateUnavailable={(date) => date === '2025-02-19'}
      onValueChange={onValueChange}
      {...range}
    />,
  );

  const unavailable = screen.getByRole('button', { name: '2025年2月19日水曜日' });
  await expect.element(unavailable).toHaveAttribute('aria-disabled', 'true');
  const style = getComputedStyle(unavailable.element());
  expect(style.visibility).toBe('visible');
  expect(style.color).toBe('rgb(148, 148, 148)');

  await unavailable.click({ force: true });
  expect(onValueChange).not.toHaveBeenCalled();
});

test('follows a controlled value', async () => {
  const screen = await render(<Calendar value='2025-02-18' {...range} />);
  await screen.rerender(<Calendar value='2025-02-21' {...range} />);

  await expect
    .element(screen.getByRole('button', { name: '2025年2月21日金曜日 選択中' }))
    .toBeInTheDocument();

  await screen.rerender(<Calendar value={null} {...range} />);
  await expect
    .element(screen.getByRole('button', { name: '2025年2月21日金曜日', exact: true }))
    .toBeInTheDocument();
});
