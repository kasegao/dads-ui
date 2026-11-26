import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Image, ImageArea, ImageAreaLink, ImageCaption } from './Image';

const src =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect width='200' height='100' fill='%23ccc'/%3E%3C/svg%3E";

test('renders a figure whose caption names it', async () => {
  const screen = await render(
    <Image>
      <ImageArea bordered={true} data-testid='area'>
        <img src={src} alt='サンプル画像' width='200' height='100' />
      </ImageArea>
      <ImageCaption captionStyle='dashed'>キャプション</ImageCaption>
    </Image>,
  );

  const figure = screen.getByRole('figure', { name: 'キャプション' });
  await expect.element(figure).toBeVisible();
  await expect.element(screen.getByRole('img', { name: 'サンプル画像' })).toBeVisible();

  const area = getComputedStyle(screen.getByTestId('area').element());
  expect(area.outlineStyle).toBe('solid');
  expect(area.outlineWidth).toBe('1px');
  expect(area.outlineColor).toBe('rgb(148, 148, 148)');
  expect(area.outlineOffset).toBe('-1px');

  const caption = getComputedStyle(screen.getByText('キャプション').element());
  expect(caption.borderTopStyle).toBe('dashed');
  expect(caption.borderTopWidth).toBe('1px');
  expect(caption.borderTopColor).toBe('rgb(77, 77, 77)');
  expect(caption.color).toBe('rgb(77, 77, 77)');

  const img = getComputedStyle(screen.getByRole('img').element());
  expect(img.display).toBe('block');
  expect(img.width).toBe('200px');
});

test('has no outline or caption border by default', async () => {
  const screen = await render(
    <Image>
      <ImageArea data-testid='area'>
        <img src={src} alt='サンプル画像' width='200' height='100' />
      </ImageArea>
      <ImageCaption>キャプション</ImageCaption>
    </Image>,
  );

  expect(getComputedStyle(screen.getByTestId('area').element()).outlineStyle).toBe('none');
  expect(getComputedStyle(screen.getByText('キャプション').element()).borderTopWidth).toBe('0px');
});

test('fullWidth stretches the image to the container', async () => {
  const screen = await render(
    <div style={{ width: '400px' }}>
      <Image fullWidth={true}>
        <ImageArea>
          <img src={src} alt='サンプル画像' width='200' height='100' />
        </ImageArea>
      </Image>
    </div>,
  );

  const img = screen.getByRole('img').element();
  expect(getComputedStyle(img).width).toBe('400px');
  expect(getComputedStyle(img).height).toBe('200px');
});

test('ImageAreaLink renders a link with the blue outline', async () => {
  const screen = await render(
    <Image>
      <ImageAreaLink href='/detail'>
        <img src={src} alt='詳細ページへ' width='200' height='100' />
      </ImageAreaLink>
    </Image>,
  );

  const link = screen.getByRole('link', { name: '詳細ページへ' });
  await expect.element(link).toHaveAttribute('href', '/detail');

  const style = getComputedStyle(link.element());
  expect(style.display).toBe('block');
  expect(style.outlineStyle).toBe('solid');
  expect(style.outlineWidth).toBe('1px');
  expect(style.outlineColor).toBe('rgb(0, 23, 193)');
});
