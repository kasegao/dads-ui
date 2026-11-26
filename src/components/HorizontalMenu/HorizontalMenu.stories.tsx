import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { css } from '../../../styled-system/css';
import {
  HorizontalMenu,
  HorizontalMenuItem,
  HorizontalMenuItemButton,
  HorizontalMenuItemLink,
} from './HorizontalMenu';

const meta = {
  title: 'Components/水平メニュー',
  component: HorizontalMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof HorizontalMenu>;

export default meta;

const frontIconStyle = css({ flexShrink: '0', width: '24', height: '24' });
const chevronStyle = css({ flexShrink: '0', marginTop: '4', width: '16', height: '16' });

const FrontIcon = () => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden={true}
    className={frontIconStyle}
  >
    <path d='M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z' />
  </svg>
);

const Chevron = () => (
  <svg
    width={16}
    height={16}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden={true}
    className={chevronStyle}
  >
    <path d='M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z' />
  </svg>
);

interface PlaygroundProps {
  items: number;
  label: string;
  hasFrontIcon: boolean;
  isCurrent: boolean;
  hasSubmenu: boolean;
  isExpanded: boolean;
}

export const Playground: StoryObj<PlaygroundProps> = {
  render: (args) => (
    <nav aria-label='メインメニュー'>
      <HorizontalMenu>
        <HorizontalMenuItem>
          {args.hasSubmenu ? (
            <HorizontalMenuItemButton
              aria-current={args.isCurrent ? 'true' : undefined}
              aria-expanded={args.isExpanded}
            >
              {args.hasFrontIcon && <FrontIcon />}
              {args.label}
              <Chevron />
            </HorizontalMenuItemButton>
          ) : (
            <HorizontalMenuItemLink href='#' aria-current={args.isCurrent ? 'page' : undefined}>
              {args.hasFrontIcon && <FrontIcon />}
              {args.label}
            </HorizontalMenuItemLink>
          )}
        </HorizontalMenuItem>
        {Array.from({ length: Math.max(args.items - 1, 0) }, (_, i) => `メニュー${i + 2}`).map(
          (label) => (
            <HorizontalMenuItem key={label}>
              <HorizontalMenuItemLink href='#'>{label}</HorizontalMenuItemLink>
            </HorizontalMenuItem>
          ),
        )}
      </HorizontalMenu>
    </nav>
  ),
  argTypes: {
    items: { control: { type: 'number', min: 1 } },
    label: { control: 'text' },
    hasFrontIcon: { control: 'boolean' },
    isCurrent: { control: 'boolean' },
    hasSubmenu: { control: 'boolean' },
    isExpanded: { control: 'boolean', if: { arg: 'hasSubmenu' } },
  },
  args: {
    items: 3,
    label: 'メニュー1',
    hasFrontIcon: false,
    isCurrent: false,
    hasSubmenu: false,
    isExpanded: false,
  },
};

export const Current: StoryObj = {
  name: '現在地',
  render: () => (
    <nav aria-label='メインメニュー'>
      <HorizontalMenu>
        <HorizontalMenuItem>
          <HorizontalMenuItemLink href='#'>ホーム</HorizontalMenuItemLink>
        </HorizontalMenuItem>
        <HorizontalMenuItem>
          <HorizontalMenuItemLink href='#' aria-current='page'>
            お知らせ
          </HorizontalMenuItemLink>
        </HorizontalMenuItem>
        <HorizontalMenuItem>
          <HorizontalMenuItemLink href='#'>手続き</HorizontalMenuItemLink>
        </HorizontalMenuItem>
      </HorizontalMenu>
    </nav>
  ),
};

export const WithFrontIcon: StoryObj = {
  name: 'フロントアイコン付き',
  render: () => (
    <nav aria-label='メインメニュー'>
      <HorizontalMenu>
        {['メニュー1', 'メニュー2', 'メニュー3'].map((label) => (
          <HorizontalMenuItem key={label}>
            <HorizontalMenuItemLink href='#'>
              <FrontIcon />
              {label}
            </HorizontalMenuItemLink>
          </HorizontalMenuItem>
        ))}
      </HorizontalMenu>
    </nav>
  ),
};

const submenu = css({
  position: 'absolute',
  top: 'full',
  left: '0',
  zIndex: 'dropdown',
  width: 'max',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.420',
  backgroundColor: 'white',
  padding: '16',
  boxShadow: '1',
  textStyle: 'dns-16N-130',
});

export const WithSubmenu: StoryObj = {
  name: 'サブメニューの開閉',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <nav aria-label='メインメニュー' className={css({ minHeight: '160' })}>
        <HorizontalMenu>
          <HorizontalMenuItem>
            <HorizontalMenuItemButton
              aria-controls='horizontal-menu-submenu'
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              サービス
              <Chevron />
            </HorizontalMenuItemButton>
            {isOpen && (
              <div className={submenu} id='horizontal-menu-submenu'>
                サブメニューの内容
              </div>
            )}
          </HorizontalMenuItem>
          <HorizontalMenuItem>
            <HorizontalMenuItemLink href='#'>お知らせ</HorizontalMenuItemLink>
          </HorizontalMenuItem>
        </HorizontalMenu>
      </nav>
    );
  },
};
