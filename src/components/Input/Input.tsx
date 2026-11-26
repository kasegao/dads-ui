import type { ComponentProps } from 'react';
import { cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type InputBlockSize = 'lg' | 'md' | 'sm';

const input = cva({
  base: {
    maxWidth: 'full',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'solid-gray.600',
    borderRadius: '8',
    backgroundColor: 'white',
    paddingInline: '16',
    paddingBlock: '12',
    color: 'solid-gray.800',
    textStyle: 'oln-16N-100',
    '&:read-write:hover': { borderColor: 'black' },
    '&[aria-invalid=true]:not([aria-disabled=true])': {
      borderColor: 'error.1',
      '&:read-write:hover': { borderColor: 'red.1000' },
    },
    _focus: { ...focusRing },
    _readOnly: { borderStyle: 'dashed' },
    _ariaDisabled: {
      borderColor: 'solid-gray.300',
      backgroundColor: 'solid-gray.50',
      color: 'solid-gray.420',
      pointerEvents: 'none',
      _readOnly: { borderStyle: 'solid' },
      _forcedColors: { borderColor: 'GrayText', color: 'GrayText' },
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

export type InputProps = Omit<ComponentProps<'input'>, 'placeholder'> & {
  isError?: boolean;
  blockSize?: InputBlockSize;
  /** DADS does not allow placeholders: they disappear on input and fail contrast. */
  placeholder?: never;
};

export const Input = (props: InputProps) => {
  const { className, readOnly, isError, blockSize = 'lg', ...rest } = props;
  const isDisabled = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';

  return (
    <input
      className={cx(input({ blockSize }), className)}
      aria-invalid={isError || undefined}
      readOnly={isDisabled ? true : readOnly}
      {...rest}
    />
  );
};
