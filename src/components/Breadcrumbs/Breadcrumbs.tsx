import type { ComponentProps, ReactNode } from 'react';
import { css, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import { Slot } from '../../utils/Slot';

const itemStyle = css({ display: 'inline', overflowWrap: 'break-word' });
const currentItemStyle = css({ textStyle: 'oln-16N-100' });
const separatorStyle = css({ display: 'inline', marginInline: '8' });

const linkStyle = css({
  color: 'blue.1000',
  textStyle: 'oln-16N-100',
  textDecorationLine: 'underline',
  textUnderlineOffset: '0.1875rem',
  _hover: { color: 'blue.900', textDecorationThickness: '0.1875rem' },
  _active: { color: 'orange.800', textDecorationThickness: '1px' },
  _focusVisible: {
    ...focusRing,
    borderRadius: '4',
    backgroundColor: 'yellow.300',
    color: 'blue.1000',
  },
});

const listStyle = css({ display: 'inline' });

export type BreadcrumbsProps = ComponentProps<'nav'>;

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { children, ...rest } = props;
  return <nav {...rest}>{children}</nav>;
};

export type BreadcrumbsLabelProps = ComponentProps<'span'>;

export const BreadcrumbsLabel = (props: BreadcrumbsLabelProps) => {
  const { children, ...rest } = props;
  return <span {...rest}>{children}</span>;
};

export type BreadcrumbListProps = ComponentProps<'p'>;

export const BreadcrumbList = (props: BreadcrumbListProps) => {
  const { children, className, ...rest } = props;
  return (
    <p className={cx(listStyle, className)} {...rest}>
      {children}
    </p>
  );
};

export type BreadcrumbItemProps = ComponentProps<'span'> & {
  isCurrent?: boolean;
};

export const BreadcrumbItem = (props: BreadcrumbItemProps) => {
  const { isCurrent = false, children, className, ...rest } = props;

  if (isCurrent) {
    return (
      <span aria-current='page' className={cx(itemStyle, currentItemStyle, className)} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <span className={cx(itemStyle, className)} {...rest}>
      {children}
      <svg
        aria-hidden={true}
        className={separatorStyle}
        fill='none'
        height='12'
        viewBox='0 0 12 12'
        width='12'
      >
        <path
          d='M4.50078 1.2998L3.80078 1.9998L7.80078 5.9998L3.80078 9.9998L4.50078 10.6998L9.20078 5.9998L4.50078 1.2998Z'
          fill='currentColor'
        />
      </svg>
    </span>
  );
};

export type BreadcrumbLinkProps = {
  className?: string;
} & (({ asChild?: false } & ComponentProps<'a'>) | { asChild: true; children: ReactNode });

export const BreadcrumbLink = (props: BreadcrumbLinkProps) => {
  const { asChild, children, className, ...rest } = props;
  const classNames = cx(linkStyle, className);

  if (asChild) {
    return (
      <Slot className={classNames} {...rest}>
        {children}
      </Slot>
    );
  }

  return (
    <a className={classNames} {...rest}>
      {children}
    </a>
  );
};
