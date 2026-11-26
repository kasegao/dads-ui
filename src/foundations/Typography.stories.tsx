import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '../../styled-system/css';
import { textStyles } from '../preset/text-styles';

const meta = {
  title: 'Foundations/タイポグラフィ',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const row = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', desktop: '12rem 1fr' },
  alignItems: 'baseline',
  columnGap: '24',
  paddingBlock: '12',
  borderBottomWidth: '1',
  borderBottomStyle: 'solid',
  borderBottomColor: 'solid-gray.200',
});
const name = css({ textStyle: 'mono-14N-150', color: 'solid-gray.700' });

type TextStyleValue = {
  fontFamily?: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
};

const sample = '日本のデジタル社会を、誰一人取り残さず前へ。Digital Agency 0123456789';

export const TextStyles: Story = {
  name: 'テキストスタイル',
  render: () => (
    <div>
      {Object.entries(textStyles as Record<string, { value: TextStyleValue }>).map(
        ([key, { value }]) => (
          <div key={key} className={row}>
            <span className={name}>{key}</span>
            <span
              style={{
                fontFamily: value.fontFamily === 'mono' ? "'Noto Sans Mono', monospace" : undefined,
                fontSize: `${Number(value.fontSize) / 16}rem`,
                fontWeight: value.fontWeight,
                lineHeight: Number(value.lineHeight) / 100,
                letterSpacing: value.letterSpacing,
              }}
            >
              {sample}
            </span>
          </div>
        ),
      )}
    </div>
  ),
};
