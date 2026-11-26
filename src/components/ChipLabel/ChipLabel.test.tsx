import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { ChipLabel } from './ChipLabel';

const styleOf = (element: Element) => getComputedStyle(element);

test('defaults to the gray text variant', async () => {
  const screen = await render(<ChipLabel>ラベル</ChipLabel>);

  const style = styleOf(screen.getByText('ラベル').element());
  expect(style.display).toBe('inline-grid');
  expect(style.minHeight).toBe('32px');
  expect(style.borderRadius).toBe('8px');
  expect(style.borderTopWidth).toBe('0px');
  expect(style.paddingLeft).toBe('8px');
  expect(style.color).toBe('rgb(51, 51, 51)');
  expect(style.fontSize).toBe('16px');
});

test('outlined uses the color for border and text on white', async () => {
  const screen = await render(
    <ChipLabel variant='outlined' color='blue'>
      ラベル
    </ChipLabel>,
  );

  const style = styleOf(screen.getByText('ラベル').element());
  expect(style.borderTopWidth).toBe('1px');
  expect(style.borderTopColor).toBe('rgb(38, 74, 244)');
  expect(style.color).toBe('rgb(38, 74, 244)');
  expect(style.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(style.paddingLeft).toBe('7px');
  expect(style.paddingTop).toBe('3px');
});

test('filled-1 uses a tinted background, darker text and a colored icon', async () => {
  const screen = await render(
    <ChipLabel variant='filled-1' color='red' data-testid='chip'>
      <svg aria-hidden={true} width='24' height='24' />
      ラベル
    </ChipLabel>,
  );

  const chip = screen.getByTestId('chip').element();
  const style = styleOf(chip);
  expect(style.borderTopColor).toBe('rgb(206, 0, 0)');
  expect(style.backgroundColor).toBe('rgb(253, 238, 238)');
  expect(style.color).toBe('rgb(169, 0, 0)');
  expect(styleOf(chip.querySelector('svg') as SVGElement).color).toBe('rgb(206, 0, 0)');
});

test('filled-2 uses a solid fill with white text', async () => {
  const screen = await render(
    <ChipLabel variant='filled-2' color='green'>
      ラベル
    </ChipLabel>,
  );

  const style = styleOf(screen.getByText('ラベル').element());
  expect(style.backgroundColor).toBe('rgb(25, 122, 75)');
  expect(style.color).toBe('rgb(255, 255, 255)');
  expect(style.borderTopColor).toBe('rgba(0, 0, 0, 0)');
});

test('gray keeps the darker label on outlined', async () => {
  const screen = await render(
    <ChipLabel variant='outlined' color='gray'>
      ラベル
    </ChipLabel>,
  );

  const style = styleOf(screen.getByText('ラベル').element());
  expect(style.borderTopColor).toBe('rgb(77, 77, 77)');
  expect(style.color).toBe('rgb(51, 51, 51)');
});
