import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  LanguageSelector,
  LanguageSelectorArrowIcon,
  LanguageSelectorButton,
  LanguageSelectorGlobeIcon,
  LanguageSelectorMenu,
  LanguageSelectorMenuItem,
  type LanguageSelectorProps,
} from './LanguageSelector';

const renderSelector = (props: Partial<LanguageSelectorProps> = {}) =>
  render(
    <>
      <LanguageSelector {...props}>
        <LanguageSelectorButton>
          <LanguageSelectorGlobeIcon />
          Language
          <LanguageSelectorArrowIcon data-testid='arrow' />
        </LanguageSelectorButton>
        <LanguageSelectorMenu>
          <LanguageSelectorMenuItem href='#ja' lang='ja' value='ja' isCurrent={true}>
            日本語
          </LanguageSelectorMenuItem>
          <LanguageSelectorMenuItem href='#en' lang='en' value='en'>
            English
          </LanguageSelectorMenuItem>
          <LanguageSelectorMenuItem href='#ko' lang='ko' value='ko'>
            한국어
          </LanguageSelectorMenuItem>
        </LanguageSelectorMenu>
      </LanguageSelector>
      <button type='button' style={{ position: 'fixed', right: 0, bottom: 0 }}>
        外部ボタン
      </button>
    </>,
  );

test('is closed initially and opens on click', async () => {
  const screen = await renderSelector();
  const button = screen.getByRole('button', { name: 'Language' });

  await expect.element(button).toHaveAttribute('aria-expanded', 'false');
  await expect.element(button).toHaveAttribute('aria-haspopup', 'menu');
  expect(getComputedStyle(screen.getByTestId('arrow').element()).transform).toBe('none');

  await button.click();
  await expect.element(button).toHaveAttribute('aria-expanded', 'true');
  await expect.element(screen.getByRole('menu', { name: 'Language' })).toBeVisible();
  expect(screen.getByRole('menuitem').elements().length).toBe(3);
  expect(getComputedStyle(screen.getByTestId('arrow').element()).transform).toBe(
    'matrix(-1, 0, 0, -1, 0, 0)',
  );

  await button.click();
  await expect.element(button).toHaveAttribute('aria-expanded', 'false');
});

test('menu items are links with lang and the current language is marked', async () => {
  const screen = await renderSelector({ defaultOpen: true });

  const current = screen.getByRole('menuitem', { name: '日本語' });
  const other = screen.getByRole('menuitem', { name: 'English' });

  await expect.element(current).toHaveAttribute('aria-current', 'true');
  await expect.element(other).toHaveAttribute('href', '#en');
  await expect.element(other).toHaveAttribute('lang', 'en');
  expect(other.element().tagName).toBe('A');

  const currentStyle = getComputedStyle(current.element());
  expect(currentStyle.backgroundColor).toBe('rgb(217, 230, 255)');
  expect(currentStyle.fontWeight).toBe('700');
  expect(currentStyle.minHeight).toBe('44px');
  expect(getComputedStyle(current.element().querySelector('svg') as Element).visibility).toBe(
    'visible',
  );
  expect(getComputedStyle(other.element().querySelector('svg') as Element).visibility).toBe(
    'hidden',
  );
});

test('keyboard: Enter opens on the first item, arrows move, Escape closes', async () => {
  const screen = await renderSelector();
  const button = screen.getByRole('button', { name: 'Language' });
  const items = screen.getByRole('menuitem');

  await userEvent.tab();
  await expect.element(button).toHaveFocus();
  await userEvent.keyboard('{Enter}');

  await expect.element(button).toHaveAttribute('aria-expanded', 'true');
  await expect.element(items.nth(0)).toHaveAttribute('data-highlighted');
  await expect.element(screen.getByRole('menu')).toHaveFocus();

  await userEvent.keyboard('{ArrowDown}');
  await expect.element(items.nth(1)).toHaveAttribute('data-highlighted');
  await expect.element(items.nth(0)).not.toHaveAttribute('data-highlighted');
  expect(screen.getByRole('menu').element().getAttribute('aria-activedescendant')).toBe(
    items.nth(1).element().id,
  );

  await userEvent.keyboard('{End}');
  await expect.element(items.nth(2)).toHaveAttribute('data-highlighted');
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(items.nth(2)).toHaveAttribute('data-highlighted');
  await userEvent.keyboard('{Home}');
  await expect.element(items.nth(0)).toHaveAttribute('data-highlighted');

  await userEvent.keyboard('{Escape}');
  await expect.element(button).toHaveAttribute('aria-expanded', 'false');
  await expect.element(button).toHaveFocus();
});

test('keyboard: ArrowUp opens on the last item and Enter follows the link', async () => {
  const onSelect = vi.fn();
  const screen = await renderSelector({ onSelect });
  const button = screen.getByRole('button', { name: 'Language' });

  await userEvent.tab();
  await userEvent.keyboard('{ArrowUp}');
  await expect.element(screen.getByRole('menuitem').nth(2)).toHaveAttribute('data-highlighted');

  await userEvent.keyboard('{ArrowUp}');
  await userEvent.keyboard('{Enter}');

  expect(onSelect).toHaveBeenCalledOnce();
  expect(onSelect.mock.calls[0][0].value).toBe('en');
  await expect.element(button).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => window.location.hash).toBe('#en');
  window.location.hash = '';
});

test('keyboard-highlighted item shows the DADS focus indicator', async () => {
  const screen = await renderSelector();

  await userEvent.tab();
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');

  const item = screen.getByRole('menuitem', { name: 'English' });
  await expect.element(item).toHaveAttribute('data-highlighted');
  const style = getComputedStyle(item.element());
  expect(style.outlineStyle).toBe('solid');
  expect(style.outlineWidth).toBe('4px');
  expect(style.outlineColor).toBe('rgb(0, 0, 0)');
});

test('closes when clicking outside', async () => {
  const screen = await renderSelector();
  const button = screen.getByRole('button', { name: 'Language' });

  await button.click();
  await expect.element(button).toHaveAttribute('aria-expanded', 'true');

  await screen.getByRole('button', { name: '外部ボタン' }).click();
  await expect.element(button).toHaveAttribute('aria-expanded', 'false');
});
