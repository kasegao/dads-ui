import type { ComponentProps, ElementType, ReactNode } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';
import { Slot } from '../../utils/Slot';

export type ResourceListVariant = 'list' | 'frame';

const resourceList = cva({
  base: {
    '--resource-list-border-color': '{colors.solid-gray.420}',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    color: 'solid-gray.800',
    overflowWrap: 'anywhere',
    '&:has(:checked:enabled)': {
      '--resource-list-border-color': '{colors.solid-gray.500}',
      backgroundColor: 'key.50',
    },
    '&:has(:disabled)': {
      '--resource-list-border-color': '{colors.solid-gray.300}',
    },
  },
  variants: {
    variant: {
      list: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderTopColor: 'transparent',
        borderInlineColor: 'transparent',
        borderBottomColor: 'var(--resource-list-border-color)',
      },
      frame: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderTopColor: 'var(--resource-list-border-color)',
        borderInlineColor: 'var(--resource-list-border-color)',
        borderBottomColor: 'var(--resource-list-border-color)',
        borderRadius: '16',
      },
    },
    interaction: {
      whole: {
        '&:has(:disabled)': { backgroundColor: 'solid-gray.50', color: 'solid-gray.420' },
      },
    },
  },
});

const hoverOutline = {
  outlineWidth: '2px',
  outlineStyle: 'solid',
  outlineColor: 'black',
  backgroundColor: 'solid-gray.50',
} as const;

const resourceListBody = css({
  position: 'relative',
  zIndex: '0',
  display: 'flex',
  flexGrow: '1',
  alignItems: 'center',
  gap: '16',
  outlineOffset: '-1px',
  borderRadius: 'inherit',
  padding: '16',
  '&:not(:last-child)': { borderTopRightRadius: '0', borderBottomRightRadius: '0' },
  '&:any-link:hover': { ...hoverOutline },
  '&:has(:enabled):hover:not(:focus-visible)': {
    '[data-interaction=whole] > &': { ...hoverOutline },
  },
  '&:any-link:focus-visible': { ...focusRing },
});

const resourceListControl = css({
  display: 'flex',
  flexShrink: '0',
  alignItems: 'center',
  alignSelf: 'stretch',
  marginBlock: '-16px',
  marginLeft: '-16px',
  paddingBlock: '16',
  paddingLeft: '16',
});

const resourceListContents = css({
  display: 'flex',
  flexGrow: '1',
  flexShrink: '1',
  flexDirection: 'column',
  gap: '4',
  width: '0',
  textStyle: 'dns-16N-130',
  '& > *': { maxWidth: 'full' },
});

const titleLink = {
  color: 'blue.1000',
  textDecorationLine: 'underline',
  textDecorationThickness: '1px',
  textUnderlineOffset: '0.1875rem',
} as const;

const titleLinkHover = { color: 'blue.900', textDecorationThickness: '0.1875rem' } as const;
const titleLinkActive = { color: 'orange.800', textDecorationThickness: '1px' } as const;

const resourceListTitle = css({
  color: 'solid-gray.900',
  textStyle: 'std-20B-150',
  '[data-interaction=whole]:has(:disabled) &': { color: 'inherit' },
  'a:any-link &': { ...titleLink },
  '& a': { ...titleLink },
  'a:any-link:hover &': { ...titleLinkHover },
  '& a:hover': { ...titleLinkHover },
  'a:any-link:active &': { ...titleLinkActive },
  '& a:active': { ...titleLinkActive },
  '& :is(a, label)': {
    isolation: 'isolate',
    display: 'block',
    marginBlock: '-8px',
    paddingBlock: '8',
  },
  '& a:focus-visible': {
    ...focusRing,
    marginBlock: '0',
    borderRadius: '4',
    backgroundColor: 'yellow.300',
    paddingBlock: '0',
  },
  // Stretches the label over the whole body so the entire row toggles the control.
  '& label::before': {
    '[data-interaction=whole] &': {
      content: '""',
      position: 'absolute',
      inset: '0',
      zIndex: '1',
      borderRadius: 'inherit',
    },
  },
});

const resourceListLabel = css({ order: '-1' });

const resourceListSub = css({ flexShrink: '0', textStyle: 'dns-16N-130' });

const resourceListAction = css({
  flexShrink: '0',
  alignSelf: 'stretch',
  borderTopRightRadius: 'inherit',
  borderBottomRightRadius: 'inherit',
});

const resourceListActionButton = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '44',
  height: 'full',
  borderRadius: 'inherit',
  cursor: 'pointer',
  _disabled: { cursor: 'default' },
  '&:enabled:hover': { ...hoverOutline, outlineOffset: '-1px' },
  _focusVisible: {
    outlineWidth: '4px',
    outlineStyle: 'solid',
    outlineColor: 'black',
    outlineOffset: '-3px',
    backgroundColor: 'yellow.300',
    boxShadow: 'none',
  },
});

export type ResourceListProps = ComponentProps<'div'> & {
  /** `list`: bottom border only. `frame`: full border with rounded corners. */
  variant: ResourceListVariant;
  /** `whole` makes the entire row toggle the checkbox/radio inside it. */
  interaction?: 'whole';
};

export const ResourceList = (props: ResourceListProps) => {
  const { children, className, variant, interaction, ...rest } = props;
  return (
    <div
      className={cx(resourceList({ variant, interaction }), className)}
      data-style={variant}
      data-interaction={interaction}
      {...rest}
    >
      {children}
    </div>
  );
};

export type ResourceListBodyProps = { className?: string } & (
  | ({ asChild?: false } & ComponentProps<'div'>)
  | { asChild: true; children: ReactNode }
);

export const ResourceListBody = (props: ResourceListBodyProps) => {
  const { asChild, children, className, ...rest } = props;
  const classNames = cx(resourceListBody, className);

  if (asChild) {
    return (
      <Slot className={classNames} {...rest}>
        {children}
      </Slot>
    );
  }

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
};

export type ResourceListControlProps = ComponentProps<'label'>;

/** Layout wrapper for a checkbox/radio; its padding area is clickable too. */
export const ResourceListControl = (props: ResourceListControlProps) => {
  const { children, className, ...rest } = props;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the control is passed as children
    <label className={cx(resourceListControl, className)} {...rest}>
      {children}
    </label>
  );
};

export type ResourceListContentsProps = ComponentProps<'div'>;

export const ResourceListContents = (props: ResourceListContentsProps) => {
  const { children, className, ...rest } = props;
  return (
    <div className={cx(resourceListContents, className)} {...rest}>
      {children}
    </div>
  );
};

export type ResourceListTitleAs = 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

export type ResourceListTitleProps = ComponentProps<'h2'> & {
  as: ResourceListTitleAs;
};

export const ResourceListTitle = (props: ResourceListTitleProps) => {
  const { children, className, as, ...rest } = props;
  const Tag: ElementType = as;
  return (
    <Tag className={cx(resourceListTitle, className)} {...rest}>
      {children}
    </Tag>
  );
};

export type ResourceListLabelProps = ComponentProps<'div'>;

export const ResourceListLabel = (props: ResourceListLabelProps) => {
  const { children, className, ...rest } = props;
  return (
    <div className={cx(resourceListLabel, className)} {...rest}>
      {children}
    </div>
  );
};

export type ResourceListSupportProps = ComponentProps<'div'>;

export const ResourceListSupport = (props: ResourceListSupportProps) => {
  const { children, ...rest } = props;
  return <div {...rest}>{children}</div>;
};

export type ResourceListSubProps = ComponentProps<'div'>;

export const ResourceListSub = (props: ResourceListSubProps) => {
  const { children, className, ...rest } = props;
  return (
    <div className={cx(resourceListSub, className)} {...rest}>
      {children}
    </div>
  );
};

export type ResourceListActionProps = ComponentProps<'div'>;

export const ResourceListAction = (props: ResourceListActionProps) => {
  const { children, className, ...rest } = props;
  return (
    <div className={cx(resourceListAction, className)} {...rest}>
      {children}
    </div>
  );
};

export type ResourceListActionButtonProps = Omit<ComponentProps<'button'>, 'type'>;

export const ResourceListActionButton = (props: ResourceListActionButtonProps) => {
  const { children, className, ...rest } = props;
  return (
    <button type='button' className={cx(resourceListActionButton, className)} {...rest}>
      {children}
    </button>
  );
};
