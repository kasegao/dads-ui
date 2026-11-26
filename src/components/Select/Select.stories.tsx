import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { css } from '../../../styled-system/css';
import { ErrorText } from '../ErrorText';
import {
  FormControlLabel,
  Label,
  Legend,
  RequirementBadge,
  StatusBadge,
  SupportText,
} from '../FormControlLabel';
import { Select } from './Select';

const meta = {
  title: 'Components/セレクトボックス',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    blockSize: { control: 'radio', options: ['lg', 'md', 'sm'] },
    isError: { control: 'boolean' },
    'aria-disabled': { control: 'boolean' },
    children: { control: false },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '32' });
const row = css({ display: 'flex', flexWrap: 'wrap', gap: '16' });
const fullWidth = css({ width: 'full' });

const options = (
  <>
    <option value=''>選択してください</option>
    <option value='1'>選択肢1</option>
    <option value='2'>選択肢2</option>
    <option value='3'>選択肢3</option>
  </>
);

export const Playground: Story = {
  args: { blockSize: 'lg', isError: false, 'aria-disabled': false },
  render: (args) => {
    const id = useId();
    const supportTextId = useId();

    return (
      <FormControlLabel>
        <Label htmlFor={id}>
          ラベル<RequirementBadge>※必須</RequirementBadge>
        </Label>
        <SupportText id={supportTextId}>サポートテキスト</SupportText>
        <Select {...args} id={id} aria-describedby={supportTextId} required={true}>
          {options}
        </Select>
      </FormControlLabel>
    );
  },
};

export const Sizes: Story = {
  name: 'サイズ',
  render: () => {
    const id = useId();

    return (
      <div className={column}>
        {(['lg', 'md', 'sm'] as const).map((blockSize) => (
          <FormControlLabel key={blockSize}>
            <Label htmlFor={`${id}-${blockSize}`}>ラベル（{blockSize}）</Label>
            <Select id={`${id}-${blockSize}`} blockSize={blockSize}>
              {options}
            </Select>
          </FormControlLabel>
        ))}
      </div>
    );
  },
};

export const InlineWithGrouping: Story = {
  name: '横並びのグループ',
  render: () => {
    const id = useId();
    const supportTextId = useId();

    return (
      <FormControlLabel as='fieldset'>
        <Legend>フォームコントロールグループ</Legend>
        <SupportText id={supportTextId}>サポートテキスト</SupportText>
        <div className={row}>
          {['ラベル1', 'ラベル2', 'ラベル3'].map((text, index) => (
            <FormControlLabel key={text}>
              <Label htmlFor={`${id}-${index}`}>{text}</Label>
              <Select id={`${id}-${index}`} aria-describedby={supportTextId}>
                {options}
              </Select>
            </FormControlLabel>
          ))}
        </div>
      </FormControlLabel>
    );
  },
};

export const Errored: Story = {
  name: 'エラー',
  render: () => {
    const id = useId();
    const supportTextId = useId();
    const errorTextId = useId();

    return (
      <FormControlLabel>
        <Label htmlFor={id}>
          ラベル<RequirementBadge>※必須</RequirementBadge>
        </Label>
        <SupportText id={supportTextId}>サポートテキスト</SupportText>
        <Select
          id={id}
          aria-describedby={`${errorTextId} ${supportTextId}`}
          isError={true}
          required={true}
        >
          {options}
        </Select>
        <ErrorText id={errorTextId}>＊エラーテキスト</ErrorText>
      </FormControlLabel>
    );
  },
};

export const Disabled: Story = {
  name: '無効',
  render: () => {
    const id = useId();
    const supportTextId = useId();

    return (
      <FormControlLabel>
        <Label htmlFor={id}>
          ラベル<StatusBadge>無効</StatusBadge>
        </Label>
        <SupportText id={supportTextId}>サポートテキスト</SupportText>
        <Select id={id} aria-describedby={supportTextId} aria-disabled={true}>
          {options}
        </Select>
      </FormControlLabel>
    );
  },
};

export const WidthExamples: Story = {
  name: '幅の指定',
  render: () => {
    const id = useId();

    return (
      <div className={column}>
        <FormControlLabel>
          <Label htmlFor={`${id}-full`}>100%幅のセレクトボックス</Label>
          <Select id={`${id}-full`} className={fullWidth}>
            {options}
          </Select>
        </FormControlLabel>
        <FormControlLabel>
          <Label htmlFor={`${id}-fixed`}>特定の幅（256 CSS px）を指定したセレクトボックス</Label>
          <Select id={`${id}-fixed`} style={{ width: '16rem' }}>
            {options}
          </Select>
        </FormControlLabel>
        <FormControlLabel>
          <Label htmlFor={`${id}-fit`}>内容にフィットしたセレクトボックス</Label>
          <Select id={`${id}-fit`}>{options}</Select>
        </FormControlLabel>
      </div>
    );
  },
};
