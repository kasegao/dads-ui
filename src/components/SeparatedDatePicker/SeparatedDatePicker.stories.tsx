import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { css } from '../../../styled-system/css';
import {
  SeparatedDatePicker,
  SeparatedDatePickerCalendar,
  SeparatedDatePickerCalendarButton,
  SeparatedDatePickerDate,
  SeparatedDatePickerFields,
  SeparatedDatePickerMonth,
  SeparatedDatePickerYear,
} from './SeparatedDatePicker';

const meta = {
  title: 'Components/日付ピッカー/Separated',
  component: SeparatedDatePicker,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['lg', 'md', 'sm'] },
    isError: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadonly: { control: 'boolean' },
  },
  args: {
    size: 'lg',
    isError: false,
    isDisabled: false,
    isReadonly: false,
  },
} satisfies Meta<typeof SeparatedDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '32',
});
const fieldset = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8',
});
const legend = css({ textStyle: 'std-17B-170', color: 'solid-gray.800' });
const supportText = css({ textStyle: 'std-16N-170', color: 'solid-gray.600' });
const errorText = css({ textStyle: 'std-16N-170', color: 'error.1' });

const fields = (
  <SeparatedDatePickerFields>
    <SeparatedDatePickerYear />
    <SeparatedDatePickerMonth />
    <SeparatedDatePickerDate />
  </SeparatedDatePickerFields>
);

export const Playground: Story = {
  args: { children: fields },
};

export const WithCalendar: Story = {
  name: 'カレンダー付き',
  args: { min: '2018-01-01', max: '2030-12-31' },
  render: (args) => {
    const [date, setDate] = useState<string | null>('2025-02-18');

    return (
      <div className={column}>
        <SeparatedDatePicker {...args} value={date} onValueChange={setDate}>
          {fields}
          <SeparatedDatePickerCalendarButton />
          <SeparatedDatePickerCalendar />
        </SeparatedDatePicker>
        <p>
          選択中の日付：<output>{date ?? '未選択'}</output>
        </p>
      </div>
    );
  },
};

export const Sizes: Story = {
  name: 'サイズ',
  render: (args) => (
    <div className={column}>
      {(['lg', 'md', 'sm'] as const).map((size) => (
        <SeparatedDatePicker
          key={size}
          {...args}
          size={size}
          defaultValue='2025-02-18'
          min='2018-01-01'
          max='2030-12-31'
        >
          {fields}
          <SeparatedDatePickerCalendarButton />
          <SeparatedDatePickerCalendar />
        </SeparatedDatePicker>
      ))}
    </div>
  ),
};

export const WithFieldset: Story = {
  name: 'ラベルとサポートテキスト',
  render: (args) => (
    <fieldset className={fieldset} aria-describedby='separated-date-picker-1-support-text'>
      <legend className={legend}>日付</legend>
      <p id='separated-date-picker-1-support-text' className={supportText}>
        西暦、半角
      </p>
      <SeparatedDatePicker {...args}>{fields}</SeparatedDatePicker>
    </fieldset>
  ),
};

export const Errored: Story = {
  name: 'エラー（個別の入力欄）',
  render: (args) => (
    <fieldset className={fieldset}>
      <legend className={legend}>日付</legend>
      <p id='separated-date-picker-3-support-text' className={supportText}>
        西暦、半角
      </p>
      <SeparatedDatePicker {...args}>
        <SeparatedDatePickerFields>
          <SeparatedDatePickerYear
            aria-invalid={true}
            aria-describedby='separated-date-picker-3-error-text separated-date-picker-3-support-text'
          />
          <SeparatedDatePickerMonth
            defaultValue={10}
            aria-describedby='separated-date-picker-3-support-text'
          />
          <SeparatedDatePickerDate
            defaultValue={28}
            aria-describedby='separated-date-picker-3-support-text'
          />
        </SeparatedDatePickerFields>
      </SeparatedDatePicker>
      <p id='separated-date-picker-3-error-text' className={errorText}>
        ＊年を入力してください。
      </p>
    </fieldset>
  ),
};

export const Disabled: Story = {
  name: '無効',
  args: { isDisabled: true, defaultValue: '2025-10-28' },
  render: (args) => (
    <fieldset className={fieldset} aria-describedby='separated-date-picker-5-support-text'>
      <legend className={legend}>日付</legend>
      <p id='separated-date-picker-5-support-text' className={supportText}>
        〜の理由により、この項目は編集できません。
      </p>
      <SeparatedDatePicker {...args}>
        {fields}
        <SeparatedDatePickerCalendarButton />
        <SeparatedDatePickerCalendar />
      </SeparatedDatePicker>
    </fieldset>
  ),
};

export const Readonly: Story = {
  name: '読み取り専用',
  args: { isReadonly: true, defaultValue: '2025-10-28' },
  render: (args) => (
    <fieldset className={fieldset} aria-describedby='separated-date-picker-6-support-text'>
      <legend className={legend}>日付</legend>
      <p id='separated-date-picker-6-support-text' className={supportText}>
        〜の理由により、この項目は編集できません。
      </p>
      <SeparatedDatePicker {...args}>{fields}</SeparatedDatePicker>
    </fieldset>
  ),
};

export const Partial: Story = {
  name: '年月または月日のみ',
  render: (args) => (
    <div className={column}>
      <SeparatedDatePicker {...args}>
        <SeparatedDatePickerFields>
          <SeparatedDatePickerYear name='year' />
          <SeparatedDatePickerMonth name='month' />
        </SeparatedDatePickerFields>
      </SeparatedDatePicker>
      <SeparatedDatePicker {...args}>
        <SeparatedDatePickerFields>
          <SeparatedDatePickerMonth name='month' />
          <SeparatedDatePickerDate name='day' />
        </SeparatedDatePickerFields>
      </SeparatedDatePicker>
    </div>
  ),
};
