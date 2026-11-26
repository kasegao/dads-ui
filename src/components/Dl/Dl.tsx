import type { ComponentProps } from 'react';
import { css, cx } from '../../../styled-system/css';

export type DlMarker = 'none' | 'bullet';

const dl = css({
  display: 'grid',
  rowGap: '8',
});

const dt = css({
  fontWeight: '700',
  'dl[data-marker=bullet] &': {
    display: 'list-item',
    marginLeft: '32',
    listStyleType: 'disc',
  },
});

const dd = css({
  marginLeft: '32',
});

export type DlProps = ComponentProps<'dl'> & {
  marker?: DlMarker;
};

export const Dl = (props: DlProps) => {
  const { children, className, marker, ...rest } = props;

  return (
    <dl className={cx(dl, className)} data-marker={marker} {...rest}>
      {children}
    </dl>
  );
};

export type DtProps = ComponentProps<'dt'>;

export const Dt = (props: DtProps) => {
  const { children, className, ...rest } = props;

  return (
    <dt className={cx(dt, className)} {...rest}>
      {children}
    </dt>
  );
};

export type DdProps = ComponentProps<'dd'>;

export const Dd = (props: DdProps) => {
  const { children, className, ...rest } = props;

  return (
    <dd className={cx(dd, className)} {...rest}>
      {children}
    </dd>
  );
};
