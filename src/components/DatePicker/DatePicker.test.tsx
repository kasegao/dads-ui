import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import type { DatePickerProps } from './DatePicker';
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerCalendarButton,
  DatePickerDate,
  DatePickerFields,
  DatePickerMonth,
  DatePickerYear,
} from './DatePicker';

const Example = (props: DatePickerProps) => (
  <DatePicker min='2018-01-01' max='2030-12-31' {...props}>
    <DatePickerFields data-testid='fields'>
      <DatePickerYear />
      <DatePickerMonth />
      <DatePickerDate />
    </DatePickerFields>
    <DatePickerCalendarButton />
    <DatePickerCalendar />
  </DatePicker>
);

test('renders year, month and day inputs filled from the value', async () => {
  const screen = await render(<Example defaultValue='2025-02-18' />);

  await expect.element(screen.getByRole('textbox', { name: '年' })).toHaveValue('2025');
  await expect.element(screen.getByRole('textbox', { name: '月' })).toHaveValue('02');
  await expect.element(screen.getByRole('textbox', { name: '日' })).toHaveValue('18');
  await expect
    .element(screen.getByRole('textbox', { name: '年' }))
    .toHaveAttribute('inputmode', 'numeric');
  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
});

test('applies the DADS design for each size and state', async () => {
  const screen = await render(
    <>
      <Example data-testid='lg' />
      <Example data-testid='md' size='md' isError={true} />
      <Example data-testid='sm' size='sm' isReadonly={true} />
      <Example data-testid='disabled' isDisabled={true} />
    </>,
  );

  const style = (id: string, selector: string) =>
    getComputedStyle(screen.getByTestId(id).element().querySelector(selector) as Element);

  const lg = style('lg', '[data-testid=fields]');
  expect(lg.height).toBe('56px');
  expect(lg.borderTopColor).toBe('rgb(102, 102, 102)');
  expect(lg.borderTopStyle).toBe('solid');
  expect(lg.borderRadius).toBe('8px');
  expect(style('lg', 'button').height).toBe('56px');
  expect(style('lg', 'button').borderTopColor).toBe('rgb(0, 23, 193)');
  expect(style('lg', 'button').color).toBe('rgb(0, 23, 193)');
  expect(style('lg', 'input').width).toBe('64px');
  expect(style('lg', 'label:last-of-type input').width).toBe('44px');

  const md = style('md', '[data-testid=fields]');
  expect(md.height).toBe('48px');
  expect(md.borderTopColor).toBe('rgb(236, 0, 0)');
  expect(style('md', 'button').height).toBe('48px');

  const sm = style('sm', '[data-testid=fields]');
  expect(sm.height).toBe('40px');
  expect(sm.borderTopStyle).toBe('dashed');
  expect(style('sm', 'button').height).toBe('40px');

  const disabled = style('disabled', '[data-testid=fields]');
  expect(disabled.backgroundColor).toBe('rgb(242, 242, 242)');
  expect(disabled.borderTopColor).toBe('rgb(179, 179, 179)');
  expect(disabled.color).toBe('rgb(148, 148, 148)');
});

test('opens the calendar popup and picks a date', async () => {
  const onValueChange = vi.fn();
  const screen = await render(<Example defaultValue='2025-02-18' onValueChange={onValueChange} />);

  const button = screen.getByRole('button', { name: 'カレンダー' });
  await expect.element(button).toHaveAttribute('aria-expanded', 'false');
  await expect.element(button).toHaveAttribute('aria-haspopup', 'dialog');

  await button.click();
  await expect.element(button).toHaveAttribute('aria-expanded', 'true');
  const dialog = screen.getByRole('dialog', { name: 'カレンダー' });
  await expect.element(dialog).toBeVisible();
  await expect.element(screen.getByRole('grid', { name: '2025年2月' })).toBeVisible();
  await expect
    .element(screen.getByRole('button', { name: '2025年2月18日火曜日 選択中' }))
    .toHaveFocus();

  const popup = getComputedStyle(dialog.element());
  expect(popup.borderTopColor).toBe('rgb(148, 148, 148)');
  expect(popup.borderRadius).toBe('8px');
  expect(popup.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(popup.boxShadow).not.toBe('none');

  await screen.getByRole('button', { name: '2025年2月20日木曜日' }).click();

  expect(onValueChange).toHaveBeenLastCalledWith('2025-02-20');
  await expect.element(screen.getByRole('textbox', { name: '日' })).toHaveValue('20');
  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  await expect.element(button).toHaveAttribute('aria-expanded', 'false');
  await expect.element(button).toHaveFocus();
});

test('navigates months in the popup with mouse and keyboard', async () => {
  const onValueChange = vi.fn();
  const screen = await render(<Example defaultValue='2025-02-18' onValueChange={onValueChange} />);

  await screen.getByRole('button', { name: 'カレンダー' }).click();
  await screen.getByRole('button', { name: '次の月' }).click();
  await expect.element(screen.getByRole('grid', { name: '2025年3月' })).toBeVisible();

  await screen.getByRole('combobox', { name: '年' }).selectOptions('2026');
  await expect.element(screen.getByRole('grid', { name: '2026年3月' })).toBeVisible();

  // Changing the month moves the roving tab stop to the first day of that month.
  const firstDay = screen.getByRole('button', { name: '2026年3月1日日曜日' });
  await expect.element(firstDay).toHaveAttribute('tabindex', '0');
  (firstDay.element() as HTMLElement).focus();
  await userEvent.keyboard('{ArrowRight}{ArrowDown}{Enter}');

  expect(onValueChange).toHaveBeenLastCalledWith('2026-03-09');
  await expect.element(screen.getByRole('textbox', { name: '年' })).toHaveValue('2026');
  await expect.element(screen.getByRole('textbox', { name: '月' })).toHaveValue('03');
  await expect.element(screen.getByRole('textbox', { name: '日' })).toHaveValue('09');
});

test('closes the popup with Escape and returns focus to the button', async () => {
  const screen = await render(<Example defaultValue='2025-02-18' />);

  const button = screen.getByRole('button', { name: 'カレンダー' });
  await button.click();
  await expect.element(screen.getByRole('dialog')).toBeVisible();

  await userEvent.keyboard('{Escape}');
  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  await expect.element(button).toHaveFocus();
});

test('clears the inputs with 削除 in the popup', async () => {
  const onValueChange = vi.fn();
  const screen = await render(<Example defaultValue='2025-02-18' onValueChange={onValueChange} />);

  await screen.getByRole('button', { name: 'カレンダー' }).click();
  await screen.getByRole('button', { name: '削除' }).click();

  expect(onValueChange).toHaveBeenLastCalledWith(null);
  await expect.element(screen.getByRole('textbox', { name: '年' })).toHaveValue('');
  await expect.element(screen.getByRole('textbox', { name: '月' })).toHaveValue('');
  await expect.element(screen.getByRole('textbox', { name: '日' })).toHaveValue('');
  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
});

test('commits typed dates on blur and keeps incomplete input', async () => {
  const onValueChange = vi.fn();
  const screen = await render(<Example onValueChange={onValueChange} />);

  await screen.getByRole('textbox', { name: '年' }).fill('2025');
  await screen.getByRole('textbox', { name: '月' }).fill('3');
  expect(onValueChange).not.toHaveBeenCalled();
  await screen.getByRole('textbox', { name: '日' }).fill('5');
  await userEvent.tab();

  expect(onValueChange).toHaveBeenLastCalledWith('2025-03-05');
  await expect.element(screen.getByRole('textbox', { name: '月' })).toHaveValue('3');

  await screen.getByRole('button', { name: 'カレンダー' }).click();
  await expect
    .element(screen.getByRole('button', { name: '2025年3月5日水曜日 選択中' }))
    .toBeVisible();
  await userEvent.keyboard('{Escape}');

  await screen.getByRole('textbox', { name: '日' }).fill('32');
  await userEvent.tab();
  expect(onValueChange).toHaveBeenLastCalledWith(null);
  await expect.element(screen.getByRole('textbox', { name: '日' })).toHaveValue('32');
  await expect.element(screen.getByRole('textbox', { name: '年' })).toHaveValue('2025');
});

test('moves between inputs with arrow keys and ignores non-digit keys', async () => {
  const screen = await render(<Example />);

  const year = screen.getByRole('textbox', { name: '年' });
  const month = screen.getByRole('textbox', { name: '月' });
  const day = screen.getByRole('textbox', { name: '日' });

  await year.click();
  await userEvent.keyboard('20a25-');
  await expect.element(year).toHaveValue('2025');

  await userEvent.keyboard('{ArrowRight}');
  await expect.element(month).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  await expect.element(day).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  await expect.element(day).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
  await expect.element(year).toHaveFocus();
  await userEvent.keyboard('{ArrowLeft}');
  await expect.element(year).toHaveFocus();
});

test('disabled and read-only pickers cannot be edited', async () => {
  const screen = await render(
    <>
      <Example data-testid='disabled' defaultValue='2025-02-18' isDisabled={true} />
      <Example data-testid='readonly' defaultValue='2025-02-18' isReadonly={true} />
    </>,
  );

  const disabled = screen.getByTestId('disabled');
  await expect.element(disabled.getByRole('textbox', { name: '年' })).toHaveAttribute('readonly');
  await expect
    .element(disabled.getByRole('textbox', { name: '年' }))
    .toHaveAttribute('aria-disabled', 'true');
  await expect.element(disabled.getByRole('button', { name: 'カレンダー' })).toBeDisabled();

  const readonly = screen.getByTestId('readonly');
  await expect.element(readonly.getByRole('textbox', { name: '年' })).toHaveAttribute('readonly');
  await expect
    .element(readonly.getByRole('textbox', { name: '年' }))
    .not.toHaveAttribute('aria-disabled');
});

test('marks inputs invalid in the error state', async () => {
  const screen = await render(<Example isError={true} />);

  await expect
    .element(screen.getByRole('textbox', { name: '年' }))
    .toHaveAttribute('aria-invalid', 'true');
});

test('follows a controlled value', async () => {
  const screen = await render(<Example value='2025-02-18' />);
  await screen.rerender(<Example value='2026-11-03' />);

  await expect.element(screen.getByRole('textbox', { name: '年' })).toHaveValue('2026');
  await expect.element(screen.getByRole('textbox', { name: '月' })).toHaveValue('11');
  await expect.element(screen.getByRole('textbox', { name: '日' })).toHaveValue('03');

  await screen.rerender(<Example value={null} />);
  await expect.element(screen.getByRole('textbox', { name: '年' })).toHaveValue('');
});

test('works without a calendar and with partial fields', async () => {
  const screen = await render(
    <DatePicker>
      <DatePickerFields>
        <DatePickerYear name='year' defaultValue='2025' />
        <DatePickerMonth name='month' />
      </DatePickerFields>
    </DatePicker>,
  );

  await expect.element(screen.getByRole('textbox', { name: '年' })).toHaveValue('2025');
  await screen.getByRole('textbox', { name: '月' }).fill('7');
  await expect.element(screen.getByRole('textbox', { name: '月' })).toHaveValue('7');
  expect(screen.getByRole('textbox').elements()).toHaveLength(2);
});
