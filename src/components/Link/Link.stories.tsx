import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { Link, LinkExternalLinkIcon } from './Link';

const meta = {
  title: 'Components/リンク',
  component: Link,
  tags: ['autodocs'],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '32',
});
const narrow = css({ width: '160' });

export const Playground: Story = {
  args: { children: 'リンク', href: '#' },
};

export const External: Story = {
  name: '外部リンク',
  args: { children: '外部リンク', href: 'https://www.digital.go.jp', target: '_blank' },
};

export const Inline: Story = {
  name: '文中のリンク',
  args: { children: '文中のリンク', href: '#' },
  render: () => (
    <div className={column}>
      <p>
        これは<Link href='#'>文中のリンク</Link>です。
      </p>
      <p className={narrow}>
        これは
        <Link href='https://www.digital.go.jp' target='_blank'>
          複数行にまたがる文中のインラインリンク
        </Link>
        です。
      </p>
    </div>
  ),
};

export const AsChild: Story = {
  name: '子要素をリンクにする',
  args: { children: 'リンク' },
  render: () => (
    <Link asChild={true}>
      <a href='https://www.digital.go.jp' target='_blank' rel='noreferrer'>
        asChild を使ったリンク
        <LinkExternalLinkIcon />
      </a>
    </Link>
  ),
};
