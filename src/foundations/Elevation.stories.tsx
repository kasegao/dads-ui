import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../styled-system/css';
import { shadows } from '../preset/tokens.generated';

const meta = {
  title: 'Foundations/エレベーション',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const grid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
  gap: '40',
  padding: '24',
});
const box = css({
  display: 'grid',
  placeItems: 'center',
  height: '96',
  borderRadius: '8',
  backgroundColor: 'white',
  textStyle: 'std-16B-170',
});

export const Elevation: Story = {
  name: 'エレベーション',
  render: () => (
    <div className={grid}>
      {Object.entries(shadows).map(([level, token]) => (
        <div key={level} className={box} style={{ boxShadow: token.value }}>
          shadow: '{level}'
        </div>
      ))}
    </div>
  ),
};
