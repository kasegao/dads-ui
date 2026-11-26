import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  ResourceList,
  ResourceListAction,
  ResourceListActionButton,
  ResourceListBody,
  ResourceListContents,
  ResourceListControl,
  ResourceListSupport,
  ResourceListTitle,
} from './ResourceList';

test('list and frame variants draw their borders', async () => {
  const screen = await render(
    <>
      <ResourceList variant='list' data-testid='list'>
        <ResourceListBody>
          <ResourceListContents>
            <ResourceListTitle as='h3'>リスト</ResourceListTitle>
          </ResourceListContents>
        </ResourceListBody>
      </ResourceList>
      <ResourceList variant='frame' data-testid='frame'>
        <ResourceListBody>
          <ResourceListContents>
            <ResourceListTitle as='p'>フレーム</ResourceListTitle>
          </ResourceListContents>
        </ResourceListBody>
      </ResourceList>
    </>,
  );

  await expect.element(screen.getByRole('heading', { level: 3, name: 'リスト' })).toBeVisible();
  expect(screen.getByText('フレーム').element().tagName).toBe('P');

  const list = getComputedStyle(screen.getByTestId('list').element());
  expect(list.borderBottomColor).toBe('rgb(148, 148, 148)');
  expect(list.borderTopColor).toBe('rgba(0, 0, 0, 0)');
  expect(list.borderBottomWidth).toBe('1px');

  const frame = getComputedStyle(screen.getByTestId('frame').element());
  expect(frame.borderTopColor).toBe('rgb(148, 148, 148)');
  expect(frame.borderLeftColor).toBe('rgb(148, 148, 148)');
  expect(frame.borderTopLeftRadius).toBe('16px');
});

test('asChild body renders a link whose title looks like a link', async () => {
  const screen = await render(
    <ResourceList variant='list'>
      <ResourceListBody asChild={true}>
        <a href='/detail'>
          <ResourceListContents>
            <ResourceListTitle as='h2'>健康診断</ResourceListTitle>
            <ResourceListSupport>
              <p>2025年度</p>
            </ResourceListSupport>
          </ResourceListContents>
        </a>
      </ResourceListBody>
    </ResourceList>,
  );

  await expect.element(screen.getByRole('link')).toHaveAttribute('href', '/detail');
  const title = getComputedStyle(screen.getByRole('heading', { name: '健康診断' }).element());
  expect(title.color).toBe('rgb(0, 17, 143)');
  expect(title.textDecorationLine).toBe('underline');
});

test('action button fires click and is 44px wide', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <ResourceList variant='frame'>
      <ResourceListBody>
        <ResourceListContents>
          <ResourceListTitle as='h2'>給与明細</ResourceListTitle>
        </ResourceListContents>
      </ResourceListBody>
      <ResourceListAction>
        <ResourceListActionButton aria-label='ダウンロード' onClick={onClick} />
      </ResourceListAction>
    </ResourceList>,
  );

  const button = screen.getByRole('button', { name: 'ダウンロード' });
  await button.click();
  expect(onClick).toHaveBeenCalledOnce();
  expect(getComputedStyle(button.element()).width).toBe('44px');
});

const renderSelectable = (disabled = false) =>
  render(
    <ResourceList variant='frame' interaction='whole' data-testid='root'>
      <ResourceListBody>
        <ResourceListControl>
          <input id='pay-card' type='checkbox' disabled={disabled} />
        </ResourceListControl>
        <ResourceListContents>
          <ResourceListTitle as='p'>
            <label htmlFor='pay-card'>クレジットカード払い</label>
          </ResourceListTitle>
          <ResourceListSupport>
            <p data-testid='support'>Visa、Master、JCB対応</p>
          </ResourceListSupport>
        </ResourceListContents>
      </ResourceListBody>
    </ResourceList>,
  );

// The title label is stretched over the row, so clicks land on it rather than on the text below.
test('interaction="whole" toggles the control from anywhere in the row', async () => {
  const screen = await renderSelectable();
  const checkbox = screen.getByRole('checkbox', { name: 'クレジットカード払い' });
  const root = screen.getByTestId('root').element();

  await expect.element(checkbox).not.toBeChecked();
  await screen.getByTestId('support').click({ force: true });
  await expect.element(checkbox).toBeChecked();

  const style = getComputedStyle(root);
  expect(style.backgroundColor).toBe('rgb(232, 241, 254)');
  expect(style.borderTopColor).toBe('rgb(127, 127, 127)');

  await screen.getByTestId('support').click({ force: true });
  await expect.element(checkbox).not.toBeChecked();
});

test('disabled control greys out the whole row', async () => {
  const screen = await renderSelectable(true);

  const style = getComputedStyle(screen.getByTestId('root').element());
  expect(style.backgroundColor).toBe('rgb(242, 242, 242)');
  expect(style.color).toBe('rgb(148, 148, 148)');
  expect(style.borderTopColor).toBe('rgb(179, 179, 179)');
});
