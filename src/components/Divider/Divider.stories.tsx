import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { Divider } from './Divider';

const meta = {
  title: 'Components/ディバイダー',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'radio', options: ['gray-420', 'gray-536', 'black'] },
    thickness: { control: 'radio', options: ['1', '2', '3', '4'] },
    variant: { control: 'radio', options: ['solid', 'dashed'] },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = css({ display: 'flex', flexDirection: 'column', gap: '32' });

const colors = ['gray-420', 'gray-536', 'black'] as const;
const thicknesses = ['1', '2', '3', '4'] as const;

export const Playground: Story = {
  args: { color: 'gray-420', thickness: '1', variant: 'solid' },
};

export const Solid: Story = {
  name: '実線',
  render: () => (
    <div className={column}>
      {thicknesses.map((thickness) =>
        colors.map((color) => (
          <Divider key={`${thickness}-${color}`} color={color} thickness={thickness} />
        )),
      )}
    </div>
  ),
};

export const Dashed: Story = {
  name: '破線',
  render: () => (
    <div className={column}>
      {thicknesses.map((thickness) =>
        colors.map((color) => (
          <Divider
            key={`${thickness}-${color}`}
            color={color}
            thickness={thickness}
            variant='dashed'
          />
        )),
      )}
    </div>
  ),
};
