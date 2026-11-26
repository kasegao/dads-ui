import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  Tab,
  TabItem,
  TabList,
  TabNav,
  TabNavItem,
  TabNavList,
  TabNavPanel,
  TabPanel,
  type TabProps,
} from './Tab';

const renderTab = (props: Partial<TabProps> = {}) =>
  render(
    <Tab defaultValue='a' {...props}>
      <TabList aria-label='案内'>
        <TabItem value='a'>タブA</TabItem>
        <TabItem value='b'>タブB</TabItem>
        <TabItem value='c'>タブC</TabItem>
      </TabList>
      <TabPanel value='a'>内容A</TabPanel>
      <TabPanel value='b'>内容B</TabPanel>
      <TabPanel value='c'>内容C</TabPanel>
    </Tab>,
  );

test('shows the selected panel and exposes tab semantics', async () => {
  const screen = await renderTab();

  await expect.element(screen.getByRole('tablist', { name: '案内' })).toBeVisible();
  const tabA = screen.getByRole('tab', { name: 'タブA' });
  const tabB = screen.getByRole('tab', { name: 'タブB' });

  await expect.element(tabA).toHaveAttribute('aria-selected', 'true');
  await expect.element(tabB).toHaveAttribute('aria-selected', 'false');
  await expect.element(screen.getByRole('tabpanel', { name: 'タブA' })).toHaveTextContent('内容A');
  await expect.element(screen.getByText('内容B')).not.toBeVisible();
  expect(tabA.element().tagName).toBe('BUTTON');
});

test('click selects a tab and reports the change', async () => {
  const onValueChange = vi.fn();
  const screen = await renderTab({ onValueChange });

  await screen.getByRole('tab', { name: 'タブB' }).click();

  await expect
    .element(screen.getByRole('tab', { name: 'タブB' }))
    .toHaveAttribute('aria-selected', 'true');
  await expect.element(screen.getByText('内容B')).toBeVisible();
  await expect.element(screen.getByText('内容A')).not.toBeVisible();
  expect(onValueChange).toHaveBeenCalledWith({ value: 'b' });
});

test('arrow keys move focus and selection without wrapping (auto activation)', async () => {
  const screen = await renderTab();
  const tabA = screen.getByRole('tab', { name: 'タブA' });
  const tabB = screen.getByRole('tab', { name: 'タブB' });
  const tabC = screen.getByRole('tab', { name: 'タブC' });

  await userEvent.tab();
  await expect.element(tabA).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}');
  await expect.element(tabA).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  await expect.element(tabB).toHaveFocus();
  await expect.element(tabB).toHaveAttribute('aria-selected', 'true');
  await expect.element(screen.getByText('内容B')).toBeVisible();

  await userEvent.keyboard('{End}');
  await expect.element(tabC).toHaveFocus();
  await expect.element(tabC).toHaveAttribute('aria-selected', 'true');

  await userEvent.keyboard('{ArrowRight}');
  await expect.element(tabC).toHaveFocus();

  await userEvent.keyboard('{Home}');
  await expect.element(tabA).toHaveFocus();
  await expect.element(tabA).toHaveAttribute('aria-selected', 'true');

  await userEvent.tab();
  await expect.element(screen.getByRole('tabpanel', { name: 'タブA' })).toHaveFocus();
});

test('manual activation selects only on Enter or Space', async () => {
  const screen = await renderTab({ activation: 'manual' });
  const tabA = screen.getByRole('tab', { name: 'タブA' });
  const tabB = screen.getByRole('tab', { name: 'タブB' });
  const tabC = screen.getByRole('tab', { name: 'タブC' });

  await userEvent.tab();
  await userEvent.keyboard('{ArrowRight}');
  await expect.element(tabB).toHaveFocus();
  await expect.element(tabA).toHaveAttribute('aria-selected', 'true');
  await expect.element(screen.getByText('内容A')).toBeVisible();

  await userEvent.keyboard('{Enter}');
  await expect.element(tabB).toHaveAttribute('aria-selected', 'true');
  await expect.element(screen.getByText('内容B')).toBeVisible();

  await userEvent.keyboard('{ArrowRight}');
  await userEvent.keyboard(' ');
  await expect.element(tabC).toHaveAttribute('aria-selected', 'true');
});

test('left position uses the vertical axis', async () => {
  const screen = await renderTab({ position: 'left' });

  await expect.element(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  await userEvent.tab();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(screen.getByRole('tab', { name: 'タブB' })).toHaveFocus();
  await userEvent.keyboard('{ArrowUp}');
  await expect.element(screen.getByRole('tab', { name: 'タブA' })).toHaveFocus();

  const root = screen.getByRole('tablist').element().parentElement as HTMLElement;
  expect(getComputedStyle(root).flexDirection).toBe('row');
  expect(getComputedStyle(screen.getByRole('tabpanel').element()).borderLeftWidth).toBe('0px');
});

test('selected tab is bold with a key-colored bar', async () => {
  const screen = await renderTab();

  const selected = screen.getByRole('tab', { name: 'タブA' }).element()
    .firstElementChild as Element;
  const other = screen.getByRole('tab', { name: 'タブB' }).element().firstElementChild as Element;

  expect(getComputedStyle(selected).fontWeight).toBe('700');
  expect(getComputedStyle(selected, '::before').backgroundColor).toBe('rgb(0, 23, 193)');
  expect(getComputedStyle(selected, '::before').height).toBe('6px');
  expect(getComputedStyle(other).fontWeight).toBe('400');
  expect(getComputedStyle(other, '::before').backgroundColor).toBe('rgba(0, 0, 0, 0)');

  const panel = getComputedStyle(screen.getByRole('tabpanel').element());
  expect(panel.borderTopWidth).toBe('0px');
  expect(panel.borderBottomWidth).toBe('1px');
  expect(panel.borderBottomColor).toBe('rgb(148, 148, 148)');
});

test('link list marks the current page', async () => {
  const screen = await render(
    <TabNav>
      <TabNavList>
        <TabNavItem href='/a' aria-current='page'>
          ページA
        </TabNavItem>
        <TabNavItem href='/b'>ページB</TabNavItem>
      </TabNavList>
      <TabNavPanel>ページAの内容</TabNavPanel>
    </TabNav>,
  );

  const current = screen.getByRole('link', { name: 'ページA' });
  await expect.element(current).toHaveAttribute('aria-current', 'page');
  await expect.element(screen.getByRole('link', { name: 'ページB' })).toHaveAttribute('href', '/b');
  expect(screen.getByRole('listitem').elements().length).toBe(2);

  const label = current.element().firstElementChild as Element;
  expect(getComputedStyle(label).fontWeight).toBe('700');
  expect(getComputedStyle(label, '::before').backgroundColor).toBe('rgb(0, 23, 193)');
});
