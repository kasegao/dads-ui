import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Radio } from './Radio';

const KEY_900 = 'rgb(0, 23, 193)';
const GRAY_300 = 'rgb(179, 179, 179)';

// The pointer position outlives a test; park it so `:hover` does not leak into the next one.
afterEach(async () => {
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });
});

test('selects one option of a group, by click and by arrow keys', async () => {
  const onChange = vi.fn();
  const screen = await render(
    <>
      <Radio name='contact' value='email' onChange={onChange}>
        メール
      </Radio>
      <Radio name='contact' value='phone' onChange={onChange}>
        電話
      </Radio>
    </>,
  );
  const email = screen.getByRole('radio', { name: 'メール' });
  const phone = screen.getByRole('radio', { name: '電話' });

  await screen.getByText('メール').click();
  await expect.element(email).toBeChecked();

  await userEvent.keyboard('{ArrowDown}');
  await expect.element(phone).toBeChecked();
  await expect.element(email).not.toBeChecked();
  expect(onChange).toHaveBeenCalledTimes(2);
});

test('renders the circle alone when it has no children', async () => {
  const screen = await render(<Radio aria-label='行を選択' name='row' />);

  await expect.element(screen.getByRole('radio', { name: '行を選択' })).toBeInTheDocument();
  expect(screen.container.querySelector('label')).toBeNull();
});

test('sizes the hit area and the label text', async () => {
  const screen = await render(
    <>
      <Radio name='size' size='sm'>
        小
      </Radio>
      <Radio name='size' size='md'>
        中
      </Radio>
      <Radio name='size' size='lg'>
        大
      </Radio>
    </>,
  );

  const measure = (name: string) => {
    const input = screen.getByRole('radio', { name }).element();
    const control = getComputedStyle(input.parentElement as HTMLElement);
    const circle = getComputedStyle(input);
    return [control.width, control.height, circle.borderTopWidth];
  };

  expect(measure('小')).toEqual(['24px', '24px', '2px']);
  expect(measure('中')).toEqual(['32px', '32px', '2px']);
  expect(measure('大')).toEqual(['44px', '44px', '3px']);
  expect(getComputedStyle(screen.getByRole('radio', { name: '小' }).element()).width).toBe('20px');
  expect(getComputedStyle(screen.getByText('大').element()).fontSize).toBe('17px');
});

test('draws the key-color dot when checked', async () => {
  const screen = await render(
    <>
      <Radio name='state' defaultChecked={true}>
        選択済み
      </Radio>
      <Radio name='state'>未選択</Radio>
    </>,
  );
  const checked = screen.getByRole('radio', { name: '選択済み' }).element();
  const unchecked = screen.getByRole('radio', { name: '未選択' });

  expect(getComputedStyle(checked).borderTopColor).toBe(KEY_900);
  expect(getComputedStyle(checked).backgroundColor).toBe('rgb(255, 255, 255)');
  expect(getComputedStyle(checked, '::before').display).toBe('block');
  expect(getComputedStyle(checked, '::before').backgroundColor).toBe(KEY_900);
  expect(getComputedStyle(unchecked.element(), '::before').display).toBe('none');
  expect(getComputedStyle(unchecked.element()).borderTopColor).toBe('rgb(102, 102, 102)');

  await userEvent.hover(unchecked);
  expect(getComputedStyle(unchecked.element()).borderTopColor).toBe('rgb(0, 0, 0)');
});

test('isError uses the error color for the border and the dot', async () => {
  const screen = await render(
    <Radio name='state' isError={true} defaultChecked={true}>
      選択済み
    </Radio>,
  );
  const element = screen.getByRole('radio').element();

  expect(getComputedStyle(element).borderTopColor).toBe('rgb(236, 0, 0)');
  expect(getComputedStyle(element, '::before').backgroundColor).toBe('rgb(236, 0, 0)');
});

test('aria-disabled keeps focus but blocks selection and greys out', async () => {
  const onChange = vi.fn();
  const screen = await render(
    <>
      <Radio name='contact' aria-disabled={true} onChange={onChange}>
        メール
      </Radio>
      <Radio name='contact' aria-disabled={true} defaultChecked={true} onChange={onChange}>
        電話
      </Radio>
    </>,
  );
  const email = screen.getByRole('radio', { name: 'メール' });
  const phone = screen.getByRole('radio', { name: '電話' });

  await screen.getByText('メール').click({ force: true });

  await expect.element(email).not.toBeChecked();
  await expect.element(phone).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();

  const style = getComputedStyle(phone.element());
  expect(style.borderTopColor).toBe(GRAY_300);
  expect(style.backgroundColor).toBe('rgb(242, 242, 242)');
  expect(getComputedStyle(phone.element(), '::before').backgroundColor).toBe(GRAY_300);
});
