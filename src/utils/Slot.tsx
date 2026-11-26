import { Children, cloneElement, type HTMLAttributes, isValidElement, type ReactNode } from 'react';
import { cx } from '../../styled-system/css';

type SlotProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
};

/** Merges its props into the single child element (`asChild` pattern). */
export const Slot = (props: SlotProps) => {
  const { children, ...rest } = props;

  if (isValidElement<HTMLAttributes<HTMLElement>>(children)) {
    return cloneElement(children, {
      ...rest,
      ...children.props,
      className: cx(rest.className, children.props.className),
    });
  }

  if (Children.count(children) > 1) {
    Children.only(null);
  }

  return null;
};
