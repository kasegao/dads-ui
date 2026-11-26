import { Children, type ComponentProps, isValidElement, type Ref } from 'react';
import { css, cva, cx } from '../../../styled-system/css';

export type HeadingSize = '64' | '57' | '45' | '36' | '32' | '28' | '24' | '20' | '18' | '16';
export type RuleSize = '8' | '6' | '4' | '2';
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const chipBar = {
  content: '""',
  position: 'absolute',
  left: '0',
  bottom: '0.1em',
  width: 'calc(1em / 3)',
  backgroundColor: 'key.900',
  '@supports (top: 1lh)': { bottom: 'calc(0.5lh - 0.55em)' },
  _forcedColors: { backgroundColor: 'CanvasText' },
} as const;

const chipRoot = {
  position: 'relative',
  paddingLeft: 'calc(1em / 3 + 0.5em)',
} as const;

const heading = cva({
  base: {
    color: 'solid-gray.800',
  },
  variants: {
    size: {
      '64': {
        textStyle: 'dsp-64B-140',
        '--heading-shoulder-size': '1.75rem',
        '--heading-shoulder-line-height': '1.5',
        '--heading-shoulder-letter-spacing': '0.01em',
      },
      '57': {
        textStyle: 'dsp-57B-140',
        '--heading-shoulder-size': '1.5rem',
        '--heading-shoulder-line-height': '1.5',
        '--heading-shoulder-letter-spacing': '0.02em',
      },
      '45': {
        textStyle: 'std-45B-140',
        '--heading-shoulder-size': '1.375rem',
        '--heading-shoulder-line-height': '1.5',
        '--heading-shoulder-letter-spacing': '0.02em',
      },
      '36': {
        textStyle: 'std-36B-140',
        '--heading-shoulder-size': '1.25rem',
        '--heading-shoulder-line-height': '1.5',
        '--heading-shoulder-letter-spacing': '0.02em',
      },
      '32': {
        textStyle: 'std-32B-150',
        '--heading-shoulder-size': '1.125rem',
        '--heading-shoulder-line-height': '1.6',
        '--heading-shoulder-letter-spacing': '0.02em',
      },
      '28': {
        textStyle: 'std-28B-150',
        '--heading-shoulder-size': '1rem',
        '--heading-shoulder-line-height': '1.7',
        '--heading-shoulder-letter-spacing': '0.01em',
      },
      '24': {
        textStyle: 'std-24B-150',
        '--heading-shoulder-size': '1rem',
        '--heading-shoulder-line-height': '1.7',
        '--heading-shoulder-letter-spacing': '0.02em',
      },
      '20': {
        textStyle: 'std-20B-150',
        '--heading-shoulder-size': '1rem',
        '--heading-shoulder-line-height': '1.7',
        '--heading-shoulder-letter-spacing': '0.02em',
      },
      '18': {
        textStyle: 'std-18B-160',
        '--heading-shoulder-size': '1rem',
        '--heading-shoulder-line-height': '1.7',
        '--heading-shoulder-letter-spacing': '0.02em',
      },
      '16': {
        textStyle: 'std-16B-170',
        '--heading-shoulder-size': '1rem',
        '--heading-shoulder-line-height': '1.7',
        '--heading-shoulder-letter-spacing': '0.02em',
      },
    },
    chip: {
      none: {},
      title: {
        ...chipRoot,
        _before: {
          ...chipBar,
          top: '0.2em',
          '@supports (top: 1lh)': {
            top: 'calc(0.5lh - 0.45em)',
            bottom: 'calc(0.5lh - 0.55em)',
          },
        },
      },
      // With a shoulder the bar starts at the cap height of the shoulder's first line.
      shoulder: {
        ...chipRoot,
        _before: {
          ...chipBar,
          top: 'calc((var(--heading-shoulder-size) * (var(--heading-shoulder-line-height) - 1)) / 2)',
        },
      },
    },
    rule: {
      none: {},
      '8': { borderBottomWidth: '0.5rem', paddingBottom: '32' },
      '6': { borderBottomWidth: '0.375rem', paddingBottom: '24' },
      '4': { borderBottomWidth: '0.25rem', paddingBottom: '16' },
      '2': { borderBottomWidth: '0.125rem', paddingBottom: '8' },
    },
    hasRule: {
      true: { borderBottomStyle: 'solid', borderBottomColor: 'key.900' },
      false: {},
    },
  },
});

const shoulder = css({
  fontWeight: '700',
  fontSize: 'var(--heading-shoulder-size)',
  lineHeight: 'var(--heading-shoulder-line-height)',
  letterSpacing: 'var(--heading-shoulder-letter-spacing)',
});

export type HeadingShoulderProps = ComponentProps<'p'>;

export const HeadingShoulder = (props: HeadingShoulderProps) => {
  const { className, children, ...rest } = props;

  return (
    <p className={cx(shoulder, className)} {...rest}>
      {children}
    </p>
  );
};

export type HeadingTitleProps = ComponentProps<'h2'> & {
  level: HeadingLevel;
};

export const HeadingTitle = (props: HeadingTitleProps) => {
  const { level: Component, children, ...rest } = props;

  return <Component {...rest}>{children}</Component>;
};

export type HeadingProps = ComponentProps<'hgroup'> & {
  size: HeadingSize;
  hasChip?: boolean;
  rule?: RuleSize;
};

export const Heading = (props: HeadingProps) => {
  const { size, hasChip, rule, className, children, ref, ...rest } = props;

  const hasShoulder = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === HeadingShoulder,
  );

  const Component = hasShoulder ? 'hgroup' : 'div';
  const chip = hasChip ? (hasShoulder ? 'shoulder' : 'title') : 'none';

  return (
    <Component
      ref={ref as Ref<HTMLDivElement>}
      className={cx(heading({ size, chip, rule: rule ?? 'none', hasRule: !!rule }), className)}
      {...rest}
    >
      {children}
    </Component>
  );
};
