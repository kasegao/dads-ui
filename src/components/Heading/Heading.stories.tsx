import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import {
  Heading,
  type HeadingLevel,
  HeadingShoulder,
  type HeadingSize,
  HeadingTitle,
  type RuleSize,
} from './Heading';

const meta = {
  title: 'Components/見出し',
  component: Heading,
  tags: ['autodocs'],
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '32' });
const icon = css({
  display: 'inline-block',
  marginRight: '0.4em',
  width: '1.25em',
  height: '1.25em',
  verticalAlign: '-0.25em',
});

const sizes: HeadingSize[] = ['64', '57', '45', '36', '32', '28', '24', '20', '18', '16'];
const rules: RuleSize[] = ['8', '6', '4', '2'];

const SampleIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden={true}
    className={icon}
  >
    <path d='M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z' />
  </svg>
);

type PlaygroundArgs = {
  level: HeadingLevel;
  size: HeadingSize;
  hasChip: boolean;
  hasRule: boolean;
  rule: RuleSize;
  hasShoulder: boolean;
  shoulderText: string;
  text: string;
  hasIcon: boolean;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    level: 'h2',
    size: '36',
    hasChip: false,
    hasIcon: false,
    hasRule: false,
    rule: '6',
    hasShoulder: false,
    shoulderText: 'ショルダーテキスト',
    text: '見出しテキスト',
  },
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    level: { control: 'inline-radio', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    hasChip: { control: 'boolean' },
    hasIcon: { control: 'boolean' },
    hasRule: { control: 'boolean' },
    rule: { control: 'inline-radio', options: rules, if: { arg: 'hasRule', eq: true } },
    hasShoulder: { control: 'boolean' },
    shoulderText: { control: 'text', if: { arg: 'hasShoulder', eq: true } },
    text: { control: 'text' },
  },
  render: ({ level, size, hasChip, hasIcon, hasRule, rule, hasShoulder, shoulderText, text }) => (
    <Heading size={size} hasChip={hasChip} rule={hasRule ? rule : undefined}>
      {hasShoulder && <HeadingShoulder>{shoulderText}</HeadingShoulder>}
      <HeadingTitle level={level}>
        {hasIcon && <SampleIcon />}
        {text}
      </HeadingTitle>
    </Heading>
  ),
};

export const Sizes: Story = {
  name: 'サイズ',
  args: { size: '36' },
  render: () => (
    <div className={column}>
      {sizes.map((size) => (
        <Heading key={size} size={size}>
          <HeadingTitle level='h2'>見出しテキスト {size}</HeadingTitle>
        </Heading>
      ))}
    </div>
  ),
};

export const WithChip: Story = {
  name: 'チップつき',
  args: { size: '36' },
  render: () => (
    <div className={column}>
      {sizes.map((size) => (
        <Heading key={size} size={size} hasChip={true}>
          <HeadingTitle level='h2'>見出しテキスト {size}</HeadingTitle>
        </Heading>
      ))}
    </div>
  ),
};

export const WithRule: Story = {
  name: '罫線つき',
  args: { size: '36' },
  render: () => (
    <div className={column}>
      {rules.map((rule) => (
        <Heading key={rule} size='36' rule={rule}>
          <HeadingTitle level='h2'>見出しテキスト（罫線 {rule}）</HeadingTitle>
        </Heading>
      ))}
    </div>
  ),
};

export const WithShoulder: Story = {
  name: 'ショルダーつき',
  args: { size: '36' },
  render: () => (
    <div className={column}>
      <Heading size='45'>
        <HeadingShoulder>ショルダーテキスト</HeadingShoulder>
        <HeadingTitle level='h2'>見出しテキスト</HeadingTitle>
      </Heading>
      <Heading size='36' hasChip={true}>
        <HeadingShoulder>ショルダーテキスト</HeadingShoulder>
        <HeadingTitle level='h2'>チップつきの見出しテキスト</HeadingTitle>
      </Heading>
      <Heading size='28' hasChip={true} rule='4'>
        <HeadingShoulder>ショルダーテキスト</HeadingShoulder>
        <HeadingTitle level='h3'>チップと罫線つきの見出しテキスト</HeadingTitle>
      </Heading>
    </div>
  ),
};

export const WithIcon: Story = {
  name: 'アイコンつき',
  args: { size: '36' },
  render: () => (
    <Heading size='32'>
      <HeadingTitle level='h2'>
        <SampleIcon />
        見出しテキスト
      </HeadingTitle>
    </Heading>
  ),
};
