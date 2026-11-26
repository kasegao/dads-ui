import type { ComponentProps, MouseEvent } from 'react';
import { cx, sva } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type CheckboxSize = 'sm' | 'md' | 'lg';

const checkbox = sva({
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
      borderRadius: 'calc(1 / 8 * 100%)',
      // Aligns the box with the first line of the label text.
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
      width: '75%',
      height: '75%',
      borderStyle: 'solid',
      borderColor: { base: 'solid-gray.600', _forcedColors: 'ButtonText' },
      borderRadius: 'calc(2 / 18 * 100%)',
      backgroundColor: 'white',
      backgroundClip: 'padding-box',
      _focus: { ...focusRing },
      _before: {
        content: '""',
        display: 'none',
        width: '14',
        height: '14',
        backgroundColor: { base: 'white', _forcedColors: 'HighlightText' },
      },
      _checked: {
        _before: {
          display: 'block',
          clipPath: "path('M5.6,11.2L12.65,4.15L11.25,2.75L5.6,8.4L2.75,5.55L1.35,6.95L5.6,11.2Z')",
        },
      },
      _indeterminate: {
        _before: {
          display: 'block',
          clipPath: "path('M3.25,7.75H10.75V6.25H3.25V7.75Z')",
        },
      },
      '&:not(:disabled, [aria-disabled=true])': {
        _hover: { borderColor: { base: 'black', _forcedColors: 'ButtonText' } },
        _checked: {
          borderColor: { base: 'key.900', _forcedColors: 'Highlight' },
          backgroundColor: { base: 'key.900', _forcedColors: 'Highlight' },
          _hover: {
            borderColor: { base: 'key.1100', _forcedColors: 'Highlight' },
            backgroundColor: { base: 'key.1100', _forcedColors: 'Highlight' },
          },
        },
        _indeterminate: {
          borderColor: { base: 'key.900', _forcedColors: 'Highlight' },
          backgroundColor: { base: 'key.900', _forcedColors: 'Highlight' },
          _hover: {
            borderColor: { base: 'key.1100', _forcedColors: 'Highlight' },
            backgroundColor: { base: 'key.1100', _forcedColors: 'Highlight' },
          },
        },
      },
      '&:is(:disabled, [aria-disabled=true])': {
        borderColor: { base: 'solid-gray.300', _forcedColors: 'GrayText' },
        backgroundColor: 'solid-gray.50',
        _checked: { backgroundColor: { base: 'solid-gray.300', _forcedColors: 'GrayText' } },
        _indeterminate: { backgroundColor: { base: 'solid-gray.300', _forcedColors: 'GrayText' } },
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
        input: {
          borderWidth: '0.125rem',
          _before: { transformOrigin: 'top left', transform: 'scale(calc(20 / 14))' },
        },
        label: { textStyle: 'dns-16N-130' },
      },
      lg: {
        root: { gap: '8' },
        control: { '--baseline-offset': '0.625rem', width: '44', height: '44' },
        input: {
          borderWidth: '0.1875rem',
          _before: { transformOrigin: 'top left', transform: 'scale(calc(27 / 14))' },
        },
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
              backgroundColor: { base: 'error.1', _forcedColors: 'Highlight' },
              _hover: {
                borderColor: { base: 'red.1000', _forcedColors: 'Highlight' },
                backgroundColor: { base: 'red.1000', _forcedColors: 'Highlight' },
              },
            },
            _indeterminate: {
              borderColor: { base: 'error.1', _forcedColors: 'Highlight' },
              backgroundColor: { base: 'error.1', _forcedColors: 'Highlight' },
              _hover: {
                borderColor: { base: 'red.1000', _forcedColors: 'Highlight' },
                backgroundColor: { base: 'red.1000', _forcedColors: 'Highlight' },
              },
            },
          },
        },
      },
    },
  },
});

export type CheckboxProps = Omit<ComponentProps<'input'>, 'size' | 'type'> & {
  size?: CheckboxSize;
  isError?: boolean;
};

const preventDefault = (e: MouseEvent) => e.preventDefault();
const noop = () => {};

/** Renders the box alone without `children`, or wrapped in a `<label>` with them. */
export const Checkbox = (props: CheckboxProps) => {
  const { children, className, isError, onChange, onClick, size = 'sm', ...rest } = props;
  const isDisabled = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';
  const classes = checkbox({ size, isError });

  const control = (
    <span className={classes.control}>
      <input
        className={cx(classes.input, className)}
        type='checkbox'
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
