import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../styled-system/css';
import { colors, semanticColors } from '../preset/tokens.generated';

const meta = {
  title: 'Foundations/カラー',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const section = css({ marginBlockEnd: '40' });
const heading = css({ textStyle: 'std-20B-150', marginBlockEnd: '12' });
const grid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))',
  gap: '8',
});
const swatch = css({
  height: '56',
  borderRadius: '8',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.200',
});
const label = css({ textStyle: 'dns-14N-130', marginBlockStart: '4' });
const value = css({ textStyle: 'mono-14N-150', color: 'solid-gray.700' });

type Scale = Record<string, { value: string }>;

const resolve = (ref: string): string => {
  const m = ref.match(/^\{colors\.(.+)\.(\d+)\}$/);
  if (!m) return ref;
  return (colors as unknown as Record<string, Scale>)[m[1]][m[2]].value;
};

const Swatches = ({ name, scale }: { name: string; scale: Scale }) => (
  <section className={section}>
    <h2 className={heading}>{name}</h2>
    <div className={grid}>
      {Object.entries(scale).map(([step, token]) => (
        <div key={step}>
          <div className={swatch} style={{ backgroundColor: resolve(token.value) }} />
          <p className={label}>
            {name}.{step}
          </p>
          <p className={value}>{resolve(token.value)}</p>
        </div>
      ))}
    </div>
  </section>
);

const isScale = (entry: Scale | { value: string }): entry is Scale =>
  typeof (entry as { value?: unknown }).value !== 'string';

export const Primitive: Story = {
  name: 'プリミティブカラー',
  render: () => (
    <div>
      {Object.entries(colors).map(([name, entry]) =>
        isScale(entry) ? <Swatches key={name} name={name} scale={entry} /> : null,
      )}
    </div>
  ),
};

export const Semantic: Story = {
  name: 'キーカラーとセマンティックカラー',
  render: () => (
    <div>
      {Object.entries(semanticColors).map(([name, scale]) => (
        <Swatches key={name} name={name} scale={scale} />
      ))}
    </div>
  ),
};
