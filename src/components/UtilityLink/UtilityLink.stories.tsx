import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { UtilityLink, UtilityLinkExternalLinkIcon } from './UtilityLink';

const meta = {
  title: 'Components/ユーティリティリンク',
  component: UtilityLink,
  tags: ['autodocs'],
} satisfies Meta<typeof UtilityLink>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '32',
});

export const Playground: Story = {
  args: { href: '#', children: 'リンク' },
};

export const External: Story = {
  name: '外部リンク',
  args: {
    href: 'https://www.digital.go.jp',
    target: '_blank',
    rel: 'noreferrer',
    children: '外部リンク',
  },
};

export const AsChild: Story = {
  name: 'asChild で任意のリンク要素を使う',
  args: { href: '#', children: 'リンク' },
  render: () => (
    <div className={column}>
      <UtilityLink asChild={true}>
        <a href='https://www.digital.go.jp' target='_blank' rel='noreferrer'>
          <svg
            className={css({
              display: 'inline-block',
              width: '16',
              height: '16',
              marginRight: '4',
              verticalAlign: '-0.15em',
            })}
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='currentcolor'
            aria-hidden='true'
          >
            <path d='M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z' />
          </svg>
          アイコン付きのリンク
          <UtilityLinkExternalLinkIcon />
        </a>
      </UtilityLink>
    </div>
  ),
};
