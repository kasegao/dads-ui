import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Input } from './Input';

test('accepts typed text', async () => {
  const screen = await render(<Input aria-label='氏名' />);

  const input = screen.getByRole('textbox', { name: '氏名' });
  await input.fill('山田太郎');

  await expect.element(input).toHaveValue('山田太郎');
});

test('applies the DADS field design at each block size', async () => {
  const screen = await render(
    <>
      <Input aria-label='lg' />
      <Input aria-label='md' blockSize='md' />
      <Input aria-label='sm' blockSize='sm' />
    </>,
  );

  const lg = getComputedStyle(screen.getByRole('textbox', { name: 'lg' }).element());
  expect(lg.height).toBe('56px');
  expect(lg.borderTopColor).toBe('rgb(102, 102, 102)');
  expect(lg.borderTopWidth).toBe('1px');
  expect(lg.borderTopLeftRadius).toBe('8px');
  expect(lg.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(lg.fontSize).toBe('16px');
  expect(getComputedStyle(screen.getByRole('textbox', { name: 'md' }).element()).height).toBe(
    '48px',
  );
  expect(getComputedStyle(screen.getByRole('textbox', { name: 'sm' }).element()).height).toBe(
    '40px',
  );
});

test('darkens the border on hover and shows the focus ring', async () => {
  const screen = await render(<Input aria-label='氏名' />);
  const input = screen.getByRole('textbox');

  await userEvent.hover(input);
  expect(getComputedStyle(input.element()).borderTopColor).toBe('rgb(0, 0, 0)');

  await input.click();
  const style = getComputedStyle(input.element());
  expect(style.outlineWidth).toBe('4px');
  expect(style.outlineColor).toBe('rgb(0, 0, 0)');
});

test('isError marks the field invalid with the error color, also on hover', async () => {
  const screen = await render(<Input aria-label='氏名' isError={true} />);
  const input = screen.getByRole('textbox');

  await expect.element(input).toHaveAttribute('aria-invalid', 'true');
  expect(getComputedStyle(input.element()).borderTopColor).toBe('rgb(236, 0, 0)');

  await userEvent.hover(input);
  expect(getComputedStyle(input.element()).borderTopColor).toBe('rgb(169, 0, 0)');
});

test('readOnly uses a dashed border', async () => {
  const screen = await render(<Input aria-label='氏名' readOnly={true} defaultValue='山田' />);

  expect(getComputedStyle(screen.getByRole('textbox').element()).borderTopStyle).toBe('dashed');
});

test('aria-disabled keeps the field focusable but not editable', async () => {
  const screen = await render(
    <Input aria-label='氏名' aria-disabled={true} isError={true} defaultValue='山田' />,
  );
  const input = screen.getByRole('textbox');
  const element = input.element() as HTMLInputElement;

  expect(element.readOnly).toBe(true);
  element.focus();
  expect(document.activeElement).toBe(element);
  await userEvent.keyboard('太郎');
  await expect.element(input).toHaveValue('山田');

  const style = getComputedStyle(element);
  expect(style.backgroundColor).toBe('rgb(242, 242, 242)');
  expect(style.borderTopColor).toBe('rgb(179, 179, 179)');
  expect(style.borderTopStyle).toBe('solid');
  expect(style.color).toBe('rgb(148, 148, 148)');
});
