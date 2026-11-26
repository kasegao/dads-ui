import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { css } from '../../../styled-system/css';
import {
  MenuListBox,
  MenuListBoxItem,
  type MenuListBoxItemSize,
  MenuListBoxOpener,
  type MenuListBoxOpenerFontWeight,
  type MenuListBoxOpenerSize,
  type MenuListBoxOpenerStyle,
  MenuListBoxPopup,
  type MenuListBoxSelectDetail,
} from './MenuListBox';

const meta = {
  title: 'Components/メニューリストボックス',
  component: MenuListBox,
  tags: ['autodocs'],
} satisfies Meta<typeof MenuListBox>;

export default meta;

const stage = css({ minHeight: '24rem' });
const row = css({ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '32' });
const column = css({ display: 'flex', flexDirection: 'column', gap: '32', minHeight: '24rem' });
const openerIcon = css({ width: '20', height: '20' });

const iconPath =
  'M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z';

const OpenerIcon = () => (
  <svg
    aria-hidden={true}
    className={openerIcon}
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='currentColor'
  >
    <path d={iconPath} />
  </svg>
);

const ItemIcon = () => (
  <svg aria-hidden={true} width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
    <path d={iconPath} />
  </svg>
);

const items = Array.from({ length: 7 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `メニュー項目${i + 1}`,
}));

interface PlaygroundArgs {
  size: MenuListBoxOpenerSize;
  buttonStyle: MenuListBoxOpenerStyle;
  fontWeight: MenuListBoxOpenerFontWeight;
  itemSize: MenuListBoxItemSize;
  onSelect: (detail: MenuListBoxSelectDetail) => void;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  render: (args) => (
    <div className={stage}>
      <MenuListBox onSelect={args.onSelect}>
        <MenuListBoxOpener
          size={args.size}
          buttonStyle={args.buttonStyle}
          fontWeight={args.fontWeight}
        >
          <OpenerIcon />
          メニュー
        </MenuListBoxOpener>
        <MenuListBoxPopup>
          {items.map((item) => (
            <MenuListBoxItem key={item.value} value={item.value} size={args.itemSize}>
              <ItemIcon />
              <span>{item.label}</span>
            </MenuListBoxItem>
          ))}
        </MenuListBoxPopup>
      </MenuListBox>
    </div>
  ),
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
    buttonStyle: { control: 'radio', options: ['text', 'outlined', 'filled'] },
    fontWeight: { control: 'radio', options: ['normal', 'bold'] },
    itemSize: { control: 'radio', options: ['regular', 'small'] },
    onSelect: { action: 'onSelect' },
  },
  args: { size: 'sm', buttonStyle: 'text', fontWeight: 'normal', itemSize: 'regular' },
};

export const OpenerVariants: StoryObj = {
  name: 'オープナーのバリエーション',
  render: () => (
    <div className={column}>
      {(['sm', 'md'] as const).map((size) => (
        <div className={row} key={size}>
          {(['text', 'outlined', 'filled'] as const).map((buttonStyle) =>
            (['normal', 'bold'] as const).map((fontWeight) => (
              <MenuListBox key={`${buttonStyle}-${fontWeight}`}>
                <MenuListBoxOpener size={size} buttonStyle={buttonStyle} fontWeight={fontWeight}>
                  メニュー
                </MenuListBoxOpener>
                <MenuListBoxPopup>
                  {items.slice(0, 3).map((item) => (
                    <MenuListBoxItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuListBoxItem>
                  ))}
                </MenuListBoxPopup>
              </MenuListBox>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};

const sortOptions = [
  { value: 'newest', label: '新しい順' },
  { value: 'oldest', label: '古い順' },
  { value: 'name', label: '名前順' },
];

export const WithCurrent: StoryObj = {
  name: '選択中の項目を示す',
  render: () => {
    const [sort, setSort] = useState('newest');
    return (
      <div className={stage}>
        <MenuListBox onSelect={(detail) => setSort(detail.value)}>
          <MenuListBoxOpener size='md' buttonStyle='outlined'>
            並び替え: {sortOptions.find((option) => option.value === sort)?.label}
          </MenuListBoxOpener>
          <MenuListBoxPopup>
            {sortOptions.map((option) => (
              <MenuListBoxItem
                key={option.value}
                value={option.value}
                size='small'
                current={option.value === sort}
              >
                {option.label}
              </MenuListBoxItem>
            ))}
          </MenuListBoxPopup>
        </MenuListBox>
      </div>
    );
  },
};

export const WithDisabledItem: StoryObj = {
  name: '無効な項目',
  render: () => (
    <div className={stage}>
      <MenuListBox>
        <MenuListBoxOpener size='md' buttonStyle='filled'>
          操作
        </MenuListBoxOpener>
        <MenuListBoxPopup>
          <MenuListBoxItem value='edit'>編集</MenuListBoxItem>
          <MenuListBoxItem value='duplicate'>複製</MenuListBoxItem>
          <MenuListBoxItem value='delete' disabled={true}>
            削除
          </MenuListBoxItem>
        </MenuListBoxPopup>
      </MenuListBox>
    </div>
  ),
};
