import type { ComponentProps } from 'react';
import { css, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

const accordion = css({
  '--accordion-icon-size': { base: '1.25rem', desktop: '2rem' },
  borderBottomWidth: '1',
  borderBottomStyle: 'solid',
  borderBottomColor: 'solid-gray.420',
});

const summary = css({
  position: 'relative',
  display: 'block',
  paddingBlock: { base: '8', desktop: '14' },
  paddingLeft: {
    base: 'calc(var(--accordion-icon-size) + 0.75rem)',
    desktop: 'calc(var(--accordion-icon-size) + 1.25rem)',
  },
  paddingRight: { base: '8', desktop: '16' },
  cursor: 'default',
  _marker: { content: '""' },
  '&::-webkit-details-marker': { display: 'none' },
  _hover: { backgroundColor: 'solid-gray.50' },
  _focusVisible: { ...focusRing, borderRadius: '4', backgroundColor: 'yellow.300' },
});

const icon = css({
  position: 'absolute',
  top: { base: '8', desktop: '14' },
  left: { base: '2', desktop: '6' },
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'var(--accordion-icon-size)',
  height: 'var(--accordion-icon-size)',
  marginTop: 'calc((1lh - var(--accordion-icon-size)) / 2)',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'current',
  borderRadius: 'full',
  backgroundColor: 'white',
  color: 'key.1000',
  'summary:hover > &': {
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineColor: 'current',
  },
  'details[open] > summary > &': { transform: 'rotate(180deg)' },
});

const iconSvg = css({
  marginTop: '2',
  width: { base: '16', desktop: 'auto' },
  height: { base: '16', desktop: 'auto' },
  pointerEvents: 'none',
});

const content = css({
  paddingBlock: { base: '16', desktop: '24' },
  paddingLeft: {
    base: 'calc(var(--accordion-icon-size) + 0.75rem)',
    desktop: 'calc(var(--accordion-icon-size) + 1.25rem)',
  },
  paddingRight: { base: '8', desktop: '16' },
});

const backLink = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '6',
  width: 'fit',
  color: 'blue.1000',
  textDecorationLine: 'underline',
  textUnderlineOffset: '0.1875rem',
  _hover: { color: 'blue.1000', textDecorationThickness: '0.1875rem' },
  _active: { color: 'orange.800', textDecorationThickness: '1px' },
  _focusVisible: {
    ...focusRing,
    borderRadius: '4',
    backgroundColor: 'yellow.300',
    color: 'blue.1000',
  },
});

const backLinkIcon = css({
  flexShrink: '0',
  marginTop: 'calc((1lh - 24px) / 2)',
});

export type AccordionProps = ComponentProps<'details'>;

export const Accordion = (props: AccordionProps) => {
  const { children, className, ...rest } = props;

  return (
    <details className={cx(accordion, className)} {...rest}>
      {children}
    </details>
  );
};

export type AccordionSummaryProps = ComponentProps<'summary'>;

export const AccordionSummary = (props: AccordionSummaryProps) => {
  const { children, className, ...rest } = props;

  return (
    <summary className={cx(summary, className)} {...rest}>
      <span className={icon}>
        <svg
          aria-hidden={true}
          className={iconSvg}
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
        >
          <path
            d='M16.668 5.5L10.0013 12.1667L3.33464 5.5L2.16797 6.66667L10.0013 14.5L17.8346 6.66667L16.668 5.5Z'
            fill='currentColor'
          />
        </svg>
      </span>
      {children}
    </summary>
  );
};

export type AccordionContentProps = ComponentProps<'div'>;

export const AccordionContent = (props: AccordionContentProps) => {
  const { children, className, ...rest } = props;

  return (
    <div className={cx(content, className)} {...rest}>
      {children}
    </div>
  );
};

export type AccordionBackLinkProps = ComponentProps<'a'>;

export const AccordionBackLink = (props: AccordionBackLinkProps) => {
  const { children, className, ...rest } = props;

  return (
    <a className={cx(backLink, className)} {...rest}>
      <svg
        aria-hidden={true}
        className={backLinkIcon}
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
      >
        <path
          d='M5 7L7 7L7 14.1C7 15.15 7.33333 16.0625 8 16.8375C8.66667 17.6125 9.5 18 10.5 18C11.5 18 12.3333 17.6125 13 16.8375C13.6667 16.0625 14 15.15 14 14.1L14 7.8L11.4 10.4L10 9L15 4L20 9L18.6 10.4L16 7.8V14.1C16 15.7167 15.475 17.1042 14.425 18.2625C13.375 19.4208 12.0667 20 10.5 20C8.93333 20 7.625 19.4208 6.575 18.2625C5.525 17.1042 5 15.7167 5 14.1L5 7Z'
          fill='currentColor'
        />
      </svg>
      {children}
    </a>
  );
};
