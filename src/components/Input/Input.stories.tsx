import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { css } from '../../../styled-system/css';
import { ErrorText } from '../ErrorText';
import {
  FormControlLabel,
  Label,
  RequirementBadge,
  StatusBadge,
  SupportText,
} from '../FormControlLabel';
import { Input } from './Input';

const meta = {
  title: 'Components/インプットテキスト',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    blockSize: { control: 'radio', options: ['lg', 'md', 'sm'] },
    isError: { control: 'boolean' },
    'aria-disabled': { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '32' });

export const Playground: Story = {
  args: { blockSize: 'lg', isError: false, 'aria-disabled': false, readOnly: false },
  render: (args) => {
    const id = useId();
    const supportTextId = useId();

    return (
      <FormControlLabel>
        <Label htmlFor={id}>
          ラベル<RequirementBadge>※必須</RequirementBadge>
        </Label>
        <SupportText id={supportTextId}>サポートテキスト</SupportText>
        <div>
          <Input {...args} id={id} aria-describedby={supportTextId} required={true} />
        </div>
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
            <div>
              <Input id={`${id}-${blockSize}`} blockSize={blockSize} />
            </div>
          </FormControlLabel>
        ))}
      </div>
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
        <div>
          <Input
            id={id}
            aria-describedby={`${errorTextId} ${supportTextId}`}
            isError={true}
            required={true}
          />
        </div>
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
        <div>
          <Input
            id={id}
            aria-describedby={supportTextId}
            aria-disabled={true}
            defaultValue='入力済みの内容'
          />
        </div>
      </FormControlLabel>
    );
  },
};

export const Readonly: Story = {
  name: '読み取り専用',
  render: () => {
    const id = useId();
    const supportTextId = useId();

    return (
      <FormControlLabel>
        <Label htmlFor={id}>
          ラベル<StatusBadge>編集不可</StatusBadge>
        </Label>
        <SupportText id={supportTextId}>サポートテキスト</SupportText>
        <div>
          <Input
            id={id}
            aria-describedby={supportTextId}
            readOnly={true}
            defaultValue='入力済みの内容'
          />
        </div>
      </FormControlLabel>
    );
  },
};
