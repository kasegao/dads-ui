import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { MenuList, MenuListItem, MenuListItemButton, MenuListItemLink } from './MenuList';

test('renders list items as links and buttons', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <MenuList>
      <MenuListItem>
        <MenuListItemLink href='/a' type='standard' size='regular'>
          リンク項目
        </MenuListItemLink>
      </MenuListItem>
      <MenuListItem>
        <MenuListItemButton type='standard' size='regular' onClick={onClick}>
          ボタン項目
        </MenuListItemButton>
      </MenuListItem>
    </MenuList>,
  );

  await expect
    .element(screen.getByRole('link', { name: 'リンク項目' }))
    .toHaveAttribute('href', '/a');
  const button = screen.getByRole('button', { name: 'ボタン項目' });
  await expect.element(button).toHaveAttribute('type', 'button');
  await button.click();
  expect(onClick).toHaveBeenCalledOnce();
});

test('applies size and type styles', async () => {
  const screen = await render(
    <MenuList>
      <MenuListItem>
        <MenuListItemLink href='#' type='standard' size='regular'>
          標準
        </MenuListItemLink>
      </MenuListItem>
      <MenuListItem>
        <MenuListItemLink href='#' type='box' size='small'>
          ボックス
        </MenuListItemLink>
      </MenuListItem>
    </MenuList>,
  );

  const standard = getComputedStyle(screen.getByRole('link', { name: '標準' }).element());
  expect(standard.minHeight).toBe('44px');
  expect(standard.borderRadius).toBe('8px');
  expect(standard.paddingLeft).toBe('16px');

  const box = getComputedStyle(screen.getByRole('link', { name: 'ボックス' }).element());
  expect(box.minHeight).toBe('36px');
  expect(box.borderRadius).toBe('0px');
});

test('highlights the current item and its parent item', async () => {
  const screen = await render(
    <MenuList>
      <MenuListItem>
        <MenuListItemButton type='standard' size='regular' aria-expanded={true}>
          親項目
        </MenuListItemButton>
        <MenuList indent={1}>
          <MenuListItem>
            <MenuListItemLink
              href='#'
              type='standard'
              size='regular'
              current={true}
              aria-current='page'
            >
              現在の項目
            </MenuListItemLink>
          </MenuListItem>
          <MenuListItem>
            <MenuListItemLink href='#' type='standard' size='regular'>
              他の項目
            </MenuListItemLink>
          </MenuListItem>
        </MenuList>
      </MenuListItem>
    </MenuList>,
  );

  const current = getComputedStyle(screen.getByRole('link', { name: '現在の項目' }).element());
  expect(current.backgroundColor).toBe('rgb(217, 230, 255)');
  expect(current.color).toBe('rgb(0, 17, 143)');
  expect(current.fontWeight).toBe('700');
  expect(current.marginLeft).toBe('16px');

  const parent = getComputedStyle(screen.getByRole('button', { name: '親項目' }).element());
  expect(parent.backgroundColor).toBe('rgb(232, 241, 254)');

  const other = getComputedStyle(screen.getByRole('link', { name: '他の項目' }).element());
  expect(other.backgroundColor).toBe('rgba(0, 0, 0, 0)');
});

test('box type indents with padding instead of margin', async () => {
  const screen = await render(
    <MenuList indent={2}>
      <MenuListItem>
        <MenuListItemLink href='#' type='box' size='regular'>
          項目
        </MenuListItemLink>
      </MenuListItem>
    </MenuList>,
  );

  const style = getComputedStyle(screen.getByRole('link', { name: '項目' }).element());
  expect(style.paddingLeft).toBe('48px');
  expect(style.marginLeft).toBe('0px');
});
