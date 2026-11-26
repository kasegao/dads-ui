import type { ComponentProps, ReactNode } from 'react';
import { css, cx } from '../../../styled-system/css';
import { linkStyle } from '../../styles/link';
import { Slot } from '../../utils/Slot';

const link = css(linkStyle);

const externalLinkIcon = css({
  display: 'inline',
  marginBottom: '3',
  marginLeft: '3',
});

export type LinkExternalLinkIconProps = ComponentProps<'svg'>;

export const LinkExternalLinkIcon = (props: LinkExternalLinkIconProps) => {
  const { className, 'aria-label': ariaLabel = '新規タブで開きます', ...rest } = props;

  return (
    <svg
      aria-label={ariaLabel}
      className={cx(externalLinkIcon, className)}
      fill='none'
      height='17'
      role='img'
      viewBox='0 0 16 17'
      width='16'
      {...rest}
    >
      <path
        clipRule='evenodd'
        d='M3 13.5H13V9.16667H14V14.5H2V2.5H7.33333V3.5H3V13.5ZM9.33333 3.5V2.5H14V7.16667H13V4.23333L7 10.1667L6.33333 9.5L12.2667 3.5H9.33333Z'
        fillRule='evenodd'
        fill='currentColor'
      />
    </svg>
  );
};

export type LinkProps = {
  className?: string;
  /** Props for the external-link icon shown when `target='_blank'`. */
  icon?: LinkExternalLinkIconProps;
} & (({ asChild?: false } & ComponentProps<'a'>) | { asChild: true; children: ReactNode });

export const Link = (props: LinkProps) => {
  const { asChild, children, className, icon, ...rest } = props;
  const classNames = cx(link, className);

  if (asChild) {
    return (
      <Slot className={classNames} {...rest}>
        {children}
      </Slot>
    );
  }

  const anchorProps = rest as ComponentProps<'a'>;

  return (
    <a className={classNames} {...anchorProps}>
      {children}
      {anchorProps.target === '_blank' && <LinkExternalLinkIcon {...icon} />}
    </a>
  );
};
