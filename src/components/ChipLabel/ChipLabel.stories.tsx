import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { ChipLabel, type ChipLabelColor, type ChipLabelVariant } from './ChipLabel';

const variants: ChipLabelVariant[] = ['text', 'outlined', 'filled-1', 'filled-2'];
const colors: ChipLabelColor[] = [
  'gray',
  'blue',
  'light-blue',
  'cyan',
  'green',
  'lime',
  'yellow',
  'orange',
  'red',
  'magenta',
  'purple',
];

const meta = {
  title: 'Components/チップラベル',
  component: ChipLabel,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: variants },
    color: { control: 'inline-radio', options: colors },
  },
} satisfies Meta<typeof ChipLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '16' });
const row = css({ display: 'flex', flexWrap: 'wrap', gap: '16' });
const icon = css({
  '--icon-offset': 'calc((1.5rem - 1cap) / 2)',
  position: 'relative',
  top: 'var(--icon-offset)',
  flexShrink: '0',
  marginTop: 'calc(-1 * var(--icon-offset))',
  marginRight: '4',
  marginBottom: 'var(--icon-offset)',
});

const SampleIcon = () => (
  <svg
    className={icon}
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='currentcolor'
    aria-hidden={true}
  >
    <path d='M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z' />
  </svg>
);

type PlaygroundArgs = {
  variant: ChipLabelVariant;
  color: ChipLabelColor;
  icon: boolean;
  text: string;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: { variant: 'text', color: 'gray', icon: true, text: 'ラベル' },
  argTypes: {
    icon: { control: 'boolean' },
    text: { control: 'text' },
  },
  render: (args) => (
    <ChipLabel variant={args.variant} color={args.color}>
      {args.icon && <SampleIcon />}
      {args.text}
    </ChipLabel>
  ),
};

export const AllChipLabels: Story = {
  name: 'バリアントと色',
  render: () => (
    <div className={column}>
      {variants.map((variant) => (
        <div key={variant} className={row}>
          {colors.map((color) => (
            <ChipLabel key={color} variant={variant} color={color}>
              ラベル
            </ChipLabel>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  name: 'アイコンつき',
  render: () => (
    <div className={column}>
      {variants.map((variant) => (
        <div key={variant} className={row}>
          {colors.map((color) => (
            <ChipLabel key={color} variant={variant} color={color}>
              <SampleIcon />
              ラベル
            </ChipLabel>
          ))}
        </div>
      ))}
    </div>
  ),
};
