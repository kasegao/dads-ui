import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  HorizontalMenu,
  HorizontalMenuItem,
  HorizontalMenuItemButton,
  HorizontalMenuItemLink,
} from './HorizontalMenu';

const chevron = (
  <svg width={16} height={16} viewBox='0 0 24 24' aria-hidden={true} data-testid='chevron'>
    <path d='M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z' />
  </svg>
);

test('renders a list of links and marks the current page', async () => {
  const screen = await render(
    <HorizontalMenu>
      <HorizontalMenuItem>
        <HorizontalMenuItemLink href='/' aria-current='page'>
          ホーム
        </HorizontalMenuItemLink>
      </HorizontalMenuItem>
      <HorizontalMenuItem>
        <HorizontalMenuItemLink href='/news' aria-current={false}>
          お知らせ
        </HorizontalMenuItemLink>
      </HorizontalMenuItem>
    </HorizontalMenu>,
  );

  await expect.element(screen.getByRole('list')).toBeVisible();
  expect(screen.getByRole('listitem').elements().length).toBe(2);

  const current = screen.getByRole('link', { name: 'ホーム' }).element();
  const other = screen.getByRole('link', { name: 'お知らせ' }).element();

  expect(getComputedStyle(current).color).toBe('rgb(0, 17, 143)');
  expect(getComputedStyle(current).minHeight).toBe('64px');
  expect(getComputedStyle(current, '::after').borderBottomWidth).toBe('4px');
  expect(getComputedStyle(current, '::after').borderBottomColor).toBe('rgb(0, 23, 193)');

  expect(getComputedStyle(other).color).toBe('rgb(26, 26, 26)');
  // The pointer may rest on the item (real browser), so only rule out the current-page underline.
  expect(getComputedStyle(other, '::after').borderBottomColor).not.toBe('rgb(0, 23, 193)');
});

test('button item toggles and flips the chevron when expanded', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <HorizontalMenu>
      <HorizontalMenuItem>
        <HorizontalMenuItemButton aria-expanded={false} onClick={onClick}>
          サービス
          {chevron}
        </HorizontalMenuItemButton>
      </HorizontalMenuItem>
    </HorizontalMenu>,
  );

  const button = screen.getByRole('button', { name: 'サービス' });
  await expect.element(button).toHaveAttribute('type', 'button');
  await button.click();
  expect(onClick).toHaveBeenCalledOnce();
  expect(getComputedStyle(screen.getByTestId('chevron').element()).transform).toBe('none');

  await screen.rerender(
    <HorizontalMenu>
      <HorizontalMenuItem>
        <HorizontalMenuItemButton aria-expanded={true} onClick={onClick}>
          サービス
          {chevron}
        </HorizontalMenuItemButton>
      </HorizontalMenuItem>
    </HorizontalMenu>,
  );

  expect(getComputedStyle(screen.getByTestId('chevron').element()).transform).toBe(
    'matrix(-1, 0, 0, -1, 0, 0)',
  );
});
