import type { ComponentProps, KeyboardEvent, MouseEvent } from 'react';
import { cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type SelectBlockSize = 'lg' | 'md' | 'sm';

const select = cva({
  base: {
    display: 'inline-block',
    width: 'fit',
    maxWidth: 'full',
    verticalAlign: 'baseline',
    appearance: 'none',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'solid-gray.600',
    borderRadius: '8',
    backgroundColor: 'white',
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3Cpath%20fill='%231a1a1a'%20d='M12%2017.1%203%208l1-1%208%208%208-8%201%201z'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1rem 1rem',
    backgroundPosition: 'right 1rem center',
    paddingLeft: '16',
    paddingRight: '40',
    paddingBlock: '0.6875rem',
    color: 'solid-gray.800',
    textStyle: 'oln-16N-100',
    _forcedColors: { appearance: 'auto', backgroundImage: 'none' },
    '&:not([aria-disabled=true])': {
      _hover: { borderColor: 'black' },
      '&[aria-invalid=true]': {
        borderColor: 'error.1',
        _hover: { borderColor: 'red.1000' },
      },
    },
    _focus: { ...focusRing },
    _ariaDisabled: {
      borderColor: 'solid-gray.300',
      backgroundColor: 'solid-gray.50',
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3Cpath%20fill='%23949494'%20d='M12%2017.1%203%208l1-1%208%208%208-8%201%201z'/%3E%3C/svg%3E\")",
      color: 'solid-gray.420',
      pointerEvents: 'none',
      _forcedColors: { borderColor: 'GrayText', backgroundImage: 'none', color: 'GrayText' },
    },
  },
  variants: {
    blockSize: {
      lg: { height: '56' },
      md: { height: '48' },
      sm: { height: '40' },
    },
  },
});

export type SelectProps = ComponentProps<'select'> & {
  isError?: boolean;
  blockSize?: SelectBlockSize;
};

const blockKeyDown = (e: KeyboardEvent<HTMLSelectElement>) => {
  if (e.code !== 'Tab') {
    e.preventDefault();
  }
};

const blockMouseDown = (e: MouseEvent<HTMLSelectElement>) => {
  e.preventDefault();
};

export const Select = (props: SelectProps) => {
  const { children, className, isError, blockSize = 'lg', onKeyDown, onMouseDown, ...rest } = props;
  const isDisabled = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';

  return (
    <select
      className={cx(select({ blockSize }), className)}
      aria-invalid={isError || undefined}
      onMouseDown={isDisabled ? blockMouseDown : onMouseDown}
      onKeyDown={isDisabled ? blockKeyDown : onKeyDown}
      {...rest}
    >
      {children}
    </select>
  );
};
