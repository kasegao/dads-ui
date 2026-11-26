import type { ComponentProps } from 'react';
import { css, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type EmergencyBannerHeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const banner = css({
  display: 'block',
  borderWidth: '6px',
  borderStyle: 'solid',
  borderColor: 'warning-orange.1',
  backgroundColor: 'white',
  paddingInline: { base: '10', desktop: '1.625rem' },
  paddingBlock: { base: '14', desktop: '1.625rem' },
});

const heading = css({
  color: 'black',
  textStyle: { base: 'std-20B-150', desktop: 'std-24B-150' },
});

const body = css({ marginTop: { base: '8', desktop: '16' } });

const button = css({
  position: 'relative',
  display: 'block',
  marginInline: 'auto',
  width: { base: 'full', desktop: 'fit' },
  minWidth: { desktop: '50%' },
  borderWidth: { base: '2', desktop: '4' },
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderRadius: { base: '12', desktop: '16' },
  backgroundColor: 'error.1',
  padding: { base: '18', desktop: '20' },
  color: 'white',
  textStyle: 'oln-16B-100',
  textAlign: 'center',
  _after: {
    content: '""',
    position: 'absolute',
    inset: '0',
    borderWidth: { base: '2', desktop: '4' },
    borderStyle: 'solid',
    borderColor: 'white',
    borderRadius: { base: '0.625rem', desktop: '12' },
  },
  _hover: {
    backgroundColor: 'error.2',
    textDecorationLine: 'underline',
    textUnderlineOffset: '0.1875rem',
  },
  _focusVisible: { ...focusRing },
});

const newWindowIcon = css({ display: 'inline', marginLeft: '4', verticalAlign: 'top' });

export type EmergencyBannerProps = ComponentProps<'div'>;

export const EmergencyBanner = ({ className, ...rest }: EmergencyBannerProps) => (
  <div className={cx(banner, className)} {...rest} />
);

export type EmergencyBannerHeadingProps = ComponentProps<'h2'> & {
  level: EmergencyBannerHeadingLevel;
};

export const EmergencyBannerHeading = (props: EmergencyBannerHeadingProps) => {
  const { level: Tag, className, children, ...rest } = props;

  return (
    <Tag className={cx(heading, className)} {...rest}>
      【緊急】
      {children}
    </Tag>
  );
};

export type EmergencyBannerBodyProps = ComponentProps<'div'>;

export const EmergencyBannerBody = ({ className, ...rest }: EmergencyBannerBodyProps) => (
  <div className={cx(body, className)} {...rest} />
);

export type EmergencyBannerButtonProps = ComponentProps<'a'>;

export const EmergencyBannerButton = (props: EmergencyBannerButtonProps) => {
  const { className, children, ...rest } = props;

  return (
    <a className={cx(button, className)} {...rest}>
      {children}
      {rest.target === '_blank' && (
        <svg
          aria-label='新規タブで開きます'
          className={newWindowIcon}
          fill='none'
          height='16'
          role='img'
          viewBox='0 0 16 16'
          width='16'
        >
          <path
            clipRule='evenodd'
            d='M3 13.5H13V9.16667H14V14.5H2V2.5H7.33333V3.5H3V13.5ZM9.33333 3.5V2.5H14V7.16667H13V4.23333L7 10.1667L6.33333 9.5L12.2667 3.5H9.33333Z'
            fillRule='evenodd'
            fill='currentColor'
          />
        </svg>
      )}
    </a>
  );
};
