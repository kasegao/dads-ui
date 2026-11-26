import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useId, useRef } from 'react';
import { css } from '../../../styled-system/css';
import { ErrorText } from '../ErrorText';
import { FormControlLabel, Legend, RequirementBadge, SupportText } from '../FormControlLabel';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/チェックボックス',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    isError: { control: 'boolean' },
    'aria-disabled': { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '32' });
const inline = css({ display: 'flex', flexWrap: 'wrap', columnGap: '16' });
const narrow = css({ maxWidth: '20rem' });

const sizes = ['sm', 'md', 'lg'] as const;

export const Playground: Story = {
  args: { children: '選択肢', size: 'sm', isError: false, 'aria-disabled': false },
};

export const Standalone: Story = {
  name: 'ラベルなし',
  args: { 'aria-label': '選択肢', size: 'sm' },
};

export const Stacked: Story = {
  name: '縦並び',
  render: () => (
    <div className={column}>
      {sizes.map((size) => (
        <FormControlLabel key={size} as='fieldset'>
          <Legend>ラベル（{size}）</Legend>
          <div>
            <Checkbox name={`stacked-${size}`} size={size}>
              選択肢1
            </Checkbox>
            <Checkbox name={`stacked-${size}`} size={size} defaultChecked={true}>
              選択肢2
            </Checkbox>
            <Checkbox name={`stacked-${size}`} size={size}>
              選択肢3
            </Checkbox>
          </div>
        </FormControlLabel>
      ))}
    </div>
  ),
};

export const Inline: Story = {
  name: '横並び',
  render: () => (
    <div className={column}>
      {sizes.map((size) => (
        <FormControlLabel key={size} as='fieldset'>
          <Legend>ラベル（{size}）</Legend>
          <div className={inline}>
            <Checkbox name={`inline-${size}`} size={size}>
              選択肢1
            </Checkbox>
            <Checkbox name={`inline-${size}`} size={size} defaultChecked={true}>
              選択肢2
            </Checkbox>
            <Checkbox name={`inline-${size}`} size={size}>
              選択肢3
            </Checkbox>
          </div>
        </FormControlLabel>
      ))}
    </div>
  ),
};

export const MultiLine: Story = {
  name: '複数行のラベル',
  render: () => (
    <div className={narrow}>
      {sizes.map((size) => (
        <Checkbox key={size} size={size}>
          ラベルが複数行に折り返す場合も、チェックボックスは1行目のテキストに揃います。
        </Checkbox>
      ))}
    </div>
  ),
};

export const Errored: Story = {
  name: 'エラー',
  render: () => {
    const supportTextId = useId();
    const errorTextId = useId();

    return (
      <FormControlLabel as='fieldset' aria-describedby={`${errorTextId} ${supportTextId}`}>
        <Legend>
          ラベル<RequirementBadge>※必須</RequirementBadge>
        </Legend>
        <SupportText id={supportTextId}>1つ以上選択してください。</SupportText>
        <div>
          <Checkbox name='errored' size='md' isError={true} aria-invalid={true}>
            選択肢1
          </Checkbox>
          <Checkbox name='errored' size='md' isError={true} aria-invalid={true}>
            選択肢2
          </Checkbox>
          <Checkbox
            name='errored'
            size='md'
            isError={true}
            aria-invalid={true}
            defaultChecked={true}
          >
            選択肢3（選択済みの見た目）
          </Checkbox>
        </div>
        <ErrorText id={errorTextId}>＊選択内容を確認してください。</ErrorText>
      </FormControlLabel>
    );
  },
};

export const Disabled: Story = {
  name: '無効',
  render: () => (
    <div className={column}>
      {sizes.map((size) => (
        <FormControlLabel key={size} as='fieldset'>
          <Legend>ラベル（{size}）</Legend>
          <div>
            <Checkbox name={`disabled-${size}`} size={size} aria-disabled={true}>
              未選択
            </Checkbox>
            <Checkbox
              name={`disabled-${size}`}
              size={size}
              aria-disabled={true}
              defaultChecked={true}
            >
              選択済み
            </Checkbox>
          </div>
        </FormControlLabel>
      ))}
    </div>
  ),
};

export const Indeterminate: Story = {
  name: '不確定',
  render: () => {
    const refs = [
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
    ];

    // biome-ignore lint/correctness/useExhaustiveDependencies: the refs never change.
    useEffect(() => {
      for (const ref of refs) {
        if (ref.current) {
          ref.current.indeterminate = true;
        }
      }
    }, []);

    return (
      <div>
        {sizes.map((size, index) => (
          <Checkbox key={size} ref={refs[index]} size={size}>
            すべて選択（{size}）
          </Checkbox>
        ))}
      </div>
    );
  },
};
