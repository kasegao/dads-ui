import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Select } from './Select';

const options = (
  <>
    <option value=''>選択してください</option>
    <option value='1'>選択肢1</option>
    <option value='2'>選択肢2</option>
  </>
);

const dispatch = (element: Element, event: Event) => {
  element.dispatchEvent(event);
  return event.defaultPrevented;
};

test('selects an option and reports the change', async () => {
  const onChange = vi.fn();
  const screen = await render(
    <Select aria-label='都道府県' onChange={onChange}>
      {options}
    </Select>,
  );

  const select = screen.getByRole('combobox', { name: '都道府県' });
  await userEvent.selectOptions(select, '2');

  await expect.element(select).toHaveValue('2');
  expect(onChange).toHaveBeenCalledOnce();
});

test('applies the DADS field design at each block size', async () => {
  const screen = await render(
    <>
      <Select aria-label='lg'>{options}</Select>
      <Select aria-label='md' blockSize='md'>
        {options}
      </Select>
      <Select aria-label='sm' blockSize='sm'>
        {options}
      </Select>
    </>,
  );

  const lg = getComputedStyle(screen.getByRole('combobox', { name: 'lg' }).element());
  expect(lg.height).toBe('56px');
  expect(lg.borderTopColor).toBe('rgb(102, 102, 102)');
  expect(lg.borderTopLeftRadius).toBe('8px');
  expect(lg.paddingRight).toBe('40px');
  expect(lg.appearance).toBe('none');
  expect(lg.backgroundImage).toContain('data:image/svg+xml');
  expect(getComputedStyle(screen.getByRole('combobox', { name: 'md' }).element()).height).toBe(
    '48px',
  );
  expect(getComputedStyle(screen.getByRole('combobox', { name: 'sm' }).element()).height).toBe(
    '40px',
  );
});

test('isError marks the field invalid with the error color, also on hover', async () => {
  const screen = await render(
    <Select aria-label='都道府県' isError={true}>
      {options}
    </Select>,
  );
  const select = screen.getByRole('combobox');

  await expect.element(select).toHaveAttribute('aria-invalid', 'true');
  expect(getComputedStyle(select.element()).borderTopColor).toBe('rgb(236, 0, 0)');

  await userEvent.hover(select);
  expect(getComputedStyle(select.element()).borderTopColor).toBe('rgb(169, 0, 0)');
});

test('aria-disabled blocks opening by mouse and keyboard but keeps Tab', async () => {
  const onKeyDown = vi.fn();
  const onMouseDown = vi.fn();
  const screen = await render(
    <Select
      aria-label='都道府県'
      aria-disabled={true}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
    >
      {options}
    </Select>,
  );
  const element = screen.getByRole('combobox').element();
  const init = { bubbles: true, cancelable: true };

  expect(dispatch(element, new MouseEvent('mousedown', init))).toBe(true);
  expect(dispatch(element, new KeyboardEvent('keydown', { ...init, code: 'ArrowDown' }))).toBe(
    true,
  );
  expect(dispatch(element, new KeyboardEvent('keydown', { ...init, code: 'Tab' }))).toBe(false);
  expect(onKeyDown).not.toHaveBeenCalled();
  expect(onMouseDown).not.toHaveBeenCalled();

  const style = getComputedStyle(element);
  expect(style.backgroundColor).toBe('rgb(242, 242, 242)');
  expect(style.borderTopColor).toBe('rgb(179, 179, 179)');
  expect(style.color).toBe('rgb(148, 148, 148)');
  expect(style.pointerEvents).toBe('none');
});

test('does not intercept events when enabled', async () => {
  const onKeyDown = vi.fn();
  const screen = await render(
    <Select aria-label='都道府県' onKeyDown={onKeyDown}>
      {options}
    </Select>,
  );
  const element = screen.getByRole('combobox').element();

  const prevented = dispatch(
    element,
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, code: 'ArrowDown' }),
  );

  expect(prevented).toBe(false);
  expect(onKeyDown).toHaveBeenCalledOnce();
});
