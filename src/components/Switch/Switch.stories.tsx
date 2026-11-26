import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { css } from '../../../styled-system/css';
import {
  FormControlLabel,
  Label,
  Legend,
  RequirementBadge,
  SupportText,
} from '../FormControlLabel';
import { SwitchMode, SwitchOnOff } from './Switch';

const meta = {
  title: 'Components/スイッチ',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const inlineLabel = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8',
  width: 'fit',
  color: 'solid-gray.800',
});
const column = css({ display: 'flex', flexDirection: 'column', gap: '24' });

type OnOffArgs = { disabled: boolean };

export const Playground: StoryObj<OnOffArgs> = {
  name: 'Playground（オン／オフ）',
  args: { disabled: false },
  argTypes: { disabled: { control: 'boolean' } },
  render: ({ disabled }) => {
    const [checked, setChecked] = useState(false);

    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: SwitchOnOff renders a labelable button.
      <label className={inlineLabel}>
        <SwitchOnOff
          aria-checked={checked}
          disabled={disabled}
          onClick={() => setChecked((prev) => !prev)}
        />
        ラベル
      </label>
    );
  },
};

export const WithFormControlLabelOnOff: StoryObj = {
  name: 'ラベル付き（オン／オフ）',
  render: () => {
    const [checked, setChecked] = useState(false);
    const id = useId();
    const supportTextId = useId();

    return (
      <FormControlLabel>
        <Label htmlFor={id}>
          ラベル<RequirementBadge>※必須</RequirementBadge>
        </Label>
        <SupportText id={supportTextId}>サポートテキスト</SupportText>
        <div>
          <SwitchOnOff
            id={id}
            aria-checked={checked}
            aria-describedby={supportTextId}
            onClick={() => setChecked((prev) => !prev)}
          />
        </div>
      </FormControlLabel>
    );
  },
};

export const DisabledOnOff: StoryObj = {
  name: '無効（オン／オフ）',
  render: () => (
    <div className={column}>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: SwitchOnOff renders a labelable button. */}
      <label className={inlineLabel}>
        <SwitchOnOff aria-checked={false} disabled={true} />
        オフ
      </label>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: SwitchOnOff renders a labelable button. */}
      <label className={inlineLabel}>
        <SwitchOnOff aria-checked={true} disabled={true} />
        オン
      </label>
    </div>
  ),
};

type ModeArgs = { leftLabel: string; rightLabel: string; disabled: boolean };

export const PlaygroundMode: StoryObj<ModeArgs> = {
  name: 'Playground（モード）',
  args: { leftLabel: 'モード1', rightLabel: 'モード2', disabled: false },
  argTypes: {
    leftLabel: { control: 'text' },
    rightLabel: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  render: ({ leftLabel, rightLabel, disabled }) => {
    // Tracks the side, not the label, so that editing the labels keeps the selection.
    const [selected, setSelected] = useState<'left' | 'right'>('left');

    return (
      <SwitchMode
        leftLabel={leftLabel}
        rightLabel={rightLabel}
        value={selected === 'left' ? leftLabel : rightLabel}
        onChange={(value) => setSelected(value === rightLabel ? 'right' : 'left')}
        disabled={disabled}
      />
    );
  },
};

export const WithFormControlLabelMode: StoryObj = {
  name: 'ラベル付き（モード）',
  render: () => {
    const [value, setValue] = useState('月払い');
    const supportTextId = useId();

    return (
      <FormControlLabel as='fieldset'>
        <Legend>
          ラベル<RequirementBadge>※必須</RequirementBadge>
        </Legend>
        <SupportText id={supportTextId}>サポートテキスト</SupportText>
        <div>
          <SwitchMode
            leftLabel='月払い'
            rightLabel='年払い'
            value={value}
            onChange={setValue}
            aria-describedby={supportTextId}
          />
        </div>
      </FormControlLabel>
    );
  },
};

export const DisabledMode: StoryObj = {
  name: '無効（モード）',
  render: () => (
    <SwitchMode
      leftLabel='モード1'
      rightLabel='モード2'
      value='モード1'
      onChange={() => {}}
      disabled={true}
    />
  ),
};
