import type { ComponentProps, MouseEvent } from 'react';
import { cx, sva } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type RadioSize = 'sm' | 'md' | 'lg';

const radio = sva({
  slots: ['root', 'control', 'input', 'label'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'baseline',
      width: 'fit',
      paddingBlock: '8',
    },
    control: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      borderRadius: 'full',
      // Aligns the circle with the first line of the label text.
      _notOnly: {
        position: 'relative',
        top: 'var(--baseline-offset)',
        marginTop: 'calc(var(--baseline-offset) * -1)',
        marginBottom: 'var(--baseline-offset)',
      },
      '&:has(input:hover:not(:focus):not(:disabled):not([aria-disabled=true]))': {
        backgroundColor: 'solid-gray.420',
      },
    },
    input: {
      appearance: 'none',
      width: 'calc(5 / 6 * 100%)',
      height: 'calc(5 / 6 * 100%)',
      borderStyle: 'solid',
      borderColor: { base: 'solid-gray.600', _forcedColors: 'ButtonText' },
      borderRadius: 'full',
      backgroundColor: 'white',
      _focus: { ...focusRing },
      _before: {
        content: '""',
        display: 'none',
        width: 'full',
        height: 'full',
        backgroundColor: 'white',
        clipPath: 'circle(calc(5 / 16 * 100%))',
      },
      _checked: {
        _before: { display: 'block' },
      },
      '&:not(:disabled, [aria-disabled=true])': {
        _hover: { borderColor: { base: 'black', _forcedColors: 'ButtonText' } },
        _checked: {
          borderColor: { base: 'key.900', _forcedColors: 'Highlight' },
          _before: { backgroundColor: { base: 'key.900', _forcedColors: 'Highlight' } },
          _hover: {
            borderColor: { base: 'key.1100', _forcedColors: 'Highlight' },
            _before: { backgroundColor: { base: 'key.1100', _forcedColors: 'Highlight' } },
          },
        },
      },
      '&:is(:disabled, [aria-disabled=true])': {
        borderColor: { base: 'solid-gray.300', _forcedColors: 'GrayText' },
        backgroundColor: 'solid-gray.50',
        _checked: {
          _before: { backgroundColor: { base: 'solid-gray.300', _forcedColors: 'GrayText' } },
        },
      },
    },
    label: {
      color: 'solid-gray.800',
    },
  },
  variants: {
    size: {
      sm: {
        root: { gap: '4' },
        control: { '--baseline-offset': '0.1875rem', width: '24', height: '24' },
        input: { borderWidth: '0.125rem' },
        label: { textStyle: 'dns-16N-130' },
      },
      md: {
        root: { gap: '8' },
        control: { '--baseline-offset': '0.375rem', width: '32', height: '32' },
        input: { borderWidth: '0.125rem' },
        label: { textStyle: 'dns-16N-130' },
      },
      lg: {
        root: { gap: '12' },
        control: { '--baseline-offset': '0.6875rem', width: '44', height: '44' },
        input: { borderWidth: '0.1875rem' },
        label: { textStyle: 'dns-17N-130' },
      },
    },
    isError: {
      true: {
        input: {
          '&:not(:disabled, [aria-disabled=true])': {
            borderColor: { base: 'error.1', _forcedColors: 'ButtonText' },
            _hover: { borderColor: { base: 'red.1000', _forcedColors: 'ButtonText' } },
            _checked: {
              borderColor: { base: 'error.1', _forcedColors: 'Highlight' },
              _before: { backgroundColor: { base: 'error.1', _forcedColors: 'Highlight' } },
              _hover: {
                borderColor: { base: 'red.1000', _forcedColors: 'Highlight' },
                _before: { backgroundColor: { base: 'red.1000', _forcedColors: 'Highlight' } },
              },
            },
          },
        },
      },
    },
  },
});

export type RadioProps = Omit<ComponentProps<'input'>, 'size' | 'type'> & {
  size?: RadioSize;
  isError?: boolean;
};

const preventDefault = (e: MouseEvent) => e.preventDefault();
const noop = () => {};

/** Renders the circle alone without `children`, or wrapped in a `<label>` with them. */
export const Radio = (props: RadioProps) => {
  const { children, className, isError, onChange, onClick, size = 'sm', ...rest } = props;
  const isDisabled = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';
  const classes = radio({ size, isError });

  const control = (
    <span className={classes.control}>
      <input
        className={cx(classes.input, className)}
        type='radio'
        // React reports a change before the prevented click is reverted, so drop it as well.
        onChange={isDisabled ? noop : onChange}
        onClick={isDisabled ? preventDefault : onClick}
        {...rest}
      />
    </span>
  );

  if (!children) {
    return control;
  }

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: `control` holds the input.
    <label className={classes.root}>
      {control}
      <span className={classes.label}>{children}</span>
    </label>
  );
};
