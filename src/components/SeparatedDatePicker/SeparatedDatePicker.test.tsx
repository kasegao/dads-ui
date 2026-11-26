import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import type { SeparatedDatePickerProps } from './SeparatedDatePicker';
import {
  SeparatedDatePicker,
  SeparatedDatePickerCalendar,
  SeparatedDatePickerCalendarButton,
  SeparatedDatePickerDate,
  SeparatedDatePickerFields,
  SeparatedDatePickerMonth,
  SeparatedDatePickerYear,
} from './SeparatedDatePicker';

const Example = (props: SeparatedDatePickerProps) => (
  <SeparatedDatePicker min='2018-01-01' max='2030-12-31' {...props}>
    <SeparatedDatePickerFields data-testid='fields'>
      <SeparatedDatePickerYear />
      <SeparatedDatePickerMonth />
      <SeparatedDatePickerDate />
    </SeparatedDatePickerFields>
    <SeparatedDatePickerCalendarButton />
    <SeparatedDatePickerCalendar />
  </SeparatedDatePicker>
);

test('renders separate year, month and day inputs', async () => {
  const screen = await render(<Example defaultValue='2025-02-18' />);

  await expect.element(screen.getByRole('textbox', { name: '年' })).toHaveValue('2025');
  await expect.element(screen.getByRole('textbox', { name: '月' })).toHaveValue('02');
  await expect.element(screen.getByRole('textbox', { name: '日' })).toHaveValue('18');
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

  const lg = style('lg', 'input');
  expect(lg.height).toBe('56px');
  expect(lg.width).toBe('72px');
  expect(lg.borderTopColor).toBe('rgb(102, 102, 102)');
  expect(lg.borderTopStyle).toBe('solid');
  expect(lg.borderRadius).toBe('8px');
  expect(lg.textAlign).toBe('center');
  expect(style('lg', 'label:last-of-type input').width).toBe('56px');
  expect(style('lg', 'button').height).toBe('56px');

  expect(style('md', 'input').height).toBe('48px');
  expect(style('md', 'input').borderTopColor).toBe('rgb(236, 0, 0)');

  expect(style('sm', 'input').height).toBe('40px');
  expect(style('sm', 'input').borderTopStyle).toBe('dashed');

  expect(style('disabled', 'input').backgroundColor).toBe('rgb(242, 242, 242)');
  expect(style('disabled', 'input').color).toBe('rgb(148, 148, 148)');
  expect(style('disabled', 'input').borderTopStyle).toBe('solid');
  expect(style('disabled', 'label > span').color).toBe('rgb(148, 148, 148)');
});

test('opens the calendar popup, picks a date and fills the inputs', async () => {
  const onValueChange = vi.fn();
  const screen = await render(<Example defaultValue='2025-02-18' onValueChange={onValueChange} />);

  const button = screen.getByRole('button', { name: 'カレンダー' });
  await button.click();
  await expect.element(screen.getByRole('dialog', { name: 'カレンダー' })).toBeVisible();

  await screen.getByRole('button', { name: '前の月' }).click();
  await expect.element(screen.getByRole('grid', { name: '2025年1月' })).toBeVisible();
  await screen.getByRole('button', { name: '2025年1月7日火曜日' }).click();

  expect(onValueChange).toHaveBeenLastCalledWith('2025-01-07');
  await expect.element(screen.getByRole('textbox', { name: '月' })).toHaveValue('01');
  await expect.element(screen.getByRole('textbox', { name: '日' })).toHaveValue('07');
  await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  await expect.element(button).toHaveFocus();
});

test('commits typed dates on blur', async () => {
  const onValueChange = vi.fn();
  const screen = await render(<Example onValueChange={onValueChange} />);

  await screen.getByRole('textbox', { name: '年' }).fill('2024');
  await screen.getByRole('textbox', { name: '月' }).fill('2');
  await screen.getByRole('textbox', { name: '日' }).fill('29');
  await userEvent.tab();
  expect(onValueChange).toHaveBeenLastCalledWith('2024-02-29');

  await screen.getByRole('textbox', { name: '年' }).fill('2025');
  await userEvent.tab();
  expect(onValueChange).toHaveBeenLastCalledWith(null);
});

test('does not move between inputs with arrow keys', async () => {
  const screen = await render(<Example defaultValue='2025-02-18' />);

  const year = screen.getByRole('textbox', { name: '年' });
  await year.click();
  await userEvent.keyboard('{End}{ArrowRight}');
  await expect.element(year).toHaveFocus();
});

test('supports per-field errors and the disabled state', async () => {
  const screen = await render(
    <>
      <SeparatedDatePicker data-testid='error'>
        <SeparatedDatePickerFields>
          <SeparatedDatePickerYear aria-invalid={true} />
          <SeparatedDatePickerMonth defaultValue={10} />
          <SeparatedDatePickerDate defaultValue={28} />
        </SeparatedDatePickerFields>
      </SeparatedDatePicker>
      <Example data-testid='disabled' isDisabled={true} />
    </>,
  );

  const error = screen.getByTestId('error');
  await expect
    .element(error.getByRole('textbox', { name: '年' }))
    .toHaveAttribute('aria-invalid', 'true');
  await expect.element(error.getByRole('textbox', { name: '月' })).toHaveValue('10');
  await expect
    .element(error.getByRole('textbox', { name: '月' }))
    .not.toHaveAttribute('aria-invalid');
  expect(
    getComputedStyle(error.getByRole('textbox', { name: '年' }).element()).borderTopColor,
  ).toBe('rgb(236, 0, 0)');
  expect(
    getComputedStyle(error.getByRole('textbox', { name: '月' }).element()).borderTopColor,
  ).toBe('rgb(102, 102, 102)');

  const disabled = screen.getByTestId('disabled');
  await expect
    .element(disabled.getByRole('textbox', { name: '年' }))
    .toHaveAttribute('aria-disabled', 'true');
  await expect.element(disabled.getByRole('textbox', { name: '年' })).toHaveAttribute('readonly');
  await expect.element(disabled.getByRole('button', { name: 'カレンダー' })).toBeDisabled();
});
