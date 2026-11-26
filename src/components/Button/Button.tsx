import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import { Slot } from '../../utils/Slot';

export type ButtonVariant = 'solid-fill' | 'outline' | 'text';
export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs';

/** Expands the hit area of small buttons to 44px (WCAG 2.5.8). */
const targetSize = {
  position: 'relative',
  _after: {
    content: '""',
    position: 'absolute',
    insetInline: '0',
    insetBlock: '-100%',
    margin: 'auto',
    height: '44px',
  },
} as const;

const button = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: '4',
    width: 'fit',
    maxWidth: 'full',
    textUnderlineOffset: '0.1875rem',
    cursor: 'pointer',
    _focusVisible: { ...focusRing },
    _disabled: {
      pointerEvents: 'none',
      _forcedColors: { borderColor: 'GrayText', color: 'GrayText' },
    },
  },
  variants: {
    variant: {
      'solid-fill': {
        borderWidth: '4',
        borderStyle: 'double',
        borderColor: 'transparent',
        backgroundColor: 'key.900',
        color: 'white',
        _hover: { backgroundColor: 'key.1000', textDecorationLine: 'underline' },
        _active: { backgroundColor: 'key.1200', textDecorationLine: 'underline' },
        _disabled: { backgroundColor: 'solid-gray.300', color: 'solid-gray.50' },
      },
      outline: {
        borderWidth: '1',
        borderStyle: 'solid',
        borderColor: 'current',
        backgroundColor: 'white',
        color: 'key.900',
        _hover: {
          backgroundColor: 'key.200',
          color: 'key.1000',
          textDecorationLine: 'underline',
        },
        _active: {
          backgroundColor: 'key.300',
          color: 'key.1200',
          textDecorationLine: 'underline',
        },
        _disabled: { backgroundColor: 'white', color: 'solid-gray.300' },
      },
      text: {
        color: 'key.900',
        textDecorationLine: 'underline',
        _hover: {
          backgroundColor: 'key.50',
          color: 'key.1000',
          textDecorationThickness: '0.1875rem',
        },
        _active: { backgroundColor: 'key.100', color: 'key.1200' },
        _focusVisible: { backgroundColor: 'yellow.300' },
        _disabled: {
          backgroundColor: 'transparent',
          color: 'solid-gray.300',
          _focusVisible: { backgroundColor: 'yellow.300' },
        },
      },
    },
    size: {
      lg: {
        minWidth: '8.5rem',
        minHeight: '56',
        borderRadius: '8',
        paddingInline: '16',
        paddingBlock: '12',
        textStyle: 'oln-16B-100',
      },
      md: {
        minWidth: '96',
        minHeight: '48',
        borderRadius: '8',
        paddingInline: '16',
        paddingBlock: '8',
        textStyle: 'oln-16B-100',
      },
      sm: {
        ...targetSize,
        minWidth: '80',
        minHeight: '36',
        borderRadius: '6',
        paddingInline: '12',
        paddingBlock: '2',
        textStyle: 'oln-16B-100',
      },
      xs: {
        ...targetSize,
        minWidth: '72',
        minHeight: '28',
        borderRadius: '4',
        paddingInline: '8',
        paddingBlock: '2',
        textStyle: 'oln-14B-100',
      },
    },
  },
});

export type ButtonProps = {
  className?: string;
  variant?: ButtonVariant;
  size: ButtonSize;
} & (({ asChild?: false } & ComponentProps<'button'>) | { asChild: true; children: ReactNode });

const preventDefault = (e: MouseEvent) => e.preventDefault();

export const Button = (props: ButtonProps) => {
  const { asChild, children, className, variant, size, ...rest } = props;
  const classNames = cx(button({ variant, size }), className);

  if (asChild) {
    return (
      <Slot className={classNames} {...rest}>
        {children}
      </Slot>
    );
  }

  const { onClick, type = 'button', ...buttonProps } = rest as ComponentProps<'button'>;

  return (
    <button
      className={classNames}
      type={type}
      onClick={buttonProps['aria-disabled'] ? preventDefault : onClick}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
