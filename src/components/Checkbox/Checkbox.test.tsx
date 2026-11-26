import { afterEach, expect, test, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Checkbox } from './Checkbox';

const KEY_900 = 'rgb(0, 23, 193)';
const KEY_1100 = 'rgb(0, 0, 113)';
const ERROR = 'rgb(236, 0, 0)';
const GRAY_300 = 'rgb(179, 179, 179)';

// The pointer position outlives a test; park it so `:hover` does not leak into the next one.
afterEach(async () => {
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });
});

test('toggles through its label and reports the change', async () => {
  const onChange = vi.fn();
  const screen = await render(<Checkbox onChange={onChange}>同意する</Checkbox>);
  const checkbox = screen.getByRole('checkbox', { name: '同意する' });

  await screen.getByText('同意する').click();
  await expect.element(checkbox).toBeChecked();

  checkbox.element().focus();
  await userEvent.keyboard(' ');
  await expect.element(checkbox).not.toBeChecked();
  expect(onChange).toHaveBeenCalledTimes(2);
});

test('renders the box alone when it has no children', async () => {
  const screen = await render(<Checkbox aria-label='行を選択' />);

  await expect.element(screen.getByRole('checkbox', { name: '行を選択' })).toBeInTheDocument();
  expect(screen.container.querySelector('label')).toBeNull();
});

test('sizes the hit area and the label text', async () => {
  const screen = await render(
    <>
      <Checkbox size='sm'>小</Checkbox>
      <Checkbox size='md'>中</Checkbox>
      <Checkbox size='lg'>大</Checkbox>
    </>,
  );

  const measure = (name: string) => {
    const input = screen.getByRole('checkbox', { name }).element();
    const control = getComputedStyle(input.parentElement as HTMLElement);
    const box = getComputedStyle(input);
    return [control.width, control.height, box.width, box.borderTopWidth];
  };

  expect(measure('小')).toEqual(['24px', '24px', '18px', '2px']);
  expect(measure('中')).toEqual(['32px', '32px', '24px', '2px']);
  expect(measure('大')).toEqual(['44px', '44px', '33px', '3px']);
  expect(getComputedStyle(screen.getByText('大').element()).fontSize).toBe('17px');
});

test('fills with the key color when checked and darkens on hover', async () => {
  const screen = await render(<Checkbox defaultChecked={true}>同意する</Checkbox>);
  const checkbox = screen.getByRole('checkbox');
  const element = checkbox.element();

  expect(getComputedStyle(element).backgroundColor).toBe(KEY_900);
  expect(getComputedStyle(element).borderTopColor).toBe(KEY_900);
  expect(getComputedStyle(element, '::before').display).toBe('block');
  expect(getComputedStyle(element, '::before').clipPath).toContain('path(');

  await userEvent.hover(checkbox);
  expect(getComputedStyle(element).backgroundColor).toBe(KEY_1100);
  expect(getComputedStyle(element.parentElement as HTMLElement).backgroundColor).toBe(
    'rgb(148, 148, 148)',
  );
});

test('unchecked box hides the mark and darkens its border on hover', async () => {
  const screen = await render(<Checkbox>同意する</Checkbox>);
  const checkbox = screen.getByRole('checkbox');
  const element = checkbox.element();

  expect(getComputedStyle(element).backgroundColor).toBe('rgb(255, 255, 255)');
  expect(getComputedStyle(element).borderTopColor).toBe('rgb(102, 102, 102)');
  expect(getComputedStyle(element, '::before').display).toBe('none');

  await userEvent.hover(checkbox);
  expect(getComputedStyle(element).borderTopColor).toBe('rgb(0, 0, 0)');
});

test('shows a dash when indeterminate', async () => {
  const screen = await render(
    <Checkbox
      ref={(element) => {
        if (element) {
          element.indeterminate = true;
        }
      }}
    >
      すべて選択
    </Checkbox>,
  );
  const element = screen.getByRole('checkbox').element();

  await expect.element(screen.getByRole('checkbox')).toBePartiallyChecked();
  expect(getComputedStyle(element).backgroundColor).toBe(KEY_900);
  expect(getComputedStyle(element, '::before').clipPath).toContain('M 3.25 7.75');
});

test('isError uses the error color for the border and the fill', async () => {
  const screen = await render(
    <>
      <Checkbox isError={true}>未選択</Checkbox>
      <Checkbox isError={true} defaultChecked={true}>
        選択済み
      </Checkbox>
    </>,
  );

  const unchecked = getComputedStyle(screen.getByRole('checkbox', { name: '未選択' }).element());
  const checked = getComputedStyle(screen.getByRole('checkbox', { name: '選択済み' }).element());
  expect(unchecked.borderTopColor).toBe(ERROR);
  expect(unchecked.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(checked.borderTopColor).toBe(ERROR);
  expect(checked.backgroundColor).toBe(ERROR);
});

test('aria-disabled keeps focus but blocks toggling and greys out', async () => {
  const onChange = vi.fn();
  const onClick = vi.fn();
  const screen = await render(
    <Checkbox
      aria-disabled={true}
      defaultChecked={true}
      isError={true}
      onChange={onChange}
      onClick={onClick}
    >
      同意する
    </Checkbox>,
  );
  const checkbox = screen.getByRole('checkbox');
  const element = checkbox.element();

  await screen.getByText('同意する').click({ force: true });
  element.focus();
  await userEvent.keyboard(' ');

  expect(document.activeElement).toBe(element);
  await expect.element(checkbox).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
  expect(onClick).not.toHaveBeenCalled();

  await userEvent.hover(checkbox);
  expect(getComputedStyle(element).backgroundColor).toBe(GRAY_300);
  expect(getComputedStyle(element).borderTopColor).toBe(GRAY_300);
});

test('native disabled greys out as well', async () => {
  const screen = await render(
    <>
      <Checkbox disabled={true}>未選択</Checkbox>
      <Checkbox disabled={true} defaultChecked={true}>
        選択済み
      </Checkbox>
    </>,
  );

  const unchecked = getComputedStyle(screen.getByRole('checkbox', { name: '未選択' }).element());
  const checked = getComputedStyle(screen.getByRole('checkbox', { name: '選択済み' }).element());
  expect(unchecked.backgroundColor).toBe('rgb(242, 242, 242)');
  expect(unchecked.borderTopColor).toBe(GRAY_300);
  expect(checked.backgroundColor).toBe(GRAY_300);
});

test('uses system colors in forced-colors mode', async () => {
  const session = cdp() as unknown as {
    send: (method: string, params: object) => Promise<unknown>;
  };
  await session.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value: 'active' }],
  });

  try {
    const screen = await render(
      <>
        <Checkbox defaultChecked={true}>選択済み</Checkbox>
        <Checkbox aria-disabled={true} defaultChecked={true}>
          無効
        </Checkbox>
        <span data-testid='highlight' style={{ color: 'Highlight' }} />
        <span data-testid='gray' style={{ color: 'GrayText' }} />
      </>,
    );
    expect(matchMedia('(forced-colors: active)').matches).toBe(true);

    const system = (id: string) => getComputedStyle(screen.getByTestId(id).element()).color;
    const checked = getComputedStyle(screen.getByRole('checkbox', { name: '選択済み' }).element());
    const disabled = getComputedStyle(screen.getByRole('checkbox', { name: '無効' }).element());

    expect(checked.backgroundColor).toBe(system('highlight'));
    expect(checked.borderTopColor).toBe(system('highlight'));
    expect(disabled.backgroundColor).toBe(system('gray'));
    expect(disabled.borderTopColor).toBe(system('gray'));
  } finally {
    await session.send('Emulation.setEmulatedMedia', { features: [] });
  }
});
