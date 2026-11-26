import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Textarea } from './Textarea';

test('accepts typed text', async () => {
  const screen = await render(<Textarea aria-label='お問い合わせ内容' />);

  const textarea = screen.getByRole('textbox', { name: 'お問い合わせ内容' });
  await textarea.fill('1行目\n2行目');

  await expect.element(textarea).toHaveValue('1行目\n2行目');
});

test('applies the DADS field design', async () => {
  const screen = await render(<Textarea aria-label='内容' className='custom' />);
  const element = screen.getByRole('textbox').element();
  const style = getComputedStyle(element);

  expect(element.classList.contains('custom')).toBe(true);
  expect(style.borderTopColor).toBe('rgb(102, 102, 102)');
  expect(style.borderTopLeftRadius).toBe('8px');
  expect(style.paddingTop).toBe('16px');
  expect(style.fontSize).toBe('16px');
  expect(style.lineHeight).toBe('27.2px');
});

test('isError marks the field invalid with the error color, also on hover', async () => {
  const screen = await render(<Textarea aria-label='内容' isError={true} />);
  const textarea = screen.getByRole('textbox');

  await expect.element(textarea).toHaveAttribute('aria-invalid', 'true');
  expect(getComputedStyle(textarea.element()).borderTopColor).toBe('rgb(236, 0, 0)');

  await userEvent.hover(textarea);
  expect(getComputedStyle(textarea.element()).borderTopColor).toBe('rgb(169, 0, 0)');
});

test('readOnly uses a dashed border', async () => {
  const screen = await render(<Textarea aria-label='内容' readOnly={true} />);

  expect(getComputedStyle(screen.getByRole('textbox').element()).borderTopStyle).toBe('dashed');
});

test('aria-disabled keeps the field focusable but not editable', async () => {
  const screen = await render(
    <Textarea aria-label='内容' aria-disabled={true} defaultValue='入力済み' />,
  );
  const textarea = screen.getByRole('textbox');
  const element = textarea.element() as HTMLTextAreaElement;

  expect(element.readOnly).toBe(true);
  element.focus();
  await userEvent.keyboard('追記');
  await expect.element(textarea).toHaveValue('入力済み');

  const style = getComputedStyle(element);
  expect(style.backgroundColor).toBe('rgb(242, 242, 242)');
  expect(style.borderTopColor).toBe('rgb(179, 179, 179)');
  expect(style.borderTopStyle).toBe('solid');
});
