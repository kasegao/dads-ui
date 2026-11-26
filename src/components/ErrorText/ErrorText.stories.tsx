import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorText } from './ErrorText';

const meta = {
  title: 'Components/エラーテキスト',
  component: ErrorText,
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: '＊エラーテキスト' },
};
