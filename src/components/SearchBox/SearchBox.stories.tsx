import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { css } from '../../../styled-system/css';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { FormControlLabel, Legend } from '../FormControlLabel';
import { Radio } from '../Radio';
import {
  SearchBox,
  SearchBoxDetail,
  SearchBoxDetailActions,
  SearchBoxFields,
  SearchBoxInput,
  SearchBoxSelect,
  SearchBoxSubmit,
} from './SearchBox';

type StoryArgs = {
  size: 'lg' | 'md' | 'sm';
  hasOption: boolean;
};

const meta = {
  title: 'Components/検索ボックス',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['lg', 'md', 'sm'] },
    hasOption: { control: 'boolean' },
  },
  args: { size: 'lg', hasOption: true },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '32' });
const filters = css({ display: 'flex', flexDirection: 'column', gap: '24', marginBottom: '32' });
const choices = css({ display: 'flex', flexWrap: 'wrap', columnGap: '16' });
const heading = css({ marginBottom: '16', textStyle: 'std-20B-150' });

// `&&` raises specificity so the width wins over Button's own `width: fit`.
const detailSubmit = css({
  '&&': {
    columnGap: '8',
    width: { base: 'full', desktop: 'fit' },
    minWidth: { desktop: '50%' },
  },
});

const scopeOptions = (
  <>
    <option value=''>すべて</option>
    <option value='images'>画像</option>
    <option value='files'>ファイル</option>
    <option value='map'>地図</option>
    <option value='videos'>動画</option>
  </>
);

export const Playground: Story = {
  render: ({ size, hasOption }) => (
    <SearchBox size={size}>
      <SearchBoxFields>
        {hasOption && (
          <SearchBoxSelect label='検索対象' name='scope'>
            {scopeOptions}
          </SearchBoxSelect>
        )}
        <SearchBoxInput label='検索' type='search' name='q' />
      </SearchBoxFields>
      <SearchBoxSubmit type='submit'>検索</SearchBoxSubmit>
    </SearchBox>
  ),
};

export const Sizes: Story = {
  name: 'サイズ',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={column}>
      {(['lg', 'md', 'sm'] as const).map((size) => (
        <SearchBox key={size} size={size}>
          <SearchBoxFields>
            <SearchBoxSelect label='検索対象' name='scope'>
              {scopeOptions}
            </SearchBoxSelect>
            <SearchBoxInput label={`検索（${size}）`} type='search' name='q' />
          </SearchBoxFields>
          <SearchBoxSubmit type='submit'>検索</SearchBoxSubmit>
        </SearchBox>
      ))}
    </div>
  ),
};

export const WithoutSelect: Story = {
  name: '絞り込みオプションなし',
  parameters: { controls: { disable: true } },
  render: () => {
    const headingId = useId();

    return (
      <search>
        <h2 id={headingId} className={heading}>
          サイト内検索
        </h2>
        <SearchBox>
          <SearchBoxFields>
            <SearchBoxInput aria-labelledby={headingId} type='search' name='q' />
          </SearchBoxFields>
          <SearchBoxSubmit type='submit'>検索</SearchBoxSubmit>
        </SearchBox>
      </search>
    );
  },
};

const lawTypes = ['法令', '政令', '勅令', '府省令', '規則'];

export const WithDetail: Story = {
  name: '詳細検索パネル付き',
  parameters: { controls: { disable: true } },
  render: () => {
    const [checked, setChecked] = useState<string[]>(['法令', '勅令', '規則']);
    const allChecked = checked.length === lawTypes.length;

    return (
      <form onSubmit={(e) => e.preventDefault()} onReset={() => setChecked([])}>
        <SearchBox>
          <SearchBoxFields>
            <SearchBoxSelect label='検索対象' name='scope'>
              {scopeOptions}
            </SearchBoxSelect>
            <SearchBoxInput label='検索' type='search' name='q' />
          </SearchBoxFields>

          <SearchBoxDetail summary='詳細検索'>
            <div className={filters}>
              <FormControlLabel as='fieldset'>
                <Legend>検索対象</Legend>
                <div className={choices}>
                  <Radio name='search-target' value='current' defaultChecked={true}>
                    現行法令
                  </Radio>
                  <Radio name='search-target' value='point-in-time'>
                    時点指定
                  </Radio>
                </div>
              </FormControlLabel>

              <FormControlLabel as='fieldset'>
                <Legend>法令種別</Legend>
                <div className={choices}>
                  <Checkbox
                    name='law-type'
                    value='all'
                    checked={allChecked}
                    ref={(element) => {
                      if (element) {
                        element.indeterminate = checked.length > 0 && !allChecked;
                      }
                    }}
                    onChange={(e) => setChecked(e.target.checked ? lawTypes : [])}
                  >
                    すべて
                  </Checkbox>
                  {lawTypes.map((lawType) => (
                    <Checkbox
                      key={lawType}
                      name='law-type'
                      value={lawType}
                      checked={checked.includes(lawType)}
                      onChange={(e) =>
                        setChecked((prev) =>
                          e.target.checked
                            ? [...prev, lawType]
                            : prev.filter((item) => item !== lawType),
                        )
                      }
                    >
                      {lawType}
                    </Checkbox>
                  ))}
                </div>
              </FormControlLabel>

              <FormControlLabel as='fieldset'>
                <Legend>並び順</Legend>
                <div className={choices}>
                  <Radio name='sort-order' value='relevance' defaultChecked={true}>
                    関連度順
                  </Radio>
                  <Radio name='sort-order' value='updated'>
                    更新日時順
                  </Radio>
                </div>
              </FormControlLabel>

              <FormControlLabel as='fieldset'>
                <Legend>表示件数</Legend>
                <div className={choices}>
                  <Radio name='display-count' value='10' defaultChecked={true}>
                    10件
                  </Radio>
                  <Radio name='display-count' value='50'>
                    50件
                  </Radio>
                  <Radio name='display-count' value='100'>
                    100件
                  </Radio>
                </div>
              </FormControlLabel>
            </div>

            <SearchBoxDetailActions>
              <Button type='submit' variant='solid-fill' size='lg' className={detailSubmit}>
                <svg aria-hidden={true} width='24' height='24' viewBox='0 0 24 24'>
                  <path
                    d='m21 20.5-6-6a7.4 7.4 0 0 0 1.9-5A7.4 7.4 0 0 0 9.5 2 7.5 7.5 0 1 0 14 15.5l6 6 1-1ZM3.5 9.5a6 6 0 0 1 6-6 6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6Z'
                    fill='currentColor'
                  />
                </svg>
                検索
              </Button>
              <Button type='reset' variant='text' size='sm'>
                検索条件をクリア
              </Button>
            </SearchBoxDetailActions>
          </SearchBoxDetail>

          <SearchBoxSubmit type='submit'>検索</SearchBoxSubmit>
        </SearchBox>
      </form>
    );
  },
};
