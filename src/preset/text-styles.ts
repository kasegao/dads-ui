import { defineTextStyles } from '@pandacss/dev/define';

type Weight = 'B' | 'N';

/** [prefix, size(px), line-height(%), letter-spacing] — DADS typography table. */
const table: [string, number, number, string][] = [
  ['dsp', 64, 140, '0'],
  ['dsp', 57, 140, '0'],
  ['dsp', 48, 140, '0'],
  ['std', 45, 140, '0'],
  ['std', 36, 140, '0.01em'],
  ['std', 32, 150, '0.01em'],
  ['std', 28, 150, '0.01em'],
  ['std', 26, 150, '0.02em'],
  ['std', 24, 150, '0.02em'],
  ['std', 22, 150, '0.02em'],
  ['std', 20, 160, '0.02em'],
  ['std', 20, 150, '0.02em'],
  ['std', 18, 160, '0.02em'],
  ['std', 17, 170, '0.02em'],
  ['std', 16, 170, '0.02em'],
  ['std', 16, 175, '0.02em'],
  ['dns', 17, 130, '0'],
  ['dns', 17, 120, '0'],
  ['dns', 16, 130, '0'],
  ['dns', 16, 120, '0'],
  ['dns', 14, 130, '0'],
  ['dns', 14, 120, '0'],
  ['oln', 17, 100, '0.02em'],
  ['oln', 16, 100, '0.02em'],
  ['oln', 14, 100, '0.02em'],
  ['mono', 17, 150, '0'],
  ['mono', 16, 150, '0'],
  ['mono', 14, 150, '0'],
];

type TextStyleValue = {
  fontFamily?: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
};

const styles: Record<string, { value: TextStyleValue }> = {};

for (const [prefix, size, leading, tracking] of table) {
  for (const weight of ['B', 'N'] satisfies Weight[]) {
    styles[`${prefix}-${size}${weight}-${leading}`] = {
      value: {
        ...(prefix === 'mono' ? { fontFamily: 'mono' } : {}),
        fontSize: `${size}`,
        fontWeight: weight === 'B' ? '700' : '400',
        lineHeight: `${leading}`,
        letterSpacing: tracking,
      },
    };
  }
}

export const textStyles = defineTextStyles(styles);
