import type { ComponentProps } from 'react';
import { css, cx } from '../../../styled-system/css';

const blockquote = css({
  marginInline: '40',
  borderLeftWidth: '8px',
  borderLeftStyle: 'solid',
  borderLeftColor: 'solid-gray.536',
  paddingBlock: '8',
  paddingLeft: '24',
  paddingRight: '16',
  '& > *:first-child': { marginTop: '0' },
  '& > *:last-child': { marginBottom: '0' },
});

export type BlockquoteProps = ComponentProps<'blockquote'>;

export const Blockquote = (props: BlockquoteProps) => {
  const { children, className, ...rest } = props;

  return (
    <blockquote className={cx(blockquote, className)} {...rest}>
      {children}
    </blockquote>
  );
};
