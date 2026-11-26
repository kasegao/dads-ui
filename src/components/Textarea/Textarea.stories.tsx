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
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/テキストエリア',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    isError: { control: 'boolean' },
    'aria-disabled': { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

const fieldSizing = css({
  fieldSizing: 'content',
  width: '24rem',
  minHeight: 'calc(3lh + 2rem + 2px)',
  maxHeight: 'calc(10lh + 2rem + 2px)',
});

export const Playground: Story = {
  args: { isError: false, 'aria-disabled': false, readOnly: false, rows: 4, cols: 40 },
  render: (args) => {
    const id = useId();
    const supportTextId = useId();

    return (
      <FormControlLabel>
        <Label htmlFor={id}>
          ラベル<RequirementBadge>※必須</RequirementBadge>
        </Label>
        <SupportText id={supportTextId}>サポートテキスト</SupportText>
        <Textarea {...args} id={id} aria-describedby={supportTextId} required={true} />
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
        <Textarea
          id={id}
          aria-describedby={`${errorTextId} ${supportTextId}`}
          isError={true}
          required={true}
          rows={4}
          cols={40}
        />
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
        <Textarea
          id={id}
          aria-describedby={supportTextId}
          aria-disabled={true}
          defaultValue='入力済みの内容'
          rows={4}
          cols={40}
        />
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
        <Textarea
          id={id}
          aria-describedby={supportTextId}
          readOnly={true}
          defaultValue='入力済みの内容'
          rows={4}
          cols={40}
        />
      </FormControlLabel>
    );
  },
};

export const WithFieldSizing: Story = {
  name: '内容に応じて高さを変える',
  render: () => {
    const id = useId();
    const supportTextId = useId();

    return (
      <FormControlLabel>
        <Label htmlFor={id}>field-sizing を使用したテキストエリア</Label>
        <SupportText id={supportTextId}>
          field-sizing: content を使用し、内容に応じて高さが3行〜10行まで可変するテキストエリアの例
        </SupportText>
        <Textarea id={id} aria-describedby={supportTextId} className={fieldSizing} />
      </FormControlLabel>
    );
  },
};

export const WithColsAndRowsAttribute: Story = {
  name: 'cols と rows を指定する',
  render: () => {
    const id = useId();
    const supportTextId = useId();

    return (
      <FormControlLabel>
        <Label htmlFor={id}>cols, rows 属性を使用したテキストエリア</Label>
        <SupportText id={supportTextId}>
          cols 属性の値に30、rows 属性の値に4を指定したテキストエリアの例
        </SupportText>
        <Textarea id={id} aria-describedby={supportTextId} rows={4} cols={30} />
      </FormControlLabel>
    );
  },
};
