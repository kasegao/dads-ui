import type { ComponentProps } from 'react';
import { cva, cx } from '../../../styled-system/css';

export type ListSpacing = '4' | '8' | '12';
export type ListMarker = 'number';

const numberMarker = {
  display: 'inline-block',
  marginLeft: '-32',
  minWidth: '32',
  whiteSpace: 'nowrap',
} as const;

const list = cva({
  base: {
    '& > li': { paddingBlock: 'var(--list-spacing, 0px)' },
    '& ul': {
      marginTop: 'var(--list-spacing, 0px)',
      marginBottom: 'calc(-1 * var(--list-spacing, 0px))',
    },
  },
  variants: {
    spacing: {
      '4': { '--list-spacing': '0.25rem' },
      '8': { '--list-spacing': '0.5rem' },
      '12': { '--list-spacing': '0.75rem' },
    },
    marker: {
      default: {
        paddingLeft: '32',
        listStyleType: 'revert',
      },
      number: {
        '& > li': { paddingLeft: '32' },
        '& > li > a:only-child': { marginLeft: '-32', paddingLeft: '32' },
        '& > li > span:first-child': numberMarker,
        '& > li > a:only-child > span:first-child': {
          ...numberMarker,
          textDecoration: 'inherit',
        },
      },
    },
  },
});

export type ListProps = ComponentProps<'ul'> & {
  spacing: ListSpacing;
  /**
   * `number` lays out a hand-written marker: put it in the first `<span>` of each `<li>`
   * (or of the only `<a>` in the `<li>`).
   */
  marker?: ListMarker;
};

export const List = (props: ListProps) => {
  const { spacing, marker, children, className, ...rest } = props;

  return (
    <ul className={cx(list({ spacing, marker: marker ?? 'default' }), className)} {...rest}>
      {children}
    </ul>
  );
};
