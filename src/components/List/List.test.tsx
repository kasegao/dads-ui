import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { List } from './List';

test('renders a bulleted list with the requested spacing', async () => {
  const screen = await render(
    <List spacing='8'>
      <li>項目1</li>
      <li>項目2</li>
    </List>,
  );

  const list = screen.getByRole('list');
  await expect.element(list).toBeVisible();
  expect(screen.getByRole('listitem').elements()).toHaveLength(2);

  const listStyle = getComputedStyle(list.element());
  const itemStyle = getComputedStyle(screen.getByText('項目1').element());

  expect(listStyle.paddingLeft).toBe('32px');
  expect(listStyle.listStyleType).toBe('disc');
  expect(itemStyle.paddingTop).toBe('8px');
  expect(itemStyle.paddingBottom).toBe('8px');
});

test('lays out hand-written markers when marker is number', async () => {
  const screen = await render(
    <List spacing='4' marker='number'>
      <li data-testid='item'>
        <span>1. </span>
        項目
      </li>
    </List>,
  );

  const listStyle = getComputedStyle(screen.getByRole('list').element());
  const itemStyle = getComputedStyle(screen.getByTestId('item').element());
  const markerStyle = getComputedStyle(screen.getByText('1.').element());

  expect(listStyle.listStyleType).toBe('none');
  expect(listStyle.paddingLeft).toBe('0px');
  expect(itemStyle.paddingLeft).toBe('32px');
  expect(itemStyle.paddingTop).toBe('4px');
  expect(markerStyle.display).toBe('inline-block');
  expect(markerStyle.marginLeft).toBe('-32px');
  expect(markerStyle.minWidth).toBe('32px');
});

test('nested lists keep their own spacing and offset the trailing padding', async () => {
  const screen = await render(
    <List spacing='12'>
      <li>
        親
        <List spacing='12' data-testid='nested'>
          <li>子</li>
        </List>
      </li>
    </List>,
  );

  const nested = getComputedStyle(screen.getByTestId('nested').element());

  expect(nested.marginTop).toBe('12px');
  expect(nested.marginBottom).toBe('-12px');
  expect(nested.listStyleType).toBe('circle');
});
