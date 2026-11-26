import type { ComponentProps, ElementType } from 'react';
import { css, cva, cx } from '../../../styled-system/css';

export type FormControlLabelSize = 'sm' | 'md' | 'lg';

const formControlLabel = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    color: 'solid-gray.800',
    textStyle: 'std-16N-170',
    '& > legend': { marginBottom: '8' },
  },
  variants: {
    size: {
      sm: { rowGap: '4' },
      md: { rowGap: '8' },
      lg: { rowGap: '8' },
    },
  },
});

export type FormControlLabelProps = (
  | (ComponentProps<'div'> & { as?: 'div' })
  | (ComponentProps<'fieldset'> & { as: 'fieldset' })
) & {
  size?: FormControlLabelSize;
};

export const FormControlLabel = (props: FormControlLabelProps) => {
  const { as = 'div', children, className, size = 'md', ...rest } = props;
  const Tag = as as ElementType;

  return (
    <Tag className={cx(formControlLabel({ size }), className)} {...rest}>
      {children}
    </Tag>
  );
};

export type LabelSize = 'lg' | 'md' | 'sm';

const label = cva({
  base: {
    alignSelf: 'flex-start',
    color: 'solid-gray.800',
  },
  variants: {
    size: {
      sm: { textStyle: 'std-16B-170' },
      md: { textStyle: 'std-17B-170' },
      lg: { textStyle: 'std-18B-160' },
    },
  },
});

export type LabelProps = ComponentProps<'label'> & {
  size?: LabelSize;
};

export const Label = (props: LabelProps) => {
  const { children, className, size = 'md', ...rest } = props;

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the consumer associates it through `htmlFor`.
    <label className={cx(label({ size }), className)} {...rest}>
      {children}
    </label>
  );
};

export type LegendSize = 'lg' | 'md' | 'sm';

const legend = cva({
  base: {
    display: 'inline',
    alignSelf: 'flex-start',
    color: 'solid-gray.800',
  },
  variants: {
    size: {
      sm: { textStyle: 'std-16B-170' },
      md: { textStyle: 'std-17B-170' },
      lg: { textStyle: 'std-18B-160' },
    },
  },
});

export type LegendProps = ComponentProps<'legend'> & {
  size?: LegendSize;
};

export const Legend = (props: LegendProps) => {
  const { children, className, size = 'md', ...rest } = props;

  return (
    <legend className={cx(legend({ size }), className)} {...rest}>
      {children}
    </legend>
  );
};

const requirementBadge = cva({
  base: {
    marginLeft: '4',
    textStyle: 'std-16N-170',
    // Keeps the label and the badge apart when the text is copied or read without styles.
    _before: { content: '" "' },
  },
  variants: {
    isOptional: {
      true: { color: 'solid-gray.800' },
      false: { color: 'error.1' },
    },
  },
});

export type RequirementBadgeProps = ComponentProps<'span'> & {
  isOptional?: boolean;
};

export const RequirementBadge = (props: RequirementBadgeProps) => {
  const { children, className, isOptional = false, ...rest } = props;

  return (
    <span className={cx(requirementBadge({ isOptional }), className)} {...rest}>
      {children}
    </span>
  );
};

const statusBadge = css({
  display: 'inline-block',
  marginLeft: '4',
  outlineWidth: '1px',
  outlineStyle: 'solid',
  outlineColor: 'transparent',
  borderRadius: '8',
  backgroundColor: 'solid-gray.536',
  padding: '8',
  color: 'white',
  textStyle: 'oln-16N-100',
});

export type StatusBadgeProps = ComponentProps<'span'>;

export const StatusBadge = (props: StatusBadgeProps) => {
  const { children, className, ...rest } = props;

  return (
    <span className={cx(statusBadge, className)} {...rest}>
      {children}
    </span>
  );
};

const supportText = css({
  color: 'solid-gray.600',
  textStyle: 'std-16N-170',
});

export type SupportTextProps = ComponentProps<'p'>;

export const SupportText = (props: SupportTextProps) => {
  const { children, className, ...rest } = props;

  return (
    <p className={cx(supportText, className)} {...rest}>
      {children}
    </p>
  );
};
