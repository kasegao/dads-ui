import type { ComponentProps } from 'react';
import { cx, sva } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

const switchOnOff = sva({
  slots: ['root', 'track', 'thumb', 'icon'],
  base: {
    root: {
      position: 'relative',
      flexShrink: '0',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
      // Extends the hit area to 44px.
      _before: {
        content: '""',
        position: 'absolute',
        insetBlock: '-4',
        insetInline: '0',
      },
      _focusVisible: { ...focusRing, borderRadius: 'full' },
    },
    track: {
      position: 'relative',
      display: 'block',
      width: '56',
      borderWidth: '2',
      borderStyle: 'solid',
      borderColor: { base: 'solid-gray.600', _forcedColors: 'ButtonText' },
      borderRadius: 'full',
      backgroundColor: 'white',
      padding: '4',
      '[aria-checked=true] > &': {
        borderColor: { base: 'key.900', _forcedColors: 'Highlight' },
        backgroundColor: 'key.50',
      },
      'button:enabled:hover > &': {
        borderColor: { base: 'black', _forcedColors: 'ButtonText' },
      },
      '[aria-checked=true]:enabled:hover > &': {
        borderColor: { base: 'key.1100', _forcedColors: 'Highlight' },
      },
      'button:enabled:hover:not(:active) > &': {
        boxShadow: '0 0 0 4px {colors.solid-gray.420}',
      },
      'button:enabled:active > &': {
        boxShadow: '0 0 0 0.375rem {colors.solid-gray.600}',
      },
      'button:disabled > &': {
        borderColor: { base: 'solid-gray.300', _forcedColors: 'GrayText' },
        backgroundColor: 'solid-gray.50',
      },
    },
    thumb: {
      display: 'block',
      width: '24',
      height: '24',
      borderRadius: 'full',
      backgroundColor: { base: 'solid-gray.800', _forcedColors: 'ButtonText' },
      'button[aria-checked=true] &': { marginLeft: 'auto' },
      'button[aria-checked=true]:enabled &': {
        backgroundColor: { base: 'key.900', _forcedColors: 'Highlight' },
      },
      'button[aria-checked=false]:enabled:hover &': {
        backgroundColor: { base: 'black', _forcedColors: 'ButtonText' },
      },
      'button[aria-checked=true]:enabled:hover &': {
        backgroundColor: { base: 'key.1100', _forcedColors: 'Highlight' },
      },
      'button:disabled &': {
        backgroundColor: { base: 'solid-gray.300', _forcedColors: 'GrayText' },
      },
    },
    icon: {
      display: 'none',
      flexShrink: '0',
      width: '24',
      height: '24',
      color: { base: 'white', _forcedColors: 'Canvas' },
      'button[aria-checked=true] &': { display: 'block' },
    },
  },
});

export type SwitchOnOffProps = Omit<ComponentProps<'button'>, 'aria-disabled' | 'type' | 'role'>;

/**
 * On/off switch. Stateless: the caller owns `aria-checked` and toggles it in `onClick`.
 * Give it a name by wrapping it in a `<label>` or pointing a `<label htmlFor>` at its `id`.
 */
export const SwitchOnOff = (props: SwitchOnOffProps) => {
  const { className, 'aria-checked': ariaChecked = false, ...rest } = props;
  const classes = switchOnOff();

  return (
    <button
      {...rest}
      type='button'
      role='switch'
      aria-checked={ariaChecked}
      className={cx(classes.root, className)}
    >
      <span className={classes.track} aria-hidden='true'>
        <span className={classes.thumb}>
          <svg
            className={classes.icon}
            viewBox='0 0 24 24'
            width='24'
            height='24'
            aria-hidden='true'
          >
            <path d='m10.4 16.3-4.1-4.1 1.2-1.3 2.9 2.9 6-6.1 1.3 1.2z' fill='currentcolor' />
          </svg>
        </span>
      </span>
    </button>
  );
};

const switchMode = sva({
  slots: ['root', 'option', 'control', 'rail', 'thumb'],
  base: {
    root: {
      isolation: 'isolate',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '16',
      color: 'solid-gray.800',
      textStyle: 'oln-16N-100',
      '&:has(:disabled)': {
        color: { base: 'solid-gray.300', _forcedColors: 'GrayText' },
      },
    },
    option: {
      position: 'relative',
      display: 'flex',
      alignSelf: 'stretch',
      alignItems: 'center',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
      // Either option toggles, so the selected one steps back and lets the other take the click.
      '&[aria-checked=true]': { zIndex: '-10' },
      // Both pseudo-elements stretch over the rail: `::before` is the hit area,
      // `::after` draws the focus ring around the option and the rail together.
      _before: {
        content: '""',
        position: 'absolute',
        insetBlock: '-8',
        insetInline: '0',
      },
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
      },
      _first: {
        _before: { right: '-4.75rem' },
        _after: { right: '-4.75rem' },
      },
      _last: {
        _before: { left: '-4.75rem' },
        _after: { left: '-4.75rem' },
      },
      _focusVisible: {
        outlineStyle: 'none',
        _after: {
          ...focusRing,
          borderRadius: 'full',
          _forcedColors: { outlineColor: 'Highlight' },
        },
      },
    },
    control: {
      position: 'relative',
      flexShrink: '0',
      width: '3.75rem',
      borderRadius: 'full',
      padding: '6',
      pointerEvents: 'none',
      '[data-switch-mode]:not(:has(:disabled)):hover:not(:active) > &': {
        boxShadow: '0 0 0 4px {colors.solid-gray.420}',
      },
      '[data-switch-mode]:not(:has(:disabled)):active > &': {
        boxShadow: '0 0 0 0.375rem {colors.solid-gray.600}',
      },
    },
    rail: {
      display: 'block',
      height: '16',
      borderWidth: '2',
      borderStyle: 'solid',
      borderColor: { base: 'blue.900', _forcedColors: 'ButtonText' },
      borderRadius: '8',
      backgroundColor: 'blue.100',
      '[data-switch-mode]:not(:has(:disabled)):hover &': {
        borderColor: { base: 'blue.1100', _forcedColors: 'ButtonText' },
      },
      '[data-switch-mode]:has(:disabled) &': {
        borderColor: 'solid-gray.300',
        backgroundColor: 'solid-gray.50',
      },
    },
    thumb: {
      position: 'absolute',
      insetInline: '0',
      insetBlock: '-100%',
      marginBlock: 'auto',
      boxSizing: 'content-box',
      width: '24',
      height: '24',
      borderWidth: '2',
      borderStyle: 'solid',
      borderColor: { base: 'white', _forcedColors: 'Canvas' },
      borderRadius: 'full',
      backgroundColor: { base: 'blue.900', _forcedColors: 'ButtonText' },
      '[data-switch-mode]:has(button:last-of-type[aria-checked=true]) &': {
        left: '32',
      },
      '[data-switch-mode]:not(:has(:disabled)):hover &': {
        backgroundColor: { base: 'blue.1100', _forcedColors: 'ButtonText' },
      },
      '[data-switch-mode]:has(:disabled) &': {
        backgroundColor: { base: 'solid-gray.300', _forcedColors: 'GrayText' },
      },
    },
  },
});

export type SwitchModeProps = Omit<ComponentProps<'div'>, 'onChange' | 'aria-describedby'> & {
  leftLabel: string;
  rightLabel: string;
  /** The selected side: equal to `leftLabel` or `rightLabel`. */
  value: string;
  /** Called with the label that becomes selected, whichever side was clicked. */
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Applied to both option buttons, not to the root. */
  'aria-describedby'?: string;
};

/** Two-option mode switch. Stateless: the caller owns `value`. */
export const SwitchMode = (props: SwitchModeProps) => {
  const {
    className,
    leftLabel,
    rightLabel,
    value,
    onChange,
    disabled,
    'aria-describedby': ariaDescribedby,
    ...rest
  } = props;
  const classes = switchMode();
  const toggle = () => onChange(value === leftLabel ? rightLabel : leftLabel);

  return (
    <div className={cx(classes.root, className)} data-switch-mode='' {...rest}>
      <button
        type='button'
        role='switch'
        aria-checked={value === leftLabel}
        aria-describedby={ariaDescribedby}
        disabled={disabled}
        onClick={toggle}
        className={classes.option}
      >
        {leftLabel}
      </button>
      <span className={classes.control} aria-hidden='true'>
        <span className={classes.rail} />
        <span className={classes.thumb} />
      </span>
      <button
        type='button'
        role='switch'
        aria-checked={value === rightLabel}
        aria-describedby={ariaDescribedby}
        disabled={disabled}
        onClick={toggle}
        className={classes.option}
      >
        {rightLabel}
      </button>
    </div>
  );
};
