import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../../styled-system/css';
import { Dd, Dl, Dt } from './Dl';

const meta = {
  title: 'Components/説明リスト',
  component: Dl,
  tags: ['autodocs'],
  argTypes: {
    marker: { control: 'radio', options: ['none', 'bullet'] },
  },
} satisfies Meta<typeof Dl>;

export default meta;
type Story = StoryObj<typeof meta>;

const customMarker = css({ display: 'inline-block', minWidth: '32' });
const customMarkerIcon = css({
  position: 'relative',
  bottom: '-0.3125rem',
  display: 'block',
  marginTop: '-0.3125rem',
});

const items = ['項目名1', '項目名2', '項目名3'];

const description = (index: number) =>
  `これは項目${index + 1}の説明文です。説明リストは用語とその説明をセットで表示するのに適しています。`;

const numberIcons = [
  {
    label: '①',
    d: 'M12 22a9.7 9.7 0 0 1-7-3A10.1 10.1 0 0 1 2.7 8.2 10.1 10.1 0 0 1 12 2a9.7 9.7 0 0 1 7 3 10.1 10.1 0 0 1 2.2 10.9A10.1 10.1 0 0 1 12 22Zm-.5-5h2V7h-4v2h2v8Z',
  },
  {
    label: '②',
    d: 'M12 22a9.7 9.7 0 0 1-7-3A10.1 10.1 0 0 1 2.7 8.2 10.1 10.1 0 0 1 12 2a9.7 9.7 0 0 1 7 3 10.1 10.1 0 0 1 2.2 10.9A10.1 10.1 0 0 1 12 22Zm-3-5h6v-2h-4v-2h2c.6 0 1-.2 1.4-.6.4-.4.6-.8.6-1.4V9c0-.6-.2-1-.6-1.4A2 2 0 0 0 13 7H9v2h4v2h-2a2 2 0 0 0-1.4.6A2 2 0 0 0 9 13v4Z',
  },
  {
    label: '③',
    d: 'M12 22a9.7 9.7 0 0 1-7-3A10.1 10.1 0 0 1 2.7 8.2 10.1 10.1 0 0 1 12 2a9.7 9.7 0 0 1 7 3 10.1 10.1 0 0 1 2.2 10.9A10.1 10.1 0 0 1 12 22Zm-3-5h4c.6 0 1-.2 1.4-.6.4-.4.6-.8.6-1.4v-1.5a1.5 1.5 0 0 0-1.5-1.5 1.5 1.5 0 0 0 1.5-1.5V9c0-.6-.2-1-.6-1.4A2 2 0 0 0 13 7H9v2h4v2h-2v2h2v2H9v2Z',
  },
];

export const Playground: Story = {
  args: { marker: 'none' },
  render: (args) => (
    <Dl {...args}>
      {items.map((item, index) => (
        <div key={item}>
          <Dt>{item}</Dt>
          <Dd>{description(index)}</Dd>
        </div>
      ))}
    </Dl>
  ),
};

export const Bullet: Story = {
  name: 'ブレットつき',
  args: { marker: 'bullet' },
  render: Playground.render,
};

export const Custom: Story = {
  name: '独自のマーカー',
  args: { marker: 'none' },
  argTypes: { marker: { table: { disable: true } } },
  render: (args) => (
    <Dl {...args}>
      {items.map((item, index) => (
        <div key={item}>
          <Dt>
            <span className={customMarker}>
              <svg
                className={customMarkerIcon}
                width='24'
                height='24'
                fill='none'
                viewBox='0 0 24 24'
                role='img'
                aria-label={numberIcons[index].label}
              >
                <path fill='#0017C1' d={numberIcons[index].d} />
              </svg>
            </span>
            {item}
          </Dt>
          <Dd>{description(index)}</Dd>
        </div>
      ))}
    </Dl>
  ),
};
