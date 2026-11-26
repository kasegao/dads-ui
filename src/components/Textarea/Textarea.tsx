import type { ComponentProps } from 'react';
import { css, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

// The zero-width space exposes the first-line baseline in Safari.
const wrapper = css({
  display: 'block',
  textStyle: 'std-16N-170',
  _before: {
    content: '"\\200B"',
    display: 'block',
    height: '0',
    paddingTop: '16',
    marginBottom: '-16',
  },
});

const textarea = css({
  display: 'block',
  maxWidth: 'full',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'solid-gray.600',
  borderRadius: '8',
  backgroundColor: 'white',
  padding: '16',
  color: 'solid-gray.800',
  textStyle: 'std-16N-170',
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
});

export type TextareaProps = Omit<ComponentProps<'textarea'>, 'placeholder'> & {
  isError?: boolean;
  /** DADS does not allow placeholders: they disappear on input and fail contrast. */
  placeholder?: never;
};

export const Textarea = (props: TextareaProps) => {
  const { className, isError, readOnly, ...rest } = props;
  const isDisabled = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';

  return (
    <span className={wrapper}>
      <textarea
        className={cx(textarea, className)}
        aria-invalid={isError || undefined}
        readOnly={isDisabled ? true : readOnly}
        {...rest}
      />
    </span>
  );
};
