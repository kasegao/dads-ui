import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  MenuListBox,
  MenuListBoxItem,
  MenuListBoxOpener,
  type MenuListBoxOpenerProps,
  MenuListBoxPopup,
  type MenuListBoxProps,
} from './MenuListBox';

const renderMenu = (
  props: Partial<MenuListBoxProps> = {},
  opener: Partial<MenuListBoxOpenerProps> = {},
) =>
  render(
    <>
      <MenuListBox {...props}>
        <MenuListBoxOpener size='sm' buttonStyle='text' {...opener}>
          メニュー
        </MenuListBoxOpener>
        <MenuListBoxPopup>
          <MenuListBoxItem value='one'>項目1</MenuListBoxItem>
          <MenuListBoxItem value='two' current={true}>
            項目2
          </MenuListBoxItem>
          <MenuListBoxItem value='three'>項目3</MenuListBoxItem>
        </MenuListBoxPopup>
      </MenuListBox>
      <button type='button' style={{ position: 'fixed', right: 0, bottom: 0 }}>
        外部ボタン
      </button>
    </>,
  );

test('is closed initially and toggles on click', async () => {
  const screen = await renderMenu();
  const opener = screen.getByRole('button', { name: 'メニュー' });

  await expect.element(opener).toHaveAttribute('aria-expanded', 'false');
  await expect.element(opener).toHaveAttribute('aria-haspopup', 'menu');

  await opener.click();
  await expect.element(opener).toHaveAttribute('aria-expanded', 'true');
  await expect.element(screen.getByRole('menu', { name: 'メニュー' })).toBeVisible();
  expect(screen.getByRole('menuitem').elements().length).toBe(3);

  await opener.click();
  await expect.element(opener).toHaveAttribute('aria-expanded', 'false');
});

test('closes on outside click', async () => {
  const screen = await renderMenu();
  const opener = screen.getByRole('button', { name: 'メニュー' });

  await opener.click();
  await expect.element(opener).toHaveAttribute('aria-expanded', 'true');
  await screen.getByRole('button', { name: '外部ボタン' }).click();
  await expect.element(opener).toHaveAttribute('aria-expanded', 'false');
});

test('Escape closes the menu and returns focus to the opener', async () => {
  const screen = await renderMenu();
  const opener = screen.getByRole('button', { name: 'メニュー' });

  await opener.click();
  await expect.element(screen.getByRole('menu')).toHaveFocus();
  await userEvent.keyboard('{Escape}');

  await expect.element(opener).toHaveAttribute('aria-expanded', 'false');
  await expect.element(opener).toHaveFocus();
});

test.each([
  ['{ArrowDown}', 0],
  ['{Enter}', 0],
  [' ', 0],
  ['{ArrowUp}', 2],
])('opener key %s opens the menu and highlights item %i', async (key, index) => {
  const screen = await renderMenu();
  const opener = screen.getByRole('button', { name: 'メニュー' });

  await userEvent.tab();
  await expect.element(opener).toHaveFocus();
  await userEvent.keyboard(key);

  await expect.element(opener).toHaveAttribute('aria-expanded', 'true');
  await expect.element(screen.getByRole('menuitem').nth(index)).toHaveAttribute('data-highlighted');
});

test('arrow keys, Home and End move the highlight without wrapping', async () => {
  const screen = await renderMenu();
  const items = screen.getByRole('menuitem');

  await userEvent.tab();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(items.nth(0)).toHaveAttribute('data-highlighted');

  await userEvent.keyboard('{ArrowUp}');
  await expect.element(items.nth(0)).toHaveAttribute('data-highlighted');

  await userEvent.keyboard('{ArrowDown}');
  await expect.element(items.nth(1)).toHaveAttribute('data-highlighted');
  expect(screen.getByRole('menu').element().getAttribute('aria-activedescendant')).toBe(
    items.nth(1).element().id,
  );

  await userEvent.keyboard('{End}');
  await expect.element(items.nth(2)).toHaveAttribute('data-highlighted');
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(items.nth(2)).toHaveAttribute('data-highlighted');

  await userEvent.keyboard('{Home}');
  await expect.element(items.nth(0)).toHaveAttribute('data-highlighted');
});

test('clicking an item selects it, closes the menu and focuses the opener', async () => {
  const onSelect = vi.fn();
  const screen = await renderMenu({ onSelect });
  const opener = screen.getByRole('button', { name: 'メニュー' });

  await opener.click();
  await screen.getByRole('menuitem', { name: '項目3' }).click();

  expect(onSelect).toHaveBeenCalledOnce();
  expect(onSelect.mock.calls[0][0].value).toBe('three');
  await expect.element(opener).toHaveAttribute('aria-expanded', 'false');
  await expect.element(opener).toHaveFocus();
});

test.each([['{Enter}'], [' ']])('key %s selects the highlighted item', async (key) => {
  const onSelect = vi.fn();
  const screen = await renderMenu({ onSelect });
  const opener = screen.getByRole('button', { name: 'メニュー' });

  await userEvent.tab();
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(screen.getByRole('menuitem').nth(1)).toHaveAttribute('data-highlighted');
  await userEvent.keyboard(key);

  expect(onSelect).toHaveBeenCalledOnce();
  expect(onSelect.mock.calls[0][0].value).toBe('two');
  await expect.element(opener).toHaveAttribute('aria-expanded', 'false');
  await expect.element(opener).toHaveFocus();
});

test('Tab closes the menu and returns focus to the opener', async () => {
  const screen = await renderMenu();
  const opener = screen.getByRole('button', { name: 'メニュー' });

  await userEvent.tab();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(opener).toHaveAttribute('aria-expanded', 'true');
  await userEvent.tab();
  await expect.element(opener).toHaveAttribute('aria-expanded', 'false');
  await expect.element(opener).toHaveFocus();
});

test('applies opener and item styles', async () => {
  const screen = await renderMenu(
    { defaultOpen: true },
    { size: 'md', buttonStyle: 'outlined', fontWeight: 'bold' },
  );

  const opener = getComputedStyle(screen.getByRole('button', { name: 'メニュー' }).element());
  expect(opener.minHeight).toBe('44px');
  expect(opener.paddingLeft).toBe('16px');
  expect(opener.borderTopWidth).toBe('1px');
  expect(opener.borderTopColor).toBe('rgb(148, 148, 148)');
  expect(opener.fontWeight).toBe('700');

  const item = getComputedStyle(screen.getByRole('menuitem', { name: '項目1' }).element());
  expect(item.minHeight).toBe('44px');
  const current = getComputedStyle(screen.getByRole('menuitem', { name: '項目2' }).element());
  expect(current.backgroundColor).toBe('rgb(217, 230, 255)');
  expect(current.fontWeight).toBe('700');

  const popup = getComputedStyle(screen.getByRole('menu').element());
  expect(popup.borderTopLeftRadius).toBe('8px');
  expect(popup.borderTopRightRadius).toBe('0px');
});
