import type { ComponentProps, ReactNode } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

export type NotificationBannerHeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type NotificationBannerStyle = 'standard' | 'color-chip';
export type NotificationBannerType = 'info1' | 'info2' | 'warning' | 'error' | 'success';

const banner = cva({
  base: {
    '--icon-size': { base: '1.5rem', desktop: '2.25rem' },
    display: 'grid',
    gridTemplateColumns: 'var(--icon-size) 1fr minmax(0, auto)',
    gridTemplateRows: 'minmax(2.25rem, auto)',
    rowGap: '16',
    columnGap: { base: '16', desktop: '24' },
    borderStyle: 'solid',
    borderColor: 'currentColor',
    paddingRight: { base: '16', desktop: '24' },
    paddingTop: { base: '8', desktop: '24' },
    paddingBottom: { base: '24', desktop: '32' },
  },
  variants: {
    bannerStyle: {
      standard: {
        borderWidth: '3',
        borderRadius: '12',
        paddingLeft: { base: '16', desktop: '24' },
      },
      'color-chip': {
        borderWidth: '2',
        paddingLeft: { base: '24', desktop: '40' },
        boxShadow: {
          base: 'inset {spacing.8} 0 0 0 var(--color-chip-color, currentColor)',
          desktop: 'inset {spacing.16} 0 0 0 var(--color-chip-color, currentColor)',
        },
      },
    },
    type: {
      info1: { color: 'blue.900' },
      info2: { color: 'solid-gray.536' },
      warning: { color: 'warning-yellow.2', '--color-chip-color': '{colors.yellow.400}' },
      error: { color: 'error.1' },
      success: { color: 'success.2' },
    },
  },
});

const heading = css({
  gridColumn: 'span 2',
  display: 'grid',
  gridTemplateColumns: 'inherit',
  gap: 'inherit',
});

const icon = css({
  justifySelf: 'center',
  width: { base: '28', desktop: '44' },
  height: { base: '28', desktop: '44' },
  maxWidth: 'none',
  maxHeight: 'none',
  marginTop: { base: '3', desktop: '-0.25rem' },
  marginBottom: { desktop: '-0.25rem' },
});

const titleText = css({
  paddingTop: { base: '3', desktop: '2' },
  color: 'solid-gray.900',
  textStyle: { base: 'std-17B-170', desktop: 'std-20B-150' },
});

const body = css({
  gridColumnStart: { base: '1', desktop: '2' },
  gridColumnEnd: '-1',
  display: 'grid',
  rowGap: '8',
  color: 'solid-gray.800',
  textStyle: 'std-16N-170',
});

const close = css({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: '4',
  marginRight: '-0.75rem',
  borderRadius: '6',
  paddingTop: '4',
  paddingInline: '12',
  paddingBottom: '6',
  color: 'solid-gray.900',
  cursor: 'pointer',
  _hover: {
    backgroundColor: 'solid-gray.50',
    textDecorationLine: 'underline',
    textUnderlineOffset: '0.1875rem',
  },
  _focusVisible: { ...focusRing, backgroundColor: 'yellow.300' },
});

const closeIcon = css({ marginTop: '2', width: '24', height: '24' });
const closeLabel = css({ textStyle: 'oln-16N-100' });

const mobileClose = css({
  alignSelf: 'flex-start',
  marginTop: '4',
  borderRadius: '4',
  color: 'solid-gray.900',
  touchAction: 'manipulation',
  cursor: 'pointer',
  _hover: {
    backgroundColor: 'solid-gray.50',
    outlineWidth: '1px',
    outlineStyle: 'solid',
  },
  _focusVisible: { ...focusRing, backgroundColor: 'yellow.300' },
});

const TypeIcon = ({ type }: { type: NotificationBannerType }) => {
  const props = {
    className: icon,
    fill: 'none',
    height: '24',
    role: 'img',
    viewBox: '0 0 24 24',
    width: '24',
  } as const;

  switch (type) {
    case 'warning':
      return (
        <svg aria-label='警告' {...props}>
          <path d='M1 21 12 2l11 19H1Z' fill='currentColor' />
          <path d='M13 15h-2v-5h2v5Z' fill='Canvas' />
          <circle cx='12' cy='17' r='1' fill='Canvas' />
        </svg>
      );
    case 'error':
      return (
        <svg aria-label='エラー' {...props}>
          <path
            d='M8.25 21 3 15.75v-7.5L8.25 3h7.5L21 8.25v7.5L15.75 21h-7.5Z'
            fill='currentColor'
          />
          <path
            d='m12 13.4-2.85 2.85-1.4-1.4L10.6 12 7.75 9.15l1.4-1.4L12 10.6l2.85-2.85 1.4 1.4L13.4 12l2.85 2.85-1.4 1.4L12 13.4Z'
            fill='Canvas'
          />
        </svg>
      );
    case 'success':
      return (
        <svg aria-label='成功' {...props}>
          <circle cx='12' cy='12' r='10' fill='currentColor' />
          <path d='m17.6 9.6-7 7-4.3-4.3L7.7 11l2.9 2.9 5.7-5.6 1.3 1.4Z' fill='Canvas' />
        </svg>
      );
    default:
      return (
        <svg aria-label='インフォメーション' {...props}>
          <circle cx='12' cy='12' r='10' fill='currentColor' />
          <circle cx='12' cy='8' r='1' fill='Canvas' />
          <path d='M11 11h2v6h-2z' fill='Canvas' />
        </svg>
      );
  }
};

export type NotificationBannerProps = Omit<ComponentProps<'div'>, 'title'> & {
  bannerStyle: NotificationBannerStyle;
  type: NotificationBannerType;
  title: ReactNode;
  /** Renders the title as a heading. Omit to render a plain `div`. */
  headingLevel?: NotificationBannerHeadingLevel;
};

export const NotificationBanner = (props: NotificationBannerProps) => {
  const { className, children, bannerStyle, type, title, headingLevel, ...rest } = props;
  const Tag = headingLevel ?? 'div';

  return (
    <div
      className={cx(banner({ bannerStyle, type }), className)}
      data-type={type}
      data-style={bannerStyle}
      {...rest}
    >
      <Tag className={heading}>
        <TypeIcon type={type} />
        <span className={titleText}>{title}</span>
      </Tag>
      {children}
    </div>
  );
};

export type NotificationBannerBodyProps = ComponentProps<'div'>;

export const NotificationBannerBody = ({ className, ...rest }: NotificationBannerBodyProps) => (
  <div className={cx(body, className)} {...rest} />
);

export type NotificationBannerCloseProps = Omit<ComponentProps<'button'>, 'children'> & {
  label?: string;
};

export const NotificationBannerClose = (props: NotificationBannerCloseProps) => {
  const { className, label = '閉じる', ...rest } = props;

  return (
    <button className={cx(close, className)} type='button' {...rest}>
      <svg
        aria-hidden='true'
        className={closeIcon}
        fill='none'
        height='24'
        viewBox='0 0 24 24'
        width='24'
      >
        <path
          d='m6.4 18.6-1-1 5.5-5.6-5.6-5.6 1.1-1 5.6 5.5 5.6-5.6 1 1.1L13 12l5.6 5.6-1 1L12 13l-5.6 5.6Z'
          fill='currentColor'
        />
      </svg>
      <span className={closeLabel}>{label}</span>
    </button>
  );
};

export type NotificationBannerMobileCloseProps = Omit<ComponentProps<'button'>, 'children'>;

/** Compact 44px close button with the label drawn inside the icon, for narrow layouts. */
export const NotificationBannerMobileClose = (props: NotificationBannerMobileCloseProps) => {
  const { className, ...rest } = props;

  return (
    <button className={cx(mobileClose, className)} type='button' {...rest}>
      <svg width='44' height='44' viewBox='0 0 44 44' role='img' aria-label='閉じる'>
        <path
          d='m13 26-2-2 9-9-9-9 2-2 9 9 9-9 2 2-9 9 9 9-2 2-9-9-9 9ZM11.8 30v3.6H9v5.3H8V30h3.8ZM9 32.1v.7h1.7V32H9Zm0-.7h1.7v-.6H9v.6ZM16.4 30v7.6c0 .5 0 1-.5 1.1-.4.2-1 .2-2 .2 0-.3-.1-.7-.3-1h1.5c.2 0 .2-.1.2-.3v-4h-2.8V30h4Zm-2.8 2.1v.7h1.7v-.7h-1.7Zm0-1.3v.6h1.7v-.6h-1.7ZM13.3 34.6h1.4v.9h-1.4v2.2c0 .5 0 .7-.4.8-.3.2-.7.2-1.3.2l-.3-.9h.9l.1-.1v-1.5a8 8 0 0 1-2.3 1.9l-.6-.8c1-.4 1.8-1 2.5-1.8H9.7v-1h2.6v-.7h1v.8ZM23 31l1 1.6-.9.4c-.2-.6-.5-1.1-.9-1.6l.8-.3Zm1.3-.5 1 1.6-.8.4-1-1.6.8-.4Zm-4-.3c-.2 2-.1 4-.2 6 0 .3 0 .6.2.8.3.4.7.5 1.3.5 1.7 0 2.7-1 3.4-2l.9 1a5.3 5.3 0 0 1-4.3 2.2c-1 0-2-.3-2.3-1-.3-.3-.3-.6-.3-1.2v-6.3h1.4ZM28.8 30.5H31a60.3 60.3 0 0 0 2.8-.1l.6.8c-1.1.6-2 1.5-3 2.3l1-.1c1.5 0 3 .9 3 2.4 0 1.1-.6 2-1.6 2.4-.5.3-1.2.4-2 .4-1 0-2.3-.4-2.3-1.6 0-.9.8-1.5 1.7-1.5a2 2 0 0 1 2.1 2l-1 .2c0-.7-.4-1.3-1.1-1.3-.3 0-.7.2-.7.5 0 .6.7.7 1.1.7 1.7 0 2.6-.7 2.6-1.8 0-1-1.2-1.6-2-1.6-.9 0-1.5.2-2 .6-.7.3-1.2.8-1.8 1.5l-.8-.9 2.6-2.1 2.1-1.8c-1.1 0-2.2 0-3.3.2v-1.2Z'
          fill='currentColor'
        />
      </svg>
    </button>
  );
};
