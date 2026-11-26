import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { Button } from './Button';

const meta = {
  title: 'Components/ボタン',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['solid-fill', 'outline', 'text'] },
    size: { control: 'radio', options: ['lg', 'md', 'sm', 'xs'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16' });
const column = css({ display: 'flex', flexDirection: 'column', gap: '24' });

export const Playground: Story = {
  args: { children: 'ボタン', variant: 'solid-fill', size: 'lg' },
};

export const AllVariants: Story = {
  name: 'バリアントとサイズ',
  args: { children: 'ボタン', size: 'lg' },
  render: () => (
    <div className={column}>
      {(['solid-fill', 'outline', 'text'] as const).map((variant) => (
        <div key={variant} className={row}>
          {(['lg', 'md', 'sm', 'xs'] as const).map((size) => (
            <Button key={size} variant={variant} size={size}>
              ボタン
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  name: '無効',
  args: { children: 'ボタン', size: 'lg' },
  render: () => (
    <div className={row}>
      {(['solid-fill', 'outline', 'text'] as const).map((variant) => (
        <Button key={variant} variant={variant} size='lg' aria-disabled={true}>
          ボタン
        </Button>
      ))}
    </div>
  ),
};

export const AsLink: Story = {
  name: 'リンクとして使う',
  args: { children: 'リンク', size: 'lg' },
  render: () => (
    <Button asChild={true} variant='outline' size='md'>
      <a href='https://design.digital.go.jp/'>リンク</a>
    </Button>
  ),
};
