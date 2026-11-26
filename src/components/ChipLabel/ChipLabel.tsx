import type { ComponentProps } from 'react';
import { cva, cx } from '../../../styled-system/css';

export type ChipLabelVariant = 'text' | 'outlined' | 'filled-1' | 'filled-2';
export type ChipLabelColor =
  | 'gray'
  | 'blue'
  | 'light-blue'
  | 'cyan'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'magenta'
  | 'purple';

const framed = {
  borderWidth: '1',
  borderStyle: 'solid',
  paddingBlock: '3',
  paddingInline: '0.4375rem',
} as const;

/*
 * Each color defines four custom properties that the variants pick from:
 * --chip-main (border, solid fill, icon), --chip-text (text / outlined label),
 * --chip-text-strong (filled-1 label), --chip-tint (filled-1 background).
 */
const chipLabel = cva({
  base: {
    display: 'inline-grid',
    gridTemplateColumns: 'auto auto',
    alignItems: 'baseline',
    alignContent: 'center',
    minHeight: '32',
    borderRadius: '8',
    textStyle: 'oln-16N-100',
    overflowWrap: 'anywhere',
    '& svg': { _forcedColors: { fill: 'CanvasText' } },
  },
  variants: {
    variant: {
      text: {
        paddingBlock: '4',
        paddingInline: '8',
        color: 'var(--chip-text)',
      },
      outlined: {
        ...framed,
        borderColor: 'var(--chip-main)',
        backgroundColor: 'white',
        color: 'var(--chip-text)',
      },
      'filled-1': {
        ...framed,
        borderColor: 'var(--chip-main)',
        backgroundColor: 'var(--chip-tint)',
        color: 'var(--chip-text-strong)',
        '& svg': { color: 'var(--chip-main)' },
      },
      'filled-2': {
        ...framed,
        borderColor: 'transparent',
        backgroundColor: 'var(--chip-main)',
        color: 'white',
      },
    },
    color: {
      gray: {
        '--chip-main': '{colors.solid-gray.700}',
        '--chip-text': '{colors.solid-gray.800}',
        '--chip-text-strong': '{colors.solid-gray.800}',
        '--chip-tint': '{colors.solid-gray.50}',
      },
      blue: {
        '--chip-main': '{colors.blue.700}',
        '--chip-text': '{colors.blue.700}',
        '--chip-text-strong': '{colors.blue.800}',
        '--chip-tint': '{colors.blue.50}',
      },
      'light-blue': {
        '--chip-main': '{colors.light-blue.800}',
        '--chip-text': '{colors.light-blue.800}',
        '--chip-text-strong': '{colors.light-blue.900}',
        '--chip-tint': '{colors.light-blue.50}',
      },
      cyan: {
        '--chip-main': '{colors.cyan.900}',
        '--chip-text': '{colors.cyan.900}',
        '--chip-text-strong': '{colors.cyan.1000}',
        '--chip-tint': '{colors.cyan.50}',
      },
      green: {
        '--chip-main': '{colors.green.800}',
        '--chip-text': '{colors.green.800}',
        '--chip-text-strong': '{colors.green.900}',
        '--chip-tint': '{colors.green.50}',
      },
      lime: {
        '--chip-main': '{colors.lime.900}',
        '--chip-text': '{colors.lime.900}',
        '--chip-text-strong': '{colors.lime.1000}',
        '--chip-tint': '{colors.lime.50}',
      },
      yellow: {
        '--chip-main': '{colors.yellow.1000}',
        '--chip-text': '{colors.yellow.1000}',
        '--chip-text-strong': '{colors.yellow.1100}',
        '--chip-tint': '{colors.yellow.50}',
      },
      orange: {
        '--chip-main': '{colors.orange.900}',
        '--chip-text': '{colors.orange.900}',
        '--chip-text-strong': '{colors.orange.1000}',
        '--chip-tint': '{colors.orange.50}',
      },
      red: {
        '--chip-main': '{colors.red.900}',
        '--chip-text': '{colors.red.900}',
        '--chip-text-strong': '{colors.red.1000}',
        '--chip-tint': '{colors.red.50}',
      },
      magenta: {
        '--chip-main': '{colors.magenta.800}',
        '--chip-text': '{colors.magenta.800}',
        '--chip-text-strong': '{colors.magenta.900}',
        '--chip-tint': '{colors.magenta.50}',
      },
      purple: {
        '--chip-main': '{colors.purple.800}',
        '--chip-text': '{colors.purple.800}',
        '--chip-text-strong': '{colors.purple.800}',
        '--chip-tint': '{colors.purple.50}',
      },
    },
  },
});

export type ChipLabelProps = Omit<ComponentProps<'span'>, 'color'> & {
  variant?: ChipLabelVariant;
  color?: ChipLabelColor;
};

export const ChipLabel = (props: ChipLabelProps) => {
  const { className, children, variant = 'text', color = 'gray', ...rest } = props;

  return (
    <span className={cx(chipLabel({ variant, color }), className)} {...rest}>
      {children}
    </span>
  );
};
