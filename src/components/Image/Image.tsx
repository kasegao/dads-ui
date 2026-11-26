import type { ComponentProps } from 'react';
import { css, cva, cx } from '../../../styled-system/css';
import { focusRing } from '../../styles/focus';

const image = cva({
  base: { width: 'fit' },
  variants: {
    fullWidth: {
      true: { width: 'full' },
    },
  },
});

const imageContent = {
  '& img': {
    display: 'block',
    maxWidth: 'full',
    height: 'auto',
  },
  '[data-full-width] & img': { width: 'full' },
} as const;

const area = cva({
  base: { ...imageContent },
  variants: {
    bordered: {
      true: {
        outlineWidth: '1px',
        outlineStyle: 'solid',
        outlineColor: 'solid-gray.420',
        outlineOffset: '-1px',
      },
    },
  },
});

const areaLink = css({
  ...imageContent,
  display: 'block',
  outlineWidth: '1px',
  outlineStyle: 'solid',
  outlineColor: 'blue.900',
  outlineOffset: '-1px',
  '&:hover:not(:focus-visible)': { outlineWidth: '4px', outlineOffset: '-4px' },
  _focusVisible: { ...focusRing },
});

const caption = cva({
  base: {
    marginTop: '8',
    marginBottom: '40',
    contain: 'inline-size',
    paddingBlock: '8',
    paddingInline: '24',
    color: 'solid-gray.700',
    textStyle: 'std-16N-170',
  },
  variants: {
    captionStyle: {
      dashed: { borderWidth: '1', borderStyle: 'dashed', borderColor: 'solid-gray.700' },
      solid: { borderWidth: '1', borderStyle: 'solid', borderColor: 'solid-gray.420' },
    },
  },
});

export type ImageProps = ComponentProps<'figure'> & {
  /** Stretches the image to the container width regardless of its intrinsic size. */
  fullWidth?: boolean;
};

export const Image = (props: ImageProps) => {
  const { children, className, fullWidth, ...rest } = props;

  return (
    <figure
      className={cx(image({ fullWidth }), className)}
      data-full-width={fullWidth ? '' : undefined}
      {...rest}
    >
      {children}
    </figure>
  );
};

export type ImageAreaProps = ComponentProps<'div'> & {
  bordered?: boolean;
};

export const ImageArea = (props: ImageAreaProps) => {
  const { children, className, bordered, ...rest } = props;

  return (
    <div className={cx(area({ bordered }), className)} {...rest}>
      {children}
    </div>
  );
};

export type ImageAreaLinkProps = Omit<ComponentProps<'a'>, 'href'> & { href: string };

export const ImageAreaLink = (props: ImageAreaLinkProps) => {
  const { children, className, ...rest } = props;

  return (
    <a className={cx(areaLink, className)} {...rest}>
      {children}
    </a>
  );
};

export type ImageCaptionStyle = 'dashed' | 'solid';

export type ImageCaptionProps = ComponentProps<'figcaption'> & {
  captionStyle?: ImageCaptionStyle;
};

export const ImageCaption = (props: ImageCaptionProps) => {
  const { children, className, captionStyle, ...rest } = props;

  return (
    <figcaption className={cx(caption({ captionStyle }), className)} {...rest}>
      {children}
    </figcaption>
  );
};
