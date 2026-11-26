import { useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { SwitchMode, SwitchOnOff } from './Switch';

const KEY_900 = 'rgb(0, 23, 193)';
const GRAY_300 = 'rgb(179, 179, 179)';

// The pointer position outlives a test; park it so `:hover` does not leak into the next one.
afterEach(async () => {
  await userEvent.hover(document.body, { position: { x: 0, y: 0 } });
});

const OnOff = ({ disabled }: { disabled?: boolean }) => {
  const [checked, setChecked] = useState(false);

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: SwitchOnOff renders a labelable button.
    <label>
      <SwitchOnOff
        aria-checked={checked}
        disabled={disabled}
        onClick={() => setChecked((prev) => !prev)}
      />
      通知を受け取る
    </label>
  );
};

const parts = (button: Element) => {
  const track = button.firstElementChild as HTMLElement;
  const thumb = track.firstElementChild as HTMLElement;
  const icon = thumb.firstElementChild as SVGElement;
  return { track, thumb, icon };
};

test('SwitchOnOff toggles by click and by keyboard', async () => {
  const screen = await render(
    <div style={{ padding: 16 }}>
      <OnOff />
    </div>,
  );
  const button = screen.getByRole('switch', { name: '通知を受け取る' });

  await expect.element(button).toHaveAttribute('aria-checked', 'false');
  await expect.element(button).toHaveAttribute('type', 'button');

  await button.click();
  await expect.element(button).toHaveAttribute('aria-checked', 'true');

  await userEvent.keyboard(' ');
  await expect.element(button).toHaveAttribute('aria-checked', 'false');
  await userEvent.keyboard('{Enter}');
  await expect.element(button).toHaveAttribute('aria-checked', 'true');
});

test('SwitchOnOff moves the thumb and takes the key color when on', async () => {
  const screen = await render(
    <div style={{ padding: 16 }}>
      <SwitchOnOff aria-label='オフ' />
      <SwitchOnOff aria-label='オン' aria-checked={true} />
    </div>,
  );
  const off = parts(screen.getByRole('switch', { name: 'オフ' }).element());
  const on = parts(screen.getByRole('switch', { name: 'オン' }).element());

  expect(getComputedStyle(off.track).width).toBe('56px');
  expect(getComputedStyle(off.track).height).toBe('36px');
  expect(getComputedStyle(off.track).borderTopColor).toBe('rgb(102, 102, 102)');
  expect(getComputedStyle(off.thumb).backgroundColor).toBe('rgb(51, 51, 51)');
  expect(getComputedStyle(off.icon).display).toBe('none');

  expect(getComputedStyle(on.track).borderTopColor).toBe(KEY_900);
  expect(getComputedStyle(on.track).backgroundColor).toBe('rgb(232, 241, 254)');
  expect(getComputedStyle(on.thumb).backgroundColor).toBe(KEY_900);
  expect(getComputedStyle(on.icon).display).toBe('block');
  const inset = ({ track, thumb }: ReturnType<typeof parts>) =>
    thumb.getBoundingClientRect().left - track.getBoundingClientRect().left;
  expect(inset(off)).toBe(6);
  expect(inset(on)).toBe(26);
});

test('SwitchOnOff shows a halo and darker colors on hover', async () => {
  const screen = await render(
    <div style={{ padding: 16 }}>
      <SwitchOnOff aria-label='オン' aria-checked={true} />
    </div>,
  );
  const button = screen.getByRole('switch');
  const { track, thumb } = parts(button.element());

  await userEvent.hover(button);

  expect(getComputedStyle(track).borderTopColor).toBe('rgb(0, 0, 113)');
  expect(getComputedStyle(thumb).backgroundColor).toBe('rgb(0, 0, 113)');
  expect(getComputedStyle(track).boxShadow).toBe('rgb(148, 148, 148) 0px 0px 0px 4px');
});

test('SwitchOnOff does not toggle when disabled', async () => {
  const screen = await render(
    <div style={{ padding: 16 }}>
      <OnOff disabled={true} />
      <SwitchOnOff aria-label='オン' aria-checked={true} disabled={true} />
    </div>,
  );
  const button = screen.getByRole('switch', { name: '通知を受け取る' });

  await button.click({ force: true });
  await expect.element(button).toBeDisabled();
  await expect.element(button).toHaveAttribute('aria-checked', 'false');

  const on = screen.getByRole('switch', { name: 'オン' });
  await userEvent.hover(on, { force: true });
  const { track, thumb } = parts(on.element());
  expect(getComputedStyle(track).borderTopColor).toBe(GRAY_300);
  expect(getComputedStyle(track).backgroundColor).toBe('rgb(242, 242, 242)');
  expect(getComputedStyle(track).boxShadow).toBe('none');
  expect(getComputedStyle(thumb).backgroundColor).toBe(GRAY_300);
});

const Mode = ({
  onChange,
  disabled,
}: {
  onChange?: (value: string) => void;
  disabled?: boolean;
}) => {
  const [value, setValue] = useState('月払い');

  return (
    <div style={{ padding: 16 }}>
      <SwitchMode
        leftLabel='月払い'
        rightLabel='年払い'
        value={value}
        onChange={(next) => {
          setValue(next);
          onChange?.(next);
        }}
        disabled={disabled}
        aria-describedby='support'
      />
      <p id='support'>支払い方法を選択してください。</p>
    </div>
  );
};

test('SwitchMode flips the selection whichever option is pressed', async () => {
  const onChange = vi.fn();
  const screen = await render(<Mode onChange={onChange} />);
  const left = screen.getByRole('switch', { name: '月払い' });
  const right = screen.getByRole('switch', { name: '年払い' });

  await expect.element(left).toHaveAttribute('aria-checked', 'true');
  await expect.element(right).toHaveAttribute('aria-checked', 'false');
  await expect.element(left).toHaveAccessibleDescription('支払い方法を選択してください。');
  await expect.element(right).toHaveAccessibleDescription('支払い方法を選択してください。');

  await right.click();
  expect(onChange).toHaveBeenLastCalledWith('年払い');
  await expect.element(right).toHaveAttribute('aria-checked', 'true');
  await expect.element(left).toHaveAttribute('aria-checked', 'false');

  await userEvent.keyboard(' ');
  expect(onChange).toHaveBeenLastCalledWith('月払い');
  await expect.element(left).toHaveAttribute('aria-checked', 'true');
});

test('SwitchMode slides the thumb to the selected side', async () => {
  const screen = await render(<Mode />);
  const control = screen.getByRole('switch', { name: '月払い' }).element()
    .nextElementSibling as HTMLElement;
  const rail = control.children[0] as HTMLElement;
  const thumb = control.children[1] as HTMLElement;
  const offset = () => thumb.getBoundingClientRect().left - control.getBoundingClientRect().left;

  expect(getComputedStyle(control).width).toBe('60px');
  expect(getComputedStyle(rail).borderTopColor).toBe(KEY_900);
  expect(getComputedStyle(rail).backgroundColor).toBe('rgb(217, 230, 255)');
  expect(getComputedStyle(thumb).backgroundColor).toBe(KEY_900);
  expect(thumb.getBoundingClientRect().width).toBe(28);
  expect(offset()).toBe(0);

  await screen.getByRole('switch', { name: '年払い' }).click();
  await expect
    .element(screen.getByRole('switch', { name: '年払い' }))
    .toHaveAttribute('aria-checked', 'true');
  expect(offset()).toBe(32);
});

test('SwitchMode disables both options', async () => {
  const onChange = vi.fn();
  const screen = await render(<Mode onChange={onChange} disabled={true} />);
  const left = screen.getByRole('switch', { name: '月払い' });
  const right = screen.getByRole('switch', { name: '年払い' });

  await expect.element(left).toBeDisabled();
  await expect.element(right).toBeDisabled();
  await right.click({ force: true });
  expect(onChange).not.toHaveBeenCalled();

  const control = left.element().nextElementSibling as HTMLElement;
  expect(getComputedStyle(left.element()).color).toBe(GRAY_300);
  expect(getComputedStyle(control.children[0]).borderTopColor).toBe(GRAY_300);
  expect(getComputedStyle(control.children[1]).backgroundColor).toBe(GRAY_300);
});
