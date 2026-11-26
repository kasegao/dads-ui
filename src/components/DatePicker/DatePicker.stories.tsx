import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { css } from '../../../styled-system/css';
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerCalendarButton,
  DatePickerDate,
  DatePickerFields,
  DatePickerMonth,
  DatePickerYear,
} from './DatePicker';

const meta = {
  title: 'Components/日付ピッカー/Consolidated',
  component: DatePicker,
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
} satisfies Meta<typeof DatePicker>;

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
  <DatePickerFields>
    <DatePickerYear />
    <DatePickerMonth />
    <DatePickerDate />
  </DatePickerFields>
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
        <DatePicker {...args} value={date} onValueChange={setDate}>
          {fields}
          <DatePickerCalendarButton />
          <DatePickerCalendar />
        </DatePicker>
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
        <DatePicker
          key={size}
          {...args}
          size={size}
          defaultValue='2025-02-18'
          min='2018-01-01'
          max='2030-12-31'
        >
          {fields}
          <DatePickerCalendarButton />
          <DatePickerCalendar />
        </DatePicker>
      ))}
    </div>
  ),
};

export const WithFieldset: Story = {
  name: 'ラベルとサポートテキスト',
  render: (args) => (
    <fieldset className={fieldset} aria-describedby='date-picker-1-support-text'>
      <legend className={legend}>日付</legend>
      <p id='date-picker-1-support-text' className={supportText}>
        例：2025年01月20日
      </p>
      <DatePicker {...args}>{fields}</DatePicker>
    </fieldset>
  ),
};

export const Errored: Story = {
  name: 'エラー',
  args: { isError: true },
  render: (args) => (
    <fieldset className={fieldset}>
      <legend className={legend}>日付</legend>
      <p id='date-picker-3-support-text' className={supportText}>
        例：2025年01月20日
      </p>
      <DatePicker {...args}>
        <DatePickerFields>
          <DatePickerYear aria-describedby='date-picker-3-support-text date-picker-3-error-text' />
          <DatePickerMonth
            defaultValue={10}
            aria-describedby='date-picker-3-support-text date-picker-3-error-text'
          />
          <DatePickerDate
            defaultValue={28}
            aria-describedby='date-picker-3-support-text date-picker-3-error-text'
          />
        </DatePickerFields>
      </DatePicker>
      <p id='date-picker-3-error-text' className={errorText}>
        ＊正しい日付を入力してください。
      </p>
    </fieldset>
  ),
};

export const Disabled: Story = {
  name: '無効',
  args: { isDisabled: true, defaultValue: '2025-10-28' },
  render: (args) => (
    <fieldset className={fieldset} aria-describedby='date-picker-5-support-text'>
      <legend className={legend}>日付</legend>
      <p id='date-picker-5-support-text' className={supportText}>
        〜の理由により、この項目は編集できません。
      </p>
      <DatePicker {...args}>
        {fields}
        <DatePickerCalendarButton />
        <DatePickerCalendar />
      </DatePicker>
    </fieldset>
  ),
};

export const Readonly: Story = {
  name: '読み取り専用',
  args: { isReadonly: true, defaultValue: '2025-10-28' },
  render: (args) => (
    <fieldset className={fieldset} aria-describedby='date-picker-6-support-text'>
      <legend className={legend}>日付</legend>
      <p id='date-picker-6-support-text' className={supportText}>
        〜の理由により、この項目は編集できません。
      </p>
      <DatePicker {...args}>{fields}</DatePicker>
    </fieldset>
  ),
};

export const Partial: Story = {
  name: '年月または月日のみ',
  render: (args) => (
    <div className={column}>
      <DatePicker {...args}>
        <DatePickerFields>
          <DatePickerYear name='year' />
          <DatePickerMonth name='month' />
        </DatePickerFields>
      </DatePicker>
      <DatePicker {...args}>
        <DatePickerFields>
          <DatePickerMonth name='month' />
          <DatePickerDate name='day' />
        </DatePickerFields>
      </DatePicker>
    </div>
  ),
};
