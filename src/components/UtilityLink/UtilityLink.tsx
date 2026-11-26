import type { ComponentProps, ReactNode } from 'react';
import { css, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import { Slot } from '../../utils/Slot';

const utilityLink = css({
  color: 'solid-gray.800',
  textStyle: 'dns-16N-130',
  textDecorationLine: 'underline',
  textUnderlineOffset: '0.1875rem',
  _visited: { color: 'solid-gray.800' },
  _hover: { textDecorationThickness: '0.1875rem' },
  _focusVisible: {
    ...focusRing,
    borderRadius: '4',
    backgroundColor: 'yellow.300',
    color: 'blue.1000',
  },
});

const externalLinkIcon = css({
  display: 'inline-block',
  marginLeft: '4',
  verticalAlign: '-0.15em',
});

export type UtilityLinkExternalLinkIconProps = ComponentProps<'svg'>;

export const UtilityLinkExternalLinkIcon = (props: UtilityLinkExternalLinkIconProps) => {
  const { className, 'aria-label': ariaLabel = '新規タブで開きます', ...rest } = props;

  return (
    <svg
      aria-label={ariaLabel}
      role='img'
      className={cx(externalLinkIcon, className)}
      fill='none'
      height='16'
      viewBox='0 0 48 48'
      width='16'
      {...rest}
    >
      <path
        d='M22 6V9H9V39H39V26H42V42H6V6H22ZM42 6V20H39V11.2L21 29L19 27L36.8 9H28V6H42Z'
        fill='currentColor'
      />
    </svg>
  );
};

export type UtilityLinkProps = {
  className?: string;
  /** Props for the external-link icon shown when `target='_blank'`. */
  icon?: UtilityLinkExternalLinkIconProps;
} & (({ asChild?: false } & ComponentProps<'a'>) | { asChild: true; children: ReactNode });

export const UtilityLink = (props: UtilityLinkProps) => {
  const { asChild, children, className, icon, ...rest } = props;
  const classNames = cx(utilityLink, className);

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
      {anchorProps.target === '_blank' && <UtilityLinkExternalLinkIcon {...icon} />}
    </a>
  );
};
