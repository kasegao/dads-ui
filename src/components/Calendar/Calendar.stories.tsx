import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { css } from '../../../styled-system/css';
import { Calendar, CalendarGrid, CalendarHeader } from './Calendar';

const meta = {
  title: 'Components/カレンダー',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    min: { control: 'text' },
    max: { control: 'text' },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '24' });

export const Playground: Story = {
  args: {
    defaultValue: '2025-02-18',
    min: '2018-01-01',
    max: '2030-12-31',
    disabled: false,
    readOnly: false,
  },
};

export const Controlled: Story = {
  name: '選択中の日付を表示する',
  render: () => {
    const [date, setDate] = useState<string | null>('2025-02-18');

    return (
      <div className={column}>
        <p>
          選択中の日付：<output>{date ?? '未選択'}</output>
        </p>
        <Calendar value={date} onValueChange={setDate} min='2018-01-01' max='2030-12-31' />
      </div>
    );
  },
};

export const Range: Story = {
  name: '選択可能範囲を制限する',
  args: {
    defaultValue: '2025-02-18',
    min: '2025-02-10',
    max: '2025-03-20',
  },
};

export const Unavailable: Story = {
  name: '選択できない日を指定する',
  args: {
    defaultValue: '2025-02-18',
    min: '2018-01-01',
    max: '2030-12-31',
    isDateUnavailable: (date) => [0, 6].includes(new Date(date).getDay()),
  },
};

export const WithoutFooter: Story = {
  name: '「削除」「今日」ボタンなし',
  args: {
    defaultValue: '2025-02-18',
    min: '2018-01-01',
    max: '2030-12-31',
    children: (
      <>
        <CalendarHeader />
        <CalendarGrid />
      </>
    ),
  },
};

export const ReadOnly: Story = {
  name: '読み取り専用',
  args: {
    defaultValue: '2025-02-18',
    min: '2018-01-01',
    max: '2030-12-31',
    readOnly: true,
  },
};

export const Disabled: Story = {
  name: '無効',
  args: {
    defaultValue: '2025-02-18',
    min: '2018-01-01',
    max: '2030-12-31',
    disabled: true,
  },
};
