import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  SearchBox,
  SearchBoxDetail,
  SearchBoxDetailActions,
  SearchBoxFields,
  SearchBoxInput,
  SearchBoxSelect,
  type SearchBoxSize,
  SearchBoxSubmit,
} from './SearchBox';

const renderSearchBox = (size?: SearchBoxSize, onSubmit = vi.fn()) =>
  render(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(Object.fromEntries(new FormData(e.currentTarget)));
      }}
    >
      <SearchBox size={size}>
        <SearchBoxFields>
          <SearchBoxSelect label='検索対象' name='scope'>
            <option value=''>すべて</option>
            <option value='images'>画像</option>
          </SearchBoxSelect>
          <SearchBoxInput label='キーワード' type='search' name='q' />
        </SearchBoxFields>
        <SearchBoxSubmit type='submit'>検索</SearchBoxSubmit>
      </SearchBox>
    </form>,
  );

test('labels the fields and submits the query', async () => {
  const onSubmit = vi.fn();
  const screen = await renderSearchBox('lg', onSubmit);

  await screen.getByRole('combobox', { name: '検索対象' }).selectOptions('images');
  await screen.getByRole('searchbox', { name: 'キーワード' }).fill('法令');
  await screen.getByRole('button', { name: '検索' }).click();

  expect(onSubmit).toHaveBeenCalledWith({ scope: 'images', q: '法令' });
});

test('joins the select, the input and the key-color button into one row', async () => {
  const screen = await renderSearchBox();
  const select = screen.getByRole('combobox').element();
  const input = screen.getByRole('searchbox').element();
  const button = screen.getByRole('button').element();

  const selectStyle = getComputedStyle(select);
  expect(selectStyle.width).toBe('160px');
  expect(selectStyle.backgroundColor).toBe('rgb(242, 242, 242)');
  expect(selectStyle.borderTopLeftRadius).toBe('8px');
  expect(selectStyle.borderTopRightRadius).toBe('0px');
  expect(selectStyle.paddingTop).toBe('20px');

  const inputStyle = getComputedStyle(input);
  expect(inputStyle.borderTopLeftRadius).toBe('0px');
  expect(inputStyle.borderTopRightRadius).toBe('8px');
  expect(inputStyle.marginLeft).toBe('-1px');
  expect(inputStyle.paddingLeft).toBe('48px');
  expect(inputStyle.borderTopColor).toBe('rgb(102, 102, 102)');

  expect(getComputedStyle(button).backgroundColor).toBe('rgb(0, 23, 193)');
  expect(button.getBoundingClientRect().height).toBe(56);
  expect(select.getBoundingClientRect().height).toBe(56);
  expect(input.getBoundingClientRect().height).toBe(56);
  expect(select.getBoundingClientRect().right - 1).toBe(input.getBoundingClientRect().left);
});

test('size scales the row and hides the select label at sm', async () => {
  const md = await renderSearchBox('md');
  expect(md.getByRole('button').element().getBoundingClientRect().height).toBe(48);
  expect(md.getByRole('searchbox').element().getBoundingClientRect().height).toBe(48);
  expect(getComputedStyle(md.getByRole('combobox').element()).paddingTop).toBe('18px');
  expect(md.getByText('検索対象').element().getBoundingClientRect().width).toBeGreaterThan(1);
  await md.unmount();

  const sm = await renderSearchBox('sm');
  expect(sm.getByRole('button').element().getBoundingClientRect().height).toBe(36);
  expect(sm.getByRole('searchbox').element().getBoundingClientRect().height).toBe(36);
  expect(getComputedStyle(sm.getByRole('combobox').element()).paddingTop).toBe('0px');
  expect(sm.getByText('検索対象').element().getBoundingClientRect().width).toBe(1);
  await expect.element(sm.getByRole('combobox', { name: '検索対象' })).toBeInTheDocument();
});

test('the input keeps full radius without a select and can be labelled by a heading', async () => {
  const screen = await render(
    <>
      <h2 id='heading'>サイト内検索</h2>
      <SearchBox>
        <SearchBoxFields>
          <SearchBoxInput aria-labelledby='heading' type='search' name='q' />
        </SearchBoxFields>
        <SearchBoxSubmit>検索</SearchBoxSubmit>
      </SearchBox>
    </>,
  );

  const input = screen.getByRole('searchbox', { name: 'サイト内検索' });
  const style = getComputedStyle(input.element());
  expect(style.borderTopLeftRadius).toBe('8px');
  expect(style.marginLeft).toBe('0px');
  await expect
    .element(screen.getByRole('button', { name: '検索' }))
    .toHaveAttribute('type', 'button');
});

test('opening the detail panel hides the outer submit button', async () => {
  const screen = await render(
    <SearchBox>
      <SearchBoxFields>
        <SearchBoxInput label='キーワード' type='search' name='q' />
      </SearchBoxFields>
      <SearchBoxDetail summary='詳細検索'>
        <p>絞り込み条件</p>
        <SearchBoxDetailActions>
          <button type='submit'>この条件で検索</button>
        </SearchBoxDetailActions>
      </SearchBoxDetail>
      <SearchBoxSubmit>検索</SearchBoxSubmit>
    </SearchBox>,
  );
  const submit = screen.getByText('検索', { exact: true }).element();
  const details = screen.container.querySelector('details') as HTMLDetailsElement;

  expect(details.open).toBe(false);
  expect(getComputedStyle(submit).visibility).toBe('visible');
  expect(getComputedStyle(details).borderTopColor).toBe('rgb(102, 102, 102)');

  await screen.getByText('詳細検索').click();

  expect(details.open).toBe(true);
  await expect.element(screen.getByRole('button', { name: 'この条件で検索' })).toBeVisible();
  expect(getComputedStyle(submit).visibility).toBe('hidden');
  expect(getComputedStyle(details).paddingBottom).toBe('24px');
  expect(details.getBoundingClientRect().width).toBe(
    (details.parentElement as HTMLElement).getBoundingClientRect().width,
  );
});

test('SearchBoxSubmit asChild places a custom element in the submit cell', async () => {
  const screen = await render(
    <SearchBox>
      <SearchBoxFields>
        <SearchBoxInput label='キーワード' type='search' name='q' />
      </SearchBoxFields>
      <SearchBoxSubmit asChild={true}>
        <a href='/search'>検索ページへ</a>
      </SearchBoxSubmit>
    </SearchBox>,
  );

  const link = screen.getByRole('link', { name: '検索ページへ' });
  await expect.element(link).toHaveAttribute('href', '/search');
  expect(getComputedStyle(link.element()).gridRowStart).toBe('submit');
});

test('SearchBoxSubmit does not fire click when aria-disabled', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <SearchBox>
      <SearchBoxFields>
        <SearchBoxInput label='キーワード' type='search' name='q' />
      </SearchBoxFields>
      <SearchBoxSubmit aria-disabled={true} onClick={onClick}>
        検索
      </SearchBoxSubmit>
    </SearchBox>,
  );

  await screen.getByRole('button').click({ force: true });

  expect(onClick).not.toHaveBeenCalled();
});
