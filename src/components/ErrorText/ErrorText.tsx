import type { ComponentProps } from 'react';
import { css, cx } from '../../../styled-system/css';

const errorText = css({
  color: 'error.1',
  textStyle: 'dns-16N-130',
});

export type ErrorTextProps = ComponentProps<'p'>;

export const ErrorText = (props: ErrorTextProps) => {
  const { children, className, ...rest } = props;

  return (
    <p className={cx(errorText, className)} {...rest}>
      {children}
    </p>
  );
};
