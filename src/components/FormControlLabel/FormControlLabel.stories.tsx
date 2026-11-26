import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { css } from '../../../styled-system/css';
import { Checkbox } from '../Checkbox';
import { ErrorText } from '../ErrorText';
import { Input } from '../Input';
import { Radio } from '../Radio';
import { Select } from '../Select';
import { Textarea } from '../Textarea';
import {
  FormControlLabel,
  type FormControlLabelSize,
  Label,
  Legend,
  RequirementBadge,
  StatusBadge,
  SupportText,
} from './FormControlLabel';

type StoryArgs = {
  size: FormControlLabelSize;
  required: boolean;
  supportText: boolean;
  error: boolean;
};

const meta = {
  title: 'Components/フォームコントロールラベル',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    supportText: { control: 'boolean' },
    error: { control: 'boolean' },
  },
  args: { size: 'md', required: true, supportText: true, error: false },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '32' });

/** Label and support text on the left, the control on the right (desktop only). */
const horizontal = css({
  overflowWrap: 'anywhere',
  desktop: {
    display: 'grid',
    gridTemplate: '"label field field" auto "support-text field field" 1fr / 1fr 1fr 1fr',
    columnGap: '24',
    justifyContent: 'start',
    alignItems: 'baseline',
    '& > label': { gridArea: 'label', alignSelf: 'baseline' },
    '& > p': { gridArea: 'support-text' },
    '& > legend': { display: 'contents' },
    '& > legend > span': { gridArea: 'label', justifySelf: 'start' },
    '& > div': { gridArea: 'field', minWidth: '0' },
  },
});

export const Playground: Story = {
  render: ({ size, required, supportText, error }) => {
    const controlId = useId();
    const supportTextId = useId();
    const errorTextId = useId();
    const describedBy =
      [error && errorTextId, supportText && supportTextId].filter(Boolean).join(' ') || undefined;

    return (
      <FormControlLabel size={size}>
        <Label htmlFor={controlId} size={size}>
          ラベル
          <RequirementBadge isOptional={!required}>{required ? '※必須' : '※任意'}</RequirementBadge>
        </Label>
        {supportText && <SupportText id={supportTextId}>サポートテキスト</SupportText>}
        <div>
          <Input
            id={controlId}
            aria-describedby={describedBy}
            isError={error}
            required={required}
            blockSize='md'
          />
        </div>
        {error && <ErrorText id={errorTextId}>＊入力内容を確認してください。</ErrorText>}
      </FormControlLabel>
    );
  },
};

export const Multiple: Story = {
  name: '複数のコントロール',
  render: ({ size, required, supportText, error }) => {
    const supportTextId = useId();
    const errorTextId = useId();
    const describedBy =
      [error && errorTextId, supportText && supportTextId].filter(Boolean).join(' ') || undefined;

    return (
      <FormControlLabel as='fieldset' size={size} aria-describedby={describedBy}>
        <Legend size={size}>
          ラベル
          <RequirementBadge isOptional={!required}>{required ? '※必須' : '※任意'}</RequirementBadge>
        </Legend>
        {supportText && (
          <SupportText id={supportTextId}>
            {required ? '1つ以上選択してください。' : '当てはまるものを選択してください。'}
          </SupportText>
        )}
        <div>
          {['選択肢1', '選択肢2', '選択肢3'].map((option) => (
            <Checkbox
              key={option}
              name='multiple'
              value={option}
              size='md'
              isError={error}
              aria-invalid={error || undefined}
            >
              {option}
            </Checkbox>
          ))}
        </div>
        {error && <ErrorText id={errorTextId}>＊選択内容を確認してください。</ErrorText>}
      </FormControlLabel>
    );
  },
};

export const Sizes: Story = {
  name: 'サイズ',
  parameters: { controls: { disable: true } },
  render: () => {
    const id = useId();

    return (
      <div className={column}>
        {(['lg', 'md', 'sm'] as const).map((size) => (
          <FormControlLabel key={`label-${size}`} size={size}>
            <Label htmlFor={`${id}-${size}`} size={size}>
              ラベル（{size}）<RequirementBadge>※必須</RequirementBadge>
            </Label>
            <SupportText>サポートテキスト</SupportText>
            <div>
              <Input id={`${id}-${size}`} blockSize='md' required={true} />
            </div>
          </FormControlLabel>
        ))}
        {(['lg', 'md', 'sm'] as const).map((size) => (
          <FormControlLabel key={`group-${size}`} as='fieldset' size={size}>
            <Legend size={size}>
              グループのラベル（{size}）<RequirementBadge isOptional={true}>※任意</RequirementBadge>
            </Legend>
            <SupportText>サポートテキスト</SupportText>
            <div>
              <Radio name={`${id}-radio-${size}`} size='md'>
                選択肢1
              </Radio>
              <Radio name={`${id}-radio-${size}`} size='md'>
                選択肢2
              </Radio>
            </div>
          </FormControlLabel>
        ))}
      </div>
    );
  },
};

export const Badges: Story = {
  name: '必須・任意と状態のバッジ',
  parameters: { controls: { disable: true } },
  render: () => {
    const id = useId();

    return (
      <div className={column}>
        <FormControlLabel>
          <Label htmlFor={`${id}-required`}>
            氏名<RequirementBadge>※必須</RequirementBadge>
          </Label>
          <div>
            <Input id={`${id}-required`} blockSize='md' required={true} />
          </div>
        </FormControlLabel>
        <FormControlLabel>
          <Label htmlFor={`${id}-optional`}>
            建物名<RequirementBadge isOptional={true}>※任意</RequirementBadge>
          </Label>
          <div>
            <Input id={`${id}-optional`} blockSize='md' />
          </div>
        </FormControlLabel>
        <FormControlLabel>
          <Label htmlFor={`${id}-readonly`}>
            メールアドレス<StatusBadge>編集不可</StatusBadge>
          </Label>
          <div>
            <Input
              id={`${id}-readonly`}
              blockSize='md'
              readOnly={true}
              defaultValue='taro@example.com'
            />
          </div>
        </FormControlLabel>
        <FormControlLabel>
          <Label htmlFor={`${id}-disabled`}>
            電話番号<StatusBadge>無効</StatusBadge>
          </Label>
          <div>
            <Input id={`${id}-disabled`} blockSize='md' aria-disabled={true} />
          </div>
        </FormControlLabel>
      </div>
    );
  },
};

export const Horizontal: Story = {
  name: '横並び',
  parameters: { controls: { disable: true } },
  render: () => {
    const id = useId();

    return (
      <div className={column}>
        <FormControlLabel className={horizontal}>
          <Label htmlFor={`${id}-input`}>
            ラベル<RequirementBadge>※必須</RequirementBadge>
          </Label>
          <SupportText id={`${id}-input-support`}>サポートテキスト</SupportText>
          <div>
            <Input
              id={`${id}-input`}
              aria-describedby={`${id}-input-support`}
              blockSize='md'
              required={true}
            />
          </div>
        </FormControlLabel>
        <FormControlLabel className={horizontal}>
          <Label htmlFor={`${id}-select`}>
            ラベル<RequirementBadge>※必須</RequirementBadge>
          </Label>
          <SupportText id={`${id}-select-support`}>サポートテキスト</SupportText>
          <div>
            <Select
              id={`${id}-select`}
              aria-describedby={`${id}-select-support`}
              blockSize='md'
              required={true}
            >
              <option value=''>選択してください</option>
              <option value='1'>選択肢1</option>
              <option value='2'>選択肢2</option>
            </Select>
          </div>
        </FormControlLabel>
        <FormControlLabel className={horizontal}>
          <Label htmlFor={`${id}-textarea`}>
            ラベル<RequirementBadge isOptional={true}>※任意</RequirementBadge>
          </Label>
          <SupportText id={`${id}-textarea-support`}>サポートテキスト</SupportText>
          <div>
            <Textarea
              id={`${id}-textarea`}
              aria-describedby={`${id}-textarea-support`}
              rows={3}
              cols={30}
            />
          </div>
        </FormControlLabel>
        <FormControlLabel
          as='fieldset'
          className={horizontal}
          aria-describedby={`${id}-group-support`}
        >
          <Legend>
            <span>
              ラベル<RequirementBadge>※必須</RequirementBadge>
            </span>
          </Legend>
          <SupportText id={`${id}-group-support`}>サポートテキスト</SupportText>
          <div>
            <Radio name={`${id}-group`} size='md'>
              選択肢1
            </Radio>
            <Radio name={`${id}-group`} size='md'>
              選択肢2
            </Radio>
          </div>
        </FormControlLabel>
      </div>
    );
  },
};
